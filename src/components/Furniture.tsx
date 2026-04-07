import { useRef, useCallback, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3, Mesh, Plane, Raycaster, BoxGeometry } from 'three';
import { Text } from '@react-three/drei';

// Reusable objects — never allocate inside useFrame or drag handlers
const _groundPlane = new Plane(new Vector3(0, 1, 0), 0);
const _intersection = new Vector3();
const _raycaster = new Raycaster();

// 2D point-to-segment distance on XZ plane (for wall collision)
function pointToSegmentDist2D(
  px: number, pz: number,
  ax: number, az: number,
  bx: number, bz: number
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lenSq = dx * dx + dz * dz;
  if (lenSq === 0) return Math.hypot(px - ax, pz - az);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / lenSq));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}

const Furniture = () => {
  const { furniture, updateFurniture, isColliding, setIsColliding, points } = useStore();
  const meshRef = useRef<Mesh>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef(new Vector3());

  // Max reach of furniture on XZ for collision (half-diagonal)
  const furnitureRadius = useMemo(() => {
    const hw = furniture.width / 2;
    const hd = furniture.depth / 2;
    return Math.sqrt(hw * hw + hd * hd);
  }, [furniture.width, furniture.depth]);

  // Wireframe geometry (memo to avoid recreating every render)
  const edgeGeo = useMemo(
    () => new BoxGeometry(furniture.width, furniture.height, furniture.depth),
    [furniture.width, furniture.height, furniture.depth]
  );

  // --- Collision detection (GC-free, runs every frame) ---
  useFrame(() => {
    if (points.length < 2) return;
    const fx = furniture.position[0];
    const fz = furniture.position[2];
    const threshold = furnitureRadius + 0.15;
    let hit = false;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (pointToSegmentDist2D(fx, fz, p1.x, p1.y, p2.x, p2.y) < threshold) {
        hit = true;
        break;
      }
    }

    if (hit !== isColliding) setIsColliding(hit);
  });

  // --- Drag: project pointer onto ground plane ---
  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);

    _raycaster.set(e.ray.origin, e.ray.direction);
    _raycaster.ray.intersectPlane(_groundPlane, _intersection);

    dragOffset.current.set(
      furniture.position[0] - _intersection.x,
      0,
      furniture.position[2] - _intersection.z
    );
    isDragging.current = true;
  }, [furniture.position]);

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    _raycaster.set(e.ray.origin, e.ray.direction);
    _raycaster.ray.intersectPlane(_groundPlane, _intersection);

    updateFurniture({
      position: [
        _intersection.x + dragOffset.current.x,
        furniture.position[1],
        _intersection.z + dragOffset.current.z,
      ],
    });
  }, [furniture.position, updateFurniture]);

  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    isDragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  // --- Rotation: scroll wheel = fine, right-click = 15° snap ---
  const onWheel = useCallback((e: ThreeEvent<WheelEvent>) => {
    e.stopPropagation();
    const step = e.deltaY > 0 ? 0.08 : -0.08;
    updateFurniture({
      rotation: [0, furniture.rotation[1] + step, 0],
    });
  }, [furniture.rotation, updateFurniture]);

  const onContextMenu = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    updateFurniture({
      rotation: [0, furniture.rotation[1] + Math.PI / 12, 0],
    });
  }, [furniture.rotation, updateFurniture]);

  // Common event props for both the hit-area and visible mesh
  const pointerProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onContextMenu,
  };

  return (
    <group position={furniture.position} rotation={furniture.rotation}>
      {/* Invisible enlarged hit area for easier grab */}
      <mesh visible={false} {...pointerProps}>
        <boxGeometry args={[furniture.width + 0.5, furniture.height + 0.5, furniture.depth + 0.5]} />
        <meshBasicMaterial />
      </mesh>

      {/* Visible furniture box */}
      <mesh ref={meshRef} castShadow {...pointerProps}>
        <boxGeometry args={[furniture.width, furniture.height, furniture.depth]} />
        <meshStandardMaterial
          color={isColliding ? '#ef4444' : furniture.color}
          emissive={isColliding ? '#ef4444' : '#000000'}
          emissiveIntensity={isColliding ? 0.5 : 0}
          opacity={0.85}
          transparent
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* Edge wireframe for clarity */}
      <lineSegments>
        <edgesGeometry args={[edgeGeo]} />
        <lineBasicMaterial color={isColliding ? '#fca5a5' : '#60a5fa'} transparent opacity={0.6} />
      </lineSegments>

      {/* Dimension label above */}
      <Text
        position={[0, furniture.height / 2 + 0.35, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {`${furniture.width.toFixed(1)} × ${furniture.depth.toFixed(1)} × ${furniture.height.toFixed(1)}m`}
      </Text>

      {/* Hint label below */}
      <Text
        position={[0, -0.15, furniture.depth / 2 + 0.3]}
        fontSize={0.13}
        color="#64748b"
        anchorX="center"
        anchorY="top"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {'ドラッグ: 移動  ホイール: 回転  右クリック: 15°'}
      </Text>
    </group>
  );
};

export default Furniture;

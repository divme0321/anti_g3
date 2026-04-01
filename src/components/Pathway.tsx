import { useStore } from '../store/useStore';
import type { Point } from '../store/useStore';
import { Vector3 } from 'three';
import { Line } from '@react-three/drei';

const WallSegment = ({ start, end }: { start: Vector3, end: Vector3 }) => {
  const distance = start.distanceTo(end);
  const center = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  const angle = Math.atan2(end.x - start.x, end.z - start.z);

  return (
    <mesh position={[center.x, 1, center.z]} rotation={[0, angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.2, 2, distance]} />
      <meshStandardMaterial 
        color="#1a1e26" 
        emissive="#2563eb" 
        emissiveIntensity={0.2}
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

const HandlePoint = ({ point }: { point: Point }) => {
  const { updatePoint, mode } = useStore();

  if (mode !== 'EDIT') return null;

  return (
    <mesh 
      position={[point.x, 0.1, point.y]}
      onPointerDown={(e) => {
        (e.target as any).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) { // Left click held
          // Simple drag on ground plane
          const x = e.point.x;
          const y = e.point.z;
          updatePoint(point.id, x, y);
        }
      }}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
    </mesh>
  );
};

const Pathway = () => {
  const { points } = useStore();

  const pathPoints = points.map(p => new Vector3(p.x, 0.1, p.y));

  return (
    <group>
      {/* Wall Segments */}
      {points.map((p, i) => {
        if (i === points.length - 1) return null; // No next point for last
        const next = points[i + 1];
        return (
          <WallSegment 
            key={`wall-${p.id}`} 
            start={new Vector3(p.x, 0, p.y)} 
            end={new Vector3(next.x, 0, next.y)} 
          />
        );
      })}

      {/* Handles for Edit Mode */}
      {points.map(p => (
        <HandlePoint key={`handle-${p.id}`} point={p} />
      ))}

      {/* Connection Indicator Line */}
      <Line 
        points={pathPoints} 
        color="#3b82f6" 
        lineWidth={2} 
        dashed={true}
        dashSize={0.5}
        gapSize={0.2}
      />
    </group>
  );
};

export default Pathway;

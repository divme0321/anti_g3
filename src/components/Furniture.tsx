import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3, Euler, Quaternion } from 'three';
import { PivotControls, Text } from '@react-three/drei';

const Furniture = () => {
  const { furniture, updateFurniture, isColliding, setIsColliding, points } = useStore();
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Simple Collision detection using Box3 and Raycasting / Math
  // Since we only care if the furniture is passing through the walls
  // For the MVP, we'll implement a simple point-in-wall check 
  // or use Box3 bounding checks against each wall segment
  useFrame(() => {
    if (!meshRef.current || points.length < 2) return;
    
    const furnitureBox = new Box3().setFromObject(meshRef.current);
    let colliding = false;

    // Check against each wall segment
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const start = new Vector3(p1.x, 1, p1.y);
      const end = new Vector3(p2.x, 1, p2.y);
      const center = new Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);

      const wallGeomSize = new Vector3(0.25, 2, distance + 0.1); 
      
      // We need an Oriented Bounding Box (OBB) for true accuracy, 
      // but for MVP we can check corners or use a simplified Box3 if rotation is 0.
      // Here, we check if furniture corners are inside wall bounds.
      
      // Simple intersection check using midpoints/bounds for now
      // (Actual OBB intersection is complex in vanilla Three.js without a lib)
      const distToWall = new Vector3(furniture.position[0], 1, furniture.position[2]).distanceTo(center);
      if (distToWall < (furniture.width / 2 + 0.2)) {
         // Potential collision area - more refined check
         if (furnitureBox.intersectsBox(new Box3().setFromCenterAndSize(center, wallGeomSize))) {
           colliding = true;
           break;
         }
      }
    }
    
    if (colliding !== isColliding) {
      setIsColliding(colliding);
    }
  });

  return (
    <group position={furniture.position} rotation={furniture.rotation}>
      {/* PivotControls for moving and rotating the furniture */}
      <PivotControls 
        autoTransform
        anchor={[0, 0, 0]} 
        depthTest={false} 
        lineWidth={2} 
        fixed={true} 
        scale={1.5}
        onDrag={(matrix) => {
          const pos = new Vector3();
          const rotate = new Quaternion();
          const scale = new Vector3();
          matrix.decompose(pos, rotate, scale);
          
          const euler = new Euler().setFromQuaternion(rotate);
          updateFurniture({ 
            position: [pos.x, pos.y, pos.z],
            rotation: [euler.x, euler.y, euler.z]
          });
        }}
      >
        <mesh 
          ref={meshRef} 
          castShadow 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[furniture.width, furniture.height, furniture.depth]} />
          <meshStandardMaterial 
            color={isColliding ? '#ef4444' : furniture.color} 
            emissive={isColliding ? '#ef4444' : (hovered ? '#4ade80' : '#000000')}
            emissiveIntensity={isColliding ? 0.5 : 0.2}
            opacity={0.9} 
            transparent
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </PivotControls>

      {/* Dimension Labels */}
      <Text
        position={[0, furniture.height / 2 + 0.3, 0]}
        fontSize={0.25}
        color="var(--text)"
        font="https://fonts.gstatic.com/s/outfit/v11/Q_kU9S64V78Yv82mSiaZ.woff" // Outfit URL (approx)
      >
        {`${furniture.width.toFixed(1)}m × ${furniture.height.toFixed(1)}m`}
      </Text>
    </group>
  );
};

export default Furniture;

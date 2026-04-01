import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { PivotControls, Text } from '@react-three/drei';

const Furniture = () => {
  const { furniture, updateFurniture } = useStore();
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Simple Collision detection using Box3 and Raycasting / Math
  // Since we only care if the furniture is passing through the walls
  // For the MVP, we'll implement a simple point-in-wall check 
  // or use Box3 bounding checks against each wall segment
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Simple Bounding Box check logic can go here
  });

  return (
    <group position={furniture.position} rotation={furniture.rotation}>
      {/* PivotControls for moving and rotating the furniture */}
      <PivotControls 
        anchor={[0, 0, 0]} 
        depthTest={false} 
        lineWidth={2} 
        fixed={true} 
        scale={1.5}
        onDrag={(matrix) => {
          // Decompose matrix to update store
          const pos = new Vector3();
          pos.setFromMatrixPosition(matrix);
          updateFurniture({ position: [pos.x, pos.y, pos.z] });
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
            color={furniture.color} 
            emissive={hovered ? '#4ade80' : '#000000'}
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

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Environment,
  Grid
} from '@react-three/drei';
import { useStore } from '../store/useStore';
import Pathway from './Pathway';
import Furniture from './Furniture';

const Scene = () => {
  const { mode } = useStore();

  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <PerspectiveCamera 
          makeDefault 
          position={mode === 'EDIT' ? [0, 15, 0] : [8, 10, 8]} 
          fov={mode === 'EDIT' ? 45 : 60} 
        />
        
        {/* Lights */}
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="var(--primary)" />

        {/* Environment & Floor */}
        <Environment preset="city" />
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="var(--glass-border)" 
          cellColor="rgba(255,255,255,0.05)" 
          sectionThickness={1.5}
          cellSize={1}
        />
        <ContactShadows 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />

        {/* The Simulation Components */}
        <Pathway />
        {mode === 'SIMULATE' && <Furniture />}

        {/* Controls: Orbit for 3D View, but maybe locked for 2D? */}
        <OrbitControls 
          enableRotate={mode === 'SIMULATE'} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={2}
          maxDistance={30}
        />
      </Suspense>
    </Canvas>
  );
};

export default Scene;

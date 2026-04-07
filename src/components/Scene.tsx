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
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#0066ff" />

        {/* Environment & Floor */}
        <Environment preset="city" />
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="#1a1e26" 
          cellColor="#0d0d0d" 
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
          mouseButtons={{
            LEFT: undefined as any,       // left drag → furniture (handled by Furniture.tsx)
            MIDDLE: 0,                     // middle drag → orbit rotate
            RIGHT: undefined as any,       // right click → furniture rotate
          }}
          enablePan={mode === 'EDIT'}
        />
      </Suspense>
    </Canvas>
  );
};

export default Scene;

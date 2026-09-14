import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, BakeShadows, ContactShadows, OrbitControls } from '@react-three/drei';
import CarModel from './CarModel';

interface SceneProps {
  carColor?: string;
}

export default function Scene({ carColor }: SceneProps) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2} 
        castShadow 
        shadow-mapSize={1024}
      />
      <directionalLight position={[-10, 10, -5]} intensity={1} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <CarModel carColor={carColor} />
        
        <ContactShadows 
          resolution={1024} 
          scale={20} 
          blur={2} 
          opacity={0.5} 
          far={10} 
          color="#000000"
        />
        <BakeShadows />
        
        {/* Enable user interaction with the 3D model */}
        <OrbitControls 
          enableZoom={true} 
          minDistance={4}
          maxDistance={9}
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
}

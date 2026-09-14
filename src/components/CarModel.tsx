import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface CarModelProps {
  carColor?: string;
}

export default function CarModel({ carColor = '#E31B23' }: CarModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, materials } = useGLTF('/assets/volkswagen_golf_gti_2025.glb');

  // Enable shadows
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Handle color change
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        // 'Rojo_Kings' is the name of the main car paint material in the GLB
        if (mat.name.toLowerCase().includes('rojo_kings')) {
          // Use GSAP to smoothly animate color transition
          gsap.to(mat.color, {
            r: new THREE.Color(carColor).r,
            g: new THREE.Color(carColor).g,
            b: new THREE.Color(carColor).b,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      }
    });
  }, [carColor, scene]);

  useLayoutEffect(() => {
    if (!group.current) return;

    const scale = window.innerWidth < 768 ? 0.9 : 1.3;
    
    // Initial hidden state
    gsap.set(group.current.scale, { x: 0.001, y: 0.001, z: 0.001 });
    gsap.set(group.current.position, { x: -1, y: 5, z: 0 }); // Drop from above
    gsap.set(group.current.rotation, { x: 0, y: Math.PI * 4, z: 0 }); // Spin in

    // Matrix-style entrance animation on scroll (once)
    ScrollTrigger.create({
      trigger: '#section-2',
      start: 'top 60%',
      once: true, // Only play once when scrolling down
      onEnter: () => {
        const tl = gsap.timeline();
        
        // Spin and scale up (materialize)
        tl.to(group.current!.rotation, {
          y: -Math.PI / 6,
          duration: 2.5,
          ease: 'power3.out'
        }, 0);

        // Drop down to position
        tl.to(group.current!.position, {
          y: -1.5,
          duration: 2,
          ease: 'bounce.out'
        }, 0);

        // Scale up
        tl.to(group.current!.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 1.5,
          ease: 'back.out(1.5)'
        }, 0);
      }
    });

  }, []);

  // Idle wobble animation
  useFrame((state) => {
    if (group.current) {
      // Gentle idle wobble animation around its baseline Y position
      group.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/assets/volkswagen_golf_gti_2025.glb');

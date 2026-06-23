import React, { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Box, Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export const Model = forwardRef((props, ref) => {
  const outerSphereRef = useRef();
  
  useFrame((state) => {
    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      outerSphereRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref} {...props} dispose={null}>
      
      {/* 1. Outer Network Shield (Icosahedron wireframe) */}
      <group ref={outerSphereRef}>
        <Icosahedron args={[3.2, 2]}>
          <meshStandardMaterial 
            color="#0a192f"
            emissive="#00e5ff"
            emissiveIntensity={0.4}
            wireframe={true}
            transparent={true}
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </Icosahedron>
        
        {/* Glowing Nodes on the vertices of the shield */}
        <points>
          <icosahedronGeometry args={[3.2, 2]} />
          <pointsMaterial 
            color="#00e5ff" 
            size={0.06} 
            sizeAttenuation={true} 
            transparent={true} 
            opacity={0.8} 
          />
        </points>
      </group>

      {/* 2. Inner Cyber Lock */}
      <group scale={1.2} position={[0, -0.6, 0]}>
        {/* Lock Body */}
        <Box args={[1.5, 1.2, 0.6]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#00e5ff"
            emissive="#0044ff"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </Box>
        
        {/* Glowing Circuit Lines on Lock Body */}
        <Box args={[1.52, 1.22, 0.62]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#0a192f"
            emissive="#00e5ff"
            emissiveIntensity={1}
            wireframe={true}
            transparent={true}
            opacity={0.5}
          />
        </Box>

        {/* Lock Keyhole */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0, 0.31]}>
          <meshStandardMaterial color="#000" />
        </Sphere>
        <Box args={[0.1, 0.3, 0.1]} position={[0, -0.15, 0.31]}>
          <meshStandardMaterial color="#000" />
        </Box>

        {/* Lock Shackle (Torus cut in half) */}
        <Torus args={[0.6, 0.15, 16, 32, Math.PI]} position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#00e5ff"
            emissive="#0044ff"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Torus>
        
        {/* Shackle glow wireframe */}
        <Torus args={[0.62, 0.16, 8, 16, Math.PI]} position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#0a192f"
            emissive="#00e5ff"
            emissiveIntensity={1}
            wireframe={true}
            transparent={true}
            opacity={0.4}
          />
        </Torus>
      </group>
      
    </group>
  )
});
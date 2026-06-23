import React, { forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const Model = forwardRef((props, ref) => {
  const { nodes } = useGLTF('/vhass4d.glb')
  
  // Custom glowing cyber material
  const cyberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a192f",
    emissive: "#00e5ff",
    emissiveIntensity: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  }), []);

  const solidMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00e5ff",
    emissive: "#0044ff",
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.8,
  }), []);

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        geometry={nodes.Cube.geometry}
        material={cyberMaterial}
        position={[-1.15, 2.66, -1.1]}
        scale={0.4}
      />
      <mesh
        geometry={nodes.Cube002.geometry}
        material={solidMaterial}
        position={[-0.06, 0, 0]}
        scale={1.4}
      />
      <mesh
        geometry={nodes.Cube001.geometry}
        material={cyberMaterial}
      />
      <mesh
        geometry={nodes.Cube003.geometry}
        material={cyberMaterial}
        position={[0.15, 0.14, 0.12]}
        scale={[0.87, 0.87, 0.89]}
      />
      <mesh
        geometry={nodes.Cube004.geometry}
        material={cyberMaterial}
        position={[-1.35, -1.08, 2.88]}
        scale={0.4}
      />
      <mesh
        geometry={nodes.Cube005.geometry}
        material={cyberMaterial}
        position={[2.8, -1.08, -1.1]}
        scale={0.4}
      />
    </group>
  )
});

useGLTF.preload('/vhass4d.glb');
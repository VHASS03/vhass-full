import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

export const Model = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('/vhass4d.glb')
  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
        position={[-1.15, 2.66, -1.1]}
        scale={0.4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry}
        material={materials['Material.002']}
        position={[-0.06, 0, 0]}
        scale={1.4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials['Material.003']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={materials['Material.004']}
        position={[0.15, 0.14, 0.12]}
        scale={[0.87, 0.87, 0.89]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={materials['Material.005']}
        position={[-1.35, -1.08, 2.88]}
        scale={0.4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        material={materials['Material.006']}
        position={[2.8, -1.08, -1.1]}
        scale={0.4}
      />
    </group>
  )
});

useGLTF.preload('/vhass4d.glb');
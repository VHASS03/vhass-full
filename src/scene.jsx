import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

const lerp = (start, end, factor) => start + (end - start) * factor;

/* ═══════════════════════════════════════════
   THE VHASS INTELLIGENCE CORE
   Procedural 3D • Orbiting Layers • Ambient
   ═══════════════════════════════════════════ */

// ─── Central Glowing Sphere ───
const CoreSphere = () => {
  const meshRef = useRef();
  const wireRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.05;
      wireRef.current.rotation.z = t * 0.03;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 0.8) * 0.04;
    }
  });

  return (
    <group>
      {/* Inner solid core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial
          color="#FFB162"
          emissive="#FFB162"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#FFB162"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef} scale={1.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#FFB162"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// ─── Orbiting Nodes ───
const OrbitNodes = ({ count, radius, speed, size, color, reverse }) => {
  const groupRef = useRef();

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 0.6;
      arr.push({ angle, elevation, phase: Math.random() * Math.PI * 2 });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speed * (reverse ? -1 : 1);
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => {
        const x = Math.cos(node.angle) * radius;
        const z = Math.sin(node.angle) * radius;
        const y = node.elevation;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ─── Orbit Ring ───
const OrbitRing = ({ radius, opacity = 0.06 }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#FFB162" transparent opacity={opacity} />
    </line>
  );
};

// ─── Ambient Particles ───
const AmbientParticles = () => {
  const pointsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.5 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      siz[i] = Math.random() * 0.02 + 0.005;
    }
    return [pos, siz];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFB162"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
};

// ─── Main Scene ───
const Scene = ({ progress }) => {
  const cameraRef = useRef();
  const groupRef = useRef();
  const currentPos = useRef([0, 0, 8]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Camera positions for scroll-driven movement
  const positions = [
    [0, 0.5, 8],      // Hero view
    [2, 1, 10],       // Pull back slightly
    [-1, 2, 12],      // Elevated view
    [0, 0.5, 15],     // Far view
  ];

  const getTargetPosition = (progress) => {
    const segmentCount = positions.length - 1;
    if (progress >= 1) return positions[segmentCount];
    const segmentProgress = 1 / segmentCount;
    const segmentIndex = Math.floor(progress / segmentProgress);
    const percentage = (progress % segmentProgress) / segmentProgress;
    const [startX, startY, startZ] = positions[segmentIndex];
    const [endX, endY, endZ] = positions[segmentIndex + 1];
    return [
      startX + (endX - startX) * percentage,
      startY + (endY - startY) * percentage,
      startZ + (endZ - startZ) * percentage,
    ];
  };

  useFrame((state, delta) => {
    const factor = 1 - Math.pow(0.001, delta);
    const targetPos = getTargetPosition(progress);

    currentPos.current = [
      lerp(currentPos.current[0], targetPos[0], factor),
      lerp(currentPos.current[1], targetPos[1], factor),
      lerp(currentPos.current[2], targetPos[2], factor),
    ];

    if (cameraRef.current) {
      cameraRef.current.position.set(...currentPos.current);
      cameraRef.current.lookAt(0, 0, 0);
    }

    // Mouse parallax on the group
    if (groupRef.current) {
      groupRef.current.rotation.y = lerp(
        groupRef.current.rotation.y,
        mousePos.current.x * 0.3 + state.clock.elapsedTime * 0.05,
        0.03
      );
      groupRef.current.rotation.x = lerp(
        groupRef.current.rotation.x,
        mousePos.current.y * 0.15,
        0.03
      );
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0.5, 8]}
        fov={40}
        near={0.1}
        far={100}
      />

      {/* Warm amber lighting */}
      <ambientLight intensity={0.15} color="#EEE9DF" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#FFB162" distance={20} decay={2} />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#FFB162" distance={15} decay={2} />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#FFB162" distance={10} decay={2} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={groupRef}>
          {/* The Intelligence Core */}
          <CoreSphere />

          {/* Orbit rings */}
          <OrbitRing radius={1.8} opacity={0.08} />
          <OrbitRing radius={2.6} opacity={0.05} />
          <OrbitRing radius={3.5} opacity={0.03} />

          {/* Layer 1: Cybersecurity nodes — close orbit */}
          <OrbitNodes count={4} radius={1.8} speed={0.15} size={0.08} color="#FFB162" />

          {/* Layer 2: Innovation nodes — mid orbit */}
          <OrbitNodes count={6} radius={2.6} speed={0.1} size={0.05} color="#FFC182" reverse />

          {/* Layer 3: Career pathway dots — wide orbit */}
          <OrbitNodes count={8} radius={3.5} speed={0.2} size={0.03} color="#e8944a" />

          {/* Ambient dust particles */}
          <AmbientParticles />
        </group>
      </Float>
    </>
  );
};

export default Scene;
import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Model } from "./table";

const lerp = (start, end, factor) => start + (end - start) * factor;

const DataStreams = () => {
  const pointsRef = useRef();
  
  // Generate random points in a sphere for cyber data streams
  const [positions, sizes] = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.0 + Math.random() * 2.5; // Orbit radius
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      siz[i] = Math.random() * 0.04 + 0.01;
    }
    return [pos, siz];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} sizes={sizes}>
      <PointMaterial transparent color="#00e5ff" sizeAttenuation={true} depthWrite={false} size={0.05} />
    </Points>
  );
};

const Scene = ({ progress }) => {
  const cameraRef = useRef(null);
  const logoRef = useRef();
  const groupRef = useRef();
  const currentPos = useRef([0, 0, 0]);
  const logoRotation = useRef([0, 0]);

  const mousePos = useRef({ x: 0, y: 0 }); // normalized

  // Global mousemove listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const positions = [
    [20, 15, 10],
    [0, 0, 40],
    [-10, 20, 10],
    [20, 25, 20],
  ];

  useFrame((state, delta) => {
    const factor = 1 - Math.pow(0.001, delta);

    // Smooth camera movement
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

    // Gentle floating motion for the entire group
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }

    // Rotate logo based on global mouse position
    const targetX = mousePos.current.y * 0.5;  // Correct direction
    const targetY = mousePos.current.x * 0.5 + (state.clock.elapsedTime * 0.05);  // Horizontal rotation + constant spin

    logoRotation.current = [
      lerp(logoRotation.current[0], targetX, 0.05),
      lerp(logoRotation.current[1], targetY, 0.05),
    ];

    if (logoRef.current) {
      logoRef.current.rotation.x = logoRotation.current[0];
      logoRef.current.rotation.y = logoRotation.current[1];
    }
  });

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

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 0]}
        fov={20}
        near={1}
        far={10000}
      />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} color="#00e5ff" />
      <spotLight position={[-10, -20, -10]} angle={0.2} penumbra={1} intensity={1} color="#00e5ff" />

      <group ref={groupRef}>
        <DataStreams />
        <Model ref={logoRef} />
      </group>

    </>
  );
};

export default Scene;
import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Model } from "./table";

const lerp = (start, end, factor) => start + (end - start) * factor;

const Scene = ({ progress }) => {
  const cameraRef = useRef(null);
  const logoRef = useRef();
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

    // Rotate logo based on global mouse position
const targetX = mousePos.current.y * 0.5;  // Correct direction
const targetY = mousePos.current.x * 0.5;  // Horizontal rotation


    logoRotation.current = [
      lerp(logoRotation.current[0], targetX, 0.1),
      lerp(logoRotation.current[1], targetY, 0.1),
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
        near={20}
        far={10000}
      />
      <Environment preset="city" />
      <Model ref={logoRef} />
    </>
  );
};

export default Scene;
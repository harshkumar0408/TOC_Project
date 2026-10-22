import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function StackBlock({ symbol, position, color }) {
  const meshRef = useRef();

  // Simple floating animation
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[1]) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.5, 0.8, 1.5]} />
      <meshStandardMaterial color={color} opacity={0.9} transparent />
      <Text
        position={[0, 0, 0.76]} // slightly in front of block
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </mesh>
  );
}

export default function Stack3D({ stack = [] }) {
  // Palettes for different symbols
  const colors = ["#4338ca", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const getColor = (char) => {
    if (char === "Z0") return "#334155";
    const code = char.charCodeAt(0) || 0;
    return colors[code % colors.length];
  };

  return (
    <div className="stack-3d-container">
      <h3>Stack View (3D)</h3>
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls enableZoom={true} enablePan={false} />
          
          <group position={[0, -2, 0]}>
            {stack.map((symbol, index) => (
              <StackBlock 
                key={`${index}-${symbol}`}
                symbol={symbol}
                position={[0, index * 1, 0]}
                color={getColor(symbol)}
              />
            ))}
          </group>
        </Canvas>
      </div>
    </div>
  );
}

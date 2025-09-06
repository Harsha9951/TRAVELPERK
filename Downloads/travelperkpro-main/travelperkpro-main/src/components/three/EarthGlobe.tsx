import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import type { Mesh } from "three";
import earthTexture from "@/assets/earth-texture.jpg";

function Earth() {
  const earthRef = useRef<Mesh>(null);
  
  // Use useLoader instead of useTexture for better error handling
  let texture;
  try {
    texture = useLoader(TextureLoader, earthTexture);
  } catch (error) {
    console.log("Failed to load texture, using fallback color");
    texture = null;
  }

  // Rotate Earth slowly
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      {texture ? (
        <meshStandardMaterial map={texture} />
      ) : (
        <meshStandardMaterial color="#16a34a" />
      )}
    </mesh>
  );
}

export default function EarthGlobe() {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/10">
      <Canvas camera={{ position: [0, 0, 6] }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Earth with Suspense for loading */}
        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
        }>
          <Earth />
        </Suspense>

        {/* Controls (drag/touch rotate) */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
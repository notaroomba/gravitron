import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Universe } from "physics-engine";
import { Camera, PCFSoftShadowMap } from "three";
import Scene from "./Scene";

interface SandBoxProps {
  universe: Universe;
}

export default function SandBox({ universe }: SandBoxProps) {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{
          position: [0, 5, 15],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        style={{
          background: "radial-gradient(circle, #001122 0%, #000000 100%)",
        }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
      >
        {/* Orbit Controls from Drei */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={100}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          dampingFactor={0.05}
          enableDamping={true}
          autoRotate={false}
          autoRotateSpeed={0.5}
          target={[0, 0, 0]}
          screenSpacePanning={true}
          makeDefault
        />

        <Scene universe={universe} />

        {/* Enhanced fog effect */}
        <fog attach="fog" args={["#000011", 30, 200]} />
      </Canvas>
    </div>
  );
}

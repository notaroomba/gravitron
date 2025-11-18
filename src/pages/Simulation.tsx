import { Canvas } from "@react-three/fiber";

export default function Simulation() {
  return (
    <div className="font-bold text-3xl">
      Simulation Page
      <Canvas className="w-screen h-screen"></Canvas>
    </div>
  );
}

import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { Environment, ContactShadows, Grid, Text } from "@react-three/drei";
import type { Universe } from "physics-engine";
import { useSimulation } from "../contexts/SimulationContext";
import PlanetMesh from "./PlanetMesh";
import TrailMesh from "./TrailMesh";
import VelocityVector from "./VelocityVector";
import Starfield from "./Starfield";

interface SceneProps {
  universe: Universe;
}

export default function Scene({ universe }: SceneProps) {
  const {
    selectedplanetIndex,
    setSelectedplanetIndex,
    setIsPropertyEditorOpen,
    isPropertyEditorOpen,
    setRender,
  } = useSimulation();

  const [hoveredplanetIndex] = useState<number | null>(null);

  // Animation loop
  useFrame((_state, delta) => {
    if (universe.get_is_paused()) return;

    setRender((prev) => prev + 1);
    universe.time_step(delta); // Convert to 60fps equivalent
  });

  const planets = universe.get_planets();
  const trails = universe.get_trails();
  const isPaused = universe.get_is_paused();

  const handlePlanetClick = (index: number) => {
    // Only allow clicks when paused OR when property editor is already open
    if (isPaused || isPropertyEditorOpen) {
      setSelectedplanetIndex(index);
      if (isPaused) {
        setIsPropertyEditorOpen(true);
      }
    }
  };

  const handlePlanetPositionChange = (
    index: number,
    x: number,
    y: number,
    z: number
  ) => {
    universe.update_planet_position(index, x, y, z);
    setRender((prev) => prev + 1);
  };

  return (
    <>
      {/* Starfield background */}
      {/* <Starfield /> */}

      {/* Environment and lighting */}
      {/* <Environment preset="night" /> */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4444ff" />

      {/* Contact shadows for better ground contact */}
      {/* <ContactShadows
        position={[0, -5, 0]}
        opacity={0.4}
        scale={50}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      /> */}

      {/* Render planets */}
      {planets.map((planet: any, index: number) => (
        <PlanetMesh
          key={index}
          planet={planet}
          isSelected={selectedplanetIndex === index}
          isHovered={hoveredplanetIndex === index}
          onClick={() => handlePlanetClick(index)}
          onPositionChange={(x, y, z) =>
            handlePlanetPositionChange(index, x, y, z)
          }
          isPaused={isPaused}
          isClickable={isPaused || isPropertyEditorOpen}
        />
      ))}

      {/* Render trails */}
      {trails.map((trail: any, index: number) => (
        <TrailMesh key={`trail-${index}`} trail={trail} />
      ))}

      {/* Render velocity vectors when paused */}
      {planets.map((planet: any, index: number) => (
        <VelocityVector
          key={`velocity-${index}`}
          planet={planet}
          isPaused={isPaused}
        />
      ))}

      {/* Grid helper using Drei Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444444"
        sectionSize={0.5}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={true}
        infiniteGrid
      />

      {/* Information text */}
      {isPaused && (
        <Text
          position={[-8, 6, 0]}
          fontSize={0.5}
          color="white"
          anchorX="left"
          anchorY="middle"
        >
          Simulation Paused
          {"\n"}Click planets to edit
        </Text>
      )}
    </>
  );
}

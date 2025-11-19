import { useMemo, useRef, useEffect } from "react";
import {
  Sphere,
  Float,
  MeshWobbleMaterial,
  TransformControls,
} from "@react-three/drei";
import { Color, Group } from "three";
import type { Planet } from "physics-engine";

interface PlanetMeshProps {
  planet: Planet;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPositionChange?: (x: number, y: number, z: number) => void;
  isPaused: boolean;
  isClickable?: boolean;
}

export default function PlanetMesh({
  planet,
  isSelected,
  isHovered,
  onClick,
  onPositionChange,
  isPaused,
  isClickable = true,
}: PlanetMeshProps) {
  const scale = planet.radius / 10; // Scale based on radius
  const color = useMemo(() => new Color(planet.color), [planet.color]);
  const groupRef = useRef<Group>(null!);

  // Set initial position when TransformControls becomes active
  useEffect(() => {
    if (isSelected && isPaused && groupRef.current) {
      groupRef.current.position.set(
        planet.pos.x / 100,
        planet.pos.y / 100,
        planet.pos.z / 100
      );
    }
  }, [isSelected, isPaused, planet.pos.x, planet.pos.y, planet.pos.z]);

  const planetGroup = (
    <group
      ref={groupRef}
      position={
        isSelected && isPaused
          ? [0, 0, 0] // Position will be set by useEffect and controlled by TransformControls
          : [planet.pos.x / 100, planet.pos.y / 100, planet.pos.z / 100]
      }
      onClick={isClickable ? onClick : undefined}
      onPointerOver={isClickable ? (e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      } : undefined}
      onPointerOut={isClickable ? (e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      } : undefined}
    >
      {/* Planet sphere using Drei */}
      <Sphere args={[scale, 32, 32]} castShadow receiveShadow>
        {isSelected ? (
          <MeshWobbleMaterial
            color={color}
            factor={0.3}
            speed={2}
            roughness={0.8}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={isSelected ? 0x444444 : 0x000000}
            emissiveIntensity={isSelected ? 0.3 : 0}
            metalness={0.1}
            roughness={0.8}
          />
        )}
      </Sphere>

      {/* Selection highlight - yellow outline only */}
      {(isSelected || isHovered) && (
        <Sphere args={[scale * 1.2, 32, 32]}>
          <meshBasicMaterial
            color={isSelected ? 0xffaa00 : 0x88aaff}
            transparent
            opacity={0.3}
            wireframe
          />
        </Sphere>
      )}
    </group>
  );

  return (
    <Float
      speed={isSelected ? 0 : 0.5}
      rotationIntensity={isSelected ? 0 : 0.1}
      floatIntensity={isSelected ? 0 : 0.05}
    >
      {isSelected && isPaused ? (
        <TransformControls
          mode="translate"
          makeDefault
          object={groupRef}
          onObjectChange={() => {
            console.log("TransformControls onObjectChange triggered");
            // Handle position changes when drag is complete
            if (onPositionChange && groupRef.current) {
              const pos = groupRef.current.position;
              const physicsX = pos.x * 100;
              const physicsY = pos.y * 100;
              const physicsZ = pos.z * 100;
              onPositionChange(physicsX, physicsY, physicsZ);
            }
          }}
        />
      ) : null}
      {planetGroup}
    </Float>
  );
}

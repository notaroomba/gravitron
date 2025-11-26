import { useMemo, useRef, useEffect, useState } from "react";
import {
  Sphere,
  Float,
  MeshWobbleMaterial,
  PivotControls,
} from "@react-three/drei";
import { Color, Group, Matrix4, Vector3, Quaternion } from "three";
import type { Planet } from "physics-engine";

interface PlanetMeshProps {
  planet: Planet;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPositionChange?: (x: number, y: number, z: number) => void;
  onVelocityChange?: (x: number, y: number, z: number) => void;
  isPaused: boolean;
  isClickable?: boolean;
}

export default function PlanetMesh({
  planet,
  isSelected,
  isHovered,
  onClick,
  onPositionChange,
  onVelocityChange,
  isPaused,
  isClickable = true,
}: PlanetMeshProps) {
  const scale = planet.radius; // Use radius directly (already scaled in Rust)
  const color = useMemo(() => new Color(planet.color), [planet.color]);
  const groupRef = useRef<Group>(null!);
  const [updatedPosition, setUpdatedPosition] = useState<Vector3>(
    new Vector3(planet.pos.x, planet.pos.y, planet.pos.z)
  );
  const pivotRef = useRef<any>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState<[number, number, number]>([
    planet.pos.x,
    planet.pos.y,
    planet.pos.z,
  ]);

  // Set initial position when controls become active (but not during dragging)
  useEffect(() => {
    if (isSelected && isPaused && groupRef.current && !isDragging) {
      console.log("Setting initial position for pivot controls");
      groupRef.current.position.set(offset[0], offset[1], offset[2]);
    }
  }, [isSelected, isPaused, planet.pos.x, planet.pos.y, planet.pos.z]);
  useEffect(() => {
    setOffset([planet.pos.x, planet.pos.y, planet.pos.z]);
  }, [isSelected, isPaused]);
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    console.log(updatedPosition);
    setIsDragging(false);

    // Update final position when drag ends
    if (onPositionChange && groupRef.current) {
      console.log("Updated position to:", updatedPosition);
      onPositionChange(
        planet.pos.x + updatedPosition.x,
        planet.pos.y + updatedPosition.y,
        planet.pos.z + updatedPosition.z
      );
    }
  };

  // Handle position and velocity changes through pivot control manipulation
  const handlePivotDrag = (matrix: Matrix4) => {
    if (!groupRef.current) return;

    // Extract position, rotation, and scale from the transformation matrix
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(position, quaternion, scale);
    if (onPositionChange) {
      // onPositionChange(position.x, position.y, position.z);
      setUpdatedPosition(position);
      console.log("Updating position to:", position);
    }
    // Don't update position during drag - only on drag end to prevent feedback loop

    // Calculate new velocity based on rotation of current velocity vector
    if (onVelocityChange) {
      // Create velocity vector from current velocity
      const currentVelocity = new Vector3(
        planet.vel.x,
        planet.vel.y,
        planet.vel.z
      );

      // Apply the rotation to the velocity vector
      // This rotates the velocity direction based on the pivot rotation
      currentVelocity.applyQuaternion(quaternion);

      // Update velocity with rotated values
      onVelocityChange(currentVelocity.x, currentVelocity.y, currentVelocity.z);
    }
  };

  const planetGroup = (
    <group
      ref={groupRef}
      position={[planet.pos.x, planet.pos.y, planet.pos.z]}
      onClick={isClickable ? onClick : undefined}
      onPointerOver={
        isClickable
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={
        isClickable
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "default";
            }
          : undefined
      }
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
        <PivotControls
          ref={pivotRef}
          offset={offset}
          onDrag={handlePivotDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          depthTest={false}
          lineWidth={2}
          disableScaling
          disableRotations
          scale={1}
        >
          {planetGroup}
        </PivotControls>
      ) : (
        planetGroup
      )}
    </Float>
  );
}

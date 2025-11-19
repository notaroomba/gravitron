import { useMemo, useRef, useEffect } from "react";
import { Line as DreiLine, Cone } from "@react-three/drei";
import { Vector3, Mesh } from "three";
import type { Planet } from "physics-engine";

interface VelocityVectorProps {
  planet: Planet;
  isPaused: boolean;
}

export default function VelocityVector({
  planet,
  isPaused,
}: VelocityVectorProps) {
  if (!isPaused) return null;

  const arrowRef = useRef<Mesh>(null!);

  const velocityMagnitude = Math.sqrt(
    planet.vel.x * planet.vel.x +
      planet.vel.y * planet.vel.y +
      planet.vel.z * planet.vel.z
  );

  if (velocityMagnitude < 1) return null; // Adjusted threshold for smaller scale

  const { startPoint, endPoint, direction } = useMemo(() => {
    // Reduce scale to make arrows smaller and more proportional
    const scale = 0.01; // Much smaller scale for better proportions
    const start = [
      planet.pos.x / 100,
      planet.pos.y / 100,
      planet.pos.z / 100,
    ] as [number, number, number];
    const end = [
      planet.pos.x / 100 + planet.vel.x * scale,
      planet.pos.y / 100 + planet.vel.y * scale,
      planet.pos.z / 100 + planet.vel.z * scale,
    ] as [number, number, number];

    const dir = new Vector3()
      .subVectors(new Vector3(...end), new Vector3(...start))
      .normalize();

    return {
      startPoint: start,
      endPoint: end,
      direction: dir,
    };
  }, [planet.pos, planet.vel]);

  // Use useEffect to properly orient the arrow head using lookAt
  useEffect(() => {
    if (arrowRef.current) {
      const arrowPosition = new Vector3(...endPoint);
      const targetPosition = arrowPosition.clone().add(direction);

      // Reset rotation and use lookAt for proper orientation
      arrowRef.current.rotation.set(0, 0, 0);
      arrowRef.current.lookAt(targetPosition);
      // Adjust for cone's default orientation (pointing up)
      arrowRef.current.rotateX(Math.PI / 2);
    }
  }, [endPoint, direction]);

  return (
    <group>
      {/* Velocity vector line using Drei */}
      <DreiLine points={[startPoint, endPoint]} color="#4a5568" lineWidth={2} />

      {/* Arrow head using Drei Cone */}
      <Cone
        ref={arrowRef}
        args={[0.015, 0.08, 8]} // Smaller arrow head to match scaled vectors
        position={endPoint}
      >
        <meshBasicMaterial color="#4a5568" />
      </Cone>
    </group>
  );
}

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

  if (velocityMagnitude < 0.01) return null; // Adjusted threshold for new coordinate system

  const { startPoint, endPoint, direction } = useMemo(() => {
    // Scale for velocity vectors (since coordinates are now already scaled)
    const scale = 1.0; // Adjusted for new coordinate system
    const start = [planet.pos.x, planet.pos.y, planet.pos.z] as [
      number,
      number,
      number
    ];
    const end = [
      planet.pos.x + planet.vel.x * scale,
      planet.pos.y + planet.vel.y * scale,
      planet.pos.z + planet.vel.z * scale,
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
        args={[0.03, 0.15, 8]} // Bigger arrow head for better visibility
        position={endPoint}
      >
        <meshBasicMaterial color="#4a5568" />
      </Cone>
    </group>
  );
}

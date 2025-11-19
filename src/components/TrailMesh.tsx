import { useMemo } from "react";
import { Line as DreiLine } from "@react-three/drei";
import { Color } from "three";
import type { Trail } from "physics-engine";

interface TrailMeshProps {
  trail: Trail[];
}

export default function TrailMesh({ trail }: TrailMeshProps) {
  if (trail.length < 2) return null;

  const points = useMemo(
    () =>
      trail.map(
        (point) =>
          [point.pos.x / 100, point.pos.y / 100, point.pos.z / 100] as [
            number,
            number,
            number
          ]
      ),
    [trail]
  );

  return (
    <DreiLine
      points={points}
      color={new Color(trail[0]?.color || 0xffffff)}
      lineWidth={2}
      transparent
      opacity={0.7}
    />
  );
}

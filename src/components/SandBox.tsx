import { extend, useTick } from "@pixi/react";
import type { Planet, Trail, Universe } from "physics-engine";
import { Container, Graphics } from "pixi.js";
import { useCallback, useRef, useState } from "react";
import { useSimulation } from "../contexts/SimulationContext";

extend({
  Container,
  Graphics,
});

interface SandBoxProps {
  universe: Universe;
}

export default function SandBox({ universe }: SandBoxProps) {
  const {
    selectedplanetIndex,
    setSelectedplanetIndex,
    setIsPropertyEditorOpen,
    render,
    setRender,
  } = useSimulation();

  const [hoveredplanetIndex, setHoveredplanetIndex] = useState<number | null>(
    null
  );
  const [isDraggingPlanet, setIsDraggingPlanet] = useState(false);
  const pixiContainerRef = useRef<any>(null);

  const handlePlanetDragStart = (index: number, event: any) => {
    event.stopPropagation();
    setSelectedplanetIndex(index);
    setIsDraggingPlanet(true);
    // Pause simulation while dragging
    universe.set_is_paused(true);
  };

  const handlePlanetDrag = (index: number, event: any) => {
    if (!isDraggingPlanet || !pixiContainerRef.current) return;

    const localPos = pixiContainerRef.current.toLocal(event.global);

    // Update the planet's position
    universe.update_planet_position(index, localPos.x, localPos.y, 0);
    setRender((prev) => prev + 1);
  };

  const handlePlanetDragEnd = () => {
    setIsDraggingPlanet(false);
    // Don't automatically resume - let user control pause state
  };

  const drawCallback = useCallback(
    (graphics: any) => {
      graphics.clear();

      const planets: Planet[] = universe.get_planets();
      const trails: Trail[][] = universe.get_trails();
      const isPaused = universe.get_is_paused();

      // Draw trails first (behind planets)
      if (universe.get_show_trails()) {
        for (let i = 0; i < trails.length; i++) {
          const trail = trails[i];
          for (let j = 0; j < trail.length; j++) {
            graphics.setStrokeStyle({
              width: 2,
              color: trail[j].color,
              alpha: ((j + 1) / trail.length) * 0.7,
            });
            if (j === 0) {
              graphics.moveTo(trail[j].pos.x, trail[j].pos.y);
            } else {
              graphics.lineTo(trail[j].pos.x, trail[j].pos.y);
            }
            graphics.stroke();
          }
        }
      }

      // Draw velocity vectors when paused
      if (isPaused) {
        for (let i = 0; i < planets.length; i++) {
          const planet = planets[i];
          const velocityMag = Math.sqrt(
            planet.vel.x * planet.vel.x + planet.vel.y * planet.vel.y
          );

          if (velocityMag > 0.01) {
            const velScale = 1.0;
            const velX = planet.vel.x * velScale;
            const velY = planet.vel.y * velScale;

            // Draw velocity vector line
            graphics.setStrokeStyle({
              width: 3,
              color: 0x4a5568,
              alpha: 1,
              cap: "round",
              join: "round",
            });
            graphics.moveTo(planet.pos.x, planet.pos.y);
            graphics.lineTo(planet.pos.x + velX, planet.pos.y + velY);
            graphics.stroke();

            // Draw arrow head for velocity
            const arrowSize = 15;
            const arrowAngle = Math.PI / 6;
            const velAngleDir = Math.atan2(velY, velX);

            const tipX = planet.pos.x + velX;
            const tipY = planet.pos.y + velY;

            const arrowOffset = -8;
            const arrowTipX = tipX - Math.cos(velAngleDir) * arrowOffset;
            const arrowTipY = tipY - Math.sin(velAngleDir) * arrowOffset;

            graphics.poly([
              {
                x: arrowTipX,
                y: arrowTipY,
              },
              {
                x: arrowTipX - Math.cos(velAngleDir - arrowAngle) * arrowSize,
                y: arrowTipY - Math.sin(velAngleDir - arrowAngle) * arrowSize,
              },
              {
                x: arrowTipX - Math.cos(velAngleDir + arrowAngle) * arrowSize,
                y: arrowTipY - Math.sin(velAngleDir + arrowAngle) * arrowSize,
              },
            ]);
            graphics.fill({ color: 0x4a5568, alpha: 1 });
          }
        }
      }

      // Draw planets
      for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];
        const isSelected = selectedplanetIndex === i;
        const isHovered = hoveredplanetIndex === i && isPaused; // Only show hover when paused

        // Draw selection/hover highlight (only when paused)
        if ((isSelected || isHovered) && isPaused) {
          graphics.circle(planet.pos.x, planet.pos.y, planet.radius + 8);
          graphics.fill({
            color: isSelected ? 0xffffff : 0xffaa00,
            alpha: 0.1,
          });
          graphics.stroke({
            width: 3,
            color: isSelected ? 0xffffff : 0xffaa00,
            alpha: isSelected ? 0.6 : 0.6,
          });
        }

        // Draw planet
        graphics.circle(planet.pos.x, planet.pos.y, planet.radius);
        graphics.fill({ color: planet.color, alpha: 1 });
      }
    },
    [universe, selectedplanetIndex, hoveredplanetIndex, render]
  );

  useTick((delta) => {
    if (universe.get_is_paused()) return;

    setRender((prev) => prev + 1);
    universe.time_step(delta.deltaTime / 60); // Convert to seconds
  });

  return (
    <>
      <pixiContainer
        x={0}
        y={0}
        ref={pixiContainerRef}
        interactive
        onPointerDown={(event: any) => {
          // Only allow interaction when paused
          if (!universe.get_is_paused()) return;

          const localPos = pixiContainerRef.current.toLocal(event.data.global);
          const planets: Planet[] = universe.get_planets();

          // Check if clicked on a planet
          for (let i = planets.length - 1; i >= 0; i--) {
            const planet = planets[i];
            const dx = localPos.x - planet.pos.x;
            const dy = localPos.y - planet.pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= planet.radius + 10) {
              setSelectedplanetIndex(i);
              // Only open property editor when paused
              if (universe.get_is_paused()) {
                setIsPropertyEditorOpen(true);
              }
              handlePlanetDragStart(i, event);
              return;
            }
          }

          // Clicked on empty space - deselect
          setSelectedplanetIndex(null);
        }}
        onGlobalPointerMove={(event: any) => {
          if (isDraggingPlanet && selectedplanetIndex !== null) {
            handlePlanetDrag(selectedplanetIndex, event);
          }

          // Only allow hover highlighting when paused
          if (!universe.get_is_paused()) {
            setHoveredplanetIndex(null);
            if (pixiContainerRef.current) {
              pixiContainerRef.current.cursor = "default";
            }
            return;
          }

          if (!isDraggingPlanet) {
            // Check if hovering over a planet and update hover state
            const planets: Planet[] = universe.get_planets();
            let hoveringOverPlanet = false;
            let hoveredIndex: number | null = null;
            const localPos = pixiContainerRef.current.toLocal(
              event.data.global
            );

            for (let i = planets.length - 1; i >= 0; i--) {
              const planet = planets[i];
              const dx = localPos.x - planet.pos.x;
              const dy = localPos.y - planet.pos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance <= planet.radius + 10) {
                hoveringOverPlanet = true;
                hoveredIndex = i;
                break;
              }
            }

            setHoveredplanetIndex(hoveredIndex);
            if (pixiContainerRef.current) {
              pixiContainerRef.current.cursor = hoveringOverPlanet
                ? "grab"
                : "default";
            }
          }
        }}
        onPointerUp={handlePlanetDragEnd}
        onPointerUpOutside={handlePlanetDragEnd}
      >
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </>
  );
}

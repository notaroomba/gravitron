import { useCallback } from "react";
import { Graphics as G } from "pixi.js";
import { Graphics } from "@pixi/react";
import { BatchGraphicsProps, QuadTreeProps } from "./Types";

export default function BatchGraphics({
  planets,
  quadTree,
}: BatchGraphicsProps) {
  const draw = useCallback(
    (g: G) => {
      let index = 0;
      g.clear();
      //g.lineStyle(1);
      for (let i = 0; i < planets.length; i++) {
        g.beginFill(planets[i].color, 1);
        g.drawCircle(planets[i].pos.x, planets[i].pos.y, planets[i].radius);
        g.endFill();
      }
      if (quadTree) {
        g.lineStyle(1, "#ffffff");
        g.drawRect(
          quadTree.center.x - quadTree.dimensions.x / 2,
          quadTree.center.y - quadTree.dimensions.y / 2,
          quadTree.dimensions.x,
          quadTree.dimensions.y,
        );
        const drawQuadRect = (qtt: QuadTreeProps) => {
          g.drawRect(
            qtt.center.x - qtt.dimensions.x / 2,
            qtt.center.y - qtt.dimensions.y / 2,
            qtt.dimensions.x,
            qtt.dimensions.y,
          );
          index++;
          if (qtt.children && index > 6/quadTree.theta) {
            for (let i = 0; i < qtt.children.length; i++) {
              drawQuadRect(qtt.children[i]);
            }
          }
        };
        if (quadTree.children && index > 6/quadTree.theta)
          for (let i = 0; i < quadTree.children.length; i++) {
            drawQuadRect(quadTree.children[i]);
          }
      }
    },
    [planets, quadTree],
  );
  return <Graphics draw={draw} />;
}

/* eslint-disable react-refresh/only-export-components */
import { ChangeEvent, useEffect, useState } from "react";
import { useTick } from "@pixi/react";
import { Color } from "pixi.js";
import { Universe } from "physics-engine/physics_engine";
import BatchGraphics from "../utils/BatchGraphics";
import { SandboxProps, UniverseInfo } from "../utils/Types";
const universe: Universe = new Universe(0, 0);
let info: UniverseInfo;

const planetColors = [
  "#264653",
  "#2A9D8F",
  "#F4A261",
  "#E76F51",
  "#277da1",
  "#43aa8b",
  "#E9C46A",
  "#f8961e",
  "#f94144",
];

export default function SandBox({
  width,
  height,
  random,
  count,
}: SandboxProps) {
  const [render, setRender] = useState(0);
  useTick((delta) => {
    setRender(render + 1);
    universe.time_step(delta);
  });
  useEffect(() => {
    universe.set_dimensions(width, height);
    info = { width, height, count, random, qtv: false };
    universe.reset();
    //universe.add_planet(new Planet([props.size[0]/2, props.size[1]/2], [0, 0], 15, 1000, new Color("grey").toHex()).get_data())
    for (let i = 0; i < count; i++) {
      universe.add_planet(
        Math.random() * width,
        Math.random() * height,
        Math.random() - 0.5,
        Math.random() - 0.5,
        info.random ? Math.random() * 12 + 1 : 12,
        info.random ? Math.random() * 1000 : universe.get_mass(),
        new Color(
          planetColors[Math.floor(planetColors.length * Math.random())],
        ).toHex(),
      );
    }
    universe.rebuild();
  }, [width, height, count, random]);

  return (
    <BatchGraphics
      planets={universe.get_planets()}
      quadTree={info?.qtv ? universe.get_quad_tree() : null}
    />
  );
}
export function changeSpeed(event: ChangeEvent<HTMLInputElement>) {
  universe.set_speed(parseFloat(event.target.value));
}
export function changeMass(event: ChangeEvent<HTMLInputElement>) {
  universe.set_mass(parseInt(event.target.value));
}
export function resetSimulation() {
  universe.reset();
  //universe.add_planet(new Planet([nP[0]/2, nP[1]/2], [0, 0], 15, 100000000000000, new Color("grey").toHex()).get_data())
  for (let i = 0; i < info.count; i++) {
    universe.add_planet(
      Math.random() * info.width,
      Math.random() * info.height,
      Math.random() - 0.5,
      Math.random() - 0.5,
      info.random ? Math.random() * 12 + 1 : 12,
      info.random ? Math.random() * 1000 : universe.get_mass(),
      new Color(
        planetColors[Math.floor(planetColors.length * Math.random())],
      ).toHex(),
    );
  }
  universe.rebuild();
}
export function changePlanets(event: ChangeEvent<HTMLInputElement>) {
  const { c, w }: { c: number; w: number } = {
    c: universe.get_planet_count(),
    w: parseInt(event.target.value),
  };
  if (w >= c) {
    for (let i = 0; i < w - c; i++) {
      universe.add_planet(
        Math.random() * info.width,
        Math.random() * info.height,
        Math.random() - 0.5,
        Math.random() - 0.5,
        info.random ? Math.random() * 12 + 1 : 12,
        info.random ? Math.random() * universe.get_mass() : universe.get_mass(),
        new Color(
          planetColors[Math.floor(planetColors.length * Math.random())],
        ).toHex(),
      );
    }
  } else {
    for (let i = 0; i < c - w; i++) {
      universe.remove_planet();
      if (universe.get_planet_count() < 500) info.qtv = false;
    }
  }
  universe.rebuild();
  return w;
}
export function changeGravity(event: ChangeEvent<HTMLInputElement>) {
  universe.set_gravity(parseFloat(event.target.value));
}
export function changeTheta(event: ChangeEvent<HTMLInputElement>) {
  universe.set_theta(parseFloat(event.target.value));
}
export function toggleQuadTree() {
  info.qtv = !info.qtv;
}
export function toggleRandom() {
  info.random = !info.random;
  resetSimulation();
  return info.random;
}
export function getPlanetCount() {
  return universe.get_planet_count();
}

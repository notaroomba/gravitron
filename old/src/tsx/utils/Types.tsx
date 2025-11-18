import { Vec2 } from "physics-engine";
import { ChangeEvent } from "react";

export interface SandboxProps {
  random: boolean;
  width: number;
  height: number;
  count: number;
}
export interface BatchGraphicsProps {
  planets: Array<PlanetProps>;
  quadTree: QuadTreeProps | null;
}

export interface UniverseInfo {
  width: number;
  height: number;
  count: number;
  random: boolean;
  qtv: boolean;
}

export interface PlanetProps {
  mass: number;
  radius: number;
  color: string;
  pos: Vec2;
}
export interface QuadTreeProps {
  mass: number;
  center: Vec2;
  center_of_mass: Vec2;
  dimensions: Vec2;
  theta: number;
  children: Array<QuadTreeProps>;
  planets: Array<PlanetProps>;
}

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  title: string;
  defaultValue: number;
  func: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  text: string;
  func: () => void;
}

export const bgColors = [
  "bg-light-cyan",
  "bg-salmon",
  "bg-medium-blue",
  "bg-teal",
  "bg-orange-orange",
  "bg-really-red",
];

export const accentColors = [
  "accent-dark-blue",
  "accent-light-cyan",
  "accent-yellow-orange",
  "accent-salmon",
  "accent-medium-blue",
  "accent-teal",
  "accent-darkish-yellow",
  "accent-orange-orange",
  "accent-really-red",
];

export const textColors = [
  "text-light-cyan",
  "text-yellow-orange",
  "text-salmon",
  "text-medium-blue",
  "text-teal",
  "text-darkish-yellow",
  "text-orange-orange",
];

export interface UniverseProp {
  time_step: (dt: number) => void;
  reset: () => void;
  get_quad_tree: () => QuadTreeProps;
  add_planet: (planet: PlanetProps) => void;
  remove_planet: () => void;
  get_planets: () => Array<PlanetProps>;
  //gravity
  get_gravity: () => number;
  set_gravity: (gravity: number) => void;
  //speed
  get_speed: () => number;
  set_speed: (speed: number) => void;
  //power (unused)
  get_power: () => number;
  set_power: (power: number) => void;
  //mass
  get_mass: () => number;
  set_mass: (mass: number) => void;
  //theta
  set_theta: () => number;
}

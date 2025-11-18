import { useEffect, useState } from "react";
import { SliderProps, accentColors } from "../utils/Types";

export default function Slider({
  min,
  max,
  step,
  defaultValue,
  title,
  func,
}: SliderProps) {
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(accentColors[Math.floor(Math.random() * accentColors.length)]);
  }, []);
  return (
    <div className="w-full pb-5 align-middle">
      <p className="text-2xl font-semibold my-0">{title}</p>
      <div className="flex justify-center align-middle">
        <p className="text-center p-2">{min}</p>
        <input
          type="range"
          className={color}
          max={max}
          min={min}
          step={step}
          defaultValue={defaultValue}
          onChange={func}
        />
        <p className="text-center p-2">{max}</p>
      </div>
    </div>
  );
}

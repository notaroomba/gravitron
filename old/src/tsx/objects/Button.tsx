import { useState, useEffect } from "react";
import { ButtonProps, bgColors } from "../utils/Types";

export default function Button({ text, func }: ButtonProps) {
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(bgColors[Math.floor(Math.random() * bgColors.length)]);
  }, []);
  return (
    <button
      onClick={func}
      className={
        "text-neutral-950 py-2 px-12 m-2 rounded-xl font-bold " + color
      }
    >
      {text}
    </button>
  );
}

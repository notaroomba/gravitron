import { Link } from "react-router-dom";
import { Stage } from "@pixi/react";
import SandBox from "../objects/SandBox";
import { useWindowDimension } from "../utils/useWindowDimension";
import Transitions from "../utils/Transitions";

export default function Error() {
  const [width, height] = useWindowDimension();
  return (
    <Transitions>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x000 }}
        className="canvas"
      >
        <SandBox random={true} count={150} width={width} height={height} />
      </Stage>
      <div className="fixed -translate-x-1/2 -translate-y-1/3 left-1/2 top-1/3">
        <h1 className="text-6xl md:text-9xl font-semibold mb-12">404</h1>
        <Link
          to="/"
          className="no-underline bg-black text-neutral-200 text-3xl lg:text-6xl font-extrabold shadow-black transition-all duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)] px-32 py-2.5 border-0 border-solid hover:border hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)] hover:border-solid outline"
        >
          Home
        </Link>
      </div>
    </Transitions>
  );
}

import { useApp, PixiComponent, Stage } from "@pixi/react";
import { EventSystem } from "@pixi/events";
import { Viewport as PixiViewport } from "pixi-viewport";
import SandBox from "../objects/SandBox";
import Settings from "../objects/Settings";
import { useWindowDimension } from "../utils/useWindowDimension";
import { useState } from "react";
import Transitions from "../utils/Transitions";

const Viewport = (props: {
  width: number;
  height: number;
  children: unknown;
}) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props) => {
    if (!("events" in props.app.renderer))
      props.app.renderer.addSystem(EventSystem, "events");

    const { width, height } = props;
    const { ticker } = props.app;
    const { events } = props.app.renderer;

    //throws error because of this.transform == null
    const viewport = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker: ticker,
      events: events,
    });
    viewport
      .drag({ pressDrag: true })
      .decelerate({
        friction: 0.95, // percent to decelerate after movement
        bounce: 0.8, // percent to decelerate when past boundaries (only applicable when viewport.bounce() is active)
        minSpeed: 0.01,
      })
      .pinch()
      .wheel();

    return viewport;
  },
  willUnmount: (instance) => {
    // workaround because the ticker is already destroyed by this point by the stage
    instance.options.noTicker = true;
    instance.options.events.domElement = document.createElement("Viewport");
    instance.destroy({ children: true });
  },
});

export default function Play() {
  const [width, height] = useWindowDimension();
  const [pointerDown, setPointerDown] = useState(false);
  const pointer = (value: boolean) => {
    setPointerDown(value);
  };
  return (
    <Transitions>
      <div className="flex m-0 justify-start">
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0x000 }}
          className={
            "xs:w-[70vw] " +
            (pointerDown ? "cursor-grabbing" : "cursor-pointer")
          }
          onPointerDown={() => pointer(true)}
          onPointerUp={() => pointer(false)}
        >
          <Viewport width={width} height={height}>
            <SandBox random={false} count={250} width={width} height={height} />
          </Viewport>
        </Stage>
        <Settings />
      </div>
    </Transitions>
  );
}

import {
  changeSpeed,
  changeMass,
  resetSimulation,
  changePlanets,
  changeTheta,
  toggleQuadTree,
  toggleRandom,
  getPlanetCount,
} from "./SandBox";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Slider from "./Slider";
import Button from "./Button";
export default function Settings() {
  // TODO: have settings to set the current number of planets to have random masses and sizes
  // TODO: toggle quadtree visibility and add and remove theta when needed
  const [isOpen, setIsOpen] = useState(false);
  const [planetSize, setPlanetSize] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [reset, setReset] = useState(0);
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir == "Up" && !isOpen) {
        setIsOpen(!isOpen);
      }
      if (eventData.dir == "Down" && isOpen) {
        setIsOpen(!isOpen);
      }
    },
    ...{ trackMouse: true },
  });
  return (
    <div
      className={
        "absolute flex flex-col text-neutral-300 bg-neutral-900 w-screen pt-12 rounded-t-xl" +
        (isOpen ? " bottom-0" : " -bottom-32")
      }
    >
      <div
        {...handlers}
        className="w-full bg-neutral-900 h-6 -translate-y-12 rounded-t-full"
      >
        <hr className="absolute justify-center w-3/6 left-1/2 -translate-x-1/2 translate-y-4 border-2 rounded mx-auto px-24"></hr>
        <p
          className="flex text-3xl font-bold text-center justify-center pt-8 hover:animate-pulse hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Settings
        </p>
      </div>
      <div className={"align-middle overflow-y-scroll py-4 h-36"}>
        <Slider
          key={reset + 1 + (isRandom ? 1 : 2)}
          min={-10}
          max={10}
          step={0.1}
          defaultValue={1}
          title="Simulation Speed"
          func={changeSpeed}
        />
        <Slider
          key={reset + 9 + (isRandom ? 1 : 2)}
          min={1}
          max={1000}
          step={1}
          defaultValue={250}
          title="Number of Planets"
          func={(e) => setPlanetSize(changePlanets(e))}
        />
        <Slider
          key={reset + 3 + (isRandom ? 1 : 2)}
          min={1}
          max={1000}
          step={1}
          defaultValue={12}
          title="Planet Mass"
          func={changeMass}
        />
        {planetSize > 500 ? (
          <Slider
            key={reset + 4 + (isRandom ? 1 : 2)}
            min={0.1}
            max={3}
            step={0.1}
            defaultValue={0.7}
            title="Theta"
            func={changeTheta}
          />
        ) : (
          <></>
        )}
        <div className="flex flex-wrap justify-center">
          {planetSize > 500 ? (
            <Button text={"Toggle QuadTree"} func={toggleQuadTree} />
          ) : (
            <></>
          )}
          <Button
            text={isRandom ? "De-Randomize" : "Randomize"}
            func={() => {
              setIsRandom(toggleRandom());
              setPlanetSize(getPlanetCount());
            }}
          />
          <Button
            text={"Reset Simulation"}
            func={() => {
              resetSimulation();
              setReset(reset + 1);
            }}
          />
          <Button text={"Hard Reset"} func={() => window.location.reload()} />
        </div>
      </div>
    </div>
  );
}

// OLD
// <div className="bg-[#121212] w-full rounded-tr-none rounded-br-none rounded-[35px] align-middle">
//     <p className="text-[4vw] font-bold m-2.5">Settings</p>
//     <hr className="text-neutral-200 w-9/12 mb-2.5 align-middle"></hr>
//     <div className="align-middle">
//         {/* <p className="text-[max(1.5vw,1.5vh)] font-semibold my-0">Gravity (G*m1*m2)/(r^n)</p>
//         <p className="inline-block w-[30px] text-center p-px" id="red-too">1</p>
//         <input type="range" max={1000} min={1} step={1} defaultValue={2} onChange={changeGravity}/>
//         <p className="inline-block w-[30px] text-center p-px">1000</p> */}
//         <p className="text-[max(1.5vw,1.5vh)] font-semibold my-0">Simulation Speed</p>
//         <p className="inline-block w-[30px] text-center p-px" id="red-too">-10</p>
//         <input type="range" max={10} min={-10} step={0.1} defaultValue={1} onChange={changeSpeed}/>
//         <p className="inline-block w-[30px] text-center p-px">10</p>
//         <p className="text-[max(1.5vw,1.5vh)] font-semibold my-0">Planet Mass</p>
//         <p className="inline-block w-[30px] text-center p-px">1</p>
//         <input type="range" max={1000} min={1} step={10} defaultValue={10} onChange={changeMass}/>
//         <p className="inline-block w-[30px] text-center p-px">1000</p>
//         <p className="text-[max(1.5vw,1.5vh)] font-semibold my-0">Number of Planets</p>
//         <p className="inline-block w-[30px] text-center p-px">2</p>
//         <input type="range" max={2000} min={2} step={1} defaultValue={25} onChange={changePlanets}/>
//         <p className="inline-block w-[30px] text-center p-px">2000</p>
//         <p className="text-[max(1.5vw,1.5vh)] font-semibold my-0">Theta</p>
//         <p className="inline-block w-[30px] text-center p-px">0.1</p>
//         <input type="range" max={3} min={0.1} step={0.1} defaultValue={0.5} onChange={changeTheta}/>
//         <p className="inline-block w-[30px] text-center p-px">3</p>
//     </div>

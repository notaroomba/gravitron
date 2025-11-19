import { Universe } from "physics-engine";
import Transitions from "../utils/Transitions";
import SettingsBar from "../components/SettingsBar";
import PropertyEditor from "../components/PropertyEditor";
import {
  SimulationProvider,
  useSimulation,
} from "../contexts/SimulationContext";
import SandBox from "../components/SandBox";

// Create universe singleton
const universeInstance: Universe = new Universe();

console.log("Universe initialized:", universeInstance.get_planets());

function SimulationContent() {
  const { universe } = useSimulation();

  return (
    <Transitions>
      <div className="w-screen h-screen bg-black">
        <SandBox universe={universe} />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 p-2 sm:p-4 pointer-events-none flex flex-col justify-center items-start">
        <p className="text-neutral-100 font-bold text-4xl md:text-5xl  text-center">
          Gravitron
        </p>
        <p className="text-neutral-100 text-md md:text-lg  text-center mx-auto">
          Made by{" "}
          <a
            className="underline pointer-events-auto"
            href="https://github.com/NotARoomba"
            target="_blank"
            rel="noopener noreferrer"
          >
            NotARoomba
          </a>
        </p>
      </div>
      <div className="absolute bottom-0 w-screen p-2 sm:p-4 pointer-events-none flex justify-center items-start">
        <SettingsBar />
      </div>

      {/* Property Editor */}
      <PropertyEditor />
    </Transitions>
  );
}

export default function Simulation() {
  return (
    <SimulationProvider universe={universeInstance}>
      <SimulationContent />
    </SimulationProvider>
  );
}

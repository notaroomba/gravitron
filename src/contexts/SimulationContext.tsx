import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Universe } from "physics-engine";

interface SimulationContextType {
  universe: Universe;
  render: number;
  setRender: React.Dispatch<React.SetStateAction<number>>;
  selectedplanetIndex: number | null;
  setSelectedplanetIndex: (index: number | null) => void;
  isPropertyEditorOpen: boolean;
  setIsPropertyEditorOpen: (open: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }
  return context;
}

interface SimulationProviderProps {
  children: ReactNode;
  universe: Universe;
}

export function SimulationProvider({
  children,
  universe,
}: SimulationProviderProps) {
  const [render, setRender] = useState(0);
  const [selectedplanetIndex, setSelectedplanetIndex] = useState<number | null>(
    null
  );
  const [isPropertyEditorOpen, setIsPropertyEditorOpen] = useState(false);

  return (
    <SimulationContext.Provider
      value={{
        universe,
        render,
        setRender,
        selectedplanetIndex,
        setSelectedplanetIndex,
        isPropertyEditorOpen,
        setIsPropertyEditorOpen,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

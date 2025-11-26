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
  showMoreInfo: boolean;
  setShowMoreInfo: (show: boolean) => void;
  showVelocityVectors: boolean;
  setShowVelocityVectors: (show: boolean) => void;
  useQuadtree: boolean;
  setUseQuadtree: (use: boolean) => void;
  viewQuadtree: boolean;
  setViewQuadtree: (view: boolean) => void;
  quadtreeTheta: number;
  setQuadtreeTheta: (theta: number) => void;
  fps: number;
  setFps: React.Dispatch<React.SetStateAction<number>>;
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
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showVelocityVectors, setShowVelocityVectors] = useState(false);
  const [useQuadtree, setUseQuadtree] = useState(false);
  const [viewQuadtree, setViewQuadtree] = useState(false);
  const [quadtreeTheta, setQuadtreeTheta] = useState(0.5);
  const [fps, setFps] = useState(0);

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
        showMoreInfo,
        setShowMoreInfo,
        showVelocityVectors,
        setShowVelocityVectors,
        useQuadtree,
        setUseQuadtree,
        viewQuadtree,
        setViewQuadtree,
        quadtreeTheta,
        setQuadtreeTheta,
        fps,
        setFps,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

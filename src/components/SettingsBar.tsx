import {
  Rewind,
  Pause,
  Play,
  FastForward,
  RotateCcw,
  Calculator,
  ChartScatter,
  Plus,
  Minus,
  Edit3,
  Scale,
  Sparkles,
  Maximize2,
  BookOpen,
  Rabbit,
  Info,
  Navigation,
  Grid3x3,
  Eye,
  Settings,
} from "lucide-react";
import { Implementation } from "physics-engine";
import { useEffect, useState, useRef } from "react";
import { useSimulation } from "../contexts/SimulationContext";

export default function SettingsBar() {
  const {
    universe,
    render,
    setRender,
    setIsPropertyEditorOpen,
    isPropertyEditorOpen,
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
  } = useSimulation();
  const [isPaused, setIsPaused] = useState(universe.get_is_paused());
  const [implementation, setImplementation] = useState<Implementation>(
    universe.get_implementation()
  );
  const [massCalculation, setMassCalculation] = useState(
    universe.get_mass_calculation()
  );
  const [showTrails, setShowTrails] = useState(universe.get_show_trails());
  const [planetCount, setPlanetCount] = useState(1);

  const addIntervalRef = useRef<number | null>(null);
  const removeIntervalRef = useRef<number | null>(null);
  const quadtreeManuallyDisabledRef = useRef(false);
  const previousVelocityVectorsRef = useRef(showVelocityVectors);

  const BASE_SPEED = 0.05; // 1x == 0.05
  const multipliers = [-4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4];
  const [multiplier, setMultiplier] = useState(() => {
    const current = universe.get_speed();
    return Math.round((current / BASE_SPEED) * 100) / 100;
  });

  useEffect(() => {
    universe.set_implementation(implementation);
    console.log("Implementation set to", implementation);
  }, [implementation]);

  useEffect(() => {
    universe.set_is_paused(isPaused);
    console.log("Simulation is now", isPaused ? "paused" : "playing");

    if (isPaused) {
      // Store the current velocity vector setting and show vectors when paused
      previousVelocityVectorsRef.current = showVelocityVectors;
      setShowVelocityVectors(true);
    } else {
      // Restore the previous velocity vector setting when unpaused
      setShowVelocityVectors(previousVelocityVectorsRef.current);
    }

    setRender((prev) => prev + 1);
  }, [isPaused]);

  useEffect(() => {
    universe.set_use_quadtree(useQuadtree);
    console.log("Quadtree", useQuadtree ? "enabled" : "disabled");
  }, [useQuadtree]);

  useEffect(() => {
    universe.set_quadtree_theta(quadtreeTheta);
    console.log("Quadtree theta set to", quadtreeTheta);
  }, [quadtreeTheta]);

  // Track manual changes to velocity vectors while paused
  useEffect(() => {
    if (isPaused) {
      // Update the ref when user manually changes velocity vectors while paused
      previousVelocityVectorsRef.current = showVelocityVectors;
    }
  }, [showVelocityVectors, isPaused]);

  // Auto-enable quadtree when planet count reaches 150 (only if not manually disabled)
  useEffect(() => {
    const currentPlanetCount = universe.get_planet_count();
    if (
      currentPlanetCount >= 150 &&
      !useQuadtree &&
      !quadtreeManuallyDisabledRef.current
    ) {
      setUseQuadtree(true);
      console.log("Quadtree auto-enabled at", currentPlanetCount, "planets");
    }
    // Reset manual disable flag if planet count drops below 150
    if (currentPlanetCount < 150) {
      quadtreeManuallyDisabledRef.current = false;
    }
  }, [render]); // Trigger on render updates (when planets are added/removed)

  const rewind = () => {
    const currentIndex = multipliers.indexOf(multiplier);
    const newIndex = Math.max(0, currentIndex - 1);
    const newMultiplier = multipliers[newIndex];
    setMultiplier(newMultiplier);
    universe.set_speed(newMultiplier * BASE_SPEED);
    setRender((prev) => prev + 1);
  };

  const fastForward = () => {
    const currentIndex = multipliers.indexOf(multiplier);
    const newIndex = Math.min(multipliers.length - 1, currentIndex + 1);
    const newMultiplier = multipliers[newIndex];
    setMultiplier(newMultiplier);
    universe.set_speed(newMultiplier * BASE_SPEED);
    setRender((prev) => prev + 1);
  };

  const reset = () => {
    const isPaused = universe.get_is_paused();
    universe.reset();
    universe.set_is_paused(isPaused);
    universe.set_mass_calculation(massCalculation);
    // universe.set_show_trails(showTrails);
    universe.set_use_quadtree(useQuadtree);
    setMultiplier(1);
    universe.set_speed(1 * BASE_SPEED);
    setImplementation(implementation);
    setRender((prev) => prev + 1);
  };

  const resetView = () => {
    // Access the viewport through the stage children
    const app = (window as any).pixiApp;
    if (app && app.stage && app.stage.children) {
      const viewport = app.stage.children.find(
        (child: any) => child.constructor.name === "ViewportWrapper"
      );
      if (viewport) {
        viewport.position.set(app.canvas.width / 2, app.canvas.height / 3);
        viewport.scale.set(1, 1);
        viewport.rotation = 0;
      }
    }
  };

  const addPlanets = (count: number) => {
    for (let i = 0; i < count; i++) {
      universe.add_planet_simple(
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
        0
      );
    }
    setRender((prev) => prev + 1);
  };

  const removePlanets = (count: number) => {
    for (let i = 0; i < count; i++) {
      universe.remove_planet();
    }
    setRender((prev) => prev + 1);
  };

  const handleAddMouseDown = () => {
    addPlanets(planetCount);
    addIntervalRef.current = setInterval(() => {
      addPlanets(planetCount);
    }, 200);
  };

  const handleAddMouseUp = () => {
    if (addIntervalRef.current) {
      clearInterval(addIntervalRef.current);
      addIntervalRef.current = null;
    }
  };

  const handleRemoveMouseDown = () => {
    removePlanets(planetCount);
    removeIntervalRef.current = setInterval(() => {
      removePlanets(planetCount);
    }, 200);
  };

  const handleRemoveMouseUp = () => {
    if (removeIntervalRef.current) {
      clearInterval(removeIntervalRef.current);
      removeIntervalRef.current = null;
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (addIntervalRef.current) clearInterval(addIntervalRef.current);
      if (removeIntervalRef.current) clearInterval(removeIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Edit Mode Indicator */}
      {isPaused && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto text-center animate-pulse">
          <p className="font-semibold text-sm sm:text-base">
            🎯 Edit Mode Active
          </p>
          <p className="text-xs sm:text-sm opacity-90">
            Click/drag a planet to edit its properties
          </p>
        </div>
      )}

      {/* Settings Bar */}
      <div className="w-fit max-w-full py-2 px-2 sm:px-4 bg-white border pointer-events-auto border-gray-200 rounded-lg shadow-xl overflow-x-auto">
        <div className="flex items-center justify-center divide-x divide-gray-300 flex-wrap sm:flex-nowrap gap-y-2">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <button
              onClick={() => setImplementation(Implementation.Euler)}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                implementation === Implementation.Euler
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              title="Euler Method"
            >
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setImplementation(Implementation.RK4)}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                implementation === Implementation.RK4
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              title="RK4 Method"
            >
              <ChartScatter className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setImplementation(Implementation.Verlet)}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                implementation === Implementation.Verlet
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              title="Verlet Method"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setImplementation(Implementation.Leapfrog)}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                implementation === Implementation.Leapfrog
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              title="Leapfrog Method"
            >
              <Rabbit className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <button
              onClick={() => {
                universe.toggle_mass_calculation();
                setMassCalculation(universe.get_mass_calculation());
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                massCalculation ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={
                massCalculation
                  ? "Mass Calculation Enabled"
                  : "Mass Calculation Disabled"
              }
            >
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                universe.toggle_show_trails();
                setShowTrails(universe.get_show_trails());
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                showTrails ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={showTrails ? "Trails Visible" : "Trails Hidden"}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                setShowVelocityVectors(!showVelocityVectors);
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                showVelocityVectors ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={
                showVelocityVectors
                  ? "Hide Velocity Vectors"
                  : "Show Velocity Vectors"
              }
            >
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                setShowMoreInfo(!showMoreInfo);
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                showMoreInfo ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={showMoreInfo ? "Hide Info Overlay" : "Show Info Overlay"}
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Quadtree Controls */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <button
              onClick={() => {
                const newValue = !useQuadtree;
                setUseQuadtree(newValue);
                console.log(
                  `Quadtree manually ${newValue ? "enabled" : "disabled"}`
                );
                // Track if user manually disabled quadtree when planet count >= 150
                if (!newValue && universe.get_planet_count() >= 150) {
                  quadtreeManuallyDisabledRef.current = true;
                } else if (newValue) {
                  // Reset flag when manually enabled
                  quadtreeManuallyDisabledRef.current = false;
                }
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                useQuadtree ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={useQuadtree ? "Quadtree Enabled" : "Quadtree Disabled"}
            >
              <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                setViewQuadtree(!viewQuadtree);
                setRender((prev) => prev + 1);
              }}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 ${
                viewQuadtree ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              title={viewQuadtree ? "Hide Quadtree" : "Show Quadtree"}
              disabled={!useQuadtree}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <input
                type="number"
                value={quadtreeTheta}
                onChange={(e) =>
                  setQuadtreeTheta(parseFloat(e.target.value) || 0.5)
                }
                step="0.1"
                min="0"
                max="2"
                className="w-12 sm:w-16 px-1 py-0.5 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="Quadtree Theta (Barnes-Hut threshold)"
                disabled={!useQuadtree}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <div className="w-8 sm:w-12 text-center text-xs sm:text-base">
              <p>{multiplier}x</p>
            </div>
            <button
              onClick={rewind}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title="Rewind"
            >
              <Rewind className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded cursor-pointer transition-all duration-200"
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <button
              onClick={fastForward}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title="Fast Forward"
            >
              <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={reset}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <button
              onMouseDown={handleAddMouseDown}
              onMouseUp={handleAddMouseUp}
              onMouseLeave={handleAddMouseUp}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title={`Add ${planetCount} Planet(s) (Hold to add continuously)`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <input
              type="number"
              value={planetCount}
              onChange={(e) =>
                setPlanetCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max="100"
              className="w-10 sm:w-14 px-1 py-0.5 text-xs sm:text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Number of planets to add/remove"
            />
            <button
              onMouseDown={handleRemoveMouseDown}
              onMouseUp={handleRemoveMouseUp}
              onMouseLeave={handleRemoveMouseUp}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title={`Remove ${planetCount} Planet(s) (Hold to remove continuously)`}
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <button
              onClick={() => {
                const willOpen = !isPropertyEditorOpen;
                setIsPropertyEditorOpen(willOpen);
                if (willOpen) {
                  setIsPaused(true);
                }
              }}
              className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded cursor-pointer transition-all duration-200 ${
                isPropertyEditorOpen ? "bg-blue-100" : ""
              }`}
              title={
                isPropertyEditorOpen
                  ? "Close Property Editor"
                  : "Open Property Editor"
              }
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={resetView}
              className={`p-1.5 sm:p-2 rounded cursor-pointer transition-all duration-200 active:bg-blue-200 hover:bg-gray-100`}
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

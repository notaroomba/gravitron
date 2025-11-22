import { X, GripVertical } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSimulation } from "../contexts/SimulationContext";

export default function PropertyEditor() {
  const {
    universe,
    selectedplanetIndex,
    isPropertyEditorOpen,
    setSelectedplanetIndex,
    setIsPropertyEditorOpen,
    render,
    setRender,
  } = useSimulation();

  // Get the selected planet
  const planet = useMemo(() => {
    return selectedplanetIndex !== null
      ? universe.get_planet(selectedplanetIndex)
      : null;
  }, [selectedplanetIndex, universe, render]);

  // Check if mass calculation is enabled
  const isMassCalculationEnabled = universe.get_mass_calculation();

  const [position, setPosition] = useState({
    x: 10,
    y: 10,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Local state for input values and errors
  const [massValue, setMassValue] = useState("0.00");
  const [radiusValue, setRadiusValue] = useState("0.0");
  const [positionValues, setPositionValues] = useState({
    x: "0.00",
    y: "0.00",
    z: "0.00",
  });
  const [velocityValues, setVelocityValues] = useState({
    x: "0.00",
    y: "0.00",
    z: "0.00",
  });

  // Error states
  const [massError, setMassError] = useState("");
  const [radiusError, setRadiusError] = useState("");
  const [positionErrors, setPositionErrors] = useState({
    x: "",
    y: "",
    z: "",
  });
  const [velocityErrors, setVelocityErrors] = useState({
    x: "",
    y: "",
    z: "",
  });

  // Track if user is actively editing to prevent auto-formatting
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Update local values when planet changes, but only if user is not actively editing
  useEffect(() => {
    // console.log("Updating PropertyEditor values from planet:", planet);
    if (planet) {
      if (!isEditing || !isEditing.includes("mass")) {
        setMassValue(planet.mass.toFixed(2));
      }
      if (!isEditing || !isEditing.includes("radius")) {
        setRadiusValue(planet.radius.toFixed(1));
      }
      if (!isEditing || !isEditing.includes("position")) {
        setPositionValues({
          x: planet.pos.x.toFixed(2),
          y: planet.pos.y.toFixed(2),
          z: planet.pos.z.toFixed(2),
        });
      }
      if (!isEditing || !isEditing.includes("velocity")) {
        setVelocityValues({
          x: planet.vel.x.toFixed(2),
          y: planet.vel.y.toFixed(2),
          z: planet.vel.z.toFixed(2),
        });
      }
    }
  }, [planet, selectedplanetIndex, isEditing]); // Update when planet properties or index changes

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Validation and update handlers
  const handlePropertyUpdate = (
    property: string,
    value: { x: number; y: number; z: number } | number
  ) => {
    if (selectedplanetIndex === null) return;

    switch (property) {
      case "position":
        if (typeof value === "object") {
          universe.update_planet_position(
            selectedplanetIndex,
            value.x,
            value.y,
            value.z
          );
        }
        break;
      case "velocity":
        if (typeof value === "object") {
          universe.update_planet_velocity(
            selectedplanetIndex,
            value.x,
            value.y,
            value.z
          );
        }
        break;
      case "mass":
        if (typeof value === "number") {
          universe.update_planet_mass(selectedplanetIndex, value);
        }
        break;
      case "radius":
        if (typeof value === "number") {
          universe.update_planet_radius(selectedplanetIndex, value);
        }
        break;
      case "color":
        if (typeof value === "number") {
          universe.update_planet_color(selectedplanetIndex, value);
        }
        break;
    }

    // Trigger a re-render
    setRender((prev) => prev + 1);
  };

  const handleMassChange = (value: string) => {
    setIsEditing("mass");
    setMassValue(value);
    setMassError("");

    if (value === "" || value === "-") return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setMassError("Please enter a valid number");
    } else if (numValue <= 0) {
      setMassError("Mass must be greater than 0");
    } else {
      handlePropertyUpdate("mass", numValue);
    }
  };

  const handleRadiusChange = (value: string) => {
    setIsEditing("radius");
    setRadiusValue(value);
    setRadiusError("");

    if (value === "" || value === "-") return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setRadiusError("Please enter a valid number");
    } else if (numValue <= 0) {
      setRadiusError("Radius must be greater than 0");
    } else {
      handlePropertyUpdate("radius", numValue);
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    setIsEditing(`position-${axis}`);
    setPositionValues((prev) => ({ ...prev, [axis]: value }));
    setPositionErrors((prev) => ({ ...prev, [axis]: "" }));

    if (value === "" || value === "-") return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setPositionErrors((prev) => ({
        ...prev,
        [axis]: "Please enter a valid number",
      }));
    } else {
      // Update the position with current values plus the new axis value
      const currentPos = {
        x: axis === "x" ? numValue : parseFloat(positionValues.x) || 0,
        y: axis === "y" ? numValue : parseFloat(positionValues.y) || 0,
        z: axis === "z" ? numValue : parseFloat(positionValues.z) || 0,
      };
      handlePropertyUpdate("position", currentPos);
    }
  };

  const handleVelocityChange = (axis: "x" | "y" | "z", value: string) => {
    setIsEditing(`velocity-${axis}`);
    setVelocityValues((prev) => ({ ...prev, [axis]: value }));
    setVelocityErrors((prev) => ({ ...prev, [axis]: "" }));

    if (value === "" || value === "-") return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setVelocityErrors((prev) => ({
        ...prev,
        [axis]: "Please enter a valid number",
      }));
    } else {
      // Update the velocity with current values plus the new axis value
      const currentVel = {
        x: axis === "x" ? numValue : parseFloat(velocityValues.x) || 0,
        y: axis === "y" ? numValue : parseFloat(velocityValues.y) || 0,
        z: axis === "z" ? numValue : parseFloat(velocityValues.z) || 0,
      };
      handlePropertyUpdate("velocity", currentVel);
    }
  };

  if (!isPropertyEditorOpen || !planet) return null;

  return (
    <div
      ref={editorRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
      style={{
        left:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "50%"
            : `${position.x}px`,
        top:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "50%"
            : `${position.y}px`,
        transform:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "translate(-50%, -50%)"
            : "none",
        width:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "90vw"
            : "400px",
        maxWidth: "400px",
        minHeight:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "auto"
            : "500px",
        zIndex: 1000,
      }}
    >
      {/* Header with drag handle and close button */}
      <div className="flex sticky top-0 items-center justify-between p-2 sm:p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div
          className="flex items-center gap-2 cursor-move flex-1"
          onMouseDown={handleDragStart}
        >
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hidden sm:block" />
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 -ml-4 hidden sm:block" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 sm:ml-2">
            Edit Planet{" "}
            {selectedplanetIndex !== null ? selectedplanetIndex + 1 : 0}'s
            Properties
          </h2>
        </div>
        <button
          onClick={() => {
            setIsPropertyEditorOpen(false);
            setSelectedplanetIndex(null);
          }}
          className="p-1 hover:bg-gray-200 cursor-pointer rounded transition-all duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Property fields */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Mass m */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-wrap">
            Mass <span className="text-lg">m</span>:
            {!isMassCalculationEnabled && (
              <span className="text-xs text-gray-400 font-normal">
                (disabled - enable in the settings bar)
              </span>
            )}
          </label>
          <input
            type="text"
            value={massValue}
            onChange={(e) => handleMassChange(e.target.value)}
            onBlur={() => setIsEditing(null)}
            disabled={!isMassCalculationEnabled}
            className={`w-full px-3 py-2.5 sm:py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
              massError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } ${
              !isMassCalculationEnabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
            placeholder="Mass"
          />
          {massError && (
            <span className="text-xs text-red-600">{massError}</span>
          )}
          {!massError && <span className="text-xs text-gray-500">kg</span>}
        </div>

        {/* Radius */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Radius <span className="text-lg">r</span>:
          </label>
          <input
            type="text"
            value={radiusValue}
            onChange={(e) => handleRadiusChange(e.target.value)}
            onBlur={() => setIsEditing(null)}
            className={`w-full px-3 py-2.5 sm:py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
              radiusError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Radius"
          />
          {radiusError && (
            <span className="text-xs text-red-600">{radiusError}</span>
          )}
          {!radiusError && (
            <span className="text-xs text-gray-500">pixels</span>
          )}
        </div>

        {/* Position */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Position:
          </label>

          {/* X Coordinate */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">X:</label>
            <input
              type="text"
              value={positionValues.x}
              onChange={(e) => handlePositionChange("x", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                positionErrors.x
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="X position"
            />
            {positionErrors.x && (
              <span className="text-xs text-red-600">{positionErrors.x}</span>
            )}
            {!positionErrors.x && (
              <span className="text-xs text-gray-500">m</span>
            )}
          </div>

          {/* Y Coordinate */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Y:</label>
            <input
              type="text"
              value={positionValues.y}
              onChange={(e) => handlePositionChange("y", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                positionErrors.y
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Y position"
            />
            {positionErrors.y && (
              <span className="text-xs text-red-600">{positionErrors.y}</span>
            )}
            {!positionErrors.y && (
              <span className="text-xs text-gray-500">m</span>
            )}
          </div>

          {/* Z Coordinate */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Z:</label>
            <input
              type="text"
              value={positionValues.z}
              onChange={(e) => handlePositionChange("z", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                positionErrors.z
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Z position"
            />
            {positionErrors.z && (
              <span className="text-xs text-red-600">{positionErrors.z}</span>
            )}
            {!positionErrors.z && (
              <span className="text-xs text-gray-500">m</span>
            )}
          </div>
        </div>

        {/* Velocity */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Velocity:
          </label>

          {/* X Velocity */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">X:</label>
            <input
              type="text"
              value={velocityValues.x}
              onChange={(e) => handleVelocityChange("x", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                velocityErrors.x
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="X velocity"
            />
            {velocityErrors.x && (
              <span className="text-xs text-red-600">{velocityErrors.x}</span>
            )}
            {!velocityErrors.x && (
              <span className="text-xs text-gray-500">m/s</span>
            )}
          </div>

          {/* Y Velocity */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Y:</label>
            <input
              type="text"
              value={velocityValues.y}
              onChange={(e) => handleVelocityChange("y", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                velocityErrors.y
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Y velocity"
            />
            {velocityErrors.y && (
              <span className="text-xs text-red-600">{velocityErrors.y}</span>
            )}
            {!velocityErrors.y && (
              <span className="text-xs text-gray-500">m/s</span>
            )}
          </div>

          {/* Z Velocity */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Z:</label>
            <input
              type="text"
              value={velocityValues.z}
              onChange={(e) => handleVelocityChange("z", e.target.value)}
              onBlur={() => setIsEditing(null)}
              className={`w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 ${
                velocityErrors.z
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Z velocity"
            />
            {velocityErrors.z && (
              <span className="text-xs text-red-600">{velocityErrors.z}</span>
            )}
            {!velocityErrors.z && (
              <span className="text-xs text-gray-500">m/s</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

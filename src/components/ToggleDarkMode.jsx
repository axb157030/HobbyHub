// ToggleDarkMode.jsx
import { useState, useEffect } from "react";
import SunIcon from "../icons/SunIcon";
import MoonIcon from "../icons/MoonIcon";
import "./ToggleDarkMode.css";

const ToggleDarkMode = () => {
  const [isLightMode, setIsLightMode] = useState(true);

  useEffect(() => {
    document.documentElement.style.colorScheme = isLightMode ? "light" : "dark";
  }, [isLightMode]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setIsLightMode((prev) => !prev)}
      aria-label={isLightMode ? "Switch to dark theme" : "Switch to light theme"}
    >
      <SunIcon  className={`theme-icon ${isLightMode ? "is-visible" : "is-hidden"}`} />
      <MoonIcon className={`theme-icon ${isLightMode ? "is-hidden" : "is-visible"}`} />
    </button>
  );
};

export default ToggleDarkMode;
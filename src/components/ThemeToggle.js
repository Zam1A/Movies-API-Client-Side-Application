import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`theme-toggle ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
      onClick={toggleTheme}
      title={isDark ? "Light theme" : "Dark theme"}
      type="button"
    >
      <span className="theme-toggle-icon" />
    </button>
  );
};

export default ThemeToggle;

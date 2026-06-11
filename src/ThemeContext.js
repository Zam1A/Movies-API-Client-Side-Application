import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

const savedTheme = () => {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Theme still works for the current session without persisted storage.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

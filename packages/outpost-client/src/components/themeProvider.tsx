import { createContext, useState } from "react";

export const ThemeContext = createContext({
  color: "black",
  background: "white",
});

export const ThemeProvider = ({
  color = "black",
  background = "white",
  children,
}: {
  color?: string;
  background?: string;
  children: React.ReactElement | React.ReactElement[];
}) => {
  return (
    <ThemeContext.Provider value={{ color, background }}>
      {children}
    </ThemeContext.Provider>
  );
};

import { createContext, useState } from "react";
import { colors } from "../tokens";

export const ThemeContext = createContext({
  color: colors.black,
  background: colors.white,
});

export const ThemeProvider = ({
  color = colors.black,
  background = colors.white,
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

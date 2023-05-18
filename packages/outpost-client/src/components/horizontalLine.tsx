import { useContext } from "react";
import { ThemeContext } from "./themeProvider";

export const HorizontalLine = ({ upwards = false }: { upwards?: boolean }) => {
  const { color } = useContext(ThemeContext);
  const border = `solid 2px ${color}`;
  return (
    <div
      css={{
        display: "flex",
        alignItems: upwards ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <div css={{ height: 2, width: 6, border, borderRight: "none" }}></div>
      <div css={{ borderBottom: border, height: 0, flexGrow: 1 }}></div>
      <div css={{ height: 2, width: 6, border, borderLeft: "none" }}></div>
    </div>
  );
};

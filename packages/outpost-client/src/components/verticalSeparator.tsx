import { useContext } from "react";
import { spacing } from "../tokens";
import { ThemeContext } from "./themeProvider";

export const VerticalSeparator = ({
  withLine = true,
}: {
  withLine?: boolean;
}) => {
  const { color, background } = useContext(ThemeContext);
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        css={{
          width: 0,
          height: 0,
          borderLeft: `12px solid transparent`,
          borderRight: `12px solid transparent`,
          borderTop: `12px solid ${color}`,
          position: "relative",
          marginTop: `-10px`,
        }}
      >
        <div
          css={{
            width: 0,
            height: 0,
            borderLeft: `8px solid transparent`,
            borderRight: `8px solid transparent`,
            borderTop: `8px solid ${background}`,
            position: "absolute",
            top: -12,
            left: -8,
          }}
        >
          <div
            css={{
              width: 0,
              height: 0,
              borderLeft: `4px solid transparent`,
              borderRight: `4px solid transparent`,
              borderTop: `4px solid ${color}`,
              position: "absolute",
              top: -8,
              left: -4,
            }}
          ></div>
          {/* triangle down */}
        </div>
      </div>
      {withLine && (
        <div
          css={{
            flexGrow: 1,
            width: 0,
            borderLeft: `solid 2px ${color}`,
            marginTop: spacing.tiny,
            marginBottom: spacing.tiny,
          }}
        ></div>
      )}
      <div
        css={{
          width: 0,
          height: 0,
          borderLeft: `12px solid transparent`,
          borderRight: `12px solid transparent`,
          borderBottom: `12px solid ${color}`,
          position: "relative",
          marginBottom: `-10px`,
        }}
      >
        <div
          css={{
            width: 0,
            height: 0,
            borderLeft: `8px solid transparent`,
            borderRight: `8px solid transparent`,
            borderBottom: `8px solid ${background}`,
            position: "absolute",
            bottom: -12,
            left: -8,
          }}
        >
          <div
            css={{
              width: 0,
              height: 0,
              borderLeft: `4px solid transparent`,
              borderRight: `4px solid transparent`,
              borderBottom: `4px solid ${color}`,
              position: "absolute",
              bottom: -8,
              left: -4,
            }}
          ></div>
          {/* triangle up */}
        </div>
      </div>
    </div>
  );
};

import { Card as MuiCard } from "@mui/material";
import { spacing } from "../tokens";
import { useContext } from "react";
import { ThemeContext } from "./themeProvider";
import { Interpolation, Theme } from "@emotion/react";
export const Card = ({
  children,
  onClick,
  cardClass,
  css,
  className,
  coreCss,
  ...rest
}: {
  children: React.ReactNode | React.ReactNode[];
  onClick?: (() => void) | ((e: React.MouseEvent) => void);
  cardClass?: string;
  css?: Interpolation<Theme>;
  coreCss?: Interpolation<Theme>;
  className?: string;
}) => {
  const { color, background } = useContext(ThemeContext);
  const border = `solid 2px ${color}`;
  return (
    <MuiCard
      onClick={onClick}
      className={cardClass || className}
      css={{
        display: "flex",
        alignItems: "stretch",
        padding: 0,
        width: "100%",
        marginBottom: spacing.small,
        boxShadow: "none",
        color: color,
        backgroundColor: background,
        ...((css || {}) as any),
      }}
    >
      <div
        css={{
          borderLeft: border,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginRight: 2,
          alignSelf: "stretch",
        }}
      >
        <div
          css={{
            border,
            borderBottom: "none",
            borderLeft: "none",
            height: 3,
            width: 3,
          }}
        ></div>
        <div
          css={{
            border,
            borderTop: "none",
            borderLeft: "none",
            height: 3,
            width: 3,
          }}
        ></div>
      </div>
      <div
        css={{
          border: border,
          borderLeft: "none",
          borderRight: "none",
          ...((coreCss || {}) as any),
        }}
      >
        {children}
      </div>
      <div
        css={{
          paddingLeft: spacing.tiny,
          border: border,
          borderLeft: "none",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignSelf: "stretch",
        }}
      >
        <div
          css={{
            position: "relative",
            height: "34px",
            width: "8px",
            overflow: "hidden",
            marginRight: -2,
          }}
        >
          <div
            css={{
              border: `solid 2px ${color}`,
              width: 2,
              height: 10,
              position: "absolute",
              top: 0,
              left: 0,
              borderRight: "none",
              borderBottom: "none",
            }}
          ></div>
          <div
            css={{
              border: `solid 2px ${color}`,
              width: 2,
              height: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
              borderTop: "none",
              borderRight: "none",
            }}
          ></div>
          <div
            css={{
              width: 0,
              height: 0,
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
              marginLeft: -7,
              borderRight: `15px solid ${color}`,
              position: "relative",
              top: 2,
            }}
          >
            <div
              css={{
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderRight: `12px solid ${background}`,
                position: "absolute",
                left: 3,
                top: -12,
              }}
            >
              <div
                css={{
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderRight: `6px solid ${color}`,
                  position: "absolute",
                  top: -6,
                  left: 6,
                }}
              >
                {/* separator triangle */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MuiCard>
  );
};

import {
  ClassNames,
  Interpolation,
  SerializedStyles,
  Theme,
} from "@emotion/react";
import { Card } from "./card";
import { ThemeProvider } from "./themeProvider";
import { Title } from "./Title";
import { colors } from "../tokens";

export const Button = ({
  onClick,
  color = colors.black,
  background = "white",
  disabled = false,
  children,
  className,
  inverted = false,
}: {
  onClick: (e: React.MouseEvent) => void;
  color?: string;
  background?: string;
  disabled?: boolean;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  inverted?: boolean;
}) => {
  return (
    <ThemeProvider
      color={inverted ? background : color}
      background={inverted ? color : background}
    >
      <Card
        onClick={(e) => {
          if (disabled) {
            return;
          }
          onClick(e);
        }}
        css={{
          "&.MuiCard-root": { marginBottom: 0 },
          opacity: disabled ? 0.5 : 1,
          padding: 2,
        }}
        className={className}
      >
        {typeof children === "string" ? (
          <Title title={children} css={{ whiteSpace: "pre" }} />
        ) : (
          children
        )}
      </Card>
    </ThemeProvider>
  );
};

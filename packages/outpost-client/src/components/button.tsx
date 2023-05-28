import {
  ClassNames,
  Interpolation,
  SerializedStyles,
  Theme,
} from "@emotion/react";
import { Card } from "./card";
import { ThemeProvider } from "./themeProvider";
import { Title } from "./Title";

export const Button = ({
  onClick,
  color = "black",
  background = "white",
  disabled = false,
  children,
  css,
  className,
}: {
  onClick: (e: React.MouseEvent) => void;
  color?: string;
  background?: string;
  disabled?: boolean;
  children: React.ReactNode | React.ReactNode[];
  css?: Interpolation<Theme>;
  className?: string;
}) => {
  return (
    <ThemeProvider color={color}>
      <Card
        onClick={(e) => {
          if (disabled) {
            return;
          }
          onClick(e);
        }}
        css={{
          "&.MuiCard-root": { marginBottom: 0 },
          ...((css || {}) as any),
          opacity: disabled ? 0.5 : 1,
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

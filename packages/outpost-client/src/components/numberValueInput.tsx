import { Button } from "@mui/material";
import { spacing } from "../tokens";

export const NumberValueInput = ({
  value,
  setValue,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
}: {
  value: number;
  setValue: (v: number) => void;
  max?: number;
  min?: number;
}) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        button: {
          color: "black",
          fontWeight: "bold",
          fontSize: 42,
          lineHeight: "30px",
          fontFamily: "PirataOne-Gloomhaven",
          outline: "none",
        },
      }}
    >
      <Button
        onClick={() => setValue(Math.max(value - 1, min))}
        css={{ paddingLeft: 100 }}
      >
        -
      </Button>
      <div
        css={{
          fontFamily: "PirataOne-Gloomhaven",
          fontSize: 30,
          height: 64,
          lineHeight: "64px",
          marginLeft: spacing.small,
          marginRight: spacing.small,
        }}
      >
        {value}
      </div>
      <Button
        onClick={() => setValue(Math.min(value + 1, max))}
        css={{ paddingRight: 100 }}
      >
        +
      </Button>
    </div>
  );
};

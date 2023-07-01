import { Button } from "@mui/material";
import { colors, spacing } from "../tokens";
import { useUserStore } from "../userStore";

export const NumberValueInput = ({
  value,
  setValue,
  withMultiplier = false,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
}: {
  value: number;
  withMultiplier?: boolean;
  setValue: (v: number) => void;
  max?: number;
  min?: number;
}) => {
  const { valueMultiplier } = useUserStore(({ valueMultiplier }) => ({
    valueMultiplier,
  }));
  const multiplier = withMultiplier ? valueMultiplier : 1;
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        button: {
          color: colors.black,
          fontWeight: "bold",
          fontSize: 42,
          lineHeight: "30px",
          fontFamily: "PirataOne-Gloomhaven",
          outline: "none",
        },
      }}
    >
      <Button
        onClick={() => setValue(Math.max(value - 1 * multiplier, min))}
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
        onClick={() => setValue(Math.min(value + 1 * multiplier, max))}
        css={{ paddingRight: 100 }}
      >
        +
      </Button>
    </div>
  );
};

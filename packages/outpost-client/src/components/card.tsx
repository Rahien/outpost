import { Card as MuiCard } from "@mui/material";
import { spacing } from "../tokens";
export const Card = ({
  children,
  ...rest
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const border = `solid 2px black`;
  return (
    <MuiCard
      css={{
        display: "flex",
        alignItems: "stretch",
        padding: 0,
        width: "100%",
        marginBottom: spacing.small,
        boxShadow: "none",
      }}
    >
      <div
        css={{
          borderLeft: border,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginRight: 2,
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
        {...rest}
        css={{
          border: border,
          borderLeft: "none",
          borderRight: "none",
          ...((rest as unknown as any).css || {}),
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
        }}
      >
        <div
          css={{
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            marginRight: -1,
            borderRight: "8px solid black",
          }}
        ></div>
      </div>
    </MuiCard>
  );
};

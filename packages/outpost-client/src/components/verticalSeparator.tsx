import { spacing } from "../tokens";

export const VerticalSeparator = ({
  withLine = true,
}: {
  withLine?: boolean;
}) => {
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
          borderTop: `12px solid black`,
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
            borderTop: `8px solid white`,
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
              borderTop: `4px solid black`,
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
            borderLeft: `solid 2px black`,
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
          borderBottom: `12px solid black`,
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
            borderBottom: `8px solid white`,
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
              borderBottom: `4px solid black`,
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

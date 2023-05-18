import { Interpolation, Theme } from "@emotion/react";
import { spacing } from "../tokens";

export const Title = ({
  title,
  icon,
  center = false,
  css,
  className,
}: {
  title?: string;
  icon?: React.ReactElement;
  center?: boolean;
  css?: Interpolation<Theme>;
  className?: string;
}) => {
  return (
    <div
      className={className}
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        fontFamily: "PirataOne-Gloomhaven",
        fontSize: "24px",
        ...((css || {}) as any),
      }}
    >
      {icon}
      <span css={{ marginLeft: icon ? spacing.tiny : 0, fontWeight: "bold" }}>
        {title}
      </span>
    </div>
  );
};

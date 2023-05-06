import { spacing } from "../tokens";

export const Title = ({
  title,
  icon,
  center = false,
}: {
  title?: string;
  icon?: React.ReactElement;
  center?: boolean;
}) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        fontFamily: "PirataOne-Gloomhaven",
        fontSize: "24px",
      }}
    >
      {icon}
      <span css={{ marginLeft: icon ? spacing.tiny : 0, fontWeight: "bold" }}>
        {title}
      </span>
    </div>
  );
};

import { spacing } from "../tokens";

export const Title = ({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactElement;
}) => {
  return (
    <div css={{ display: "flex", alignItems: "center" }}>
      {icon}
      <span css={{ marginLeft: spacing.tiny, fontWeight: "bold" }}>
        {title}
      </span>
    </div>
  );
};

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
      <span css={{ marginLeft: icon ? spacing.tiny : 0, fontWeight: "bold" }}>
        {title}
      </span>
    </div>
  );
};

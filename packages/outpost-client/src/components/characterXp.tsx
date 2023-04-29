import { EmojiEvents, Verified } from "@mui/icons-material";
import { Card } from "@mui/material";
import { spacing } from "../tokens";
import { useCharacterStore } from "../characterStore";
import { ChevronDown } from "react-feather";

type LevelAttainment = "current" | "yes" | "no";

const LevelBox = ({
  level,
  attained,
  xpRequired,
}: {
  level: number;
  attained: LevelAttainment;
  xpRequired: number;
}) => {
  let background = `rgba(0,0,0,0.9)`;
  let color = "black";
  if (attained === "current") {
    background = "black";
    color = "white";
  } else if (attained === "no") {
    background = "white";
  }
  return (
    <div
      css={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        css={{
          border: `solid 1px black`,
          background,
          color,
          width: 24,
          height: 24,
          textAlign: "center",
        }}
      >
        {level}
      </div>
      <ChevronDown />
      <div>{xpRequired}</div>
    </div>
  );
};

const levelBoundaries = [0, 45, 95, 150, 210, 275, 345, 420, 500];

const CharacterLevel = () => {
  const { character } = useCharacterStore(({ character }) => ({ character }));
  const xp = character?.xp || 0;

  const boxes = levelBoundaries.map((boundary, index) => {
    let attained: LevelAttainment = "no";
    if (xp >= boundary) {
      attained = "yes";
    }
    if (xp >= boundary && xp < levelBoundaries[index + 1]) {
      attained = "current";
    }
    return (
      <LevelBox
        key={index}
        level={index + 1}
        attained={attained}
        xpRequired={boundary}
      />
    );
  });

  return <>{boxes}</>;
};

export const CharacterXp = () => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
  );
  return (
    <Card css={{ padding: spacing.medium, width: "100%" }}>
      <div css={{ display: "flex" }}>
        <div css={{ display: "flex", alignItems: "center", width: 200 }}>
          <EmojiEvents />
          <span css={{ marginLeft: spacing.small }}>Level:</span>
        </div>
        <CharacterLevel />
      </div>
      <div css={{ display: "flex" }}>
        <div css={{ display: "flex", alignItems: "center", width: 200 }}>
          <Verified />
          <span css={{ marginLeft: spacing.small }}>XP:</span>
        </div>
      </div>
    </Card>
  );
};

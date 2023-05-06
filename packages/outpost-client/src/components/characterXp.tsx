import { ExpandLess, Verified } from "@mui/icons-material";
import { mediaqueries, spacing } from "../tokens";
import { useCharacterStore } from "../characterStore";
import { Fragment } from "react";
import { Card } from "./card";
import { Title } from "./Title";
import { CharacterName } from "./characterName";
import levelIcon from "../assets/general/fh-level-crown-bw-icon.png";

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
  let background = `rgba(0,0,0,0.3)`;
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
          width: 20,
          height: 20,
          lineHeight: "20px",
          fontSize: 14,
          textAlign: "center",
          [mediaqueries.tinyMobile]: {
            width: 18,
            height: 18,
            fontSize: 12,
          },
        }}
      >
        {level}
      </div>
      <ExpandLess />
      <div
        css={{
          width: 28,
          textAlign: "center",
          fontSize: 14,
          [mediaqueries.tinyMobile]: {
            width: 24,
            fontSize: 12,
          },
        }}
      >
        {xpRequired}
      </div>
    </div>
  );
};

const VerticalSeparator = () => {
  return (
    <div
      css={{
        height: 67,
        width: 1,
        borderLeft: `solid 1px black`,
        [mediaqueries.tinyMobile]: { height: 62 },
      }}
    ></div>
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
      <Fragment key={index}>
        <LevelBox
          key={index}
          level={index + 1}
          attained={attained}
          xpRequired={boundary}
        />
        {index < levelBoundaries.length - 1 && <VerticalSeparator />}
      </Fragment>
    );
  });

  return <>{boxes}</>;
};

export const CharacterXp = () => {
  return (
    <Card>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          height: 56,

          "> div": {
            flexGrow: 1,
            textAlign: "right",
          },
          input: {
            textAlign: "right",
            padding: spacing.small,
          },
          "> div:first-of-type": {
            marginRight: spacing.tiny,
            flexGrow: 0,
          },
        }}
      >
        <Title title="Name:" />
        <CharacterName />
      </div>
      <div
        css={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 1,
          }}
        >
          <div css={{ display: "flex", alignItems: "center" }}>
            <img
              src={levelIcon}
              css={{ height: 20, width: 20, marginRight: spacing.tiny }}
            />
            <Title title="Level:" />
          </div>
          <div css={{ display: "flex", alignItems: "center" }}>
            <Verified css={{ marginRight: spacing.tiny }} />
            <Title title="XP:" />
          </div>
        </div>
        <div
          css={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <CharacterLevel />
        </div>
      </div>
    </Card>
  );
};

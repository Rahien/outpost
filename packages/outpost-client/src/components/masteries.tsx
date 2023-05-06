import {
  Check,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
} from "@mui/icons-material";
import { Title } from "./Title";
import { Card } from "./card";
import { useCharacterStore } from "../characterStore";
import { useMemo } from "react";
import { spacing } from "../tokens";
import { Mastery } from "../types";
import { CustomMarkdown } from "./customMarkdown";
const PerksChecks = ({ checked }: { checked: number }) => {
  const checkedBoxes = Array.from({ length: checked }).map((_, i) => i);
  const unCheckedBoxes = Array.from({ length: 3 - checked }).map((_, i) => i);
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        ".MuiCheckbox-root": { padding: 0, path: { color: "black" } },
      }}
    >
      <div css={{ display: "flex", alignItems: "center" }}>
        <Check />
        <span>:</span>
      </div>

      {checkedBoxes.map((_, i) => (
        <CheckBoxOutlined />
      ))}
      {unCheckedBoxes.map((_, i) => (
        <CheckBoxOutlineBlank />
      ))}
    </div>
  );
};

const AllPerkChecks = () => {
  const { character } = useCharacterStore(({ character }) => ({ character }));
  const perks = character?.perkTags || 0;

  const allFilled = perks / 3;
  const remainder = perks % 3;
  const allEmpty = 6 - allFilled;

  return (
    <div
      css={{
        display: "grid",
        paddingTop: spacing.small,
        paddingBottom: spacing.small,
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      {Array.from({ length: allFilled }).map((_, i) => (
        <PerksChecks checked={3} />
      ))}
      {remainder > 0 && <PerksChecks checked={remainder} />}
      {Array.from({ length: allEmpty }).map((_, i) => (
        <PerksChecks checked={0} />
      ))}
    </div>
  );
};

const MasteryItem = ({ mastery }: { mastery: Mastery }) => {
  const { character, toggleMastery } = useCharacterStore(
    ({ character, toggleMastery }) => ({ character, toggleMastery })
  );
  const toggleActive = () => {
    if (!character) return;
    toggleMastery(character.id, mastery.id, !mastery.active);
  };
  return (
    <div
      onClick={toggleActive}
      css={{
        display: "flex",
        marginBottom: spacing.small,
      }}
    >
      {mastery.active ? (
        <CheckBoxOutlined css={{ marginTop: -2 }} />
      ) : (
        <CheckBoxOutlineBlankOutlined css={{ marginTop: -2 }} />
      )}
      <CustomMarkdown>{mastery.description}</CustomMarkdown>
    </div>
  );
};

const MasteryList = () => {
  const { character } = useCharacterStore(({ character }) => ({ character }));
  const orderedMasteries = useMemo(() => {
    const masteries = [...(character?.masteries || [])];
    masteries.sort((a, b) => (a.order < b.order ? -1 : 1));
    return masteries;
  }, [character]);

  if (!character) {
    return null;
  }

  return (
    <div css={{ paddingTop: spacing.small, paddingBottom: spacing.small }}>
      {orderedMasteries.map((mastery) => (
        <MasteryItem mastery={mastery} key={mastery.id} />
      ))}
    </div>
  );
};

export const Masteries = () => {
  return (
    <Card>
      <Title title="Masteries:" />

      <MasteryList />
    </Card>
  );
};

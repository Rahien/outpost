import {
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
} from "@mui/icons-material";
import { Title } from "./Title";
import { Card } from "./card";
import { useCharacterStore } from "../characterStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input } from "@mui/material";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { HorizontalLine } from "./horizontalLine";
import { spacing } from "../tokens";
import { Perk } from "../types";
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
        <CheckBoxOutlined key={i} />
      ))}
      {unCheckedBoxes.map((_, i) => (
        <CheckBoxOutlineBlank key={i} />
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
        <PerksChecks checked={3} key={i} />
      ))}
      {remainder > 0 && <PerksChecks checked={remainder} />}
      {Array.from({ length: allEmpty }).map((_, i) => (
        <PerksChecks checked={0} key={i} />
      ))}
    </div>
  );
};

const PerkItem = ({ perk }: { perk: Perk }) => {
  const { character, togglePerk } = useCharacterStore(
    ({ character, togglePerk }) => ({ character, togglePerk })
  );
  const inCreaseActive = () => {
    if (!character) return;
    togglePerk(character.id, perk.id, (perk.active + 1) % (perk.maxActive + 1));
  };
  return (
    <div
      key={perk.id}
      onClick={inCreaseActive}
      css={{
        display: "flex",
        marginBottom: spacing.small,
      }}
    >
      {Array.from({ length: perk.active }).map((_, i) => (
        <CheckBoxOutlined css={{ marginTop: -2 }} key={i} />
      ))}
      {Array.from({ length: perk.maxActive - perk.active }).map((_, i) => (
        <CheckBoxOutlineBlankOutlined css={{ marginTop: -2 }} key={i} />
      ))}
      <CustomMarkdown>{perk.description}</CustomMarkdown>
    </div>
  );
};

const PerkList = () => {
  const { character } = useCharacterStore(({ character }) => ({ character }));
  const orderedPerks = useMemo(() => {
    const perks = [...(character?.perks || [])];
    perks.sort((a, b) => (a.order < b.order ? -1 : 1));
    return perks;
  }, [character]);

  if (!character) {
    return null;
  }

  return (
    <div css={{ paddingTop: spacing.small, paddingBottom: spacing.small }}>
      {orderedPerks.map((perk) => (
        <PerkItem perk={perk} key={perk.id} />
      ))}
    </div>
  );
};

const PerkInput = ({
  perks,
  setPerks,
}: {
  perks: number;
  setPerks: (v: number) => void;
}) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        button: {
          color: "black",
          fontWeight: "bold",
          fontSize: 42,
          lineHeight: "30px",
          fontFamily: "PirataOne-Gloomhaven",
          outline: "none",
        },
      }}
    >
      <Button
        onClick={() => setPerks(Math.max(perks - 1, 0))}
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
        {perks}
      </div>
      <Button
        onClick={() => setPerks(Math.min(perks + 1, 18))}
        css={{ paddingRight: 100 }}
      >
        +
      </Button>
    </div>
  );
};

export const Perks = () => {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  const { character, updateCharacter, updating } = useCharacterStore(
    ({ character, updateCharacter, updating }) => ({
      character,
      updateCharacter,
      updating,
    })
  );
  const [perks, setPerks] = useState(character?.perkTags || 0);
  const debouncedPerks = useDebounce(perks, 1000);
  useEffect(() => {
    if (!character || character.perkTags === perks || updating) {
      return;
    }
    updateCharacter({ ...character, perkTags: perks });
  }, [debouncedPerks]);

  return (
    <Card>
      <div ref={ref} onClick={() => setEditing(true)}>
        <Title title="Perks" center />
        <HorizontalLine upwards />

        {editing ? (
          <PerkInput setPerks={setPerks} perks={perks} />
        ) : (
          <AllPerkChecks />
        )}
      </div>
      <HorizontalLine />

      <PerkList />
    </Card>
  );
};

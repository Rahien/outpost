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
import { colors, spacing } from "../tokens";
import { Perk } from "../types";
import { CustomMarkdown } from "./customMarkdown";
import { NumberValueInput } from "./numberValueInput";
const PerksChecks = ({ checked }: { checked: number }) => {
  const checkedBoxes = Array.from({ length: checked }).map((_, i) => i);
  const unCheckedBoxes = Array.from({ length: 3 - checked }).map((_, i) => i);
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        ".MuiCheckbox-root": { padding: 0, path: { color: colors.black } },
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

export const AllPerkChecks = ({
  perkCount,
  maxPerks,
}: {
  perkCount: number;
  maxPerks: number;
}) => {
  const perks = perkCount;

  const allFilled = perks / 3;
  const remainder = perks % 3;
  const allEmpty = maxPerks / 3 - allFilled;

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
      <div
        css={{
          display: "flex",
          ...(perk.connected
            ? {
                flexDirection: "column",
                "> *": {
                  position: "relative",
                  marginTop: -14,
                  "&:before": {
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 9,
                    content: '""',
                    width: 6,
                    height: 5,
                    background: "white",
                  },
                  "&:first-of-type": {
                    "&:before": {
                      display: "none",
                    },
                    marginTop: 0,
                  },
                },
              }
            : {}),
        }}
      >
        {Array.from({ length: perk.active }).map((_, i) => (
          <div key={i}>
            <CheckBoxOutlined css={{ marginTop: -2 }} />
          </div>
        ))}
        {Array.from({ length: perk.maxActive - perk.active }).map((_, i) => (
          <div key={i}>
            <CheckBoxOutlineBlankOutlined css={{ marginTop: -2 }} />
          </div>
        ))}
      </div>
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

export const Perks = () => {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({
      character,
      updateCharacter,
    })
  );
  const [perks, setPerks] = useState(character?.perkTags || 0);
  const debouncedPerks = useDebounce(perks, 1000);
  useEffect(() => {
    if (!character || character.perkTags === perks) {
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
          <NumberValueInput
            setValue={setPerks}
            value={perks}
            min={0}
            max={18}
          />
        ) : (
          <AllPerkChecks perkCount={character?.perkTags || 0} maxPerks={18} />
        )}
      </div>
      <HorizontalLine />

      <PerkList />
    </Card>
  );
};

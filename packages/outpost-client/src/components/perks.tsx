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
import { useEffect, useRef, useState } from "react";
import { Input } from "@mui/material";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
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

export const Perks = () => {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
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
        <Title title="Perks" />

        {editing ? (
          <Input
            type="number"
            value={perks}
            css={{ width: "100%" }}
            //onBlur={() => setEditing(false)}
            autoFocus
            inputProps={{
              max: 18,
              min: 0,
              step: 1,
            }}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              setPerks(
                Math.max(0, Math.min(18, parseInt(e.currentTarget.value, 10)))
              );
            }}
          />
        ) : (
          <AllPerkChecks />
        )}
      </div>
    </Card>
  );
};
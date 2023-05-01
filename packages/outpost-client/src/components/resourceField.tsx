import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { useCharacterStore } from "../characterStore";
import { Character } from "../types";
import { Button, TextField } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { spacing } from "../tokens";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { ResourceIcon } from "./resourceIcon";
import { Title } from "./Title";

export const ResourceField = ({
  resource,
  title,
}: {
  resource: keyof Character;
  title?: React.ReactElement;
}) => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({
      character,
      updateCharacter,
    })
  );
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    character ? (character[resource] as unknown as number) : 0
  );
  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (character && debouncedValue !== character[resource]) {
      updateCharacter({ ...character, [resource]: debouncedValue });
    }
  }, [debouncedValue, character]);

  return (
    <div
      css={{ flexGrow: 1, flexShrink: 0 }}
      onClick={() => setEditing(!editing)}
      ref={ref}
    >
      {title || <Title icon={<ResourceIcon resource={resource} />} />}
      <div
        css={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {editing ? (
          <TextField
            type="number"
            label="Value"
            value={value}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            //onBlur={() => setEditing(false)}
            onChange={(e) =>
              setValue(parseInt(e.currentTarget.value || "0", 10))
            }
          />
        ) : (
          <div css={{ fontSize: "20px" }}>{value}</div>
        )}
      </div>
    </div>
  );
};

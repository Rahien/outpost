import { useEffect, useRef, useState } from "react";
import { useCharacterStore } from "../characterStore";
import { Character } from "../types";
import { TextField } from "@mui/material";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { ResourceIcon } from "./resourceIcon";
import { Title } from "./Title";

export const ResourceField = ({
  resource,
  title,
  edit,
  setEdit,
}: {
  resource: keyof Character;
  title?: React.ReactElement;
  edit?: boolean;
  setEdit?: (editing: boolean) => void;
}) => {
  const { character, updateCharacter, updating } = useCharacterStore(
    ({ character, updateCharacter, updating }) => ({
      character,
      updateCharacter,
      updating,
    })
  );
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));

  const [editing, setEditing] = useState(edit);
  useEffect(() => {
    if (edit !== undefined && edit !== editing) {
      setEditing(edit);
    }
  }, [edit]);
  useEffect(() => {
    if (!setEdit || editing === edit || editing === undefined) {
      return;
    }
    setEdit(editing);
  }, [editing]);

  const [value, setValue] = useState(
    character ? (character[resource] as unknown as number) : 0
  );
  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (character && debouncedValue !== character[resource] && !updating) {
      updateCharacter({ ...character, [resource]: debouncedValue });
    }
  }, [debouncedValue, character]);

  return (
    <div
      css={{ flexGrow: 1, flexShrink: 0 }}
      onClick={() => setEditing(true)}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
              }
            }}
          />
        ) : (
          <div css={{ fontSize: "24px", fontFamily: "PirataOne-Gloomhaven" }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

import { Button, TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useEffect, useRef, useState } from "react";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { Title } from "./Title";
import { spacing } from "../tokens";
import { CustomMarkdown } from "./customMarkdown";

export const CharacterNotes = () => {
  const { character, updateCharacter, updating } = useCharacterStore(
    ({ character, updateCharacter, updating }) => ({
      character,
      updateCharacter,
      updating,
    })
  );
  const [value, setValue] = useState<string>(character?.notes || "");
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  const debouncedValue = useDebounce(value, 1000);
  useEffect(() => {
    if (character && debouncedValue !== (character?.notes || "") && !updating) {
      updateCharacter({ ...character, notes: debouncedValue });
    }
  }, [character, debouncedValue]);
  return (
    <div ref={ref}>
      <Title title="Notes:" />
      {editing ? (
        <div css={{ position: "relative" }}>
          <TextField
            css={{ width: "100%" }}
            value={value}
            multiline
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Button
            variant="outlined"
            onClick={() => setEditing(false)}
            css={{
              position: "absolute",
              bottom: spacing.tiny,
              right: spacing.tiny,
            }}
          >
            Done
          </Button>
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <CustomMarkdown>{value}</CustomMarkdown>
        </div>
      )}
    </div>
  );
};

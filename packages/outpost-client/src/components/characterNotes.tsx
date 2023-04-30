import { TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Title } from "./Title";

export const CharacterNotes = () => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
  );
  const [value, setValue] = useState<string>(character?.notes || "");
  const debouncedValue = useDebounce(value, 1000);
  useEffect(() => {
    if (character && debouncedValue !== character.notes) {
      updateCharacter({ ...character, notes: debouncedValue });
    }
  }, [character, debouncedValue]);
  return (
    <>
      <Title title="Notes:" />
      <TextField
        css={{ width: "100%" }}
        value={value}
        multiline
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </>
  );
};

import { TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

export const CharacterName = () => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
  );
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(character?.name || "");
  const debouncedName = useDebounce(name, 1000);
  useEffect(() => {
    if (character && debouncedName !== character.name) {
      updateCharacter({ ...character, name: debouncedName });
    }
  }, [character, debouncedName]);

  if (editing) {
    return (
      <TextField
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onFocus={(e) => e.currentTarget.select()}
        autoFocus
        onBlur={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      css={{ fontWeight: "bold", borderBottom: "solid 1px black" }}
    >
      {name}
    </div>
  );
};

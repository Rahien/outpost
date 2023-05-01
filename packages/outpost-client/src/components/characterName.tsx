import { TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useState } from "react";

export const CharacterName = () => {
  const { name, setName } = useCharacterStore();
  const [editing, setEditing] = useState(false);

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

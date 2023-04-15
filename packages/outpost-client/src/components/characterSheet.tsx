import { TextField } from "@mui/material";
import { CharacterSelect } from "./characterSelect";
import { useCharacterStore } from "../characterStore";
import { CharacterName } from "./characterName";

export const CharacterSheet = () => {
  return (
    <div css={{ display: "flex" }}>
      <CharacterSelect />
      <CharacterName />
    </div>
  );
};

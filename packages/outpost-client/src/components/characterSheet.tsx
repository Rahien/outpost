import { TextField } from "@mui/material";
import { CharacterSelect } from "./characterSelect";
import { useCharacterStore } from "../characterStore";
import { CharacterName } from "./characterName";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const CharacterSheet = () => {
  const { id } = useParams();
  const { character, fetchCharacter } = useCharacterStore(
    ({ character, fetchCharacter }) => ({
      character,
      fetchCharacter,
    })
  );
  useEffect(() => {
    if (!id) return;
    fetchCharacter(id);
  }, [fetchCharacter, id]);

  if (!character) return null; // TODO: show loading
  return (
    <div css={{ display: "flex" }}>
      <CharacterSelect />
      <CharacterName />
    </div>
  );
};

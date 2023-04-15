import { useCallback, useState } from "react";
import { Character } from "../types";
import { CharacterIcon } from "./characterIcon";
import { characters } from "../characters";
import { ChevronDown, ChevronUp } from "react-feather";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { useCharacterStore } from "../characterStore";

export const CharacterSelect = ({}: {}) => {
  const { character, setCharacter } = useCharacterStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectCharacter = useCallback((character: Character) => {
    setCharacter(character);
    setIsOpen(false);
  }, []);
  return (
    <div css={{ position: "relative" }}>
      <div css={{ display: "flex" }}>
        <CharacterIcon character={character} />
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {isOpen && (
        <Paper css={{ position: "absolute", top: 0 }}>
          {Object.values(characters).map((character) => (
            <Button
              key={character.name}
              onClick={() => selectCharacter(character)}
            >
              <CharacterIcon character={character} />
            </Button>
          ))}
        </Paper>
      )}
    </div>
  );
};

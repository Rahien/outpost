import { useCallback, useState } from "react";
import { Character } from "../types";
import { CharacterIcon } from "./characterIcon";
import { characters } from "../characters";
import { ChevronDown, ChevronUp } from "react-feather";

export const CharacterSelect = ({
  character,
  onChange,
}: {
  character: Character;
  onChange: (newCharacter: Character) => void;
}) => {
  const [selectedCharacter, setSelectedCharacter] =
    useState<Character>(character);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setIsOpen(false);
  }, []);
  return (
    <div css={{ position: "relative" }}>
      <div css={{ display: "flex" }}>
        <CharacterIcon character={selectedCharacter} />
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isOpen && (
        <div css={{ position: "absolute", bottom: 0 }}>
          {Object.values(characters).map((character) => (
            <button
              key={character.name}
              onClick={() => selectCharacter(character)}
            >
              <CharacterIcon character={character} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

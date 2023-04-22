import { useCallback, useState } from "react";
import { Character } from "../types";
import { ClassIcon } from "./characterIcon";
import { ChevronDown, ChevronUp } from "react-feather";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { characterClasses, useCharacterStore } from "../characterStore";

export const ClassSelect = ({}: {}) => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectCharacterClass = useCallback(async (className: string) => {
    if (!character) {
      return;
    }
    await updateCharacter({ ...character, className });
    setIsOpen(false);
  }, []);
  if (!character) {
    return null;
  }
  return (
    <div css={{ position: "relative" }}>
      <div css={{ display: "flex" }}>
        <ClassIcon
          charClass={
            characterClasses[character.className] ||
            characterClasses["blinkblade"]
          }
        />
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {isOpen && (
        <Paper css={{ position: "absolute", top: 0 }}>
          {Object.values(characterClasses).map((charClass) => (
            <Button
              key={charClass.name}
              onClick={() => selectCharacterClass(charClass.id)}
            >
              <ClassIcon charClass={charClass} />
            </Button>
          ))}
        </Paper>
      )}
    </div>
  );
};

import { useCallback, useRef, useState } from "react";
import { ClassIcon } from "./characterIcon";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { characterClasses, useCharacterStore } from "../characterStore";
import { VerticalSeparator } from "./verticalSeparator";
import { useOnClickOutside } from "usehooks-ts";

export const ClassSelect = () => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({ character, updateCharacter })
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));
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
    <div css={{ position: "relative", width: "100%" }} ref={ref}>
      <div
        css={{ display: "flex", width: "100%" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ClassIcon
          charClass={
            characterClasses[character.className] ||
            characterClasses["blinkblade"]
          }
        />
        <VerticalSeparator withLine={false} />
        <div
          css={{
            alignSelf: "center",
            flexGrow: 1,
            textAlign: "center",
            fontSize: "34px",
            fontWeight: "bold",
            fontFamily: "PirataOne-Gloomhaven",
            lineHeight: "1em",
          }}
        >
          {characterClasses[character.className]?.name ||
            characterClasses["blinkblade"].name}
        </div>
      </div>
      {isOpen && (
        <Paper css={{ position: "absolute", top: 0, zIndex: 10 }}>
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

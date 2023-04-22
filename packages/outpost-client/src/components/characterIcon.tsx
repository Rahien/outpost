import { Character } from "../types";
import background from "../assets/classes.png";
import { imageSize } from "../tokens";
import { CharacterClass } from "../characterStore";
export const ClassIcon = ({ charClass }: { charClass: CharacterClass }) => {
  return (
    <div
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize.large,
        height: imageSize.large,
        backgroundColor: "red",
        backgroundPositionX: `${charClass.iconOffset?.x || 0}px`,
        backgroundPositionY: `${charClass.iconOffset?.y || 0}px`,
        ariaLabel: charClass.name,
        backgroundSize: "352px",
      }}
    ></div>
  );
};

import { Character } from "../types";
import background from "../assets/classes.png";
import { imageSize } from "../tokens";
export const CharacterIcon = ({ character }: { character: Character }) => {
  return (
    <div
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize.large,
        height: imageSize.large,
        backgroundColor: "red",
        backgroundPositionX: `${character.iconOffset.x}px`,
        backgroundPositionY: `${character.iconOffset.y}px`,
        ariaLabel: character.name,
        backgroundSize: "352px",
      }}
    ></div>
  );
};

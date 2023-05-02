import { Character } from "../types";
import background from "../assets/classes.png";
import { imageSize } from "../tokens";
import { CharacterClass } from "../characterStore";
export const ClassIcon = ({
  charClass,
  inline = false,
  size = "large",
}: {
  charClass: CharacterClass;
  size?: keyof typeof imageSize;
  inline?: boolean;
}) => {
  const iconSize = parseInt(imageSize[size], 10);
  const defaultSize = parseInt(imageSize.large, 10);
  const sizeMultiplier = iconSize / defaultSize;
  const backgroundSize = 352 * sizeMultiplier;
  return (
    <div
      aria-label={charClass.name}
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize[size],
        height: imageSize[size],
        backgroundPositionX: `${
          (charClass.iconOffset?.x || 0) * sizeMultiplier
        }px`,
        backgroundPositionY: `${
          (charClass.iconOffset?.y || 0) * sizeMultiplier
        }px`,
        backgroundSize: `${backgroundSize}px`,
        display: inline ? "inline-block" : "block",
        verticalAlign: "middle",
      }}
    ></div>
  );
};

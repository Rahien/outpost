import bannerspear from "../assets/characters/fh-banner-spear-bw-icon.png";
import blinkblade from "../assets/characters/fh-blinkblade-bw-icon.png";
import boneshaper from "../assets/characters/fh-boneshaper-bw-icon.png";
import deathwalker from "../assets/characters/fh-deathwalker-bw-icon.png";
import drifter from "../assets/characters/fh-drifter-bw-icon.png";
import geminate from "../assets/characters/fh-geminate-bw-icon.png";

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
  return (
    <img
      aria-label={charClass.name}
      src={classIcons[charClass.id]}
      css={{
        width: imageSize[size],
        height: imageSize[size],
        objectFit: "contain",
        display: inline ? "inline-block" : "block",
        verticalAlign: "middle",
      }}
    />
  );
};

const classIcons: Record<string, string> = {
  bannerspear,
  blinkblade,
  boneshaper,
  deathwalker,
  drifter,
  geminate,
};

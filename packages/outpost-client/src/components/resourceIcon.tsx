import arrowvine from "../assets/loot/fh-arrowvine-bw-icon.png";
import axenut from "../assets/loot/fh-axenut-bw-icon.png";
import corpsecap from "../assets/loot/fh-corpsecap-bw-icon.png";
import flamefruit from "../assets/loot/fh-flamefruit-bw-icon.png";
import rockroot from "../assets/loot/fh-rockroot-bw-icon.png";
import snowthistle from "../assets/loot/fh-snowthistle-bw-icon.png";
import hide from "../assets/loot/fh-hide-bw-icon.png";
import metal from "../assets/loot/fh-metal-bw-icon.png";
import wood from "../assets/loot/fh-lumber-bw-icon.png";

import { imageSize } from "../tokens";
export const ResourceIcon = ({
  resource,
  inline = false,
  size = "medium",
}: {
  resource: string;
  inline?: boolean;
  size: keyof typeof imageSize;
}) => {
  const iconSize = parseInt(imageSize[size], 10);
  const defaultSize = parseInt(imageSize.medium, 10);
  const sizeMultiplier = iconSize / defaultSize;
  const backgroundSize = 310 * sizeMultiplier;
  return (
    <img
      aria-label={resource}
      src={resourceImages[resource]}
      css={{
        width: imageSize[size],
        height: imageSize[size],
        display: inline ? "inline-block" : "block",
        verticalAlign: "middle",
        objectFit: "contain",
      }}
    />
  );
};

const resourceImages: Record<string, string> = {
  metal,
  wood,
  hide,
  arrowvine,
  axenut,
  corpsecap,
  flamefruit,
  rockroot,
  snowthistle,
};

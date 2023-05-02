import background from "../assets/resources.png";
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
    <div
      aria-label={resource}
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize[size],
        height: imageSize[size],
        backgroundPositionX: `${
          (resourceOffsets[resource]?.x || 0) * sizeMultiplier
        }px`,
        backgroundPositionY: `${
          (resourceOffsets[resource]?.y || 0) * sizeMultiplier
        }px`,
        backgroundSize: `${backgroundSize}px`,
        display: inline ? "inline-block" : "block",
        verticalAlign: "middle",
      }}
    ></div>
  );
};

const resourceOffsets: Record<string, { x: number; y: number }> = {
  metal: { x: 166, y: -2 },
  wood: { x: 40, y: -4 },
  hide: { x: -4, y: -4 },
  arrowvine: { x: -1, y: 91 },
  axenut: { x: 171, y: 91 },
  corpsecap: { x: 171, y: 39 },
  flamefruit: { x: -4, y: 40 },
  rockroot: { x: 44, y: 90 },
  snowthistle: { x: 42, y: 41 },
};

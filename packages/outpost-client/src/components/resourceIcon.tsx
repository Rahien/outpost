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
  metal: { x: 173, y: 0 },
  wood: { x: 46, y: 0 },
  hide: { x: 0, y: 0 },
  arrowvine: { x: 5, y: 97 },
  axenut: { x: 174, y: 97 },
  corpsecap: { x: 173, y: 45 },
  flamefruit: { x: -4, y: 43 },
  rockroot: { x: 46, y: 96 },
  snowthistle: { x: 46, y: 47 },
};

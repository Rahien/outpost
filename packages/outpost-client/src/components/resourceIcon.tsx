import background from "../assets/resources.png";
import { imageSize } from "../tokens";
export const ResourceIcon = ({ resource }: { resource: string }) => {
  return (
    <div
      aria-label={resource}
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize.medium,
        height: imageSize.medium,
        backgroundColor: "red",
        backgroundPositionX: `${resourceOffsets[resource]?.x || 0}px`,
        backgroundPositionY: `${resourceOffsets[resource]?.y || 0}px`,

        backgroundSize: "310px",
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

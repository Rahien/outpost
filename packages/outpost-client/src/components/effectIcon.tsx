import background from "../assets/conditions-and-effects.png";
import { imageSize } from "../tokens";

export const EffectIcon = ({
  effect,
  inline = false,
  size = "tiny",
}: {
  effect: string;
  size?: keyof typeof imageSize;
  inline?: boolean;
}) => {
  const iconSize = parseInt(imageSize[size], 10);
  const defaultSize = parseInt(imageSize.tiny, 10);
  const sizeMultiplier = iconSize / defaultSize;
  const backgroundSize = 132 * sizeMultiplier;
  return (
    <div
      aria-label={effect}
      css={{
        backgroundImage: `url(${background})`,
        width: imageSize[size],
        height: imageSize[size],
        backgroundPositionX: `${
          (effectOffsets[effect]?.x || 0) * sizeMultiplier
        }px`,
        backgroundPositionY: `${
          (effectOffsets[effect]?.y || 0) * sizeMultiplier
        }px`,
        backgroundSize: `${backgroundSize}px`,
        display: inline ? "inline-block" : "block",
        verticalAlign: "middle",
      }}
    ></div>
  );
};

export const effectOffsets: Record<string, { x: number; y: number }> = {
  fire: { x: -3, y: -3.6 },
  ice: { x: -21, y: -3.6 },
  air: { x: -39, y: -3.6 },
  earth: { x: -57, y: -3.6 },
  light: { x: -75, y: -3.6 },
  dark: { x: -93, y: -3.6 },

  pull: { x: -3, y: -35.8 },
  push: { x: -21, y: -35.8 },
  pierce: { x: -39, y: -35.8 },
  target: { x: -57, y: -35.8 },

  regenerate: { x: -3, y: -68.7 },
  ward: { x: -21, y: -68.7 },
  invisible: { x: -39, y: -68.7 },
  strengthen: { x: -57, y: -68.7 },
  bless: { x: -75, y: -68.7 },
  wound: { x: -93, y: -68.7 },
  brittle: { x: -111, y: -68.7 },
  bane: { x: -3, y: -86.7 },
  poison: { x: -21, y: -86.7 },
  immobilize: { x: -39, y: -86.7 },
  disarm: { x: -57, y: -86.7 },
  injure: { x: -75, y: -86.7 },
  stun: { x: -93, y: -86.7 },
  muddle: { x: -111, y: -86.7 },
  curse: { x: -3, y: -104.7 },
};

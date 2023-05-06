import { characterClasses, useCharacterStore } from "../characterStore";
import traitIcon from "../assets/general/fh-trait-bw-icon.png";
import { imageSize, spacing } from "../tokens";
import { VerticalSeparator } from "./verticalSeparator";
import { Fragment } from "react";

export const Traits = () => {
  const { character } = useCharacterStore(({ character }) => ({ character }));
  const traits =
    characterClasses[character?.className || "blinkblade"]?.traits || [];

  return (
    <>
      <img
        src={traitIcon}
        css={{
          height: imageSize.tiny,
          width: imageSize.tiny,
          objectFit: "contain",
          verticalAlign: "middle",
          marginRight: spacing.medium,
        }}
      />

      {traits.map((trait, index) => (
        <Fragment key={trait}>
          <div
            key={trait}
            css={{
              display: "flex",
              alignItems: "center",
              fontFamily: "PirataOne-Gloomhaven",
              fontSize: "18px",
              flexGrow: 1,
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            {trait}
          </div>
          {index < traits.length - 1 && (
            <VerticalSeparator
              css={{ alignSelf: "stretch" }}
              withLine={false}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

import { Fragment, useContext, useRef, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { NumberValueInput } from "./numberValueInput";
import { Title } from "./Title";
import { useOnClickOutside } from "usehooks-ts";
import { Card } from "./card";
import { ThemeContext } from "./themeProvider";
import { imageSize, spacing } from "../tokens";
import { Check } from "@mui/icons-material";
import prosperityIcon from "../assets/general/fh-building-prosperity-bw-icon.png";
import { width } from "@mui/system";

const prosperityPips = [0, 6, 9, 12, 15, 18, 21, 24, 27];
const totalProsperityForLevel = prosperityPips.map((_, index) => {
  let total = 0;
  prosperityPips.forEach((pips, i) => {
    if (i <= index) {
      total += pips;
    }
  });
  return total;
});

const prosperityToLevelAndPips = (prosperity: number) => {
  let level = 1;
  let pips = 0;
  let remaining = prosperity;
  while (remaining >= prosperityPips[level]) {
    remaining = remaining - prosperityPips[level];
    level++;
  }
  pips = remaining;
  return { level, pips };
};

const DisplayProsperityTrack = ({ onClick }: { onClick: () => void }) => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const { color, background: backgroundColor } = useContext(ThemeContext);
  const { level, pips } = prosperityToLevelAndPips(campaign?.prosperity || 0);
  return (
    <div
      onClick={onClick}
      css={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {prosperityPips.map((levelPips, index) => {
        if (index === 0) {
          return null;
        }
        return (
          <Fragment key={index}>
            {Array.from({ length: levelPips }).map((_, i) => {
              let background =
                i % 5 === 4 && i !== levelPips - 1
                  ? "rgba(0,0,0,0.2)"
                  : undefined;
              let textColor = color;
              if (level > index && levelPips - 1 === i) {
                background = color;
                textColor = backgroundColor;
              }
              return (
                <div
                  key={`${index}-${i}`}
                  css={{
                    width: i === levelPips - 1 ? 14 : 10,
                    height: i === levelPips - 1 ? 14 : 10,
                    border: `solid 2px ${color}`,
                    background: background,
                    textAlign: "center",
                    lineHeight: "16px",
                    flexWrap: "wrap",
                    position: "relative",
                    marginLeft: -2,
                    color: textColor,
                  }}
                >
                  {i === levelPips - 1 ? index + 1 : ""}
                  {(level > index || (level === index && pips > i)) &&
                    i !== levelPips - 1 && (
                      <Check
                        css={{
                          width: 16,
                          height: 16,
                          position: "absolute",
                          top: -4,
                          left: -2,
                        }}
                      />
                    )}
                </div>
              );
            })}
            {index < 8 && (
              <div
                css={{
                  flexGrow: 1,
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: spacing.tiny,
                }}
              >
                -
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

const EditProsperityTrack = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  const { campaign, updateCampaign, updating } = useCampaignStore(
    ({ campaign, updateCampaign, updating }) => ({
      campaign,
      updateCampaign,
      updating,
    })
  );

  const { level, pips } = prosperityToLevelAndPips(campaign?.prosperity || 0);

  if (!campaign) {
    return null;
  }

  return (
    <div ref={ref}>
      <Title
        title="Level"
        css={{ width: "100%", display: "flex", justifyContent: "center" }}
      />
      <NumberValueInput
        value={level}
        setValue={(value) =>
          !updating &&
          updateCampaign({
            ...campaign,
            prosperity: totalProsperityForLevel[value - 1],
          })
        }
        min={1}
        max={9}
      />
      <Title
        title="Pips"
        css={{ width: "100%", justifyContent: "center", display: "flex" }}
      />
      <NumberValueInput
        value={pips}
        setValue={(value) =>
          !updating &&
          updateCampaign({
            ...campaign,
            prosperity: totalProsperityForLevel[level - 1] + value,
          })
        }
        max={prosperityPips[level]}
      />
    </div>
  );
};

export const ProsperityTrack = () => {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <Title
        title="Prosperity"
        icon={<img src={prosperityIcon} css={{ width: imageSize.tiny }} />}
      />
      {editing ? (
        <EditProsperityTrack onClose={() => setEditing(false)} />
      ) : (
        <DisplayProsperityTrack onClick={() => setEditing(true)} />
      )}
    </Card>
  );
};

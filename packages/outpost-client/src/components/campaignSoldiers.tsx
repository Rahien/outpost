import { useContext, useRef, useState } from "react";
import { Title } from "./Title";
import { useCampaignStore } from "../campaignStore";
import helmetIcon from "../assets/general/fh-equip-slot-head-bw-icon.png";
import lostIcon from "../assets/general/fh-lost-color-icon.png";
import { spacing } from "../tokens";
import { ThemeContext } from "./themeProvider";
import { NumberValueInput } from "./numberValueInput";
import { useOnClickOutside } from "usehooks-ts";

const DisplaySoldiers = () => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const maxSoldiers = 4 + ((campaign?.barracksLevel || 1) - 1) * 2;
  const { color } = useContext(ThemeContext);
  const soldierWidth = 12;
  return (
    <div css={{ flex: 1, display: "flex", paddingTop: spacing.small }}>
      <div
        css={{
          whiteSpace: "pre",
          borderRight: `solid 1px ${color}`,
          paddingRight: 4,
          marginRight: 4,
          fontSize: 12,
          lineHeight: "12px",
          height: "fit-content",
          fontFamily: "PirataOne-Gloomhaven",
        }}
      >
        {`Lvl\n${campaign?.barracksLevel || 1}`}
      </div>
      <div
        css={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {Array.from({ length: maxSoldiers }).map((_, index) => {
          return (
            <div
              css={{
                position: "relative",
                height: soldierWidth,
                width: soldierWidth,
                border: `dashed 1px ${color}`,
                borderRadius: "100%",
              }}
              key={index}
            >
              <img
                src={helmetIcon}
                css={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: 8,
                }}
                alt="soldier"
              />
              {index >= (campaign?.soldiers || 0) && (
                <img
                  src={lostIcon}
                  alt="lost"
                  css={{
                    width: soldierWidth,
                    top: -2,
                    position: "relative",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EditSoldiers = () => {
  const { campaign, updateCampaign } = useCampaignStore(
    ({ campaign, updateCampaign }) => ({ campaign, updateCampaign })
  );
  const maxSoldiers = 4 + ((campaign?.barracksLevel || 1) - 1) * 2;
  if (!campaign) return null;
  return (
    <div
      css={{
        "> div > div": {
          fontSize: 20,
          height: 20,
          lineHeight: "20px",
        },
        span: { fontSize: 12 },
        button: {
          padding: 0,
          minWidth: 32,
          fontSize: 20,
        },
      }}
    >
      <div>
        <Title title="Lvl:" />
        <NumberValueInput
          value={campaign.barracksLevel}
          setValue={(value) => {
            updateCampaign({
              ...campaign,
              barracksLevel: value,
              soldiers: Math.min(campaign.soldiers, 4 + (value - 1) * 2),
            });
          }}
          min={1}
          max={4}
        />
      </div>
      <div>
        <Title title="Soldiers:" />
        <NumberValueInput
          value={campaign.soldiers}
          setValue={(value) => {
            updateCampaign({ ...campaign, soldiers: value });
          }}
          min={0}
          max={maxSoldiers}
        />
      </div>
    </div>
  );
};

export const CampaignSoldiers = () => {
  const [edit, setEdit] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEdit(false));
  return (
    <div onClick={() => setEdit(true)} ref={ref}>
      <Title title="Soldiers:" />
      {edit ? <EditSoldiers /> : <DisplaySoldiers />}
    </div>
  );
};

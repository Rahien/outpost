import { useEffect, useRef, useState } from "react";
import { Card } from "./card";
import { Title } from "./Title";
import { HorizontalLine } from "./horizontalLine";
import { NumberValueInput } from "./numberValueInput";
import { useCampaignStore } from "../campaignStore";
import { AllPerkChecks } from "./perks";
import { useDebounce, useOnClickOutside } from "usehooks-ts";

export const TownGuardPerks = () => {
  const [editing, setEditing] = useState(false);
  const { campaign, updateCampaign, updating } = useCampaignStore(
    ({ campaign, updateCampaign, updating }) => ({
      campaign,
      updateCampaign,
      updating,
    })
  );
  const [perks, setPerks] = useState(campaign?.perkTags || 0);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  const debouncedPerks = useDebounce(perks, 1000);
  useEffect(() => {
    if (!campaign || campaign.perkTags === perks || updating) {
      return;
    }
    updateCampaign({ ...campaign, perkTags: perks });
  }, [debouncedPerks]);
  return (
    <Card>
      <div
        css={{
          minHeight: 164,
          display: "flex",
          flexDirection: "column",
          "> *:last-of-type": { flexGrow: 1 },
        }}
      >
        <Title title="Perks" center />
        <HorizontalLine upwards />

        <div
          ref={ref}
          onClick={() => setEditing(true)}
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {editing ? (
            <NumberValueInput
              setValue={setPerks}
              value={perks}
              min={0}
              max={45}
            />
          ) : (
            <AllPerkChecks perkCount={campaign?.perkTags || 0} maxPerks={45} />
          )}
        </div>
      </div>
      <HorizontalLine />
    </Card>
  );
};

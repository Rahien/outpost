import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./card";
import { Title } from "./Title";
import { HorizontalLine } from "./horizontalLine";
import { NumberValueInput } from "./numberValueInput";
import { useCampaignStore } from "../campaignStore";
import { AllPerkChecks } from "./perks";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { TownGuardPerk } from "../types";
import { CustomMarkdown } from "./customMarkdown";
import {
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
} from "@mui/icons-material";
import sectionIcon from "../assets/general/fh-section-bw-icon.png";
import { spacing } from "../tokens";
import { Edit } from "react-feather";
import { Checkbox, Dialog } from "@mui/material";
import { Button } from "./button";

const usePerkStatus = (perk: TownGuardPerk) => {
  const sections = useMemo(() => {
    const active = (perk.active || "").split(";");
    let available = (perk.sections || "").split(";");

    available = available.filter((section) => !active.includes(section));

    let result: { section: string; active: boolean }[] = [];
    active.map((section) => {
      result.push({ section, active: true });
    });
    available.map((section) => {
      result.push({ section, active: false });
    });
    result = result.filter((section) => section.section);
    result.sort((a, b) => {
      if (a.section.length != b.section.length) {
        return a.section.length - b.section.length;
      }
      return a.section.localeCompare(b.section);
    });
    return result;
  }, [perk]);
  return sections;
};

const DisplayPerk = ({ perk }: { perk: TownGuardPerk }) => {
  const sections = usePerkStatus(perk);
  return (
    <div css={{ display: "flex", marginBottom: spacing.small }}>
      <div css={{ width: 80, flexGrow: 0, flexShrink: 0 }}>
        {sections.map((section, i) => (
          <div
            key={section.section}
            css={{ display: "flex", alignItems: "center" }}
          >
            {section.active ? (
              <CheckBoxOutlined />
            ) : (
              <CheckBoxOutlineBlankOutlined />
            )}
            <img
              src={sectionIcon}
              css={{ width: 12, marginRight: spacing.tiny }}
            />
            <div css={{ paddingTop: 2 }}>{section.section}</div>
          </div>
        ))}
      </div>
      <CustomMarkdown>{perk.description}</CustomMarkdown>
    </div>
  );
};

const EditPerk = ({
  perk,
  onClose,
}: {
  perk: TownGuardPerk;
  onClose: () => void;
}) => {
  const { updatePerk, campaign } = useCampaignStore(
    ({ updatePerk, campaign }) => ({ updatePerk, campaign })
  );
  const sections = usePerkStatus(perk);
  const toggleSection = (section: { section: string; active: boolean }) => {
    if (!campaign?.id) {
      return;
    }
    const active = !section.active;
    let activeSections = sections.filter((s) => s.active).map((s) => s.section);
    if (active) {
      activeSections.push(section.section);
    } else {
      activeSections.splice(activeSections.indexOf(section.section), 1);
    }
    activeSections = [...new Set(activeSections)];
    updatePerk(campaign.id, perk.id, activeSections.join(";"));
  };
  if (!campaign) return null;
  return (
    <Dialog open={true} onClose={onClose}>
      <div
        css={{
          width: "90vw",
          maxWidth: "100%",
          padding: spacing.medium,
          boxSizing: "border-box",
        }}
      >
        <Title
          title="Select Sections"
          css={{ fontSize: 32, marginBottom: spacing.small }}
        />
        {sections.map((section, i) => (
          <div
            key={section.section}
            onClick={() => toggleSection(section)}
            css={{
              display: "flex",
              padding: spacing.medium,
              paddingLeft: 0,
              alignItems: "center",
            }}
          >
            {section.active ? (
              <CheckBoxOutlined />
            ) : (
              <CheckBoxOutlineBlankOutlined />
            )}
            <div css={{ fontSize: 16, marginLeft: spacing.small }}>
              {section.section}
            </div>
          </div>
        ))}
        <Button onClick={onClose}>
          <Title title="Done" />
        </Button>
      </div>
    </Dialog>
  );
};

const Perk = ({ perk }: { perk: TownGuardPerk }) => {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <div onClick={() => setEditing(true)}>
        <DisplayPerk perk={perk} />
      </div>
      {editing && <EditPerk perk={perk} onClose={() => setEditing(false)} />}
    </>
  );
};

const PerkList = () => {
  const { campaign } = useCampaignStore(({ campaign }) => ({
    campaign,
  }));
  const sortedPerks = useMemo(() => {
    if (!campaign) return [];
    const perks = campaign.perks || [];
    perks.sort((a, b) => {
      return a.order - b.order;
    });
    return perks;
  }, [campaign]);

  return (
    <div>
      {sortedPerks.map((perk, i) => (
        <Perk key={i} perk={perk} />
      ))}
    </div>
  );
};

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
        <Title title="Town Guard Perks" center />
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
      <PerkList />
    </Card>
  );
};

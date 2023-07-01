import { useEffect, useRef, useState } from "react";
import { useCharacterStore } from "../characterStore";
import { Campaign, Character } from "../types";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { ResourceIcon } from "./resourceIcon";
import { Title } from "./Title";
import { useCampaignStore } from "../campaignStore";
import { NumberValueInput } from "./numberValueInput";
import { spacing } from "../tokens";
import { Card } from "@mui/material";
import { Button } from "./button";
import { useUserStore } from "../userStore";
import { Close } from "@mui/icons-material";

const NumberValueMultiplier = ({ onClose }: { onClose: () => void }) => {
  const { valueMultiplier, setValueMultiplier } = useUserStore(
    ({ valueMultiplier, setValueMultiplier }) => ({
      valueMultiplier,
      setValueMultiplier,
    })
  );
  return (
    <Card
      css={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        width: "90dvw",
        left: "5dvw",
        bottom: spacing.medium,
        padding: spacing.medium,
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        "&.MuiCard-root": { borderRadius: 4 },
        zIndex: 100,
      }}
    >
      <Title title="Step Multiplier" />
      <div
        css={{
          position: "absolute",
          top: 0,
          right: spacing.small,
          width: "fit-content !important",
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose();
        }}
      >
        <Close />
      </div>
      <div
        css={{
          display: "flex",
          gap: spacing.medium,
          justifyContent: "center",
          marginTop: spacing.medium,
          span: {
            display: "block",
            width: "100%",
            textAlign: "center",
          },
        }}
      >
        <Button
          inverted={valueMultiplier === 1}
          onClick={() => setValueMultiplier(1)}
        >
          x 1
        </Button>
        <Button
          inverted={valueMultiplier === 5}
          onClick={() => setValueMultiplier(5)}
        >
          x 5
        </Button>
        <Button
          inverted={valueMultiplier === 10}
          onClick={() => setValueMultiplier(10)}
        >
          x 10
        </Button>
      </div>
    </Card>
  );
};

const ResourceField = ({
  resource,
  title,
  edit,
  setEdit,
  entity,
  update,
}:
  | {
      resource: keyof Character;
      title?: React.ReactElement;
      edit?: boolean;
      setEdit?: (editing: boolean) => void;
      entity: Character;
      update: (newCharacter: Character) => void;
    }
  | {
      resource: keyof Campaign;
      title?: React.ReactElement;
      edit?: boolean;
      setEdit?: (editing: boolean) => void;
      entity: Campaign;
      update: (newCampaign: Campaign) => void;
    }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));

  const [editing, setEditing] = useState(edit);

  useEffect(() => {
    if (edit !== undefined && edit !== editing) {
      setEditing(edit);
    }
  }, [edit]);
  useEffect(() => {
    if (!setEdit || editing === edit || editing === undefined) {
      return;
    }
    setEdit(editing);
  }, [editing]);

  const [value, setValue] = useState(
    entity[resource as keyof typeof entity] as unknown as number
  );
  useEffect(() => {
    setValue(entity[resource as keyof typeof entity] as unknown as number);
  }, [entity]);

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedValue !== entity[resource as keyof typeof entity]) {
      update({ ...entity, [resource]: debouncedValue } as Character & Campaign);
    }
  }, [debouncedValue]);

  return (
    <div
      css={{ flexGrow: 1, flexShrink: 0 }}
      onClick={() => setEditing(true)}
      ref={ref}
    >
      {title || <Title icon={<ResourceIcon resource={resource} />} />}
      <div
        css={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          button: {
            padding: 0,
            minWidth: 30,
          },
        }}
      >
        {editing ? (
          <NumberValueInput
            value={value}
            setValue={setValue}
            min={0}
            withMultiplier
          />
        ) : (
          <div css={{ fontSize: "24px", fontFamily: "PirataOne-Gloomhaven" }}>
            {value}
          </div>
        )}
      </div>
      {editing && <NumberValueMultiplier onClose={() => setEditing(false)} />}
    </div>
  );
};

export const CharacterResourceField = ({
  resource,
  title,
  edit,
  setEdit,
}: {
  resource: keyof Character;
  title?: React.ReactElement;
  edit?: boolean;
  setEdit?: (editing: boolean) => void;
}) => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({
      character,
      updateCharacter,
    })
  );
  if (!character) return null;
  return (
    <ResourceField
      resource={resource}
      title={title}
      edit={edit}
      setEdit={setEdit}
      entity={character}
      update={updateCharacter}
    />
  );
};

export const CampaignResourceField = ({
  resource,
  title,
  edit,
  setEdit,
}: {
  resource: keyof Campaign;
  title?: React.ReactElement;
  edit?: boolean;
  setEdit?: (editing: boolean) => void;
}) => {
  const { campaign, updateCampaign } = useCampaignStore(
    ({ campaign, updateCampaign }) => ({
      campaign,
      updateCampaign,
    })
  );
  if (!campaign) return null;
  return (
    <ResourceField
      resource={resource}
      title={title}
      edit={edit}
      setEdit={setEdit}
      entity={campaign}
      update={updateCampaign}
    />
  );
};

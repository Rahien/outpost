import { useEffect, useRef, useState } from "react";
import { useCharacterStore } from "../characterStore";
import { Campaign, Character } from "../types";
import { TextField } from "@mui/material";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { ResourceIcon } from "./resourceIcon";
import { Title } from "./Title";
import { useCampaignStore } from "../campaignStore";

const ResourceField = ({
  resource,
  title,
  edit,
  setEdit,
  entity,
  update,
  updating,
}:
  | {
      resource: keyof Character;
      title?: React.ReactElement;
      edit?: boolean;
      setEdit?: (editing: boolean) => void;
      entity: Character;
      update: (newCharacter: Character) => void;
      updating: boolean;
    }
  | {
      resource: keyof Campaign;
      title?: React.ReactElement;
      edit?: boolean;
      setEdit?: (editing: boolean) => void;
      entity: Campaign;
      update: (newCampaign: Campaign) => void;
      updating: boolean;
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
  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (
      debouncedValue !== entity[resource as keyof typeof entity] &&
      !updating
    ) {
      update({ ...entity, [resource]: debouncedValue } as Character & Campaign);
    }
  }, [debouncedValue, entity]);

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
        }}
      >
        {editing ? (
          <TextField
            type="number"
            label="Value"
            value={value}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => setEditing(false)}
            onChange={(e) =>
              setValue(parseInt(e.currentTarget.value || "0", 10))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
              }
            }}
          />
        ) : (
          <div css={{ fontSize: "24px", fontFamily: "PirataOne-Gloomhaven" }}>
            {value}
          </div>
        )}
      </div>
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
  const { character, updateCharacter, updating } = useCharacterStore(
    ({ character, updateCharacter, updating }) => ({
      character,
      updateCharacter,
      updating,
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
      updating={updating}
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
  const { campaign, updateCampaign, updating } = useCampaignStore(
    ({ campaign, updateCampaign, updating }) => ({
      campaign,
      updateCampaign,
      updating,
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
      updating={updating}
    />
  );
};

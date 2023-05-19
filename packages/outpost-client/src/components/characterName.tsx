import { TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { ThemeContext } from "./themeProvider";
import { useCampaignStore } from "../campaignStore";

const EntityName = <Entity extends { name: string }>({
  entity,
  update,
  updating,
}: {
  entity: Entity;
  update: (newEntity: Entity) => Promise<void>;
  updating: boolean;
}) => {
  const { color } = useContext(ThemeContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(entity?.name || "");
  const debouncedName = useDebounce(name, 1000);
  useEffect(() => {
    if (entity && debouncedName !== entity.name && !updating) {
      update({ ...entity, name: debouncedName });
    }
  }, [entity, debouncedName]);

  if (editing) {
    return (
      <TextField
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onFocus={(e) => e.currentTarget.select()}
        autoFocus
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      css={{
        fontWeight: "bold",
        borderBottom: `solid 1px ${color}`,
        fontFamily: "PirataOne-Gloomhaven",
        fontSize: "24px",
      }}
    >
      {name}
    </div>
  );
};

export const CharacterName = () => {
  const { character, updateCharacter, updating } = useCharacterStore(
    ({ character, updateCharacter, updating }) => ({
      character,
      updateCharacter,
      updating,
    })
  );
  if (!character) return null;
  return (
    <EntityName
      entity={character}
      update={updateCharacter}
      updating={updating}
    />
  );
};

export const CampaignName = () => {
  const { campaign, updateCampaign, updating } = useCampaignStore(
    ({ campaign, updateCampaign, updating }) => ({
      campaign,
      updateCampaign,
      updating,
    })
  );
  if (!campaign) return null;
  return (
    <EntityName entity={campaign} update={updateCampaign} updating={updating} />
  );
};

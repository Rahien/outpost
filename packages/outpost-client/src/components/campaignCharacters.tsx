import { useEffect, useMemo, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { spacing } from "../tokens";
import { Character } from "../types";
import { Title } from "./Title";
import { Button } from "./button";
import { Card } from "./card";
import { Dialog } from "@mui/material";
import { HorizontalLine } from "./horizontalLine";
import { characterClasses, useCharacterStore } from "../characterStore";
import { ClassIcon } from "./characterIcon";

const CharacterListItem = ({ character }: { character: Character }) => {
  return <div>{character.name}</div>;
};

const AddCharacterDialog = ({ onClose }: { onClose: () => void }) => {
  const { campaign, addCharacterToCampaign } = useCampaignStore(
    ({ campaign, addCharacterToCampaign }) => ({
      campaign,
      addCharacterToCampaign,
    })
  );
  const { characterList, fetchCharacterList } = useCharacterStore(
    ({ characterList, fetchCharacterList }) => ({
      characterList,
      fetchCharacterList,
    })
  );
  useEffect(() => {
    fetchCharacterList();
  }, []);

  const availableCharacters = useMemo(() => {
    if (!campaign || !characterList) return [];
    return characterList.filter(
      (char) =>
        !campaign.characters.find((campaignChar) => campaignChar.id === char.id)
    );
  }, [campaign, characterList]);

  const addCharacter = async (character: Character) => {
    if (!campaign) return;
    addCharacterToCampaign(campaign.id, character.id);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <div
        css={{
          padding: spacing.small,
          paddingBottom: 0,
          width: "90vw",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Card>
          <Title title="Link Character" />
          <p>Pick a character to add to the campaign</p>
          <div css={{ maxHeight: "60vh", overflow: "auto" }}>
            {availableCharacters.map((character, index) => {
              return (
                <div
                  onClick={() => addCharacter(character)}
                  key={character.id}
                  css={{
                    marginBottom: spacing.small,
                    padding: spacing.small,
                    borderBottom:
                      index > availableCharacters.length - 2
                        ? "none"
                        : "solid 2px black",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      gap: spacing.small,
                      alignItems: "center",
                    }}
                  >
                    <ClassIcon
                      charClass={characterClasses[character.className]}
                      size={"medium"}
                    />
                    <div css={{ flexGrow: 1, fontSize: 16 }}>
                      {character.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div css={{ "> div": { marginBottom: 0 }, marginTop: spacing.small }}>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

export const CampaignCharacters = () => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const [addingCharacter, setAddingCharacter] = useState(false);
  if (!campaign) return null;
  return (
    <>
      <Card>
        <Title
          title="Characters"
          css={{
            width: "100%",
            textAlign: "center",
            display: "block",
          }}
        />
        <HorizontalLine upwards />
        {campaign.characters.length === 0 && (
          <Title
            title="No characters yet..."
            css={{ fontSize: 18, padding: `${spacing.small} 0` }}
          />
        )}
        {campaign.characters.map((character) => (
          <CharacterListItem character={character} key={character.id} />
        ))}
        <div
          css={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: spacing.small,
          }}
        >
          <Button
            onClick={() => setAddingCharacter(true)}
            css={{ maxWidth: "150px" }}
          >
            Link Character
          </Button>
        </div>
      </Card>

      {addingCharacter && (
        <AddCharacterDialog onClose={() => setAddingCharacter(false)} />
      )}
    </>
  );
};

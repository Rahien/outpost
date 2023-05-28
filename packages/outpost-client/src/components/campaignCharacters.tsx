import { useEffect, useMemo, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { imageSize, spacing } from "../tokens";
import { CampaignCharacter, Character } from "../types";
import { Title } from "./Title";
import { Button } from "./button";
import { Card } from "./card";
import { Dialog } from "@mui/material";
import { HorizontalLine } from "./horizontalLine";
import { characterClasses, useCharacterStore } from "../characterStore";
import { ClassIcon } from "./characterIcon";
import levelIcon from "../assets/general/fh-level-crown-bw-icon.png";
import perksIcon from "../assets/general/fh-battle-goal-check-mark-bw-icon.png";
import retaliateIcon from "../assets/general/fh-retaliate-bw-icon.png";
import helmetIcon from "../assets/general/fh-equip-slot-head-bw-icon.png";
import moonIcon from "../assets/general/fh-building-downtime-bw-icon.png";
import sunIcon from "../assets/general/fh-building-operation-bw-icon.png";
import { levelBoundaries } from "./characterXp";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";

const xpToLevel = (xp: number) => {
  const level = levelBoundaries.findIndex((b) => b > xp);
  return level;
};

const CharacterDetails = ({
  character,
  onClose,
}: {
  character: CampaignCharacter;
  onClose: () => void;
}) => {
  const iconSize = 12;
  const { campaign, removeCharacterFromCampaign, toggleRetired } =
    useCampaignStore(
      ({ campaign, removeCharacterFromCampaign, toggleRetired }) => ({
        campaign,
        removeCharacterFromCampaign,
        toggleRetired,
      })
    );
  const user = useMemo(() => {
    const user = campaign?.players.find((u) => u.id === character.user);
    return user?.username ?? "unknown";
  }, [campaign, character]);

  const retired = !!character.retiredAt;

  const toggleCharacterRetired = () => {
    if (!campaign) return;
    if (retired) {
      toggleRetired(campaign.id, character.id, null);
    } else {
      toggleRetired(campaign.id, character.id, new Date().toISOString());
    }
  };

  if (!campaign) return null;
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
          <div
            css={{
              padding: spacing.small,
              display: "flex",
              gap: spacing.small,
              alignItems: "center",
              justifyContent: "center",
              img: {
                marginLeft: `-${imageSize.medium}`,
              },
              paddingLeft: imageSize.mlarge,
            }}
          >
            <ClassIcon
              charClass={characterClasses[character.className]}
              size="medium"
            />
            <Title title={character.name} />
          </div>
          <HorizontalLine />
          <div css={{ padding: spacing.small }}>
            <div
              css={{
                marginTop: spacing.small,
                display: "flex",
                flexDirection: "column",
                gap: spacing.tiny,
                "> div": {
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.small,
                },
                img: {
                  height: iconSize,
                  width: 20,
                  objectFit: "contain",
                },
              }}
            >
              <div
                css={{
                  flexGrow: 1,
                  flexShrink: "1 !important",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <img src={helmetIcon} />
                <Title title="Owner:" css={{ fontSize: 18, flexGrow: 1 }} />
                <Title title={user} css={{ fontSize: 18 }} />
              </div>
              <div>
                <img src={levelIcon} />
                <Title title="Level:" css={{ fontSize: 18, flexGrow: 1 }} />
                <Title
                  title={"" + xpToLevel(character.xp)}
                  css={{ fontSize: 18 }}
                />
              </div>
              <div>
                <img src={perksIcon} />
                <Title title="Perks:" css={{ fontSize: 18, flexGrow: 1 }} />
                <Title
                  title={"" + character.perkCount}
                  css={{ fontSize: 18 }}
                />
              </div>
              <div>
                <img src={retaliateIcon} />
                <Title title="Masteries:" css={{ fontSize: 18, flexGrow: 1 }} />
                <Title
                  title={"" + character.masteryCount}
                  css={{ fontSize: 18 }}
                />
              </div>
              <div>
                {retired ? (
                  <>
                    <img src={moonIcon} />
                    <Title
                      title="Retired:"
                      css={{ fontSize: 18, flexGrow: 1 }}
                    />
                    <Title
                      title={character.retiredAt.substring(0, 10)}
                      css={{ fontSize: 18 }}
                    />
                  </>
                ) : (
                  <>
                    <img src={sunIcon} />
                    <Title title="Active" css={{ fontSize: 18 }} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.tiny,
            }}
          >
            <Button
              onClick={() => {
                removeCharacterFromCampaign(campaign.id, character.id);
                onClose();
              }}
            >
              Unlink
            </Button>
            <Button onClick={toggleCharacterRetired}>
              {retired ? "Un-Retire" : "Retire"}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

const CharacterListItem = ({ character }: { character: CampaignCharacter }) => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const [showDetails, setShowDetails] = useState(false);
  const user = useMemo(() => {
    const user = campaign?.players.find((u) => u.id === character.user);
    return user?.username ?? "unknown";
  }, [campaign, character]);
  const iconSize = 10;
  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        css={{
          display: "flex",
          alignItems: "center",
          gap: spacing.small,
          padding: `${spacing.tiny} 0`,
          opacity: character.retiredAt ? 0.6 : 1,
          width: "100%",
        }}
      >
        <ClassIcon
          charClass={characterClasses[character.className]}
          size="mlarge"
        />
        <div css={{ flexGrow: 1 }}>
          <Title title={character.name} />
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: spacing.small,
              fontSize: 10,
              width: "100%",
              "> div": {
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              },
            }}
          >
            <div
              css={{
                flexGrow: 1,
                flexShrink: "1 !important",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              by: {user}
            </div>
            <div>
              <img src={levelIcon} css={{ height: iconSize }} />
              <div>{xpToLevel(character.xp)}</div>
            </div>
            <div>
              <img src={perksIcon} css={{ height: iconSize }} />
              <div>{character.perkCount}</div>
            </div>
            <div>
              <img src={retaliateIcon} css={{ height: iconSize }} />
              <div>{character.masteryCount}</div>
            </div>
          </div>
        </div>
      </div>
      {showDetails && (
        <CharacterDetails
          character={character}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
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
  const [showRetired, setShowRetired] = useState(false);
  const charactersToShow = useMemo(() => {
    if (!campaign) return [];
    return campaign.characters.filter(
      (character) => !character.retiredAt || showRetired
    );
  }, [campaign, showRetired]);
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
        <div css={{ marginTop: spacing.small }}>
          {charactersToShow.length === 0 && (
            <Title
              title="No characters yet..."
              css={{ fontSize: 18, padding: `${spacing.small} 0` }}
            />
          )}
          {charactersToShow.map((character) => (
            <CharacterListItem character={character} key={character.id} />
          ))}
        </div>
        <div
          css={{
            display: "flex",
            width: "100%",
            gap: spacing.medium,
            justifyContent: "center",
            alignItems: "center",
            marginTop: spacing.small,
            "> div": {
              marginBottom: 0,
              flexGrow: 1,
            },
          }}
        >
          <div
            onClick={() => setShowRetired(!showRetired)}
            css={{ display: "flex", alignItems: "center", gap: spacing.tiny }}
          >
            {showRetired ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
            <div>Show retired</div>
          </div>

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

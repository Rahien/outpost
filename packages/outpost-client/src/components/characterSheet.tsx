import { ClassSelect } from "./characterClassSelect";
import { useCharacterStore } from "../characterStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, TextField } from "@mui/material";
import { Card } from "./card";
import { Character } from "../types";
import { CharacterXp } from "./characterXp";
import { ResourceField } from "./resourceField";
import { Verified } from "@mui/icons-material";
import { imageSize, spacing } from "../tokens";
import { Title } from "./Title";
import { CharacterNotes } from "./characterNotes";
import { VerticalSeparator } from "./verticalSeparator";
import { Perks } from "./perks";
import coinIcon from "../assets/general/fh-money-bw-icon.png";
import { Masteries } from "./masteries";
import { Traits } from "./traits";

const DeletingCharacter = ({
  character,
  onDelete,
  onClose,
}: {
  character: Character;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const [verifyName, setVerifyName] = useState<string>("");
  return (
    <Dialog open={true} onClose={onClose}>
      <h3>Are you sure you want to delete {character.name}?</h3>
      <p>To delete the character, type the character name below:</p>
      <TextField
        value={verifyName}
        label="Character Name To Delete"
        onChange={(e) => setVerifyName(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && verifyName === character.name) {
            onDelete();
          }
        }}
      />
      <div>
        <Button
          variant="outlined"
          color="error"
          disabled={verifyName != character.name}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button>Cancel</Button>
      </div>
    </Dialog>
  );
};

const HorizontalDivider = () => {
  return (
    <div css={{ gridColumn: "span 3", borderTop: `solid 1px black` }}></div>
  );
};

export const CharacterSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const { character, fetchCharacter, deleteCharacter } = useCharacterStore(
    ({ character, fetchCharacter, deleteCharacter }) => ({
      character,
      fetchCharacter,
      deleteCharacter,
    })
  );
  useEffect(() => {
    if (!id || character?.id === parseInt(id)) return;
    fetchCharacter(id);
  }, [fetchCharacter, id]);

  const handleDelete = async () => {
    if (!character?.id) {
      return;
    }
    await deleteCharacter(character?.id);
    navigate("/characters");
  };

  if (!character) return null; // TODO: show loading
  return (
    <>
      <Card css={{ display: "flex", width: "100%", alignItems: "center" }}>
        <ClassSelect />
      </Card>
      <CharacterXp />
      <Card
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 24px 1fr",
          gap: spacing.tiny,
          width: "100%",
        }}
      >
        <ResourceField
          resource="xp"
          title={<Title title="XP:" icon={<Verified />} />}
        />
        <VerticalSeparator />
        <ResourceField
          resource="gold"
          title={
            <Title
              title="Gold:"
              icon={
                <img
                  src={coinIcon}
                  css={{
                    width: imageSize.tiny,
                    height: imageSize.tiny,
                    objectFit: "contain",
                  }}
                />
              }
            />
          }
        />
      </Card>
      <Card css={{ width: "100%" }}>
        <Title title="Resources:" />
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: spacing.tiny,
            "> *:nth-of-type(4n+1)": {
              "> div": {
                borderRight: `solid 1px black`,
              },
            },
            "> *:nth-of-type(4n+3)": {
              "> div": {
                borderLeft: `solid 1px black`,
                img: {
                  marginLeft: spacing.tiny,
                },
              },
            },
          }}
        >
          <ResourceField resource="hide" />
          <ResourceField resource="metal" />
          <ResourceField resource="wood" />
          <HorizontalDivider />
          <ResourceField resource="arrowvine" />
          <ResourceField resource="axenut" />
          <ResourceField resource="corpsecap" />
          <HorizontalDivider />
          <ResourceField resource="flamefruit" />
          <ResourceField resource="rockroot" />
          <ResourceField resource="snowthistle" />
        </div>
      </Card>
      <Card>
        <CharacterNotes />
      </Card>

      <Card css={{ display: "flex", alignItems: "stretch" }}>
        <Traits />
      </Card>

      <Perks />
      <Masteries />

      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: spacing.large,
        }}
      >
        <Button
          css={{ flexGrow: 1, marginRight: spacing.small }}
          variant="outlined"
          onClick={() => navigate("/characters")}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleting(true)}
        >
          Delete Character
        </Button>
      </div>

      {deleting && (
        <DeletingCharacter
          character={character}
          onDelete={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
};

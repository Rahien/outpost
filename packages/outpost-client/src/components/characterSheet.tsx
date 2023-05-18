import { ClassSelect } from "./characterClassSelect";
import { useCharacterStore } from "../characterStore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, TextField } from "@mui/material";
import { Button } from "./button";
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
import { ThemeContext } from "./themeProvider";
import { VerifyDeleteDialog } from "./verifyDeleteDialog";

const HorizontalDivider = () => {
  const { color } = useContext(ThemeContext);
  return (
    <div css={{ gridColumn: "span 3", borderTop: `solid 1px ${color}` }}></div>
  );
};

export const CharacterSheet = () => {
  const { color } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [editXp, setEditXp] = useState(false);
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
      <CharacterXp setEditXp={setEditXp} />
      <Card
        coreCss={{
          display: "grid",
          gridTemplateColumns: "1fr 24px 1fr",
          gap: spacing.tiny,
          width: "100%",
        }}
      >
        <ResourceField
          resource="xp"
          edit={editXp}
          setEdit={setEditXp}
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
                borderRight: `solid 1px ${color}`,
              },
            },
            "> *:nth-of-type(4n+3)": {
              "> div": {
                borderLeft: `solid 1px ${color}`,
                img: {
                  marginLeft: spacing.tiny,
                },
              },
            },
          }}
        >
          <ResourceField resource="wood" />
          <ResourceField resource="metal" />
          <ResourceField resource="hide" />
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

      <Card coreCss={{ display: "flex", alignItems: "stretch" }}>
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
          onClick={() => navigate("/characters")}
        >
          Back
        </Button>
        <Button color="#800000" onClick={() => setDeleting(true)}>
          Delete Character
        </Button>
      </div>

      {deleting && (
        <VerifyDeleteDialog
          name={character.name}
          type={"character"}
          onDelete={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
};

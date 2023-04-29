import { ClassSelect } from "./characterClassSelect";
import { useCharacterStore } from "../characterStore";
import { CharacterName } from "./characterName";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, TextField } from "@mui/material";
import { Character } from "../types";

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
      <div css={{ display: "flex" }}>
        <ClassSelect />
        <CharacterName />
      </div>
      <div css={{ display: "flex" }}>
        <Button variant="outlined" onClick={() => navigate("/characters")}>
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

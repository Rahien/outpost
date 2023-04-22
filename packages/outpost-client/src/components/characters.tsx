import { useEffect } from "react";
import {
  characterClasses,
  defaultCharacter,
  useCharacterStore,
} from "../characterStore";
import { ClassIcon } from "./characterIcon";
import { ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@mui/material";
import { Character } from "../types";
import axios from "axios";

const CharacterListItem = ({ character }: { character: Character }) => {
  const navigate = useNavigate();
  const url = `/characters/${character.id}`;
  return (
    <Card
      css={{ display: "flex", alignItems: "center" }}
      onClick={() => navigate(url)}
    >
      <ClassIcon charClass={characterClasses[character.className]} />
      <span>{character.name}</span>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate(url);
        }}
      >
        <ArrowRight />
      </Button>
    </Card>
  );
};

export const Characters = () => {
  const navigate = useNavigate();
  const { characterList, fetchCharacterList } = useCharacterStore(
    ({ characterList, fetchCharacterList }) => ({
      characterList,
      fetchCharacterList,
    })
  );
  useEffect(() => {
    fetchCharacterList();
  }, [fetchCharacterList]);

  const createNewCharacter = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/characters/api`,
      defaultCharacter
    );
    navigate(`/characters/${data.id}`);
  };
  return (
    <>
      <div>
        {characterList.map((character) => {
          return <CharacterListItem character={character} key={character.id} />;
        })}
      </div>
      <Button onClick={() => createNewCharacter()}>Create New</Button>
    </>
  );
};

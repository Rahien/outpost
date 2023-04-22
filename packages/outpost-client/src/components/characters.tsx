import { useEffect } from "react";
import { useCharacterStore } from "../characterStore";
import { CharacterIcon } from "./characterIcon";
import { ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@mui/material";
import { Character } from "../types";

const CharacterListItem = ({ character }: { character: Character }) => {
  const navigate = useNavigate();
  const url = `/characters/${character.id}`;
  return (
    <Card
      css={{ display: "flex", alignItems: "center" }}
      onClick={() => navigate(url)}
    >
      <CharacterIcon character={character} />
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
  const { characterList, fetchCharacterList } = useCharacterStore(
    ({ characterList, fetchCharacterList }) => ({
      characterList,
      fetchCharacterList,
    })
  );
  useEffect(() => {
    fetchCharacterList();
  }, [fetchCharacterList]);
  return (
    <div>
      {characterList.map((character) => {
        return <CharacterListItem character={character} key={character.id} />;
      })}
    </div>
  );
};

import { useEffect } from "react";
import {
  characterClasses,
  defaultCharacter,
  useCharacterStore,
} from "../characterStore";
import { ClassIcon } from "./characterIcon";
import { ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Character } from "../types";
import axios from "axios";
import { Card } from "./card";
import { VerticalSeparator } from "./verticalSeparator";

const CharacterListItem = ({ character }: { character: Character }) => {
  const navigate = useNavigate();
  const url = `/characters/${character.id}`;
  return (
    <Card
      css={{
        display: "flex",
        alignItems: "center",
        "> div:nth-child(2)": {
          alignSelf: "stretch",
        },
      }}
      onClick={() => navigate(url)}
    >
      <ClassIcon charClass={characterClasses[character.className]} />
      <VerticalSeparator withLine={false} />
      <div
        css={{
          fontWeight: "bold",
          fontSize: "24px",
          flexGrow: 1,
          textAlign: "center",
          fontFamily: "PirataOne-Gloomhaven",
        }}
      >
        {character.name}
      </div>
    </Card>
  );
};

export const Characters = () => {
  const navigate = useNavigate();
  const { characterList, fetchCharacterList, setCharacter } = useCharacterStore(
    ({ characterList, fetchCharacterList, setCharacter }) => ({
      characterList,
      fetchCharacterList,
      setCharacter,
    })
  );
  useEffect(() => {
    setCharacter(null);
    fetchCharacterList();
  }, [fetchCharacterList]);

  const createNewCharacter = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/characters`,
      defaultCharacter
    );
    navigate(`/characters/${data.id}`);
  };
  return (
    <>
      <div css={{ width: "100%" }}>
        {characterList.map((character) => {
          return <CharacterListItem character={character} key={character.id} />;
        })}
      </div>
      <Button onClick={() => createNewCharacter()}>Create New</Button>
    </>
  );
};

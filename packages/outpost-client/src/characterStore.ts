import { create } from "zustand";
import { Character } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type CharacterStore = {
  character: Character | null;
  name: string;
  setCharacter: (character: Character) => void;
  fetchCharacter: (id: string) => Promise<void>;
  updateCharacter: (newCharacter: Character) => Promise<void>;
  deleteCharacter: (id: number) => Promise<void>;
  characterList: Character[];
  fetchCharacterList: () => Promise<void>;
  setName: (name: string) => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: null,
  characterList: [] as Character[],
  name: "my new character",
  setCharacter: (character: Character) => set({ character }),
  fetchCharacter: async (id: string) => {
    const response = await axios(`${API_URL}/characters/api/${id}`);
    const character = response.data;
    set({ character });
  },
  fetchCharacterList: async () => {
    const response = await axios(`${API_URL}/characters/api`);
    const characterList = response.data;
    set({ characterList });
  },
  updateCharacter: async (newCharacter: Character) => {
    const response = await axios.patch(
      `${API_URL}/characters/api/${newCharacter.id}`,
      newCharacter
    );
    const character = response.data;
    set({ character });
  },
  deleteCharacter: async (id: number) => {
    await axios.delete(`${API_URL}/characters/api/${id}`);
  },
  setName: (name: string) => set({ name }),
}));

export const defaultCharacter: Omit<Character, "id"> = {
  name: "my new character",
  className: "blinkblade",
};

export type CharacterClass = {
  name: string;
  iconOffset: { x: number; y: number };
  id: string;
};

export const characterClasses: Record<string, CharacterClass> = {
  blinkblade: {
    name: "Blinkblade",
    id: "blinkblade",
    iconOffset: {
      x: 244,
      y: -2,
    },
  },
  bannerspear: {
    name: "Bannerspear",
    id: "bannerspear",
    iconOffset: {
      x: 0,
      y: -2,
    },
  },
};

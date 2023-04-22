import { create } from "zustand";
import { Character } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type CharacterStore = {
  character: Character | null;
  name: string;
  setCharacter: (character: Character) => void;
  fetchCharacter: (id: string) => Promise<void>;
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
  setName: (name: string) => set({ name }),
}));

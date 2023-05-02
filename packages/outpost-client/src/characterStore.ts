import { create } from "zustand";
import { Character } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type CharacterStore = {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
  fetchCharacter: (id: string) => Promise<void>;
  updateCharacter: (newCharacter: Character) => Promise<void>;
  deleteCharacter: (id: number) => Promise<void>;
  characterList: Character[];
  fetchCharacterList: () => Promise<void>;
  togglePerk: (
    characterId: number,
    id: number,
    active: number
  ) => Promise<void>;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: null,
  characterList: [] as Character[],
  setCharacter: (character: Character | null) => set({ character }),
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
  togglePerk: async (characterId: number, id: number, active: number) => {
    const response = await axios.put(
      `${API_URL}/characters/api/${characterId}/perks/${id}`,
      {
        active,
      }
    );
    const character = response.data;
    set({ character });
  },
}));

export const defaultCharacter: Omit<Character, "id" | "perks"> = {
  name: "my new character",
  className: "blinkblade",
  xp: 0,
  gold: 0,
  metal: 0,
  wood: 0,
  hide: 0,
  arrowvine: 0,
  axenut: 0,
  corpsecap: 0,
  flamefruit: 0,
  rockroot: 0,
  snowthistle: 0,
  notes: "",
  perkTags: 0,
};

export type CharacterClass = {
  name: string;
  className: string;
  iconOffset: { x: number; y: number };
  id: string;
};

export const characterClasses: Record<string, CharacterClass> = {
  blinkblade: {
    name: "Quatryl Blinkblade",
    id: "blinkblade",
    className: "Blinkblade",
    iconOffset: {
      x: 244,
      y: -2,
    },
  },
  bannerspear: {
    name: "Human Banner Spear",
    className: "Banner Spear",
    id: "bannerspear",
    iconOffset: {
      x: 0,
      y: -2,
    },
  },
  boneshaper: {
    name: "Aesther Boneshaper",
    className: "Boneshaper",
    id: "boneshaper",
    iconOffset: {
      x: 130,
      y: -2,
    },
  },
  deathwalker: {
    name: "Valrath Deathwalker",
    className: "Deathwalker",
    id: "deathwalker",
    iconOffset: {
      x: 180,
      y: -2,
    },
  },
  drifter: {
    name: "Inox Drifter",
    className: "Drifter",
    id: "drifter",
    iconOffset: {
      x: 300,
      y: -2,
    },
  },
  germinate: {
    name: "Harrower Germinate",
    className: "Germinate",
    id: "germinate",
    iconOffset: {
      x: 70,
      y: -2,
    },
  },
};

import { create } from "zustand";
import { Character } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type CharacterStore = {
  character: Character | null;
  updating: boolean;
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
  toggleMastery: (
    characterId: number,
    id: number,
    active: boolean
  ) => Promise<void>;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: null,
  updating: false,
  characterList: [] as Character[],
  setCharacter: (character: Character | null) => set({ character }),
  fetchCharacter: async (id: string) => {
    const response = await axios(`${API_URL}/characters/${id}`);
    const character = response.data;
    set({ character });
  },
  fetchCharacterList: async () => {
    const response = await axios(`${API_URL}/characters`);
    const characterList = response.data;
    set({ characterList });
  },
  updateCharacter: async (newCharacter: Character) => {
    set({ updating: true });
    const response = await axios.patch(
      `${API_URL}/characters/${newCharacter.id}`,
      newCharacter
    );
    const character = response.data;
    set({ character, updating: false });
  },
  deleteCharacter: async (id: number) => {
    await axios.delete(`${API_URL}/characters/${id}`);
  },
  togglePerk: async (characterId: number, id: number, active: number) => {
    const response = await axios.put(
      `${API_URL}/characters/${characterId}/perks/${id}`,
      {
        active,
      }
    );
    const character = response.data;
    set({ character });
  },
  toggleMastery: async (characterId: number, id: number, active: boolean) => {
    const response = await axios.put(
      `${API_URL}/characters/${characterId}/masteries/${id}`,
      {
        active,
      }
    );
    const character = response.data;
    set({ character });
  },
}));

export const defaultCharacter: Omit<Character, "id" | "perks" | "masteries"> = {
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
  traits: string[];
};

export const characterClasses: Record<string, CharacterClass> = {
  blinkblade: {
    name: "Quatryl Blinkblade",
    id: "blinkblade",
    className: "Blinkblade",
    iconOffset: {
      x: 269,
      y: -7,
    },
    traits: ["Educated", "Nimble", "Resourceful"],
  },
  bannerspear: {
    name: "Human Banner Spear",
    className: "Banner Spear",
    id: "bannerspear",
    iconOffset: {
      x: 0,
      y: -7,
    },
    traits: ["Armored", "Persuasive", "Resourceful"],
  },
  boneshaper: {
    name: "Aesther Boneshaper",
    className: "Boneshaper",
    id: "boneshaper",
    iconOffset: {
      x: 143,
      y: -7,
    },
    traits: ["Arcane", "Educated", "Intimidating"],
  },
  deathwalker: {
    name: "Valrath Deathwalker",
    className: "Deathwalker",
    id: "deathwalker",
    iconOffset: {
      x: 208,
      y: -7,
    },
    traits: ["Arcane", "Outcast", "Persuasive"],
  },
  drifter: {
    name: "Inox Drifter",
    className: "Drifter",
    id: "drifter",
    iconOffset: {
      x: 337,
      y: -7,
    },
    traits: ["Outcast", "Resourceful", "Strong"],
  },
  geminate: {
    name: "Harrower Geminate",
    className: "Geminate",
    id: "geminate",
    iconOffset: {
      x: 79,
      y: -7,
    },
    traits: ["Arcane", "Chaotic", "Nimble"],
  },
  crashingTide: {
    name: "Lurker Crashing Tide",
    className: "Crashing Tide",
    id: "crashingTide",
    iconOffset: {
      x: 34,
      y: -7,
    },
    traits: ["Armored", "Chaotic", "Strong"],
  },
  deepWraith: {
    name: "Lurker Deep Wraith",
    className: "Deep Wraith",
    id: "deepWraith",
    iconOffset: {
      x: 52,
      y: -7,
    },
    traits: ["Armored", "Intimidating", "Nimble"],
  },
  frozenFist: {
    name: "Algox Frozen Fist",
    className: "Frozen Fist",
    id: "frozenFist",
    iconOffset: {
      x: 96,
      y: -7,
    },
    traits: ["Intimidating", "Persuasive", "Strong"],
  },
  hive: {
    name: "Unfettered HIVE",
    className: "Hive",
    id: "hive",
    iconOffset: {
      x: 287,
      y: -7,
    },
    traits: ["Armored", "Educated", "Resourceful"],
  },
  infuser: {
    name: "Orchid Infuser",
    className: "Infuser",
    id: "infuser",
    iconOffset: {
      x: 160,
      y: -7,
    },
    traits: ["Arcane", "Educated", "Strong"],
  },
  metalMosaic: {
    name: "Unfettered Metal Mosaic",
    className: "Metal Mosaic",
    id: "metalMosaic",
    iconOffset: {
      x: 224,
      y: -7,
    },
    traits: ["Armored", "Resourceful", "Strong"],
  },
  painConduit: {
    name: "Aesther Pain Conduit",
    className: "Pain Conduit",
    id: "painConduit",
    iconOffset: {
      x: 251,
      y: -7,
    },
    traits: ["Chaotic", "Intimidating", "Outcast"],
  },
  pyroclast: {
    name: "Savvas Pyroclast",
    className: "Pyroclast",
    id: "pyroclast",
    iconOffset: {
      x: 314,
      y: -7,
    },
    traits: ["Arcane", "Chaotic", "Intimidating"],
  },
  shattersong: {
    name: "Savvas Shattersong",
    className: "Shattersong",
    id: "shattersong",
    iconOffset: {
      x: 296,
      y: -7,
    },
    traits: ["Educated", "Outcast", "Persuasive"],
  },
  snowdancer: {
    name: "Algox Snowdancer",
    className: "Snowdancer",
    id: "snowdancer",
    iconOffset: {
      x: 115,
      y: -7,
    },
    traits: ["Chaotic", "Nimble", "Persuasive"],
  },
  trapper: {
    name: "Vermling Trapper",
    className: "Trapper",
    id: "trapper",
    iconOffset: {
      x: 305,
      y: -7,
    },
    traits: ["Nimble", "Outcast", "Resourceful"],
  },
};

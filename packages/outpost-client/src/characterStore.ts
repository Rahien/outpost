import { create } from "zustand";
import { characters } from "./characters";
import { Character } from "./types";

export type CharacterStore = {
  character: Character;
  name: string;
  setCharacter: (character: Character) => void;
  setName: (name: string) => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: characters.blinkblade,
  name: "my new character",
  setCharacter: (character: Character) => set({ character }),
  setName: (name: string) => set({ name }),
}));

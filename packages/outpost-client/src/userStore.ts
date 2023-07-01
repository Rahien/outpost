import { create } from "zustand";
import dayjs from "dayjs";

export type UserStore = {
  initialized: boolean;
  username: string;
  setUsername: (username: string) => void;
  token: string | null;
  validUntil: Date | null;
  refresh: string | null;
  setToken: (token: string, refresh: string) => void;
  setInitialized: () => void;
  valueMultiplier: number;
  setValueMultiplier: (valueMultiplier: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  initialized: false,
  username: "",
  setUsername: (username: string) => set({ username }),
  token: null,
  validUntil: null,
  valueMultiplier: 1,
  setInitialized: () => set({ initialized: true }),
  setToken: (token: string, refresh: string) => {
    const validUntil = dayjs().add(10, "minutes").toDate();
    set({ token, validUntil, refresh });
  },
  setValueMultiplier: (valueMultiplier: number) => set({ valueMultiplier }),
  refresh: null,
}));

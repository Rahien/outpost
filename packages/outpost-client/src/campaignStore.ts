import { create } from "zustand";
import { Campaign, Scenario } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type CampaignStore = {
  campaign: Campaign | null;
  updating: boolean;
  setCampaign: (campaign: Campaign | null) => void;
  fetchCampaign: (id: string) => Promise<void>;
  updateCampaign: (newCampaign: Campaign) => Promise<void>;
  deleteCampaign: (id: number) => Promise<void>;
  campaignList: Campaign[];
  scenarioList: Scenario[];
  fetchScenarioList: (campaignId: number) => Promise<void>;
  updateScenario: (
    campaignId: number,
    scenarioId: string,
    status: string
  ) => Promise<void>;
  fetchCampaignList: () => Promise<void>;
  updatePerk: (campaignId: number, id: number, active: string) => Promise<void>;
  invitePlayer: (campaignId: number, username: string) => Promise<void>;
  removeInvite: (campaignId: number, id: number) => Promise<void>;
  removePlayer: (campaignId: number, id: number) => Promise<void>;
  addCharacterToCampaign: (campaignId: number, id: number) => Promise<void>;
  removeCharacterFromCampaign: (
    campaignId: number,
    id: number
  ) => Promise<void>;
  toggleRetired: (
    campaignId: number,
    id: number,
    retiredAt: string | null
  ) => Promise<void>;
  createEvent: (
    campaignId: number,
    section: string,
    week: number
  ) => Promise<void>;
  deleteEvent: (campaignId: number, id: number) => Promise<void>;
};

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaign: null,
  updating: false,
  campaignList: [] as Campaign[],
  scenarioList: [] as Scenario[],
  setCampaign: (campaign: Campaign | null) => set({ campaign }),
  fetchCampaign: async (id: string) => {
    const response = await axios(`${API_URL}/campaigns/${id}`);
    const campaign = response.data;
    set({ campaign });
  },
  fetchCampaignList: async () => {
    const response = await axios(`${API_URL}/campaigns`);
    const campaignList = response.data;
    set({ campaignList });
  },
  fetchScenarioList: async (campaignId: number) => {
    const response = await axios(
      `${API_URL}/campaigns/${campaignId}/scenarios`
    );
    const scenarioList = response.data;
    set({ scenarioList });
  },
  updateScenario: async (
    campaignId: number,
    scenarioId: string,
    status: string
  ) => {
    const response = await axios.put(
      `${API_URL}/campaigns/${campaignId}/scenarios/${scenarioId}`,
      { status }
    );
    const scenarioList = response.data;
    set({
      scenarioList,
    });
  },
  updateCampaign: async (newCampaign: Campaign) => {
    set({ updating: true });
    const response = await axios.patch(
      `${API_URL}/campaigns/${newCampaign.id}`,
      newCampaign
    );
    const campaign = response.data;
    set({ campaign, updating: false });
  },
  deleteCampaign: async (id: number) => {
    await axios.delete(`${API_URL}/campaigns/${id}`);
  },
  updatePerk: async (campaignId: number, id: number, active: string) => {
    const response = await axios.put(
      `${API_URL}/campaigns/${campaignId}/perks/${id}`,
      {
        active,
      }
    );
    const campaign = response.data;
    set({ campaign });
  },
  invitePlayer: async (campaignId: number, username: string) => {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/invites`,
      {
        username,
      }
    );
    const campaign = response.data;
    set({ campaign });
  },
  removeInvite: async (campaignId: number, id: number) => {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/invites/${id}`
    );
    const campaign = response.data;
    set({ campaign });
  },
  removePlayer: async (campaignId: number, id: number) => {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/players/${id}`
    );
    const campaign = response.data;
    set({ campaign });
  },
  addCharacterToCampaign: async (campaignId: number, characterId: number) => {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/characters`,
      { characterId }
    );
    const campaign = response.data;
    set({ campaign });
  },
  removeCharacterFromCampaign: async (campaignId: number, id: number) => {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/characters/${id}`
    );
    const campaign = response.data;
    set({ campaign });
  },
  toggleRetired: async (
    campaignId: number,
    id: number,
    retiredAt: string | null
  ) => {
    const response = await axios.put(
      `${API_URL}/campaigns/${campaignId}/characters/${id}`,
      { retiredAt }
    );
    const campaign = response.data;
    set({ campaign });
  },
  createEvent: async (campaignId: number, section: string, week: number) => {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/events`,
      {
        section,
        week,
      }
    );
    const campaign = response.data;
    set({ campaign });
  },
  deleteEvent: async (campaignId: number, id: number) => {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/events/${id}`
    );
    const campaign = response.data;
    set({ campaign });
  },
}));

export const defaultCampaign: Omit<
  Campaign,
  | "id"
  | "perks"
  | "characters"
  | "events"
  | "players"
  | "openInvites"
  | "invites"
> = {
  name: "My new campaign",
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
  prosperity: 0,
  inspiration: 0,
  morale: 6,
  totalDefense: 0,
  barracksLevel: 0,
  soldiers: 0,
  currentWeek: 0,
};

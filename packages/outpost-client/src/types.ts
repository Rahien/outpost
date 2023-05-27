export type Perk = {
  id: number;
  description: string;
  active: number;
  maxActive: number;
  order: number;
};

export type TownGuardPerk = {
  id: number;
  description: string;
  active: string;
  sections: string;
  order: number;
};

export type Mastery = {
  id: number;
  description: string;
  active: boolean;
  order: number;
};

export type Character = {
  id: number;
  name: string;
  className: string;
  xp: number;
  gold: number;
  metal: number;
  wood: number;
  hide: number;
  arrowvine: number;
  axenut: number;
  corpsecap: number;
  flamefruit: number;
  rockroot: number;
  snowthistle: number;
  notes: string;
  perkTags: number;
  perks: Perk[];
  masteries: Mastery[];
};

export type Event = {
  id: number;
  section: string;
  week: number;
};

export type Campaign = {
  id: number;
  name: string;
  metal: number;
  wood: number;
  hide: number;
  arrowvine: number;
  axenut: number;
  corpsecap: number;
  flamefruit: number;
  rockroot: number;
  snowthistle: number;
  notes: string;
  inspiration: number;
  morale: number;
  soldiers: number;
  barracksLevel: number;
  totalDefense: number;
  prosperity: number;
  perkTags: number;
  currentWeek: number;
  perks: TownGuardPerk[];
  characters: Character[];
  events: Event[];
  players: Player[];
  invites: PlayerInvite[];
};

export type PlayerInvite = {
  id: number;
  accepted_at: string;
  rejected_at: string;
  created_at: string;
  user: Player;
};

export type Player = {
  id: number;
  username: string;
};

export const RESOURCES = [
  "metal",
  "wood",
  "hide",
  "arrowvine",
  "axenut",
  "corpsecap",
  "flamefruit",
  "rockroot",
  "snowthistle",
];

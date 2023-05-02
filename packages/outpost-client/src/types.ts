export type Perk = {
  id: number;
  description: string;
  active: number;
  maxActive: number;
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

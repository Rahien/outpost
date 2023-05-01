export type Perk = {
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
};

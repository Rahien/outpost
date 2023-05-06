import Markdown from "markdown-to-jsx";
import { ResourceIcon } from "./resourceIcon";
import { RESOURCES } from "../types";
import { characterClasses } from "../characterStore";
import { ClassIcon } from "./characterIcon";

import any from "../assets/elements/fh-wild-color-icon.png";
import anyBw from "../assets/elements/fh-wild-bw-icon.png";
import air from "../assets/elements/fh-air-color-icon.png";
import airBw from "../assets/elements/fh-air-bw-icon.png";
import dark from "../assets/elements/fh-dark-color-icon.png";
import darkBw from "../assets/elements/fh-dark-bw-icon.png";
import earth from "../assets/elements/fh-earth-color-icon.png";
import earthBw from "../assets/elements/fh-earth-bw-icon.png";
import fire from "../assets/elements/fh-fire-color-icon.png";
import fireBw from "../assets/elements/fh-fire-bw-icon.png";
import ice from "../assets/elements/fh-ice-color-icon.png";
import iceBw from "../assets/elements/fh-ice-bw-icon.png";
import light from "../assets/elements/fh-light-color-icon.png";
import lightBw from "../assets/elements/fh-light-bw-icon.png";

import bane from "../assets/conditions/fh-bane-bw-icon.png";
import bless from "../assets/conditions/fh-bless-bw-icon.png";
import brittle from "../assets/conditions/fh-brittle-bw-icon.png";
import curse from "../assets/conditions/fh-curse-bw-icon.png";
import disarm from "../assets/conditions/fh-disarm-bw-icon.png";
import immobilize from "../assets/conditions/fh-immobilize-bw-icon.png";
import invisible from "../assets/conditions/fh-invisible-bw-icon.png";
import muddle from "../assets/conditions/fh-muddle-bw-icon.png";
import poison from "../assets/conditions/fh-poison-bw-icon.png";
import regenerate from "../assets/conditions/fh-regenerate-bw-icon.png";
import impair from "../assets/conditions/fh-impair-bw-icon.png";
import strengthen from "../assets/conditions/fh-strengthen-bw-icon.png";
import stun from "../assets/conditions/fh-stun-bw-icon.png";
import wound from "../assets/conditions/fh-wound-bw-icon.png";
import ward from "../assets/conditions/fh-ward-bw-icon.png";

import rolling from "../assets/conditions/fh-rolling-bw-icon.png";
import push from "../assets/conditions/fh-push-bw-icon.png";
import pull from "../assets/conditions/fh-pull-bw-icon.png";
import pierce from "../assets/conditions/fh-pierce-bw-icon.png";

import allyModifierCard from "../assets/general/fh-ally-modifier-card-bw-icon.png";
import attack from "../assets/general/fh-attack-bw-icon.png";
import battleGoalCheckMark from "../assets/general/fh-battle-goal-check-mark-bw-icon.png";
import buildingDowntime from "../assets/general/fh-building-downtime-bw-icon.png";
import buildingOperation from "../assets/general/fh-building-operation-bw-icon.png";
import buildingProsperity from "../assets/general/fh-building-prosperity-bw-icon.png";
import buildingRepair from "../assets/general/fh-building-repair-bw-icon.png";
import buildingUpgrade from "../assets/general/fh-building-upgrade-bw-icon.png";
import buildingWrecked from "../assets/general/fh-building-wrecked-bw-icon.png";
import damage from "../assets/general/fh-damage-bw-icon.png";
import equipSlotBody from "../assets/general/fh-equip-slot-body-bw-icon.png";
import equipSlotDualHand from "../assets/general/fh-equip-slot-dual-hand-bw-icon.png";
import equipSlotHead from "../assets/general/fh-equip-slot-head-bw-icon.png";
import equipSlotItem from "../assets/general/fh-equip-slot-item-bw-icon.png";
import equipSlotLegs from "../assets/general/fh-equip-slot-legs-bw-icon.png";
import equipSlotSingleHand from "../assets/general/fh-equip-slot-single-hand-bw-icon.png";
import flight from "../assets/general/fh-flight-bw-icon.png";
import flipBackToFront from "../assets/general/fh-flip-back-to-front-color-icon.png";
import flipBackToFrontGeneric from "../assets/general/fh-flip-back-to-front-generic-color-icon.png";
import flipFrontToBack from "../assets/general/fh-flip-front-to-back-color-icon.png";
import frosthavenIdentifier from "../assets/general/fh-frosthaven-identifier-bw-icon.png";
import heal from "../assets/general/fh-heal-bw-icon.png";
import hexAttack from "../assets/general/fh-hex-attack-color-icon.png";
import hexEmpty from "../assets/general/fh-hex-empty-color-icon.png";
import hexPlayer from "../assets/general/fh-hex-player-color-icon.png";
import hexSummon from "../assets/general/fh-hex-summon-color-icon.png";
import itemCard from "../assets/general/fh-item-card-bw-icon.png";
import jump from "../assets/general/fh-jump-bw-icon.png";
import levelCrown from "../assets/general/fh-level-crown-bw-icon.png";
import lockedOut from "../assets/general/fh-locked-out-color-icon.png";
import loot from "../assets/general/fh-loot-bw-icon.png";
import lostBlackCard from "../assets/general/fh-lost-black-card-color-icon.png";
import lost from "../assets/general/fh-lost-color-icon.png";
import money from "../assets/general/fh-money-bw-icon.png";
import move from "../assets/general/fh-move-bw-icon.png";
import nonReturnCard from "../assets/general/fh-non-return-card-color-icon.png";
import persistentBonus from "../assets/general/fh-persistent-bonus-color-icon.png";
import range from "../assets/general/fh-range-bw-icon.png";
import recoverCard from "../assets/general/fh-recover-card-color-icon.png";
import retaliate from "../assets/general/fh-retaliate-bw-icon.png";
import returnCard from "../assets/general/fh-return-card-bw-icon.png";
import roundBonus from "../assets/general/fh-round-bonus-color-icon.png";
import section from "../assets/general/fh-section-bw-icon.png";
import shield from "../assets/general/fh-shield-bw-icon.png";
import spent from "../assets/general/fh-spent-bw-icon.png";
import tapCard from "../assets/general/fh-tap-card-color-icon.png";
import target from "../assets/general/fh-target-bw-icon.png";
import teleport from "../assets/general/fh-teleport-bw-icon.png";
import trait from "../assets/general/fh-trait-bw-icon.png";
import treasureChest from "../assets/general/fh-treasure-chest-bw-icon.png";
import xp from "../assets/general/fh-xp-bw-icon.png";
import modPlus1 from "../assets/attack-modifiers/fh-plus-1-bw-icon.png";
import modPlus2 from "../assets/attack-modifiers/fh-plus-2-bw-icon.png";
import modPlus3 from "../assets/attack-modifiers/fh-plus-3-bw-icon.png";
import modPlus4 from "../assets/attack-modifiers/fh-plus-4-bw-icon.png";
import modPlus0 from "../assets/attack-modifiers/fh-plus-0-bw-icon.png";
import modMinus1 from "../assets/attack-modifiers/fh-minus-1-bw-icon.png";
import modMinus2 from "../assets/attack-modifiers/fh-minus-2-bw-icon.png";
import modTimes2 from "../assets/attack-modifiers/fh-2x-bw-icon.png";
import minus1ModCard from "../assets/attack-modifiers/fh-minus-1-modifier-card-bw-icon.png";

import fast from "../assets/class/fh-blinkblade-fast-bw-icon.png";
import slow from "../assets/class/fh-blinkblade-slow-bw-icon.png";
import time from "../assets/class/fh-blinkblade-time-bw-icon.png";
import tide from "../assets/class/fh-crashing-tide-tide-bw-icon.png";
import shadow from "../assets/class/fh-deathwalker-shadow-bw-icon.png";
import trophy from "../assets/class/fh-deepwraith-trophy-bw-icon.png";
import geminateMelee from "../assets/class/fh-geminate-melee-bw-icon.png";
import geminateRanged from "../assets/class/fh-geminate-ranged-bw-icon.png";
import hiveMode from "../assets/class/fh-hive-mode-bw-icon.png";
import hiveTransfer from "../assets/class/fh-hive-transfer-bw-icon.png";
import infusion from "../assets/class/fh-infuser-infusion-bw-icon.png";
import pressureLow from "../assets/class/fh-metal-mosaic-1-pressure-low-bw-icon.png";
import pressureRegular from "../assets/class/fh-metal-mosaic-2-pressure-regular-bw-icon.png";
import pressureHigh from "../assets/class/fh-metal-mosaic-3-pressure-high-bw-icon.png";
import pressureOver from "../assets/class/fh-metal-mosaic-4-pressure-over-bw-icon.png";
import pressure from "../assets/class/fh-metal-mosaic-pressure-bw-icon.png";
import pressureDown from "../assets/class/fh-metal-mosaic-pressure-down-bw-icon.png";
import pressureUp from "../assets/class/fh-metal-mosaic-pressure-up-bw-icon.png";
import resonance from "../assets/class/fh-shattersong-resonance-bw-icon.png";

import { imageSize } from "../tokens";
import React from "react";

const icons: Record<string, string | React.ReactElement> = {
  any,
  anyBw,
  air,
  airBw,
  dark,
  darkBw,
  earth,
  earthBw,
  fire,
  fireBw,
  ice,
  iceBw,
  light,
  lightBw,

  bane,
  bless,

  brittle,
  curse,
  disarm,
  immobilize,
  invisible,
  muddle,
  poison,
  regenerate,
  impair,
  strengthen,
  stun,
  wound,
  ward,
  rolling,
  push,
  pull,
  pierce,
  allyModifierCard,
  attack,
  battleGoalCheckMark,
  buildingDowntime,
  buildingOperation,
  buildingProsperity,
  buildingRepair,
  buildingUpgrade,
  buildingWrecked,
  damage,
  equipSlotBody,
  equipSlotDualHand,
  equipSlotHead,
  equipSlotItem,
  equipSlotLegs,
  equipSlotSingleHand,
  flight,
  flipBackToFront,
  flipBackToFrontGeneric,
  flipFrontToBack,
  frosthavenIdentifier,
  heal,
  hexAttack,
  hexEmpty,
  hexPlayer,
  hexSummon,
  itemCard,
  jump,
  levelCrown,
  lockedOut,
  loot,
  lostBlackCard,
  lost,
  money,
  move,
  nonReturnCard,
  persistentBonus,
  range,
  recoverCard,
  retaliate,
  returnCard,
  roundBonus,
  section,
  shield,
  spent,
  tapCard,
  target,
  teleport,
  trait,
  treasureChest,
  xp,
  modPlus1,
  modPlus2,
  modPlus3,
  modPlus4,
  modPlus0,
  modMinus1,
  modMinus2,
  modTimes2,
  minus1ModCard,
  fast,
  slow,
  time,
  tide,
  shadow,
  trophy,
  geminateMelee,
  geminateRanged,
  hiveMode,
  hiveTransfer,
  infusion,
  pressureLow,
  pressureRegular,
  pressureHigh,
  pressureOver,
  pressure,
  pressureDown,
  pressureUp,
  resonance,
};

const components: Record<string, React.ComponentType> = {};

RESOURCES.forEach((resource) => {
  components[resource] = () => {
    return <ResourceIcon resource={resource} inline size="tiny" />;
  };
});

Object.keys(characterClasses).forEach((characterClass) => {
  components[characterClass] = () => {
    return (
      <ClassIcon
        charClass={characterClasses[characterClass]}
        inline
        size="tiny"
      />
    );
  };
});

Object.keys(icons).forEach((icon) => {
  components[icon] = () => {
    if (typeof icons[icon] === "string") {
      return (
        <img
          src={icons[icon] as string}
          alt={icon}
          css={{
            height: imageSize.tiny,
            verticalAlign: "middle",
            width: imageSize.tiny,
            objectFit: "contain",
          }}
        />
      );
    }
    return icons[icon] as React.ReactElement;
  };
});

const consumeIcon = (icon: string) => {
  if (typeof icons[icon] !== "string") return <></>;
  return (
    <div
      css={{ position: "relative", display: "inline-block" }}
      aria-label={`consume${icon}`}
    >
      <img
        src={icons[icon] as any}
        css={{
          height: imageSize.tiny,
          verticalAlign: "middle",
          width: imageSize.tiny,
          objectFit: "contain",
        }}
      />
      <img
        src={lost}
        css={{
          height: 6,
          verticalAlign: "middle",
          width: 6,
          objectFit: "contain",
          position: "absolute",
          bottom: -2,
          right: -2,
          background: "black",
          borderRadius: "50%",
          padding: 2,
          filter: "grayscale(100%) brightness(2) ",
        }}
      />
    </div>
  );
};

const overrides: Record<string, { component: React.ComponentType }> = {};
Object.keys(components).forEach((key) => {
  overrides[key] = { component: components[key] };
});

["any", "dark", "earth", "fire", "ice", "light", "air"].forEach((element) => {
  overrides[`consume${element[0].toUpperCase()}${element.substring(1)}`] = {
    component: () => consumeIcon(element),
  };
});

export const CustomMarkdown = ({ children }: { children: string }) => {
  return (
    <Markdown
      options={{
        overrides,
        createElement(type, props, children) {
          return React.createElement(type, props, children);
        },
      }}
    >
      {children}
    </Markdown>
  );
};

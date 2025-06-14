import { Card } from "./card";
import { Title } from "./Title";
import sledIcon from "../assets/outpost/fh-sled-bw-icon.png";
import climbingIcon from "../assets/outpost/fh-climbing-gear-bw-icon.png";
import boatIcon from "../assets/outpost/fh-boat-bw-icon.png";
import { Fragment } from "react";

export type ScenarioType = {
  id: number;
  number: string;
  name: string;
  icons?: string[];
  followsUps?: ScenarioType[];
  origins?: ScenarioType[];
};

export function Scenarios() {
  const activeScenarios: ScenarioType[] = [
    {
      id: 1,
      number: "123",
      name: "Scenario One",
      followsUps: [{ id: 2, number: "124", name: "Follow Up One" }],
    },
    {
      id: 2,
      number: "124",
      name: "Scenario Two",
      followsUps: [],
      icons: ["boat"],
    },
    {
      id: 3,
      number: "125",
      name: "Scenario Three",
      icons: ["calendar", "boss", "climbing", "boat"],
      followsUps: [
        { id: 4, number: "126", name: "Follow Up Two" },
        { id: 5, number: "127", name: "Follow Up Three" },
      ],
      origins: [{ id: 1, number: "123", name: "Scenario One" }],
    },
  ];

  return (
    <Card css={{ width: "100%" }}>
      <Title css={{ marginBottom: "0.5em" }} title="Available scenarios:" />
      {activeScenarios.map((scenario) => (
        <Scenario key={scenario.id} scenario={scenario} />
      ))}
    </Card>
  );
}

export function Scenario({
  scenario,
  muted,
}: {
  scenario: ScenarioType;
  muted?: boolean;
}) {
  const origins = scenario.origins || [];
  const followsUps = scenario.followsUps || [];
  const transports = (scenario.icons || [])
    .filter((icon) => ["boat", "sled", "climbing"].includes(icon))
    .map((icon, index) => {
      if (icon === "boat") return <img key={index} src={boatIcon} />;
      if (icon === "sled") return <img key={index} src={sledIcon} />;
      if (icon === "climbing") return <img key={index} src={climbingIcon} />;
      return null;
    });
  const otherIcons = (scenario.icons || [])
    .map((icon, index) => {
      if (icon === "calendar") {
        return <img key={index} src={sledIcon} />; // todo missing icon
      }
      return null;
    })
    .filter((icon) => !!icon);
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "8px",
        opacity: muted ? 0.7 : 1,
      }}
    >
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "2px",
          transform: "scale(0.66)",
        }}
      >
        {origins.map((origin, index) => {
          return (
            <Fragment key={origin.id}>
              {index > 0 ? <span>/</span> : null}
              <Scenario scenario={origin} muted />
            </Fragment>
          );
        })}
      </div>
      <Card
        css={{ width: "auto" }}
        coreCss={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "4px",
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "4px",
            img: {
              width: "16px",
              height: "16px",
            },
          }}
        >
          {transports}
        </div>
        <div css={{ paddingRight: "4px", fontSize: "1.3em" }}>
          {scenario.number}
        </div>
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "4px",
            img: {
              width: "16px",
              height: "16px",
            },
          }}
        >
          {otherIcons}
        </div>
      </Card>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "2px",
          transform: "scale(0.66)",
        }}
      >
        {followsUps.map((followUp, index) => {
          return (
            <Fragment key={followUp.id}>
              {index > 0 ? <span>/</span> : null}
              <Scenario scenario={followUp} muted />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

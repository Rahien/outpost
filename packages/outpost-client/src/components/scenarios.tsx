import { Card } from "./card";
import { Title } from "./Title";
import sledIcon from "../assets/outpost/fh-sled-bw-icon.png";
import climbingIcon from "../assets/outpost/fh-climbing-gear-bw-icon.png";
import boatIcon from "../assets/outpost/fh-boat-bw-icon.png";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Scenario as ScenarioType } from "../types";
import { useCampaignStore } from "../campaignStore";
import { Button } from "./button";
import { Dialog, TextField } from "@mui/material";
import { spacing } from "../tokens";
import { ThemeContext } from "./themeProvider";
import {
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
} from "@mui/icons-material";

export function Scenarios() {
  const { fetchScenarioList, scenarioList, campaign } = useCampaignStore(
    ({ fetchScenarioList, scenarioList, campaign }) => ({
      fetchScenarioList,
      scenarioList,
      campaign,
    })
  );
  useEffect(() => {
    if (!campaign?.id) return;
    fetchScenarioList(campaign.id);
  }, [fetchScenarioList, campaign]);
  const [updatingScenario, setAddingScenario] = useState(false);
  const activeScenarios = useMemo(() => {
    if (!scenarioList) return [];
    return scenarioList
      .filter((scenario) => scenario.status === "active")
      .sort((a, b) => {
        if (a.id === b.id) return 0;
        return a.id < b.id ? -1 : 1;
      });
  }, [scenarioList]);
  if (!scenarioList) return null;
  return (
    <Card css={{ width: "100%" }}>
      <Title css={{ marginBottom: "0.5em" }} title="Available scenarios:" />
      {activeScenarios.length > 0 ? (
        activeScenarios.map((scenario) => (
          <Scenario key={scenario.id} scenario={scenario} />
        ))
      ) : (
        <div>No available scenarios yet... Add one below!</div>
      )}
      <Button
        onClick={() => setAddingScenario(true)}
        css={{ marginTop: "1em" }}
      >
        <Title title="Unlock Scenario" />
      </Button>
      {updatingScenario ? (
        <MarkScenarioStateModal onClose={() => setAddingScenario(false)} />
      ) : null}
    </Card>
  );
}

export function MarkScenarioStateModal({
  onClose,
  initialScenario,
}: {
  onClose: () => void;
  initialScenario?: string;
}) {
  const [scenarioNumber, setScenarioNumber] = useState(initialScenario || "1");
  const [status, setStatus] = useState("active");
  const { color } = useContext(ThemeContext);
  const { updateScenario, campaign } = useCampaignStore(
    ({ updateScenario, campaign }) => ({
      updateScenario,
      campaign,
    })
  );
  const statusOptions = [
    { label: "Available", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Locked", value: "locked" },
    { label: "Removed", value: "removed" },
  ];
  return (
    <Dialog open={true} onClose={onClose}>
      <div
        css={{
          padding: spacing.tiny,
          width: "100%",
          boxSizing: "border-box",
          paddingBottom: 0,
        }}
      >
        <Card>
          <div css={{ button: { width: 90 } }}>
            <Title
              title={
                initialScenario
                  ? `Update Scenario ${initialScenario}`
                  : "Unlock Scenario"
              }
              css={{ fontSize: 30, marginBottom: spacing.medium }}
            />
            {initialScenario ? (
              <div>
                {statusOptions.map((option) => (
                  <div
                    onClick={() => setStatus(option.value)}
                    key={option.value}
                    css={{
                      display: "flex",
                      padding: spacing.medium,
                      paddingTop: 0,
                      paddingLeft: 0,
                      alignItems: "center",
                    }}
                  >
                    {status == option.value ? (
                      <CheckBoxOutlined />
                    ) : (
                      <CheckBoxOutlineBlankOutlined />
                    )}
                    <div css={{ fontSize: 16, marginLeft: spacing.small }}>
                      {option.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {initialScenario ? null : (
              <>
                <Title title="Scenario number:" />
                <TextField
                  type="number"
                  css={{
                    border: "none",
                    borderBottom: `solid 2px ${color}`,
                    marginTop: spacing.tiny,
                    paddingLeft: 28,
                    marginBottom: spacing.medium,
                    input: {
                      padding: 0,
                      fontSize: 18,
                      fontWeight: "bold",
                      fontFamily: "PirataOne-Gloomhaven",
                    },
                    fieldset: {
                      border: "none",
                      outline: "none",
                    },
                  }}
                  value={scenarioNumber}
                  onChange={(e) => setScenarioNumber(e.target.value)}
                />
              </>
            )}
          </div>
          <div css={{ width: "100%", display: "flex", gap: spacing.tiny }}>
            <Button
              onClick={() => {
                if (!campaign?.id) return;
                const number = parseInt(scenarioNumber, 10);
                if (isNaN(number) || number < 1 || number > 137) {
                  return;
                }
                updateScenario(campaign.id, scenarioNumber.toString(), status);
                onClose();
              }}
            >
              {initialScenario ? "Update Scenario" : "Unlock"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </Card>
      </div>
    </Dialog>
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
  const links = scenario.links || [];
  const [editingScenario, setEditingScenario] = useState(false);
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
    <>
      {editingScenario ? (
        <MarkScenarioStateModal
          onClose={() => setEditingScenario(false)}
          initialScenario={scenario.number}
        />
      ) : null}
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          opacity: muted ? 0.7 : 1,
          overflowX: muted ? undefined : "auto",
        }}
        onClick={() => {
          if (muted) {
            return;
          }
          setEditingScenario(true);
        }}
      >
        {!muted && origins.length > 0 && (
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "2px",
              transform: "scale(0.66)",
              marginLeft: `-${5 * origins.length}px`,
              marginRight: `-${5 * origins.length}px`,
            }}
          >
            {origins.map((origin, index) => {
              return (
                <Fragment key={origin.number}>
                  {index > 0 ? <span>/</span> : null}
                  <Scenario scenario={origin} muted />
                </Fragment>
              );
            })}
          </div>
        )}
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
        {!muted && links.length > 0 && (
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "2px",
              transform: "scale(0.66)",
              marginLeft: `-${5 * links.length}px`,
              marginRight: `-${5 * links.length}px`,
            }}
          >
            {links.map((followUp, index) => {
              return (
                <Fragment key={followUp.number}>
                  {index > 0 ? <span>/</span> : null}
                  <Scenario scenario={followUp} muted />
                </Fragment>
              );
            })}
          </div>
        )}

        {muted ? null : (
          <div>
            ({scenario.step || 1}/{scenario.length || 1})
          </div>
        )}
      </div>
    </>
  );
}

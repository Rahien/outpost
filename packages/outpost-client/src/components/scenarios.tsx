import { Card } from "./card";
import { Title } from "./Title";
import sledIcon from "../assets/outpost/fh-sled-bw-icon.png";
import bossIcon from "../assets/outpost/fh-skull-bw-icon.png";
import climbingIcon from "../assets/outpost/fh-climbing-gear-bw-icon.png";
import boatIcon from "../assets/outpost/fh-boat-bw-icon.png";
import { useContext, useEffect, useMemo, useState } from "react";
import { Scenario as ScenarioType } from "../types";
import { useCampaignStore } from "../campaignStore";
import { Button } from "./button";
import { Dialog, TextField } from "@mui/material";
import { spacing, colors } from "../tokens";
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
  initialScenario?: ScenarioType;
}) {
  const [scenarioNumber, setScenarioNumber] = useState(
    initialScenario?.number || "1"
  );
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
                  ? `Update Scenario ${initialScenario.number}`
                  : "Unlock Scenario"
              }
              css={{ fontSize: 30, marginBottom: spacing.medium }}
            />
            {initialScenario ? (
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.small,
                  justifyContent: "space-between",
                  marginBottom: spacing.medium,
                }}
              >
                <Title
                  title={initialScenario.name}
                  css={{
                    fontSize: 24,
                    marginBottom: 0,
                  }}
                />
                <div css={{ fontSize: 16 }}>
                  ({initialScenario.step} / {initialScenario.length})
                </div>
              </div>
            ) : null}
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

function ScenarioSteps({
  scenario,
  done,
}: {
  scenario: ScenarioType;
  done: boolean;
}) {
  const steps = done
    ? new Array((scenario.step || 1) - 1).fill(1)
    : new Array((scenario.length || 1) - (scenario.step || 1)).fill(1);
  if (steps.length === 0) {
    return null;
  }
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "2px",
      }}
    >
      {steps.map((_, index) => {
        return (
          <div
            key={index}
            css={{
              border: `solid 2px ${colors.black}`,
              width: "0.5em",
              height: "0.5em",
              padding: "2px",
              transformOrigin: "center",
              transform: "rotate(45deg) scale(0.7)",
            }}
          >
            {done ? (
              <div
                css={{
                  width: "100%",
                  height: "100%",
                  background: colors.black,
                }}
              ></div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function Scenario({ scenario }: { scenario: ScenarioType }) {
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
      if (icon === "boss") {
        return <img key={index} src={bossIcon} />;
      }
      return null;
    })
    .filter((icon) => !!icon);
  return (
    <>
      {editingScenario ? (
        <MarkScenarioStateModal
          onClose={() => setEditingScenario(false)}
          initialScenario={scenario}
        />
      ) : null}
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          overflowX: "auto",
          marginBottom: "8px",
        }}
        onClick={() => {
          setEditingScenario(true);
        }}
      >
        <ScenarioSteps scenario={scenario} done={true} />
        <Card
          css={{ width: "auto", marginBottom: "0 !important" }}
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
            {scenario.number}: {scenario.name}
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
        <ScenarioSteps scenario={scenario} done={false} />
      </div>
    </>
  );
}

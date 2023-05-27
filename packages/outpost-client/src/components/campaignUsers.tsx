import { useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { Title } from "./Title";
import { Button } from "./button";
import { Card } from "./card";
import { Dialog, TextField } from "@mui/material";
import { imageSize, spacing } from "../tokens";

import { PlayerInvite } from "../types";
import strengthenIcon from "../assets/conditions/fh-strengthen-bw-icon.png";
import muddleIcon from "../assets/conditions/fh-muddle-bw-icon.png";
import poisonIcon from "../assets/conditions/fh-poison-bw-icon.png";
import { HorizontalLine } from "./horizontalLine";

const InviteDialog = ({ onClose }: { onClose: () => void }) => {
  const { invitePlayer, campaign } = useCampaignStore(
    ({ invitePlayer, campaign }) => ({
      invitePlayer,
      campaign,
    })
  );
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const invite = async () => {
    if (!campaign?.id) return;
    setErrorMessage("");
    try {
      await invitePlayer(campaign.id, username);
      onClose();
    } catch (e: any) {
      if (e?.response?.status === 400) {
        setErrorMessage("Invalid username");
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <div css={{ padding: spacing.small, paddingBottom: 0 }}>
        <Card>
          <div css={{ padding: spacing.small }}>
            <Title title="Invite Player" />
            <p>To invite a player, enter their username below.</p>
            <TextField
              value={username}
              css={{ width: "100%" }}
              label="Username"
              autoFocus
              onChange={(e) => setUsername(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  invite();
                }
              }}
            />
            {errorMessage && (
              <div css={{ marginTop: spacing.medium, color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
          <div
            css={{
              marginTop: spacing.medium,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={invite}>Invite</Button>
            <Button onClick={onClose} css={{ marginLeft: spacing.small }}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

export const DeleteUserDialog = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { campaign, removePlayer, removeInvite } = useCampaignStore(
    ({ campaign, removePlayer, removeInvite }) => ({
      campaign,
      removePlayer,
      removeInvite,
    })
  );
  const onDelete = () => {
    if (!name || !campaign) {
      return;
    }
    const targetInvite = campaign.invites.find(
      (invite) => invite.user.username === name
    );
    const targetPlayer = campaign.players.find(
      (player) => player.username === name
    );

    if (targetInvite) {
      removeInvite(campaign.id, targetInvite.id);
      onClose();
    }
    if (targetPlayer) {
      if (campaign.players.length === 1) {
        setErrorMessage("You cannot delete the last player in a campaign.");
        return;
      }
      removePlayer(campaign.id, targetPlayer.id);
      onClose();
    }
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <div css={{ padding: spacing.small, paddingBottom: 0 }}>
        <Card>
          <div css={{ padding: spacing.small }}>
            <Title title="Are you sure?" />
            <p>
              To remove a player or invite, type the player's username below:
            </p>
            <TextField
              value={name}
              autoFocus
              css={{ width: "100%" }}
              label="Name To Delete"
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <div css={{ marginTop: spacing.medium, color: "red" }}>
              {errorMessage}
            </div>
            <div
              css={{
                marginTop: spacing.medium,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                color="#800000"
                disabled={name != name}
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button css={{ marginLeft: spacing.small }} onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

const Player = ({
  username,
  invite,
}: {
  username: string;
  invite?: PlayerInvite;
}) => {
  let icon = strengthenIcon;
  if (invite && invite.rejected_at) {
    icon = poisonIcon;
  } else if (invite) {
    icon = muddleIcon;
  }
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
      }}
    >
      <div>{username}</div>
      <img src={icon} css={{ width: imageSize.tiny }} />
    </div>
  );
};

export const CampaignUsers = () => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState(false);
  if (!campaign) return null;
  return (
    <Card>
      <Title title="Players" css={{ textAlign: "center", display: "block" }} />
      <HorizontalLine upwards />
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          marginTop: spacing.small,
        }}
      >
        {campaign.players.map((player) => (
          <Player key={player.id} username={player.username} />
        ))}
        {campaign.invites
          .filter((invite) => !invite.accepted_at)
          .map((invite) => (
            <Player
              key={invite.id}
              username={invite.user.username}
              invite={invite}
            />
          ))}
      </div>
      <div
        css={{ display: "flex", gap: spacing.small, marginTop: spacing.small }}
      >
        <Button onClick={() => setInviting(true)}>Invite</Button>
        <Button color="#800000" onClick={() => setRemoving(true)}>
          Remove
        </Button>
      </div>
      {inviting && <InviteDialog onClose={() => setInviting(false)} />}
      {removing && <DeleteUserDialog onClose={() => setRemoving(false)} />}
    </Card>
  );
};

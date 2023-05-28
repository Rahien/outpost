import { useEffect, useState } from "react";
import { Campaign, Player } from "../types";
import axios from "axios";
import { Dialog } from "@mui/material";
import { Card } from "./card";
import { spacing } from "../tokens";
import { Title } from "./Title";
import { Button } from "./button";
import { HorizontalLine } from "./horizontalLine";
import perksIcon from "../assets/general/fh-battle-goal-check-mark-bw-icon.png";
import loseIcon from "../assets/general/fh-lost-color-icon.png";

const API_URL = import.meta.env.VITE_API_URL;

type CampaignInvite = {
  id: string;
  campaign: Campaign;
  invitedBy: Player;
  createdAt: string;
};

const InviteItem = ({
  invite,
  onHandleInvite,
}: {
  invite: CampaignInvite;
  onHandleInvite: (invite: CampaignInvite) => void;
}) => {
  const acceptInvite = () => {
    axios
      .patch(
        `${API_URL}/campaigns/${invite.campaign.id}/invites/${invite.id}`,
        {
          acceptedAt: new Date(),
        }
      )
      .then(() => {
        onHandleInvite(invite);
      });
  };
  const rejectInvite = () => {
    axios
      .patch(
        `${API_URL}/campaigns/${invite.campaign.id}/invites/${invite.id}`,
        {
          rejectedAt: new Date(),
        }
      )
      .then(() => {
        onHandleInvite(invite);
      });
  };
  return (
    <div css={{ padding: `${spacing.small} 0` }}>
      <Title title={invite.campaign.name} css={{ fontSize: 18 }} />
      <div css={{ fontSize: 10 }}>Invited by {invite.invitedBy.username}</div>
      <div
        css={{
          marginTop: spacing.tiny,
          display: "flex",
          alignItems: "center",
          gap: spacing.small,
          justifyContent: "space-between",
          "> div": {
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: spacing.small,
            span: {
              fontSize: 14,
            },
          },
        }}
      >
        <div onClick={acceptInvite}>
          <img src={perksIcon} css={{ width: 16 }} />
          <Title title="Accept" />
        </div>
        <div
          onClick={rejectInvite}
          css={{ color: "#e06666", justifyContent: "flex-end" }}
        >
          <img src={loseIcon} css={{ width: 16 }} />
          <Title title="Decline" />
        </div>
      </div>
    </div>
  );
};

export const CampaignInvites = () => {
  const [campaignInvites, setCampaignInvites] = useState<CampaignInvite[]>([]);
  const [open, setOpen] = useState(true);
  const fetchInvites = () => {
    axios.get(`${API_URL}/campaigns/invites`).then((response) => {
      setCampaignInvites(response.data);
    });
  };
  useEffect(() => {
    fetchInvites();
    const interval = setInterval(() => {
      fetchInvites();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setOpen(true);
      }, 10 * 60 * 1000);
      return () => clearTimeout(timeout);
    }
    return () => "void";
  }, [open]);

  const onHandleInvite = (invite: CampaignInvite) => {
    setCampaignInvites((invites) => invites.filter((i) => i.id !== invite.id));
  };

  if (campaignInvites.length === 0) {
    return null;
  }
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div
        css={{
          padding: spacing.small,
          paddingBottom: 0,
          width: "90vw",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Card>
          <div css={{ padding: spacing.small }}>
            <Title
              css={{
                display: "block",
                textAlign: "center",
                marginBottom: spacing.tiny,
              }}
              title={`You've been invited to join ${
                campaignInvites.length > 1 ? "some" : "a"
              } campaign${campaignInvites.length > 1 ? "s" : ""}!`}
            />
            <HorizontalLine upwards />
            <div
              css={{
                maxHeight: "60vh",
                overflow: "auto",
                marginTop: spacing.small,
                marginBottom: spacing.small,
              }}
            >
              {campaignInvites.map((invite) => (
                <InviteItem
                  key={invite.id}
                  invite={invite}
                  onHandleInvite={onHandleInvite}
                />
              ))}
            </div>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

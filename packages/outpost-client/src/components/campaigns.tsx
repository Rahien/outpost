import { useEffect } from "react";
import { defaultCampaign, useCampaignStore } from "../campaignStore";
import { Title } from "./Title";
import { Card } from "./card";
import { Navigation } from "./navigation";
import { spacing } from "../tokens";
import { Button } from "./button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Campaigns = () => {
  const { campaignList, fetchCampaignList, setCampaign } = useCampaignStore(
    ({ campaignList, fetchCampaignList, setCampaign }) => ({
      campaignList,
      fetchCampaignList,
      setCampaign,
    })
  );
  const navigate = useNavigate();
  useEffect(() => {
    setCampaign(null);
    fetchCampaignList();
  }, []);
  const createNewCampaign = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/campaigns/`,
      defaultCampaign
    );
    navigate(`/campaigns/${data.id}`);
  };

  return (
    <>
      <Navigation />
      <div
        css={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {campaignList.length === 0 && <Title title="No characters yet..." />}
        {campaignList.map((campaign) => (
          <Card
            key={campaign.id}
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <Title title={campaign.name} />
          </Card>
        ))}
      </div>
      <div
        css={{
          marginTop: spacing.medium,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => navigate("/logout")} color="#800000">
          Log out
        </Button>
        <Button
          onClick={() => createNewCampaign()}
          css={{ marginLeft: spacing.small }}
        >
          Create New
        </Button>
      </div>
    </>
  );
};

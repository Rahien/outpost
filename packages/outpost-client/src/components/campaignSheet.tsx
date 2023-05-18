import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./button";
import { VerifyDeleteDialog } from "./verifyDeleteDialog";
import { useContext, useEffect, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { spacing } from "../tokens";
import { Card } from "./card";
import { Title } from "./Title";
import { CampaignResourceField } from "./resourceField";
import { ThemeContext } from "./themeProvider";
import { VerticalSeparator } from "./verticalSeparator";

const HorizontalDivider = () => {
  const { color } = useContext(ThemeContext);
  return (
    <div css={{ gridColumn: "span 3", borderTop: `solid 1px ${color}` }}></div>
  );
};

const CampaignResources = () => {
  const { color } = useContext(ThemeContext);
  return (
    <Card css={{ width: "100%" }}>
      <Title title="Resources:" />
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: spacing.tiny,
          "> *:nth-of-type(4n+1)": {
            "> div": {
              borderRight: `solid 1px ${color}`,
            },
          },
          "> *:nth-of-type(4n+3)": {
            "> div": {
              borderLeft: `solid 1px ${color}`,
              img: {
                marginLeft: spacing.tiny,
              },
            },
          },
        }}
      >
        <CampaignResourceField resource="wood" />
        <CampaignResourceField resource="metal" />
        <CampaignResourceField resource="hide" />
        <HorizontalDivider />
        <CampaignResourceField resource="arrowvine" />
        <CampaignResourceField resource="axenut" />
        <CampaignResourceField resource="corpsecap" />
        <HorizontalDivider />
        <CampaignResourceField resource="flamefruit" />
        <CampaignResourceField resource="rockroot" />
        <CampaignResourceField resource="snowthistle" />
      </div>
    </Card>
  );
};

export const CampaignSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const { campaign, fetchCampaign, deleteCampaign } = useCampaignStore(
    ({ campaign, fetchCampaign, deleteCampaign }) => ({
      campaign,
      fetchCampaign,
      deleteCampaign,
    })
  );
  useEffect(() => {
    if (!id || campaign?.id === parseInt(id)) return;
    fetchCampaign(id);
  }, [fetchCampaign, id]);

  const handleDelete = async () => {
    if (!campaign?.id) {
      return;
    }
    await deleteCampaign(campaign?.id);
    navigate("/campaigns");
  };

  if (!campaign) return null; // TODO: show loading
  return (
    <>
      <div>campaign sheet for {campaign.name}</div>
      <CampaignResources />
      <Card
        coreCss={{
          display: "grid",
          gridTemplateColumns: "1fr 24px 1fr",
          gap: spacing.tiny,
          width: "100%",
        }}
      >
        <CampaignResourceField
          resource="inspiration"
          title={<Title title="Inspiration:" />}
        />
        <VerticalSeparator />
        <CampaignResourceField
          resource="totalDefense"
          title={<Title title="Total Defense:" />}
        />
      </Card>
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: spacing.large,
        }}
      >
        <Button
          css={{ flexGrow: 1, marginRight: spacing.small }}
          onClick={() => navigate("/campaigns")}
        >
          Back
        </Button>
        <Button color="#800000" onClick={() => setDeleting(true)}>
          Delete Campaign
        </Button>
      </div>

      {deleting && (
        <VerifyDeleteDialog
          name={campaign.name}
          type={"campaign"}
          onDelete={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
};

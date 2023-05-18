import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./button";
import { VerifyDeleteDialog } from "./verifyDeleteDialog";
import { useEffect, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { spacing } from "../tokens";

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

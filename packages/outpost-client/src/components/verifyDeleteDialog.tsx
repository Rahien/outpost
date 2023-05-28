import { Dialog, TextField } from "@mui/material";
import { Card } from "./card";
import { spacing } from "../tokens";
import { Title } from "./Title";
import { useState } from "react";
import { Button } from "./button";

export const VerifyDeleteDialog = ({
  name,
  onDelete,
  onClose,
  type,
}: {
  type: string;
  name: string;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const [verifyName, setVerifyName] = useState<string>("");
  return (
    <Dialog open={true} onClose={onClose}>
      <div css={{ padding: spacing.small, paddingBottom: 0 }}>
        <Card>
          <Title title="Are you sure?" />
          <p>
            To delete the {type}, type the {type} name "{name}" below:
          </p>
          <TextField
            value={verifyName}
            css={{ width: "100%" }}
            label={`${type[0].toUpperCase()}${type.substring(
              1
            )} Name To Delete`}
            onChange={(e) => setVerifyName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && verifyName === name) {
                onDelete();
              }
            }}
          />
          <div
            css={{
              marginTop: spacing.medium,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              color="#800000"
              disabled={verifyName != name}
              onClick={onDelete}
            >
              Delete
            </Button>
            <Button css={{ marginLeft: spacing.small }} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

import { useEffect, useMemo, useState } from "react";
import { spacing } from "../tokens";
import { Title } from "./Title";
import { Card } from "./card";
import { useLocation, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"characters" | "campaigns" | null>(
    null
  );
  const location = useLocation();

  const selectedBasedOnLocation = useMemo(() => {
    if (selected) {
      return selected;
    }
    if (location.pathname.startsWith("/campaigns")) {
      return "campaigns";
    }
    return "characters";
  }, [location.pathname]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    if (selected === "campaigns") {
      navigate("/campaigns");
    } else {
      navigate("/characters");
    }
  }, [selected]);

  return (
    <div
      css={{
        display: "flex",
        width: "100%",
        "> *": {
          flexGrow: 0,
          width: "fit-content",
          marginRight: spacing.medium,
          cursor: "pointer",
          padding: spacing.tiny,
        },
        "> *.selected": {
          filter: "invert(90%)",
        },
        "> *:first-of-type": {
          marginLeft: `-${spacing.tiny}`,
          paddingRight: spacing.small,
          "&.selected": {
            marginLeft: 0,
            paddingRight: spacing.tiny,
          },
        },
      }}
    >
      <Card
        onClick={() => setSelected("characters")}
        cardClass={
          selectedBasedOnLocation === "characters" ? "selected" : undefined
        }
      >
        <Title title="Characters" />
      </Card>
      <Card
        onClick={() => setSelected("campaigns")}
        cardClass={
          selectedBasedOnLocation === "campaigns" ? "selected" : undefined
        }
      >
        <Title title="Campaigns" />
      </Card>
    </div>
  );
};

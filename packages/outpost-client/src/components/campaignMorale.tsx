import { useMemo, useState } from "react";
import { useCampaignStore } from "../campaignStore";
import { Title } from "./Title";
import { Card } from "./card";
import { CampaignResourceField } from "./resourceField";
import { VerticalSeparator } from "./verticalSeparator";

import sectionIcon from "../assets/general/fh-section-bw-icon.png";
import { imageSize } from "../tokens";

const moraleDefense = [
  { morale: 0, defense: -10 },
  { morale: 3, defense: -5 },
  { morale: 5, defense: 0 },
  { morale: 8, defense: 5 },
  { morale: 11, defense: 10 },
  { morale: 14, defense: 15 },
];

export const CampaignMorale = () => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const [edit, setEdit] = useState(false);
  const computedDefense = useMemo(() => {
    const m = campaign?.morale ?? 0;
    let currentIndex = 0;
    while (
      moraleDefense[currentIndex + 1] &&
      moraleDefense[currentIndex + 1].morale <= m
    ) {
      currentIndex++;
    }
    return moraleDefense[currentIndex].defense;
  }, [campaign]);

  const section = useMemo(() => {
    const m = campaign?.morale ?? 0;
    if (m === 0) {
      return "126.1";
    }
    if (m > 19) {
      return "161.3";
    }
  }, [campaign]);

  return (
    <Card coreCss={{ display: "flex" }}>
      <div css={{ flex: 1 }}>
        <CampaignResourceField
          resource="morale"
          edit={edit}
          setEdit={setEdit}
          title={<Title title="Morale:" />}
        />
      </div>
      <VerticalSeparator />
      <div
        css={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={() => setEdit(true)}
      >
        <Title title="Defense:" />
        {section && (
          <Title
            css={{ fontSize: 12, position: "absolute", bottom: 2, right: 2 }}
            title={section}
            icon={<img src={sectionIcon} css={{ width: 12 }} />}
          />
        )}
        <Title
          title={
            computedDefense > 0 ? `+${computedDefense}` : `${computedDefense}`
          }
          css={{
            flexGrow: 1,
            width: "100%",
            textAlign: "center",
            span: {
              width: "100%",
              textAlign: "center",
              display: "block",
            },
          }}
        />
      </div>
    </Card>
  );
};

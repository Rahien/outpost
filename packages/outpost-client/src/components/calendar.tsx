import summerIcon from "../assets/general/fh-building-operation-bw-icon.png";
import winterIcon from "../assets/general/fh-frosthaven-identifier-bw-icon.png";
import { imageSize, spacing } from "../tokens";
import { ThemeContext } from "./themeProvider";
import { useContext, useState } from "react";
import sectionIcon from "../assets/general/fh-section-bw-icon.png";
import lostIcon from "../assets/general/fh-lost-color-icon.png";
import { useCampaignStore } from "../campaignStore";
import { Title } from "./Title";
import { NumberValueInput } from "./numberValueInput";
import { Button } from "./button";
import { Card } from "./card";

const calendarDayHeight = 45;

const CalendarEvent = ({
  section,
  detailed,
}: {
  section: string;
  detailed?: boolean;
}) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        fontSize: detailed ? 14 : 10,
        lineHeight: "12px",
        marginBottom: 2,
        padding: detailed ? spacing.medium : 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <img
        src={sectionIcon}
        css={{ width: detailed ? 14 : 8, marginRight: spacing.tiny }}
      />
      <div>{section}</div>
    </div>
  );
};

const Season = ({ startingWeek }: { startingWeek: number }) => {
  const { campaign } = useCampaignStore(({ campaign }) => ({ campaign }));
  const { background } = useContext(ThemeContext);
  const summer = startingWeek % 20 == 0;
  if (!campaign) return null;
  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 1,

        "> div": {
          height: calendarDayHeight,
          background: summer ? background : "rgba(255,255,255,0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&.completed > div": {
            opacity: 0.5,
          },
        },

        "> div:nth-of-type(1)": {
          gridRowStart: 1,
          gridRowEnd: 3,
          height: 2 * calendarDayHeight + 1,
        },
      }}
    >
      <div>
        <img
          src={summer ? summerIcon : winterIcon}
          css={{ width: imageSize.tiny }}
        />
      </div>
      {Array.from({ length: 10 }).map((_, seasonWeek) => {
        const events = campaign.events.filter((event) => {
          return event.week === startingWeek + seasonWeek + 1;
        });
        events.sort((a, b) => {
          if (a.section.length === b.section.length) {
            return a.section.localeCompare(b.section);
          }
          return a.section.length - b.section.length;
        });
        let truncatedEvents = events;
        if (events.length > 3) {
          truncatedEvents = events.slice(0, 2);
        }

        const week = startingWeek + seasonWeek;
        const completed = week < campaign.currentWeek;
        return (
          <div key={week} className={completed ? "completed" : "todo"}>
            {truncatedEvents.map((event) => {
              return <CalendarEvent section={event.section} />;
            })}
            {events.length > 3 && <div>...</div>}
            {completed && (
              <img
                src={lostIcon}
                css={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const DisplayCalendar = ({ onClick }: { onClick: () => void }) => {
  const { color, background } = useContext(ThemeContext);
  return (
    <div
      onClick={onClick}
      css={{
        width: "100%",
        backgroundColor: color,
        padding: 2,
        boxSizing: "border-box",
        marginBottom: spacing.medium,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        gap: 1,
      }}
    >
      {Array.from({ length: 8 }).map((_, season) => {
        return <Season startingWeek={season * 10} key={season} />;
      })}
      <div
        css={{
          background: color,
          position: "absolute",
          width: 10,
          height: 10,
          bottom: 0,
          left: 0,
          paddingRight: 2,
          paddingTop: 2,
          boxSizing: "border-box",
        }}
      >
        <div
          css={{
            border: `solid 2px ${background}`,
            width: 8,
            height: 8,
            borderLeft: "none",
            borderBottom: "none",
            boxSizing: "border-box",
          }}
        >
          {/* embellishment bottom left */}
        </div>
      </div>
      <div
        css={{
          background: color,
          position: "absolute",
          width: 10,
          height: 10,
          bottom: 0,
          right: 0,
          paddingLeft: 2,
          paddingTop: 2,
          boxSizing: "border-box",
        }}
      >
        <div
          css={{
            border: `solid 2px ${background}`,
            width: 8,
            height: 8,
            borderRight: "none",
            borderBottom: "none",
            boxSizing: "border-box",
          }}
        >
          {/* embellishment bottom right */}
        </div>
      </div>
    </div>
  );
};

const EditCalendar = ({ onClose }: { onClose: () => void }) => {
  const { campaign, updateCampaign } = useCampaignStore(
    ({ campaign, updateCampaign }) => ({ campaign, updateCampaign })
  );
  const currentEvents = campaign?.events?.filter((event) => {
    return event.week === campaign.currentWeek;
  });
  const upComingEvents = campaign?.events
    ?.filter((event) => {
      return event.week > campaign.currentWeek;
    })
    ?.splice(0, 20);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [addingEvent, setAddingEvent] = useState(false);
  if (!campaign) return null;
  return (
    <Card>
      <div>
        <Title title="Current Week" />
        <NumberValueInput
          value={campaign.currentWeek}
          setValue={(value) => {
            updateCampaign({ ...campaign, currentWeek: value });
          }}
          min={0}
          max={80}
        />
      </div>
      {currentEvents && currentEvents.length > 0 ? (
        <div>
          <Title title="This Week's Events" />
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacing.tiny,
              marginTop: spacing.small,
              marginBottom: spacing.small,
            }}
          >
            {currentEvents?.map((event) => {
              return (
                <div
                  css={{ display: "flex", alignItems: "center", fontSize: 14 }}
                >
                  <img
                    src={sectionIcon}
                    css={{ width: 14, marginRight: spacing.tiny }}
                  />
                  <div css={{ paddingTop: 2, fontSize: 16 }}>
                    {event.section}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Title title="No events this week" />
      )}
      {upComingEvents && upComingEvents.length > 0 && (
        <div css={{ marginTop: spacing.medium }}>
          <Title title="Upcoming Events" />
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              marginTop: spacing.small,
              marginBottom: spacing.small,
            }}
          >
            {upComingEvents?.map((event) => {
              return (
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    padding: spacing.tiny,
                    paddingTop: 0,
                  }}
                >
                  <img
                    src={sectionIcon}
                    css={{ width: 14, marginRight: spacing.tiny }}
                  />
                  <div css={{ paddingTop: 2, fontSize: 16 }}>
                    {event.section}
                  </div>
                  <div
                    css={{
                      marginLeft: 4,
                      fontSize: 14,
                      flexGrow: 1,
                      paddingTop: 2,
                    }}
                  >
                    in {event.week - campaign.currentWeek} weeks
                  </div>
                  <img
                    src={lostIcon}
                    css={{ width: 14, marginLeft: spacing.tiny }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: spacing.small,
        }}
      >
        <Button onClick={() => setAddingEvent(true)}>Add Event</Button>
        <Button onClick={onClose}>
          <Title title="Close" />
        </Button>
      </div>
    </Card>
  );
};

export const Calendar = () => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <EditCalendar onClose={() => setEditing(false)} />;
  } else {
    return <DisplayCalendar onClick={() => setEditing(true)} />;
  }
};

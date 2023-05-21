import summerIcon from "../assets/general/fh-building-operation-bw-icon.png";
import winterIcon from "../assets/general/fh-frosthaven-identifier-bw-icon.png";
import { imageSize, spacing } from "../tokens";
import { ThemeContext } from "./themeProvider";
import { useContext } from "react";
import sectionIcon from "../assets/general/fh-section-bw-icon.png";
import lostIcon from "../assets/general/fh-lost-color-icon.png";
import { useCampaignStore } from "../campaignStore";

const calendarDayHeight = 45;

const CalendarEvent = ({ section }: { section: string }) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        fontSize: 10,
        lineHeight: "12px",
        marginBottom: 2,
      }}
    >
      <img src={sectionIcon} css={{ width: 8, marginRight: spacing.tiny }} />
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

export const Calendar = () => {
  const { color, background } = useContext(ThemeContext);
  return (
    <div
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

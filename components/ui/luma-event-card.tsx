import type { CSSProperties } from "react";
import Image from "next/image";
import { Calendar, MapPin, Video } from "lucide-react";
import type { Event } from "@/types/event";
import { formatEventTime } from "@/utils/date";

const AVATAR_DIMENSIONS = {
  default: {
    guestCount: 5,
    guestSize: 24,
  },
  sm: {
    guestCount: 5,
    guestSize: 20,
  },
} as const;

interface Props {
  event: Event;
}

export function LumaEventCard({ event }: Props) {
  const renderedGuests = event.featured_guests?.slice(0, AVATAR_DIMENSIONS.default.guestCount) ?? [];
  const overflowCount = (event.guest_count ?? 0) - renderedGuests.length;

  const formattedTime = formatEventTime(event.start_at);
  const showTime = !event.start_at.includes("T12:00:00");

  const isOnline = Boolean(event.meeting_url);
  const locationLabel = isOnline ? "Online" : (event.geo_address_info?.address ?? null);
  const LocationIcon = isOnline ? Video : MapPin;

  const locationText = event.host ? event.host.name : (event.venue ?? null);

  return (
    <a href={event.eventUrl} target="_blank" rel="noopener noreferrer" aria-label={event.title}>
      <div className="luma-event-card group glass relative overflow-hidden rounded-md">
        <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-x-6 sm:p-6">
          <div className="col-[1_/_span_1] row-[2_/_span_1] min-w-0 p-6 sm:col-[1_/_span_1] sm:row-[1_/_span_1] sm:p-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 shrink-0" />
              {showTime && <span className="text-muted-foreground/60">{formattedTime}</span>}
            </div>

            <h3 className="mb-2 truncate text-left text-xl">{event.title}</h3>

            <div className="mb-1 flex items-center gap-x-1">
              <div
                className="avatar-row flex"
                style={
                  {
                    "--size-default": `${AVATAR_DIMENSIONS.default.guestSize}px`,
                    "--size-sm": `${AVATAR_DIMENSIONS.sm.guestSize}px`,
                  } as CSSProperties
                }
              >
                {renderedGuests.map((guest, i) => (
                  <Avatar
                    key={i}
                    size={{
                      default: AVATAR_DIMENSIONS.default.guestSize,
                      sm: AVATAR_DIMENSIONS.sm.guestSize,
                    }}
                    name={guest.name ?? ""}
                    content={{
                      type: "string",
                      value: guest.name?.at(0) ?? "X",
                    }}
                  />
                ))}
                {overflowCount > 0 && (
                  <Avatar
                    size={{
                      default: AVATAR_DIMENSIONS.default.guestSize,
                      sm: AVATAR_DIMENSIONS.sm.guestSize,
                    }}
                    name=""
                    content={{
                      type: "string",
                      value: `+${overflowCount}`,
                    }}
                  />
                )}
              </div>
            </div>

            {locationLabel && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LocationIcon className="size-4 shrink-0" />
                <span>{locationLabel}</span>
              </div>
            )}

            {event.pitch && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.pitch}</p>}

            {locationText && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>{locationText}</span>
              </div>
            )}

            {event.sponsors && event.sponsors.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {event.sponsors.map((s) => (
                  <span key={s.id}>{s.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="relative col-[1_/_span_1] row-[1_/_span_1] aspect-square w-full overflow-hidden rounded-t-sm sm:col-[2_/_span_1] sm:row-[1_/_span_1] sm:self-center sm:rounded-sm">
            {event.cover_url && (
              <Image
                src={event.cover_url}
                alt=""
                fill
                sizes="(min-width: 640px) 7rem, 100vw"
                className="object-cover object-left-top"
              />
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

type AvatarProps = {
  name: string;
  content:
    | {
        type: "string";
        value: string;
      }
    | {
        type: "url";
        url: string;
      };
  size: {
    default: number;
    sm: number;
  };
};

const Avatar = ({ name, content, size }: AvatarProps) => {
  if (content.type === "url") {
    return (
      <div
        style={
          {
            "--size-default": `${size.default}px`,
            "--size-sm": `${size.sm}px`,
          } as CSSProperties
        }
        className="avatar relative overflow-hidden rounded-full border-2 border-background"
      >
        <Image src={content.url} alt={name} fill sizes={`${size.default}px`} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      style={
        {
          "--size-default": `${size.default}px`,
          "--size-sm": `${size.sm}px`,
        } as CSSProperties
      }
      className="avatar flex items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] select-none"
    >
      {content.value}
    </div>
  );
};

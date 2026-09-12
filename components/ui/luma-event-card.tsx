"use client";

import type { CSSProperties } from "react";
import { Calendar, MapPin, Video } from "lucide-react";
import type { Event } from "@/app/events/actions";

const AVATAR_DIMENSIONS = {
  default: {
    hostCount: 1,
    hostSize: 32,
    guestCount: 5,
    guestSize: 24,
  },
  sm: {
    hostCount: 4,
    hostSize: 16,
    guestCount: 5,
    guestSize: 20,
  },
} as const;

interface Props {
  event: Event;
}

export function LumaEventCard({ event }: Props) {
  const dateObj = new Date(event.start_at);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const showTime = !event.start_at.includes("T12:00:00");

  const isOnline = Boolean(event.virtual_info?.raw_join_url);
  const locationLabel = isOnline ? "Online" : (event.geo_address_info?.sublocality ?? null);
  const LocationIcon = isOnline ? Video : MapPin;

  const locationText = event.host ? event.host.name : (event.venue ?? null);

  return (
    <a href={event.eventUrl} target="_blank" rel="noopener noreferrer" aria-label={event.title}>
      <div className="luma-event-card group glass relative overflow-hidden rounded-md">
        <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_auto] sm:p-6" style={{}}>
          <div className="col-[1_/_span_1] row-[2_/_span_1] flex-1 p-6 sm:col-[1_/_span_1] sm:row-[1_/_span_1] sm:p-0">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 shrink-0" />
              {showTime && <span className="text-muted-foreground/60">{formattedTime}</span>}
            </div>

            <h3 className="mb-2 text-left text-xl">{event.title}</h3>

            <div className="mb-1 flex items-center gap-x-1">
              <div
                className="avatar-row flex"
                style={
                  {
                    "--size-default": `${AVATAR_DIMENSIONS.default.hostSize}px`,
                    "--size-sm": `${AVATAR_DIMENSIONS.sm.hostSize}px`,
                  } as CSSProperties
                }
              >
                {event.hosts?.map(
                  (host, i) =>
                    host.avatar_url && (
                      <Avatar
                        key={host.avatar_url ?? i}
                        size={{
                          default: AVATAR_DIMENSIONS.default.hostSize,
                          sm: AVATAR_DIMENSIONS.sm.hostSize,
                        }}
                        name={`${host.first_name ?? ""} ${host.last_name ?? ""}`}
                        content={{
                          type: "url",
                          url: host.avatar_url,
                        }}
                      />
                    ),
                )}
              </div>
              <span className="text-sm text-muted-foreground sm:hidden">
                {buildHostNameSummary(
                  event.hosts?.map((host) => `${host.first_name ?? ""} ${host.last_name ?? ""}`) ?? [],
                  AVATAR_DIMENSIONS.default.hostCount,
                )}
              </span>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {buildHostNameSummary(
                  event.hosts?.map((host) => `${host.first_name ?? ""} ${host.last_name ?? ""}`) ?? [],
                  AVATAR_DIMENSIONS.sm.hostCount,
                )}
              </span>
            </div>

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
                {event.featured_guests?.slice(0, AVATAR_DIMENSIONS.default.guestCount).map(
                  (guest, i) =>
                    guest.avatar_url && (
                      <Avatar
                        key={guest.avatar_url ?? i}
                        size={{
                          default: AVATAR_DIMENSIONS.default.guestSize,
                          sm: AVATAR_DIMENSIONS.sm.guestSize,
                        }}
                        name={guest.name ?? ""}
                        content={{
                          type: "url",
                          url: guest.avatar_url,
                        }}
                      />
                    ),
                )}
                {event.guest_count - AVATAR_DIMENSIONS.default.guestCount > 0 && (
                  <Avatar
                    key="extra-guest-count"
                    size={{
                      default: AVATAR_DIMENSIONS.default.guestSize,
                      sm: AVATAR_DIMENSIONS.sm.guestSize,
                    }}
                    name=""
                    content={{
                      type: "string",
                      value: `+${event.guest_count - AVATAR_DIMENSIONS.default.guestCount}`,
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
          <div
            className={`col-[1_/_span_1] row-[1_/_span_1] aspect-square h-full rounded-t-sm sm:col-[2_/_span_1] sm:row-[1_/_span_1] sm:rounded-sm`}
            style={{
              background: `url(${event.cover_url})`,
              backgroundSize: "cover",
            }}
          />
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
      <img
        src={content.url}
        alt={name}
        style={
          {
            "--size-default": `${size.default}px`,
            "--size-sm": `${size.sm}px`,
          } as CSSProperties
        }
        className="avatar rounded-full border-2 border-background"
      />
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
      className="avatar flex items-center justify-center rounded-full border-2 border-background bg-slate-100 text-[9px] select-none dark:bg-slate-800"
    >
      {content.value}
    </div>
  );
};

const buildHostNameSummary = (hosts: string[], visibleCount: number): string => {
  if (hosts.length === 0) {
    return "";
  }
  return `By ${hosts.slice(0, visibleCount).join(", ")}${hosts.length > visibleCount ? ` & ${hosts.length - visibleCount} others` : ""}`;
};

import Image from "next/image";
import { cn } from "@/utils/theme";

const AVATAR_PALETTES = [
  { bg: "bg-teal/15 dark:bg-teal/20", text: "text-teal dark:text-seafoam", ring: "ring-teal/20" },
  { bg: "bg-amber/20 dark:bg-amber/15", text: "text-overline", ring: "ring-amber/25" },
  { bg: "bg-mint/15 dark:bg-mint/20", text: "text-mint dark:text-seafoam", ring: "ring-mint/20" },
  { bg: "bg-coral/10 dark:bg-coral/15", text: "text-coral dark:text-peach", ring: "ring-coral/20" },
  { bg: "bg-seafoam/30 dark:bg-seafoam/10", text: "text-teal-dark dark:text-seafoam", ring: "ring-seafoam/30" },
] as const;

function paletteFor(name: string) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[sum % AVATAR_PALETTES.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const sizeClasses = {
  sm: { box: "h-10 w-10", text: "text-xs", ring: "" },
  md: { box: "h-14 w-14", text: "text-base", ring: "ring-2" },
  lg: { box: "h-24 w-24", text: "text-2xl", ring: "ring-4 shadow-soft" },
  xl: { box: "h-40 w-40", text: "text-3xl", ring: "ring-4 shadow-soft" },
} as const;

type TeamAvatarSize = keyof typeof sizeClasses;

interface TeamAvatarProps {
  name: string;
  avatar?: string;
  size?: TeamAvatarSize;
  className?: string;
}

export function TeamAvatar({ name, avatar, size = "md", className }: TeamAvatarProps) {
  const p = paletteFor(name);
  const s = sizeClasses[size];

  if (avatar) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full",
          s.box,
          s.ring && `ring ${p.ring}`,
          s.ring,
          className,
        )}
      >
        <Image
          src={avatar}
          alt={name}
          fill
          sizes={size === "xl" ? "160px" : size === "lg" ? "96px" : size === "md" ? "56px" : "40px"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        s.box,
        s.ring && `ring ${p.ring}`,
        s.ring,
        p.bg,
        className,
      )}
    >
      <span className={cn("font-display font-bold", s.text, p.text)}>{initials(name)}</span>
    </div>
  );
}

import Image from "next/image";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva("shrink-0 rounded-full", {
    variants: {
      size: {
        sm: "size-10",
        md: "size-14 ring-2",
        lg: "shadow-soft size-24 ring-4",
        xl: "shadow-soft size-40 ring-4",
      },
      hasImage: {
        true: "relative overflow-hidden",
        false: "flex items-center justify-center",
      },
    },
    defaultVariants: { size: "md", hasImage: false },
  }),
  initials: cva("font-display font-bold", {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-base",
        lg: "text-2xl",
        xl: "text-3xl",
      },
    },
    defaultVariants: { size: "md" },
  }),
};

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

type TeamAvatarSize = NonNullable<VariantProps<typeof styles.root>["size"]>;

/** Rendered width of each size, for `next/image` to pick the right source. */
const IMAGE_SIZES = {
  sm: "40px",
  md: "56px",
  lg: "96px",
  xl: "160px",
} as const satisfies Record<TeamAvatarSize, string>;

interface TeamAvatarProps {
  name: string;
  avatar?: string;
  size?: TeamAvatarSize;
  className?: string;
}

export function TeamAvatar({ name, avatar, size = "md", className }: TeamAvatarProps) {
  const p = paletteFor(name);
  // The sm avatar carries no ring, so it takes no ring colour either.
  const ring = size === "sm" ? undefined : p.ring;

  if (avatar) {
    return (
      <div className={cn(styles.root({ size, hasImage: true }), ring, className)}>
        <Image src={avatar} alt={name} fill sizes={IMAGE_SIZES[size]} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn(styles.root({ size, hasImage: false }), ring, p.bg, className)}>
      <span className={cn(styles.initials({ size }), p.text)}>{initials(name)}</span>
    </div>
  );
}

"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AutoplayVideo } from "@/components/ui/autoplay-video";
import { Button } from "@/components/ui/button";
import { BRAND_ICONS, InstagramIcon } from "@/components/ui/icons";
import { getAllSocialLinks } from "@/constants/social-links";
import {
  getCoverImage,
  getCoverVideo,
  getFeaturedInstagramPosts,
  type InstagramPostWithId,
} from "@/constants/instagram-posts";

const CAPTION_CHAR_LIMIT = 300;

function truncateCaption(caption: string): string {
  if (caption.length <= CAPTION_CHAR_LIMIT) return caption;
  return `${caption.slice(0, CAPTION_CHAR_LIMIT).trimEnd()}…`;
}

function formatDate(date: string | undefined, fallbackRaw: number | undefined): string {
  if (!date && !fallbackRaw) return "";
  const d = date ? new Date(date) : new Date((fallbackRaw ?? 0) * 1000);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const instagramUrl = getAllSocialLinks().find((l) => l.id === "instagram")?.url;

function InstagramPostCard({ post }: { post: InstagramPostWithId }) {
  const cover = getCoverImage(post);
  const video = getCoverVideo(post);
  const postUrl = post.shortcode
    ? `https://instagram.com/p/${post.shortcode}`
    : (instagramUrl ?? "https://instagram.com/techtankto");

  return (
    <article className="group glass relative flex flex-col overflow-hidden rounded-2xl transition-all">
      {(video || cover) && (
        <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
          {video ? (
            <AutoplayVideo
              src={video}
              poster={cover}
              description="Video from this Instagram post"
              preload="auto"
              className="absolute inset-0"
              videoClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
          {post.featured && (
            <span className="tag absolute top-3 left-3 bg-warning text-xs text-warning-foreground">Featured</span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[#E4405F]">
            <InstagramIcon className="size-5" />
          </span>
          <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">Instagram</span>
          <span className="shrink-0 text-xs text-muted-foreground">·</span>
          <span className="min-w-[8.5em] shrink-0 text-xs text-muted-foreground">
            {formatDate(post.date, post.createdAtRaw)}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 leading-relaxed whitespace-pre-line text-foreground">
          {truncateCaption(post.caption)}
        </p>

        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center text-sm font-medium text-overline transition-colors hover:text-foreground"
        >
          <InstagramIcon className="mr-2 size-4" />
          View on Instagram
          <ExternalLink className="ml-1 size-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function SocialFeed() {
  const posts = getFeaturedInstagramPosts(4);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {posts.map((post) => (
          <InstagramPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
        {getAllSocialLinks()
          .filter((link) => ["slack", "linkedin", "instagram"].includes(link.id))
          .map((link) => {
            const Icon = BRAND_ICONS[link.id];
            return (
              <Button key={link.id} variant={link.type === "primary" ? "primary" : "outline"} size="sm" asChild>
                <a
                  href={link.id === "instagram" ? (instagramUrl ?? link.url) : link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Icon && <Icon className="mr-2 size-4" />}
                  {link.id === "slack" ? "Join Slack" : link.name}
                  <ExternalLink className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

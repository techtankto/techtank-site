import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AutoplayVideo } from "@/components/ui/autoplay-video";
import { Button } from "@/components/ui/button";
import { BRAND_ICONS, InstagramIcon } from "@/components/ui/icons";
import { getAllSocialLinks, socialLinks } from "@/constants/social-links";
import {
  getCoverImage,
  getCoverVideo,
  getCoverVideoDescription,
  FEED_POST_COUNT,
  getFeaturedInstagramPosts,
  type InstagramPostWithId,
} from "@/constants/instagram-posts";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("space-y-8"),
  grid: cva("grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"),
  actions: cva("flex flex-wrap items-center justify-center gap-3 pt-6"),
  card: cva("group glass relative flex flex-col overflow-hidden rounded-2xl transition-all"),
  media: cva("relative aspect-4/5 w-full overflow-hidden bg-muted"),
  video: cva("absolute inset-0"),
  featured: cva("tag absolute top-3 left-3 bg-warning text-xs text-warning-foreground"),
  body: cva("flex flex-1 flex-col p-6"),
  meta: cva("mb-4 flex flex-wrap items-center gap-x-2 gap-y-1"),
  platformMark: cva("text-[#E4405F]"),
  platformIcon: cva("size-5"),
  platform: cva("shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase"),
  separator: cva("shrink-0 text-xs text-muted-foreground"),
  date: cva("min-w-[8.5em] shrink-0 text-xs text-muted-foreground"),
  caption: cva("mb-4 line-clamp-3 leading-relaxed whitespace-pre-line text-foreground"),
  link: cva(
    "mt-auto inline-flex items-center text-sm font-medium text-overline transition-colors hover:text-foreground",
  ),
  brandIcon: cva("mr-2 size-4"),
  zoom: cva("transition-transform duration-500 group-hover:scale-[1.03]"),
  externalIcon: cva("", {
    variants: {
      size: { sm: "ml-1 size-3", md: "ml-2 size-4" },
    },
    defaultVariants: { size: "md" },
  }),
};

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

function InstagramPostCard({ post }: { post: InstagramPostWithId }) {
  const cover = getCoverImage(post);
  const video = getCoverVideo(post);
  const postUrl = post.shortcode ? `https://instagram.com/p/${post.shortcode}` : socialLinks.instagram.url;

  return (
    <article className={styles.card()}>
      {(video || cover) && (
        <div className={styles.media()}>
          {video ? (
            <AutoplayVideo
              src={video}
              poster={cover}
              description={getCoverVideoDescription(post)}
              preload="none"
              className={styles.video()}
              objectPosition={post.coverPosition}
              videoClassName={styles.zoom()}
            />
          ) : cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className={cn("object-cover", styles.zoom())}
              style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined}
            />
          ) : null}
          {post.featured && <span className={styles.featured()}>Featured</span>}
        </div>
      )}
      <div className={styles.body()}>
        <div className={styles.meta()}>
          <span className={styles.platformMark()}>
            <InstagramIcon className={styles.platformIcon()} />
          </span>
          <span className={styles.platform()}>Instagram</span>
          <span className={styles.separator()}>·</span>
          <span className={styles.date()}>{formatDate(post.date, post.createdAtRaw)}</span>
        </div>

        <p className={styles.caption()}>{truncateCaption(post.caption)}</p>

        <a href={postUrl} target="_blank" rel="noopener noreferrer" className={styles.link()}>
          <InstagramIcon className={styles.brandIcon()} />
          View on Instagram
          <ExternalLink className={styles.externalIcon({ size: "sm" })} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function SocialFeed() {
  const posts = getFeaturedInstagramPosts(FEED_POST_COUNT);

  return (
    <div className={styles.root()}>
      <div className={styles.grid()}>
        {posts.map((post) => (
          <InstagramPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className={styles.actions()}>
        {getAllSocialLinks()
          .filter((link) => ["slack", "linkedin", "instagram"].includes(link.id))
          .map((link) => {
            const Icon = BRAND_ICONS[link.id];
            return (
              <Button key={link.id} variant={link.type === "primary" ? "primary" : "outline"} size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {Icon && <Icon className={styles.brandIcon()} />}
                  {link.id === "slack" ? "Join Slack" : link.name}
                  <ExternalLink className={styles.externalIcon({ size: "md" })} aria-hidden="true" />
                </a>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

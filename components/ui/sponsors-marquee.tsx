import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { getAllSponsors } from "@/constants/sponsors";
import { cva } from "@/utils/theme";

const styles = {
  link: cva("group flex shrink-0 items-center justify-center [--logo-height:2rem] lg:[--logo-height:2.5rem]"),
  logo: cva("object-contain opacity-70 transition-all duration-300 hover:opacity-100 dark:brightness-0 dark:invert"),
};

const sponsors = getAllSponsors();

export function SponsorsMarquee({ className }: { className?: string }) {
  return (
    <Marquee
      speed="slow"
      pauseLabel="Pause scrolling sponsor logos"
      resumeLabel="Resume scrolling sponsor logos"
      className={className}
    >
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.id}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link()}
          title={sponsor.name}
        >
          <Image
            src={sponsor.logo}
            alt={`${sponsor.name} logo`}
            width={sponsor.width}
            height={sponsor.height}
            className={styles.logo()}
            style={{
              width: "auto",
              height: `calc(var(--logo-height) * ${sponsor.scale ?? 1})`,
            }}
          />
        </a>
      ))}
    </Marquee>
  );
}

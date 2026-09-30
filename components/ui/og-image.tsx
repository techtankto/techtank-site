import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 630,
};

const logoPath = join(process.cwd(), "public/images/logos/light.png");

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;

  const css = await fetch(url).then((res) => res.text());

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (!resource) {
    throw new Error("Failed to load font");
  }

  return fetch(resource[1]).then((res) => res.arrayBuffer());
}

type CreateOGImageParams = {
  title?: string;
  imageAlt?: string;
};

export async function createOGImage({ title, imageAlt = "TechTank TO" }: CreateOGImageParams) {
  const hasTitle = Boolean(title?.trim());

  const logo = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const font = hasTitle && title ? await loadGoogleFont("Inter:wght@700", title) : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#224056",
        padding: hasTitle ? "80px" : "0px",
        fontFamily: "Space Grotesk",
      }}
    >
      <img
        src={logoSrc}
        alt={imageAlt}
        style={{
          width: hasTitle ? "820px" : "1200px",
          objectFit: "contain",
        }}
      />

      {hasTitle && (
        <div
          style={{
            marginTop: "56px",
            fontSize: "88px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          {title}
        </div>
      )}
    </div>,
    {
      ...size,
      fonts:
        hasTitle && font
          ? [
              {
                name: "Inter",
                data: font,
                weight: 700,
                style: "normal",
              },
            ]
          : [],
    },
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "TechTank TO";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function OGImage() {
  const imageData = await readFile(join(process.cwd(), "public/images/logos/light.png"));
  const base64Image = `data:image/png;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={base64Image} alt="TechTank TO" width={820} height={180} />
    </div>,
    {
      ...size,
    },
  );
}

import { createOGImage, size } from "@/components/ui/og-image";

export const alt = "TechTank TO Get Involved";
export { size };

export const contentType = "image/png";

export default function OGImage() {
  return createOGImage({
    title: "GET INVOLVED",
    imageAlt: alt,
  });
}

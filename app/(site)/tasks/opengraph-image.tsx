import { createOGImage, size } from "@/components/ui/og-image";

export const alt = "TechTank TO — Pick a Task";
export { size };

export const contentType = "image/png";

export default function OGImage() {
  return createOGImage({
    title: "PICK A TASK",
    imageAlt: alt,
  });
}

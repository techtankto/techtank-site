import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PreviousButton() {
  return (
    <Button variant="outline" size="sm" className="mt-6" asChild>
      <Link href="/">Go Home</Link>
    </Button>
  );
}

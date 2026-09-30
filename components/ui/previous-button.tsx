import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PreviousButton() {
  return (
    <Link href="/">
      <Button variant="outline" size="sm" className="mt-6 hover:cursor-pointer">
        Go Home
      </Button>
    </Link>
  );
}

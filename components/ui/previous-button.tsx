import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cva } from "@/utils/theme";

const styles = {
  root: cva("mt-6"),
};

export function PreviousButton() {
  return (
    <Button variant="outline" size="sm" className={styles.root()} asChild>
      <Link href="/">Go Home</Link>
    </Button>
  );
}

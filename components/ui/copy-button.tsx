"use client";

import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cva } from "@/utils/theme";

const styles = {
  icon: cva("mr-2 size-4"),
};

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button variant="ghost" size="sm" onClick={() => copy(text)}>
      {copied ? (
        <Check className={styles.icon()} aria-hidden="true" />
      ) : (
        <Copy className={styles.icon()} aria-hidden="true" />
      )}
      {copied ? "Copied!" : "Copy to clipboard"}
    </Button>
  );
}

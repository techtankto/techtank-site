"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { SlackIcon } from "@/components/ui/icons";
import { useAppStore } from "@/stores/app-state";
import { cva } from "@/utils/theme";

const styles = {
  dialog: cva("md:max-w-md lg:max-w-md"),
  content: cva("flex flex-col items-center gap-1.5 text-center"),
  description: cva("text-sm text-foreground"),
  qr: cva("size-60 max-w-full dark:invert"),
  button: cva("w-full"),
  leadingIcon: cva("mr-2 size-4"),
  trailingIcon: cva("ml-2 size-4"),
};

// The QR SVG below encodes https://www.techtankto.com/get-involved
// (regenerate the asset if that URL changes).

export function QrDialog() {
  const { qrDialogOpen, setQrDialogOpen } = useAppStore();

  const onClose = () => setQrDialogOpen(false);

  return (
    <Dialog open={qrDialogOpen} onClose={onClose} title="Get involved with TechTank" className={styles.dialog()}>
      <div className={styles.content()}>
        <p className={styles.description()}>Point your phone camera at the code to open the get involved page.</p>

        {/* The copy above and the link below already say this, so the graphic adds nothing. */}
        <Image src="/images/qr/get-involved.svg" alt="" width={240} height={240} className={styles.qr()} />

        <Button variant="primary" size="sm" className={styles.button()} asChild onClick={onClose}>
          <Link href="/get-involved">
            <Users className={styles.leadingIcon()} aria-hidden="true" />
            Visit Get Involved
            <ArrowRight className={styles.trailingIcon()} aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" className={styles.button()} asChild onClick={onClose}>
          <a href="/links/slack" target="_blank" rel="noopener noreferrer">
            <SlackIcon className={styles.leadingIcon()} />
            Join our Slack
            <ExternalLink className={styles.trailingIcon()} aria-hidden="true" />
          </a>
        </Button>
      </div>
    </Dialog>
  );
}

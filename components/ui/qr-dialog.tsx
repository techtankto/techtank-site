"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { SlackIcon } from "@/components/ui/icons";
import { useAppStore } from "@/stores/app-state";
import { cva } from "@/utils/theme";

const styles = {
  dialog: cva("md:max-w-md lg:max-w-md"),
  content: cva("flex flex-col items-center gap-1.5 text-center"),
  eyebrow: cva("mb-1 inline-block text-xs font-semibold tracking-widest text-ring uppercase"),
  title: cva("text-xl leading-tight font-bold"),
  description: cva("mt-1 text-sm text-foreground"),
  qr: cva("size-40 max-w-full dark:invert"),
  button: cva("w-full"),
  slackIcon: cva("mr-2 size-4"),
};

// The QR SVG below encodes https://www.techtankto.com/get-involved
// (regenerate the asset if that URL changes).

export function QrDialog() {
  const { qrDialogOpen, setQrDialogOpen } = useAppStore();

  const onClose = () => setQrDialogOpen(false);

  return (
    <Dialog open={qrDialogOpen} onClose={onClose} className={styles.dialog()}>
      <div className={styles.content()}>
        <div>
          <span className={styles.eyebrow()}>Scan to join</span>
          <DialogTitle className={styles.title()}>Get involved with TechTank</DialogTitle>
          <p className={styles.description()}>Point your phone camera at the code to open the get involved page.</p>
        </div>

        {/* The copy above and the link below already say this, so the graphic adds nothing. */}
        <Image src="/images/qr/get-involved.svg" alt="" width={160} height={160} className={styles.qr()} />

        <Button variant="primary" size="sm" className={styles.button()} asChild onClick={onClose}>
          <Link href="/get-involved">Visit Get Involved</Link>
        </Button>
        <Button variant="secondary" size="sm" className={styles.button()} asChild onClick={onClose}>
          <a href="/links/slack" target="_blank" rel="noopener noreferrer">
            <SlackIcon className={styles.slackIcon()} />
            Join our Slack
          </a>
        </Button>
      </div>
    </Dialog>
  );
}

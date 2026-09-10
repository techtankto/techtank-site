"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { QrCodeIcon, SlackIcon } from "@/components/ui/icons";
import { useAppStore } from "@/stores/app-state";

// The QR SVG below encodes https://www.techtankto.com/get-involved
// (regenerate the asset if that URL changes).
const titleId = "qr-dialog-title";

export function QrDialog() {
  const { qrDialogOpen, setQrDialogOpen } = useAppStore();

  const onClose = () => setQrDialogOpen(false);

  return (
    <Dialog open={qrDialogOpen} onClose={onClose} labelledBy={titleId} className="md:max-w-md lg:max-w-md">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div>
          <span className="mb-1 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Scan to join
          </span>
          <h2 id={titleId} className="font-display text-xl leading-tight font-bold text-foreground">
            Get involved with TechTank
          </h2>
          <p className="mt-1 text-sm text-foreground">
            Point your phone camera at the code to open the get involved page.
          </p>
        </div>

        {/* The copy above and the link below already say this, so the graphic adds nothing. */}
        <QrCodeIcon className="size-40 max-w-full text-black dark:text-white" />

        <Button variant="primary" size="sm" className="w-full" asChild onClick={onClose}>
          <Link href="/get-involved">Visit Get Involved</Link>
        </Button>
        <Button variant="secondary" size="sm" className="w-full" asChild onClick={onClose}>
          <a href="/links/slack" target="_blank" rel="noopener noreferrer">
            <SlackIcon className="mr-2 size-4" />
            Join our Slack
          </a>
        </Button>
      </div>
    </Dialog>
  );
}

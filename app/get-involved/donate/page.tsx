import type { Metadata } from "next";
import { Banknote, CreditCard, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { CopyButton } from "@/components/ui/copy-button";
import { CONTACT_EMAIL, STRIPE_DONATE_URL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support TechTank TO by card or Interac e-transfer. We're a registered Ontario nonprofit, volunteer-run and community-funded.",
};

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
              Support the mission
            </span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Donate to TechTank
            </h1>
            <p className="mb-2 text-xl leading-relaxed text-muted-foreground">
              TechTank is a registered nonprofit corporation in Ontario. We&apos;re volunteer-run and community-funded,
              and every dollar goes directly back into programming and operations: venue costs, food and drinks,
              platform fees, and event materials.
            </p>
          </div>
        </div>
      </section>

      {/* How to donate */}
      <Section>
        <SectionHeader overline="How to donate" title="Choose a way to give" className="mb-8" />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donate by card */}
          <div className="glass flex flex-col gap-4 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <CreditCard className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Donate by card</h3>
            </div>
            <p className="flex-1 text-sm text-muted-foreground">
              Quick and self-serve. You&apos;ll get an automatic email receipt.
            </p>
            <Button variant="primary" size="lg" asChild className="w-full">
              <a href={STRIPE_DONATE_URL} target="_blank" rel="noopener noreferrer">
                Donate by card
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">Processed securely via Stripe.</p>
          </div>

          {/* Interac e-transfer */}
          <div className="glass flex flex-col gap-4 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Banknote className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Donate by Interac e-transfer</h3>
            </div>
            <p className="flex-1 text-sm text-muted-foreground">
              Send any amount to the email below. Include &ldquo;Donation&rdquo; in the transfer message so we can
              identify it and send you a receipt. Want it earmarked for something specific? Mention that too and
              we&apos;ll follow up.
            </p>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3">
              <span className="font-display text-sm font-semibold text-foreground">{CONTACT_EMAIL}</span>
              <CopyButton text={CONTACT_EMAIL} />
            </div>
          </div>
        </div>
      </Section>

      {/* Tax status */}
      <Section background="white">
        <div className="max-w-2xl space-y-4 rounded-xl border border-border bg-background p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-ring" />
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Not tax-deductible</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                TechTank is a registered nonprofit, but not a registered charity. We&apos;re not authorized by the CRA
                to issue official donation tax receipts, so donations aren&apos;t tax-deductible. We&apos;ll send you a
                plain receipt confirming your donation for your own records; it just won&apos;t be a CRA tax receipt.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ring" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Questions about where donations go, or want to support TechTank another way? Reach out at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 hover:text-foreground">
                {CONTACT_EMAIL}
              </a>
              . We&apos;re also always looking for{" "}
              <a href="/get-involved/sponsor" className="underline underline-offset-2 hover:text-foreground">
                sponsors
              </a>{" "}
              and{" "}
              <a href="/get-involved/host" className="underline underline-offset-2 hover:text-foreground">
                event hosts
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for TechTank TO website and community events.",
};

export default function TermsOfServicePage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-8">
        <p className="mb-2 text-sm text-muted-foreground">Last updated: June 5, 2026</p>
        <h1 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">Terms of Service</h1>
      </div>

      {/* Content */}
      <div className="space-y-8 leading-relaxed text-foreground">
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            These terms apply to anyone who uses the TechTank TO website (techtankto.com), registers for or attends
            TechTank events, or participates in TechTank community spaces (including Slack or similar). By doing any of
            the above, you agree to be bound by these Terms of Service. &quot;TechTank TO&quot; refers to the
            volunteer-run community operating the website and organizing events.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">2. What We Ask of You</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Respect the{" "}
              <Link href="/legal/code-of-conduct" className="text-ring underline underline-offset-2">
                Code of Conduct
              </Link>{" "}
              in all community spaces
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">3. Website Use</h2>
          <p className="mb-4 text-muted-foreground">
            The TechTank TO website is provided for informational and community purposes. You may use the site to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Learn about TechTank events and programs</li>
            <li>Submit intake forms to speak, host, sponsor, or volunteer</li>
            <li>Access community resources and event information</li>
            <li>Download brand assets from the Media Kit</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            You may not use the site for harmful purposes, including scraping at harmful volume, re-posting content
            without attribution, or impersonation.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">4. External Platforms</h2>
          <p className="text-muted-foreground">
            TechTank uses third-party platforms for event registration (Luma, Meetup), community discussion (Slack), and
            content hosting (YouTube, GitHub). Use of these platforms is subject to their respective terms of service.
            TechTank is not responsible for the policies or practices of these third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">5. Events</h2>
          <p className="mb-4 text-muted-foreground">
            Participation at TechTank events (virtual or in-person) implies agreement with our{" "}
            <Link href="/legal/code-of-conduct" className="text-ring underline underline-offset-2">
              Code of Conduct
            </Link>
            . All attendees, speakers, hosts, sponsors, and volunteers are expected to follow these guidelines.
          </p>
          <p className="mb-4 text-muted-foreground">
            Registration for events does not guarantee attendance if capacity is exceeded. TechTank reserves the right
            to cancel or reschedule events. Refund policies for paid events will be stated at the time of registration.
          </p>
          <p className="text-muted-foreground">
            <strong>Photography and Recording:</strong> By participating in or attending a TechTank event, you grant
            TechTank and its representatives the right to take photographs, videos, and other media of you, and to use
            and publish them in print and/or electronically for any lawful purpose, including publicity, illustration,
            advertising, social media, and web content. You release TechTank, its volunteers, and all persons acting
            under its permission or authority from any liability related to such use, and acknowledge that you will not
            receive compensation and waive any right to inspect or approve the finished product. If you prefer not to be
            photographed, please inform an organizer at the event. Attendees may not record, photograph, or distribute
            event content without permission from the relevant parties.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">6. Intellectual Property</h2>
          <p className="mb-4 text-muted-foreground">
            TechTank branding, logos, and website content are property of TechTank TO.
          </p>
          <p className="mb-4 text-muted-foreground">
            Content shared at TechTank events — including talks, presentations, and workshop materials — belongs to its
            creators. Do not record, reproduce, or distribute such content without permission from the creator.
          </p>
          <p className="text-muted-foreground">
            User-submitted content (talk proposals, intake form submissions) remains the property of the submitter. By
            submitting content, you grant TechTank a limited license to use it for promotion of your talk or event
            participation.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">7. Disclaimers</h2>
          <p className="text-muted-foreground">
            Information on this website is provided &quot;as is&quot; without warranty. TechTank makes no guarantees
            regarding event availability, venue, speaker lineup, or timing. Events may be cancelled, postponed, or
            modified at any time.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            TechTank TO and its organizers shall not be liable for any direct, indirect, incidental, special, or
            consequential damages arising from your use of this website or participation in TechTank events, to the
            fullest extent permitted by the laws of Ontario, Canada.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">9. Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify and hold harmless TechTank TO and its organizers from any claims, damages, or
            expenses arising from your use of the website or participation in events, or your violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">10. Changes to Terms</h2>
          <p className="text-muted-foreground">
            TechTank may update these Terms of Service at any time. Material changes will be announced via the website
            and Slack community. Your continued use of the website after changes constitutes acceptance of the new
            terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">11. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms of Service are governed by the laws of the Province of Ontario, Canada, and are subject to the
            exclusive jurisdiction of courts within Toronto, Ontario, Canada.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">12. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ring underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

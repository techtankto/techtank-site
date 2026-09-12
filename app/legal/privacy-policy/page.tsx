import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for TechTank TO — what data we collect and how we use it.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-8">
        <p className="mb-2 text-sm text-muted-foreground">Last updated: August 23, 2026</p>
        <h1 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="space-y-8 leading-relaxed text-foreground">
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">1. Overview</h2>
          <p className="text-muted-foreground">
            This Privacy Policy explains what personal information TechTank TO collects, how it&apos;s used, and who
            it&apos;s shared with. This policy applies to techtankto.com and TechTank-operated community channels.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">2. Data We Collect Directly</h2>
          <p className="mb-4 text-muted-foreground">TechTank collects minimal personal information directly:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong>Intake form submissions</strong> (via Google Forms): name, email, optional profile links, and
              role-specific information (talk abstract, company, venue details, etc.)
            </li>
            <li>
              <strong>Event registration and attendance data</strong> collected via Luma and Meetup
            </li>
            <li>
              <strong>Optional demographic or background information</strong> you choose to share when registering or
              filling out a form
            </li>
            <li>
              <strong>Contact emails</strong> you send to {CONTACT_EMAIL}
            </li>
            <li>
              <strong>Basic analytics</strong> (see Analytics section below)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">3. Data We Don&apos;t Collect</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>No user accounts or passwords on this website</li>
            <li>No payment or financial data</li>
            <li>No tracking cookies beyond essential analytics</li>
            <li>No cross-site tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">4. Third-Party Platforms</h2>
          <p className="mb-4 text-muted-foreground">
            TechTank uses third-party platforms that have their own privacy policies:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong>Luma, Meetup:</strong> Event RSVPs and attendee lists
            </li>
            <li>
              <strong>Google Forms:</strong> Intake submissions (speaker, host, sponsor, volunteer)
            </li>
            <li>
              <strong>Slack:</strong> Community messages and discussions
            </li>
            <li>
              <strong>YouTube, Instagram, LinkedIn, GitHub:</strong> Embedded content and community channels
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Each platform has its own privacy policy. Please review them for details on how they handle your data.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">5. Analytics</h2>
          <p className="mb-4 text-muted-foreground">
            TechTank uses privacy-respecting analytics to understand how visitors use the website. We collect aggregate
            data only (page views, referrers, general geographic region). We do not track individual users across sites
            or collect personal identifiers through analytics.
          </p>
          <p className="text-muted-foreground">
            We use{" "}
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-ring underline underline-offset-2"
            >
              PostHog
            </a>{" "}
            for product analytics, including page views and interactions with buttons and links (such as role selections
            and calls to action) so we can understand which parts of the site are helping people get involved. PostHog
            analytics only runs on the live production site — it does not run in local development. You can review
            PostHog&apos;s own privacy practices at the link above.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">6. How We Use Your Data</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Confirm your registration and send event updates</li>
            <li>Respond to intake form submissions and inquiries</li>
            <li>Coordinate events with speakers, hosts, and sponsors</li>
            <li>Improve future programming based on who&apos;s attending and what&apos;s working</li>
            <li>Contact you about TechTank news, only if you&apos;ve opted in</li>
            <li>
              Share with venue partners where required for building access, capacity management, or emergency protocols
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">7. Data Sharing</h2>
          <p className="mb-4 text-muted-foreground">
            TechTank does not sell personal data. We do not share attendee contact information or registration data with
            sponsors for marketing or recruitment purposes. Limited sharing may occur:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong>Venue partners:</strong> Attendee information may be shared where required for building access,
              capacity management, or emergency protocols
            </li>
            <li>
              <strong>Speaker/sponsor coordination:</strong> Your contact information may be shared with event partners
              to coordinate logistics
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">8. Data Retention</h2>
          <p className="text-muted-foreground">
            Registration data is stored through Google Forms and associated Google Workspace tools. Event data is
            managed through Luma and Meetup. We retain data as long as it&apos;s relevant to community operations.
            Analytics data is aggregated and retained per our analytics provider&apos;s policy.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">9. Your Rights</h2>
          <p className="mb-4 text-muted-foreground">You have the right to:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request removal of your data from TechTank-managed records, where technically feasible</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            To exercise these rights, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ring underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            . These rights are available under PIPEDA (Canada) and, where applicable, GDPR. For data held by third-party
            platforms like Luma and Meetup, please refer to their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">10. Cookies</h2>
          <p className="text-muted-foreground">
            This website uses minimal cookies for essential functionality and analytics. No advertising or cross-site
            tracking cookies are used.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">11. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            TechTank may update this Privacy Policy from time to time. Material changes will be announced via the
            website. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">12. Contact</h2>
          <p className="text-muted-foreground">
            For privacy-related questions or to exercise your data rights, contact us at{" "}
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

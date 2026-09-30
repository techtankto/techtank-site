import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { CONTACT_EMAIL } from "@/constants/contact";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about TechTank TO — events, membership, sponsorship, volunteering, and more.",
};

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "Is TechTank free?",
        a: "Joining TechTank through our Slack community is free. Most events are free or low cost. When there is a cost, we say so upfront at registration. We try to keep things as accessible as possible, and sponsored events typically include food and drinks covered by the host.",
      },
      {
        q: "Where are you based?",
        a: "Toronto, primarily. Most events happen in the downtown core, but we're not locked to one neighbourhood or venue. As we grow, we'd love to bring programming to other parts of Ontario too.",
      },
      {
        q: "Who are these events for?",
        a: "Anyone working in or adjacent to tech — engineers, designers, product managers, data engineers, founders, and anyone else building things. We actively work to make TechTank welcoming to people at all experience levels. You don't need a senior title or a decade of experience to belong here.",
      },
      {
        q: "How do I find out about events?",
        a: "We list events on Luma and Meetup. We also announce events in our Slack community and post on LinkedIn and Instagram. Any of those will keep you in the loop.",
      },
      {
        q: "Do I need to be a member to attend?",
        a: "Nope. Most TechTank events are open to anyone. Just register on Luma or Meetup and show up.",
      },
    ],
  },
  {
    category: "Sponsorship & Hosting",
    items: [
      {
        q: "Can my company sponsor or host an event?",
        a: (
          <>
            Yes. Companies can sponsor by providing a venue, covering food and drinks, or contributing financially.
            Hosting a TechTank event is a great way to get your space and team in front of Toronto's tech community.{" "}
            <Link
              href="/get-involved/sponsor"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Fill out the sponsor and host inquiry form
            </Link>{" "}
            and an organizer will follow up.
          </>
        ),
      },
      {
        q: "Where does donation and sponsorship money go?",
        a: (
          <>
            <p className="mb-3">
              TechTank is a nonprofit run almost entirely by volunteers. When you donate or when a company sponsors us,
              here is where that money goes:
            </p>
            <ul className="mb-3 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Platform fees for Luma and Meetup</li>
              <li>Website hosting and domain costs</li>
              <li>Event materials like nametags, printed materials, and supplies</li>
              <li>Swag and community merchandise</li>
              <li>Special event costs for socials and programming not covered by a venue sponsor</li>
              <li>Operational costs including legal and bookkeeping services</li>
              <li>Food and drinks for volunteers and organizers at events and team meetings</li>
              <li>
                Eventually: speaker honorariums and travel costs, as we grow our ability to bring in speakers who
                require compensation
              </li>
            </ul>
            <p>
              We keep most events free specifically because we believe access to community shouldn't cost anything.
              Donations and sponsorships are what make that possible.
            </p>
          </>
        ),
      },
      {
        q: "What does sponsoring an event include?",
        a: "It depends on the type of sponsorship. Venue sponsors provide space and typically cover food and drinks for the event. Financial sponsors help cover platform fees, materials, and operational costs. We work with each sponsor to figure out what makes sense. All sponsors are credited at the event and in our communications.",
      },
      {
        q: "Is TechTank a nonprofit?",
        a: "Yes. TechTank is a registered nonprofit corporation in Ontario. We are volunteer-run and community-driven, and all funds go back into supporting programming and operations.",
      },
    ],
  },
  {
    category: "Getting Involved",
    items: [
      {
        q: "I have an idea for an event or initiative. Can I bring it to TechTank?",
        a: (
          <>
            Please do. TechTank has been shaped by people who showed up with ideas and made them happen. If you want to
            organize something, facilitate a workshop, or launch a new initiative under the TechTank umbrella,{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              reach out
            </a>{" "}
            or fill out the organizer interest form. We'd love to hear it.
          </>
        ),
      },
      {
        q: "Can I volunteer?",
        a: (
          <>
            Yes. We need help behind the scenes with social media, design, website, operations, fundraising, and
            sponsorship outreach. We also need people to help run events like socials and Tech Talks — though for event
            roles, we ask that you get involved in the community first so you know what TechTank is all about. Time
            commitment varies.{" "}
            <Link
              href="/get-involved/volunteer"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Fill out the volunteer form
            </Link>{" "}
            and we'll be in touch.
          </>
        ),
      },
    ],
  },
  {
    category: "Events & Policies",
    items: [
      {
        q: "What is your RSVP and cancellation policy?",
        a: "If you RSVP and can no longer attend, please update your registration at least 24 hours before the event. Repeated no-shows may affect your ability to register for future TechTank events. We keep waitlists for popular events, so cancelling early gives someone else a chance to attend. For paid events, cancellations before the cutoff date will be refunded. If you cancel after the cutoff, a refund is only possible if someone else takes your spot. Cutoff dates are posted on each event listing and vary based on the event.",
      },
      {
        q: "Will photos or videos be taken at events?",
        a: "Yes. TechTank may take photos and videos at events for use in promotional content, social media, and community communications. By attending, you acknowledge this. If you'd prefer not to be photographed or filmed, just let an organizer know when you arrive and we'll make sure to respect that.",
      },
      {
        q: "I witnessed or experienced something that made me uncomfortable at a TechTank event. What do I do?",
        a: (
          <>
            Please reach out to us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or speak to any organizer at the event. We take every report seriously and handle them confidentially. You
            can also review our full{" "}
            <Link
              href="/legal/code-of-conduct"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Code of Conduct
            </Link>{" "}
            for more detail on how reports are handled.
          </>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero texture-grain relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">FAQ</span>
            <h1 className="mb-6 font-display text-4xl font-semibold text-balance text-foreground md:text-5xl lg:text-6xl">
              Frequently asked questions
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Everything you need to know about TechTank — events, membership, sponsorship, and more. Can't find what
              you're looking for?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Email us
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ sections */}
      {faqs.map((group, groupIndex) => (
        <Section key={group.category} background={groupIndex % 2 === 0 ? undefined : "white"}>
          <SectionHeader overline={group.category} title={group.category} className="mb-8" />
          {group.items.map((item, index) => (
            <details key={index} className="mb-4 rounded-xl border border-border bg-card px-6">
              <summary className="py-5 text-left font-semibold text-foreground hover:no-underline">{item.q}</summary>
              <div className="pb-5 leading-relaxed text-muted-foreground">{item.a}</div>
            </details>
          ))}
        </Section>
      ))}

      {/* Still have questions */}
      <Section background="brand-soft">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-ring uppercase">
            Still have questions?
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground">We're happy to help</h2>
          <p className="mb-6 text-muted-foreground">
            If you didn't find what you were looking for, reach out directly and an organizer will get back to you.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-ring"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </Section>
    </>
  );
}

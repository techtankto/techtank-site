export interface TeamMember {
  name: string;
  pronouns: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
}

/** A member's place in a group. The role is per group: one person can hold different roles in different groups. */
export interface TeamMembership {
  id: TeamMemberId;
  role?: string;
}

export interface TeamGroup {
  title: string;
  subtitle?: string;
  /** Listed in display order. */
  members: TeamMembership[];
}

/** A member as shown in one group: their details plus that group's role. */
export interface TeamGroupMember extends TeamMember {
  id: TeamMemberId;
  role?: string;
}

/** Every person on the team page, stored once, keyed by id. Groups reference these ids. */
const members = {
  "danny-kim": {
    name: "Danny Kim",
    pronouns: "he/him",
    avatar: "/images/team/danny-kim.webp",
    linkedin: "https://linkedin.com/in/0916dhkim",
    github: "https://github.com/0916dhkim",
    bio: `Danny is an event organizer at TechTank. He used to be a regular at TechTank events when the community was run by the previous director, Chris, and he stepped in to help keep things running after she stepped down.
Danny focuses on organizing tech talks and panel discussions. Although he doesn't speak at these events himself, his role is behind the scenes, making sure speakers don't have to think about anything except showing up as their best selves and delivering their talk.
He's careful about picking topics that are relatable to the audience. The best talks, in his view, are about problems people have actually run into, or ideas that are just genuinely interesting. Self-promotion or corporate pitches dressed up as talks, not so much.
As an introverted self-taught developer, Danny understands how it can feel discouraging to show up to a tech event for the first time. What keeps him invested is watching people grow, whether they're just starting out or further along in their careers. He believes seeing and hearing how someone else thinks is where a lot of insight lives, and he doesn't want anyone to miss out on that.
By day, Danny is a software engineer on the frontend team at Ideogram, an AI image generation company, where he gets to work across the stack and ship features end to end. Outside of TechTank and his day job, software is still what he spends his time on.`,
  },
  "niki-fereidooni": {
    name: "Niki Fereidooni",
    pronouns: "she/her",
    avatar: "/images/team/niki-fereidooni.webp",
    linkedin: "https://linkedin.com/in/nfereidooni",
    github: "https://github.com/nfereidooni",
    bio: `Niki has been running tech community events since October 2024. She currently leads Code Diversity and Tech Talks at TechTank.
By day she's a software engineer, though she got there the long way. After nearly a decade in the print packaging industry in project management and operations, she transitioned into tech in 2020. She's a generalist at heart, someone who loves building things as much as she loves the people building alongside her.
She got involved with TechTank almost by accident. When the Code Diversity series was at risk of ending, she stepped in as a community leader. Today she's a board member and handles strategy, volunteer management, sponsor relationships, and general planning for the organization. She's the first to admit it's a lot, and the first to say it's worth it.
TechTank found Niki at a moment when she felt genuinely alone in the tech industry. No friends in the space, low confidence, unsure where she was headed. Finding a community that clicked changed that and she wants to give back to a community that has given so much to her.
She also serves as a board member for Life After Burns, a nonprofit and community supporting burn survivors through connection, healing, and growth. She also co-founded Girls with Big Ideas, an event series designed to help women and gender-diverse founders meet potential co-founders, currently on hiatus.
Outside of TechTank, you'll find her hiking the Bruce Trail, trying new restaurants, travelling when she can, and picking up new skills with more enthusiasm than expertise (pottery and sewing are the current outlets). She believes deeply that how you treat people is more important than what you know.
`,
  },
  "sophia-kim": {
    name: "Sophia Kim",
    pronouns: "she/her",
    avatar: "/images/team/sophia-kim.webp",
    linkedin: "https://linkedin.com/in/sophia-kim",
    github: "https://github.com/sophiakim1",
    bio: `Sophia leads TechTank's social events programming.
Sophia is a Software Engineer and AI Trainer with a background in full-stack development and data annotation. She has worked across startups and AI teams, building web apps and helping train large language models.
She found TechTank through a LinkedIn message from the founder and decided to check out a meetup. At the time, the community was still small, around 40 people, many coming out of bootcamps and trying to find their footing in tech. What started as simple conversations at events quickly turned into real friendships and a sense of belonging that kept her coming back.
As she became more involved, Sophia naturally stepped into a bigger role. She started TechTank's Instagram account to share moments from events and help grow the community. From there, she took on social media, event planning, and later finances, creating experiences people genuinely enjoy, remember, and keep coming back for.
To Sophia, TechTank is about real connection, growth, and opportunity. She hopes people leave TechTank events feeling inspired, supported, and more confident in their journey, whether that means making new friends, finding career opportunities, or simply feeling like they belong in tech, just as she once did.
Outside of tech, she enjoys hosting events, muay thai, travelling, and creating unforgettable experiences.
`,
  },
  "natasha-kasunic": {
    name: "Natasha Kasunic",
    pronouns: "she/her",
    avatar: "/images/team/natasha-kasunic.webp",
    linkedin: "https://linkedin.com/in/natasha-kasunic",
    bio: `Natasha is one of TechTank's newer volunteers! She's a Technical Customer Success Lead at Tightknit, a small startup building an app for community builders, where she sits between the engineering and the humans using it, translating one to the other. Computer science at Waterloo gave her the technical half; the years since taught her the part that actually matters, which is people.
She came to TechTank as an attendee first and found something she didn't expect: a room full of community leaders, operators, and builders, who happen to be her favourite kind of person. So she started pitching in. What's kept her around isn't any single event but the in-between, the hallway conversation that turns into a real one, and the way a good community quietly makes space for people, women in tech especially, to find their footing.
She's early in her TechTank story, which is the fun part. Expect to see her wherever the community needs an extra set of hands.
When she's not here, she's doing stand-up comedy, crocheting, fencing, or digital nomading her way to somewhere new.
`,
  },
  "tony-ko": {
    name: "Tony Ko",
    pronouns: "he/him",
    avatar: "/images/team/tony-ko.webp",
    linkedin: "https://linkedin.com/in/tkodev",
    github: "https://github.com/tkodev",
    bio: `Tony leads TechTank's web team while serving as an organizer. By day, he's a Staff Software Engineer working where engineering, design, and product thinking meet. He's shipped products for Aeroplan, Loblaws, and a few others you'd recognize.

He showed up early, camera in hand, doing whatever the community needed: events, copy, posters. What kept him was the people: their energy, the way quick conversations turned into real ones. To Tony, the most valuable thing TechTank offers isn't a talk or a networking opportunity, it's what happens between.

That steady involvement grew into leading the web team. He now shapes every detail online, so it reflects the same quality felt in person.

Outside of TechTank, he's drawn to experiences worth remembering. Good food, music, dance, hosting socials, new cities, and a creative eye that spans photography, 3D and industrial design.
`,
  },
  "thannia-blanchet": {
    name: "Thannia Blanchet",
    pronouns: "she/her",
    avatar: "/images/team/thannia-blanchet.webp",
    linkedin: "https://linkedin.com/in/thannia-blanchet",
    github: "https://github.com/thanniaB",
    bio: `Thannia co-runs CodeDiversity alongside Niki and has spoken at multiple TechTank events.
She's been a Front-End Software Engineer since 2014 and moved to Toronto in 2023, where shortly after she met TechTank by a matter of destiny, she was the only one available to show them the office to host an event. In TechTank, she has found community and friends, and decided to use it to continue her mission of promoting diversity, equality, inclusion, and lifting everyone up.
Outside of tech, Thannia enjoys different things: drawing, acting, muay thai, and roller derby: a sport you should totally check out.
`,
  },
  "john-malapit": {
    name: "John Malapit",
    pronouns: "he/him",
    avatar: "/images/team/john-malapit.webp",
    linkedin: "https://linkedin.com/in/johnmalapit",
    github: "https://github.com/johnmal-dev",
  },
  "robert-so": {
    name: "Robert So",
    pronouns: "he/him",
    avatar: "/images/team/robert-so.webp",
    linkedin: "https://linkedin.com/in/robertkso",
    github: "https://github.com/robester0403",
    bio: `Rob helps organize informational events for developers and tech professionals. By day, he is an engineer working on Elastic's security integration platform, operating closely with the latest in AI.
He likes to keep his ear to the ground, staying current with the local tech scene so he can share valuable insights with his peers. For Rob, the community's true value lies in giving professionals a dedicated platform to speak openly, allowing everyday networking to evolve into candid discussions about their real-life experiences.
That dedication to authentic, on-the-ground connection drives his work as an organizer. He ensures that every event provides a genuine space for the tech community to learn, share, and navigate the industry together.`,
  },
  "eileen-xue": {
    name: "Eileen Xue",
    pronouns: "she/her",
    avatar: "/images/team/eileen-xue.webp",
    linkedin: "https://linkedin.com/in/eileenxue",
    bio: `Eileen is a Tech Lead, Product at Curacity, a platform that helps hospitality brands reach travellers through media and AI-driven discovery. Beyond her day job, she's a Women Techmakers Ambassador and an active member of several women-in-tech communities.
Her TechTank story started in the pandemic, attending virtual events and slowly getting to know the community. A chance run-in at a conference with current co-chair Niki (who, as it turns out, went to undergrad with Eileen's husband) led to an invitation to Code Diversity. That small-world moment has kept her showing up ever since.
Today she volunteers wherever help is needed: events, participation, community engagement, and the in-between moments that make a community feel real. She believes TechTank is for everyone in tech, not just developers, and hopes people leave with a connection they didn't expect and a sense that they belong here.
When she's not here, she's somewhere in the world or somewhere in Toronto chasing a great meal. Sushi and steak are her love languages, ideally on the same menu.
`,
  },
  "rodrigo-curbelo": {
    name: "Rodrigo Curbelo",
    pronouns: "he/him",
    avatar: "/images/team/rodrigo-curbelo.webp",
    linkedin: "https://linkedin.com/in/rcurbelo",
    github: "https://github.com/rodrigocurbelo",
    bio: `Rodrigo is a Senior Product Engineer, UI/UX designer, and community organizer who has spent most of his career in early-stage startups. He's led engineering teams, founded a company, and tends to gravitate toward the intersection of engineering, product, and design, especially the messy early stages where the problem is still being figured out.
At TechTank, he helps organize events, partnerships, and some of the systems behind the community. He's particularly interested in creating formats that get people doing more than exchanging LinkedIn profiles: working together, sharing what they know, building things, and forming actual relationships with other people in tech.
That interest in how people work together also led him to start Creative Blocks Club, a Toronto community built around making remote work less isolating. They host regular coworking sessions, workshops, outdoor events, and collaborations with other communities around the city.
Outside of tech and community work, he can usually be found at a coffee shop, playing chess badly, planning a new trip, or getting disproportionately excited about some new project. Ask him about his dog, he won't stop talking.`,
  },
  "rohan-villoth": {
    name: "Rohan Villoth",
    pronouns: "he/him",
    avatar: "/images/team/rohan-villoth.webp",
    linkedin: "https://linkedin.com/in/RohanVilloth",
    github: "https://github.com/RohanVilloth",
  },
  "abu-saeed": {
    name: "Abu Saeed",
    pronouns: "he/him",
    avatar: "/images/team/abu-saeed.webp",
    linkedin: "https://linkedin.com/in/abuhsaeed",
    github: "https://github.com/yumstar",
    bio: "Software engineer working in the broadcasting industry, nerding out about all things audio-visual.",
  },
  "victoria-sze": {
    name: "Victoria Sze",
    pronouns: "she/her",
    avatar: "/images/team/victoria-sze.webp",
    bio: `Victoria is on TechTank's design team and is curious about people, places, and the stories behind what she creates. Her work has spanned B2B and B2C, technology, financial services, and campus planning, giving her a broad perspective on how design can shape both products and experiences.
She's drawn to the intersection of creativity and problem-solving, always looking for ways to make complex ideas feel simple, thoughtful, and human. For Victoria, good design starts with understanding people - and often begins with a conversation.
Outside of work, she's passionate about art, travelling, and discovering new experiences. She loves exploring new cities, finding inspiration in unexpected places, and meeting people from different backgrounds. Her curiosity about the world often finds its way back into her work, keeping her perspective fresh and her approach to design always evolving.`,
  },
  "mabel-kasunic": {
    name: "Mabel Kasunic",
    pronouns: "she/her",
    avatar: "/images/team/mabel-kasunic.webp",
    bio: `Mabel is a product designer who enjoys creating thoughtful digital and physical experiences that connect people, technology, and the world around them. She specializes in product thinking, systems thinking, and human-centered design, with a growing curiosity about how AI is shaping the future of design.
Outside of design, Mabel loves reading, travelling, discovering new places, and experiencing different cultures through food, people, and everyday life. Her curiosity about how people live and interact with the world around them often finds its way into the things she designs.`,
  },
  "danyal-imran": {
    name: "Danyal Imran",
    pronouns: "he/him",
    avatar: "/images/team/danyal-imran.webp",
    github: "https://github.com/imRanDan",
  },
  "justin-bento": {
    name: "Justin Bento",
    pronouns: "he/him",
    avatar: "/images/team/justin-bento.webp",
    github: "https://github.com/Justin-Bento",
  },
  "jyle-vergara": {
    name: "Jyle Vergara",
    pronouns: "she/her",
    avatar: "/images/team/jyle-vergara.webp",
    github: "https://github.com/jylevergara",
  },
  "jacky-tea": {
    name: "Jacky Tea",
    pronouns: "he/him",
    avatar: "/images/team/jacky-tea.webp",
    github: "https://github.com/jackytea",
  },
  "marco-campos": {
    name: "Marco Campos",
    pronouns: "he/him",
    avatar: "/images/team/marco-campos.webp",
    github: "https://github.com/madcampos",
  },
  "nana-ogasawara": {
    name: "Nana Ogasawara",
    pronouns: "she/her",
    avatar: "/images/team/nana-ogasawara.webp",
    linkedin: "https://linkedin.com/in/cureseven",
    github: "https://github.com/cureseven",
  },
  "amanda-collantes": {
    name: "Amanda Collantes",
    pronouns: "she/her",
    avatar: "/images/team/amanda-collantes.webp",
    github: "https://github.com/agdmc",
  },
  "beatrice-yu": {
    name: "Beatrice Yu",
    pronouns: "she/her",
    avatar: "/images/team/beatrice-yu.webp",
  },
  "charu-idnani": {
    name: "Charu Idnani",
    pronouns: "she/her",
    avatar: "/images/team/charu-idnani.webp",
  },
  "garv-gupta": {
    name: "Garv Gupta",
    pronouns: "she/her",
    avatar: "/images/team/garv-gupta.webp",
  },
  "nhi-nguyen": {
    name: "Nhi Nguyen",
    pronouns: "she/her",
    avatar: "/images/team/nhi-nguyen.webp",
    github: "https://github.com/mynhinguyentruong",
  },
  "rana-soyak": {
    name: "Rana Soyak",
    pronouns: "she/her",
    avatar: "/images/team/rana-soyak.webp",
  },
  "lune-moreau": {
    name: "Lune Moreau",
    pronouns: "she/they",
    avatar: "/images/team/lune-moreau.webp",
  },
  "ayushi-guha": {
    name: "Ayushi Guha",
    pronouns: "she/her",
  },
  "carmen-lam": {
    name: "Carmen Lam",
    pronouns: "she/her",
    avatar: "/images/team/carmen-lam.webp",
    github: "https://github.com/Carmen-jx",
  },
} satisfies Record<string, TeamMember>;

export type TeamMemberId = keyof typeof members;

export const teamMembers: Record<TeamMemberId, TeamMember> = members;

export const teamGroups: TeamGroup[] = [
  {
    title: "Board of Directors",
    members: [
      { id: "danny-kim", role: "Co-Chair & Organizer" },
      { id: "niki-fereidooni", role: "Co-Chair & Organizer" },
      { id: "sophia-kim", role: "Treasurer & Organizer" },
      { id: "natasha-kasunic", role: "Board Member, Partnerships & Community Lead" },
      { id: "tony-ko", role: "Board Member & Digital Lead" },
    ],
  },
  {
    title: "Core Team",
    members: [
      { id: "thannia-blanchet", role: "Organizer" },
      { id: "john-malapit", role: "Organizer" },
      { id: "robert-so", role: "Organizer" },
      { id: "eileen-xue" },
      { id: "rodrigo-curbelo", role: "Organizer" },
      { id: "rohan-villoth", role: "Video Content Lead" },
      { id: "abu-saeed", role: "Event Promotion Lead" },
    ],
  },
  {
    title: "Design Team",
    members: [{ id: "victoria-sze" }, { id: "mabel-kasunic" }],
  },
  {
    title: "Digital Team",
    members: [
      { id: "tony-ko" },
      { id: "danny-kim" },
      { id: "rohan-villoth" },
      { id: "danyal-imran" },
      { id: "justin-bento" },
      { id: "jyle-vergara" },
      { id: "john-malapit" },
      { id: "jacky-tea" },
      { id: "marco-campos" },
      { id: "nana-ogasawara" },
    ],
  },
  {
    title: "Social Media",
    members: [
      { id: "amanda-collantes" },
      { id: "sophia-kim" },
      { id: "natasha-kasunic" },
      { id: "niki-fereidooni" },
      { id: "beatrice-yu" },
    ],
  },
  {
    title: "Community Volunteers",
    members: [
      { id: "charu-idnani", role: "CodeDiversity" },
      { id: "garv-gupta", role: "General" },
      { id: "nhi-nguyen", role: "General" },
      { id: "rana-soyak", role: "General" },
      { id: "john-malapit", role: "General, Sashimis (Sports)" },
      { id: "danyal-imran", role: "General" },
      { id: "justin-bento", role: "General" },
      { id: "lune-moreau", role: "General" },
      { id: "ayushi-guha", role: "General" },
      { id: "carmen-lam", role: "General" },
    ],
  },
];

/** Resolves a group's member ids to full member details, in the group's display order. */
export function getGroupMembers(group: TeamGroup): TeamGroupMember[] {
  return group.members.map(({ id, role }) => ({ ...teamMembers[id], id, role }));
}

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Careers", href: "#careers" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const HERO_SLIDES = [
  {
    id: "1",
    title: "Nova Finance",
    src: "/images/work-1.svg",
  },
  {
    id: "2",
    title: "Orbit Labs",
    src: "/images/work-2.svg",
  },
  {
    id: "3",
    title: "Pulse Health",
    src: "/images/work-3.svg",
  },
] as const;

/** Three equal tiles per row in the works gallery. */
export type WorkItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  src: string;
  poster?: string;
  media?: "image" | "video";
  href?: string;
};

export const WORKS: WorkItem[] = [
  {
    id: "w7",
    title: "Don't stop",
    client: "OCAGE",
    year: "2026",
    src: "/images/works/sample-01.png",
  },
  {
    id: "w8",
    title: "Blossom",
    client: "Editorial",
    year: "2026",
    src: "/images/works/sample-02.png",
  },
  {
    id: "w9",
    title: "Ace",
    client: "RCDL",
    year: "2026",
    src: "/images/works/sample-03.png",
  },
  {
    id: "w10",
    title: "Twentyeight",
    client: "Sayansenapati",
    year: "2026",
    src: "/images/works/sample-04.png",
  },
  {
    id: "w11",
    title: "Ambush",
    client: "Streetwear",
    year: "2026",
    src: "/images/works/sample-05.png",
  },
  {
    id: "w12",
    title: "Nine lives",
    client: "Poster",
    year: "2026",
    src: "/images/works/sample-06.png",
  },
  {
    id: "w1",
    title: "Crafted for your perfect cup",
    client: "Kopvie",
    year: "2026",
    src: "/images/kopvie.png",
  },
  {
    id: "w2",
    title: "Everyday deals, boldly packaged",
    client: "Krosan",
    year: "2026",
    src: "/images/krosan.jpg",
  },
  {
    id: "w3",
    title: "Smarter spending starts here",
    client: "Tustee",
    year: "2025",
    src: "/images/tustee.png",
  },
  {
    id: "w4",
    title: "A club identity built for play",
    client: "Padelhub",
    year: "2025",
    src: "/images/padelhub.png",
  },
  {
    id: "w5",
    title: "Sunlight in a can",
    client: "Osuika",
    year: "2024",
    src: "/images/osuika.png",
  },
  {
    id: "w6",
    title: "Editorial systems for beauty",
    client: "Arvela",
    year: "2024",
    src: "/images/arvela.png",
  },
];

/** Two equal tiles per row - website design showcase below the main gallery. */
export const WEBSITE_WORKS: WorkItem[] = [
  {
    id: "web1",
    title: "3D printing agency",
    client: "Susi Labs",
    year: "2026",
    media: "video",
    src: "/videos/works/susi-labs.mp4",
    poster: "/images/works/website-01.png",
    href: "https://susilabs.in/",
  },
  {
    id: "web2",
    title: "Tactical training",
    client: "The Kraken",
    year: "2026",
    media: "video",
    src: "/videos/works/the-kraken.mp4",
    poster: "/images/works/website-02.png",
    href: "https://www.thekrakentraining.com/",
  },
  {
    id: "web3",
    title: "Unlocking Japan's hidden gems",
    client: "Sakazuki",
    year: "2026",
    media: "video",
    src: "/videos/works/sakazuki.mp4",
    poster: "/images/works/website-03.png",
    href: "https://sakazuki.io/",
  },
  {
    id: "web4",
    title: "Anti-shahid battalion",
    client: "Darknode",
    year: "2026",
    media: "video",
    src: "/videos/works/darknode.mp4",
    poster: "/images/works/website-04.png",
    href: "https://www.darknode.army/en",
  },
  {
    id: "web5",
    title: "Film & motion portfolio",
    client: "Podium",
    year: "2026",
    media: "video",
    src: "/videos/works/podium.mp4",
    poster: "/images/works/website-05.png",
    href: "https://podium.global/",
  },
  {
    id: "web6",
    title: "Nothing shown first",
    client: "Obsidian Assembly",
    year: "2026",
    media: "video",
    src: "/videos/works/obsidian-assembly.mp4",
    poster: "/images/works/website-06.png",
    href: "https://obsidianassembly.com/",
  },
];

export const BRANDING_FEATURES = [
  {
    id: "01",
    title: "Fast-track your MVP with seamless branding",
    body: "We help you launch with a strong visual identity from day one. Logo, UI/UX, and brand elements are crafted to reflect your product's essence. Quick execution without sacrificing quality.",
  },
  {
    id: "02",
    title: "Designed for startups, built to scale",
    body: "Our branding approach grows with you, from MVP to full-scale launch. With flexible plans and scalable design systems, your brand is never boxed in by early limitations.",
  },
  {
    id: "03",
    title: "All-in-one creative partner for your MVP",
    body: "Logo, UI/UX, motion, and illustration, all done by one unified team. No need to manage multiple freelancers or vendors. You focus on the product, we handle the visuals.",
  },
  {
    id: "04",
    title: "Fast turnaround, on your timeline",
    body: "We understand startup timelines, and our Business Plan guarantees execution within a month. Get investor-ready designs and presentation-friendly assets to confidently pitch your MVP.",
  },
] as const;

export const SERVICE_GROUPS = [
  {
    id: "graphic",
    title: "Graphic &\nBranding Design",
    items: [
      "Logo Design",
      "Brand Guidelines",
      "Brand Implementation",
      "Stationary Design",
      "Pitch Deck Design",
      "Icon Design",
      "Infographic Design",
      "Social Media Design",
      "Print Design",
    ],
  },
  {
    id: "motion",
    title: "Illustration &\nMotion Graphic",
    items: [
      "2D Illustration",
      "Character Design",
      "Mascot Design",
      "Isometric Illustration",
      "Digital Painting",
      "Logo Animation",
      "2D Animation",
      "Digital Media Animation",
      "Pitch Deck Animation",
    ],
  },
  {
    id: "uiux",
    title: "UIUX\nDesign",
    items: [
      "Mobile App Design",
      "Website Design",
      "Dashboard Design",
      "Responsive Design",
      "Design System",
      "UX Design",
      "Information Architecture",
      "Prototyping",
      "Website Development",
    ],
  },
] as const;

const SUBSCRIPTION_FEATURES = [
  "Execute All Works",
  "Branding, UIUX, Illustration, and Motion",
  "Unlimited Request",
  "Unlimited Revisions",
  "Pause & Cancel Anytime",
  "2 Designer & 1 Project Manager",
  "Daily & Weekly Reporting",
  "1 Month Timelines",
] as const;

const SUBSCRIPTION_FEATURES_EXTRA = [
  "2 Active Task in a day",
  "1-2 day Turnaround",
  "1 Art Director",
] as const;

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter Plan",
    badge: "Best for New Business",
    project: {
      price: "$1.599",
      unit: "/brand",
      features: [
        "Logo Design",
        "Visual Guidelines",
        "Stationary/Print Design",
        "Social Media Design",
        "Premium Mockups",
        "Unlimited Revisions",
        "1 Designer & 1 Project Manager",
        "Daily & Weekly Reporting",
      ],
    },
    subscription: {
      price: "$2.899",
      unit: "/month",
      features: [...SUBSCRIPTION_FEATURES],
      featuresExtra: [...SUBSCRIPTION_FEATURES_EXTRA],
    },
  },
  {
    id: "business",
    name: "Business Plan",
    badge: "Most Popular 🔥",
    project: {
      price: "$3.899",
      unit: "/package",
      features: [
        "All Basic Plan included",
        "Brand Guidelines",
        "Motion Design",
        "Illustration",
        "Landing Page & Development",
        "1-2 Month Timelines",
        "Unlimited Request",
        "Unlimited Revisions",
        "1 Art Director",
      ],
    },
    subscription: {
      price: "$2.699",
      unit: "/month",
      features: [...SUBSCRIPTION_FEATURES],
      featuresExtra: [...SUBSCRIPTION_FEATURES_EXTRA],
    },
  },
  {
    id: "custom",
    name: "Custom Plan",
    badge: "More Flexible",
    project: {
      price: "Custom Plan",
      unit: "",
      features: [
        "Branding Design",
        "Graphic Design",
        "UIUX Design",
        "Illustration",
        "Motion Graphic",
        "Webflow Development",
        "Framer Development",
      ],
    },
    subscription: {
      price: "Custom Plan",
      unit: "",
      features: [
        "Branding Design",
        "Graphic Design",
        "UIUX Design",
        "Illustration",
        "Motion Graphic",
        "Webflow Development",
        "Framer Development",
      ],
    },
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Subscribe Plan",
    description:
      "Choose a plan that fits your business, whether you need foundational branding or full creative support. Our flexible monthly options are built to help startups grow and scale. Subscribe, and we'll get started within 24 hours.",
  },
  {
    number: "02",
    title: "Submit Unlimited Design Requests",
    description:
      "Send in as many design tasks as you need: logo, social media, UI/UX, or brand assets. We'll help prioritize based on your goals and timelines. No limits, just clear creative flow.",
  },
  {
    number: "03",
    title: "We Craft, You Review",
    description:
      "Our team starts working right away, updating you with daily and weekly progress. Each design is shaped with your vision in mind. We revise until it's perfect, with no extra cost and no stress.",
  },
  {
    number: "04",
    title: "Approve & Receive Final Files",
    description:
      "Once approved, we deliver all assets in ready-to-use formats. Your brand visuals are now complete, seamless, and impactful. Just download and launch.",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: "01",
    name: "Hugo Cortez",
    company: "Blomer",
    year: "2023",
    avatar: "/images/partners/hugo-cortez.avif",
    logo: "/images/partners/blomer.avif",
    feedback:
      "FIVEO's clarity and craft made every review feel effortless. They moved fast without ever losing the brand's voice.",
    services: ["Branding", "Pitch Deck", "Motion Design", "Web Design"],
  },
  {
    id: "02",
    name: "Antonio R.",
    company: "Solventlife",
    year: "2024",
    avatar: "/images/partners/antonio-r.avif",
    logo: "/images/partners/solventlife.avif",
    feedback:
      "FIVEO truly captured our vision and turned it into a stunning brand. Their team was creative, responsive, and a pleasure to work with. We're thrilled with the results!",
    services: ["Dashboard", "Pitch Deck", "Motion Graphic", "Graphic Design"],
  },
  {
    id: "03",
    name: "Fazil",
    company: "Uneek Clothing",
    year: "2024",
    avatar: "/images/partners/fazil.avif",
    logo: "/images/partners/uneek.avif",
    feedback:
      "FIVEO's fast responses and unique style, which perfectly aligned with our brand vision, impressed me the most!",
    services: ["Branding", "Pitch Deck", "Motion Design", "Web Design"],
  },
  {
    id: "04",
    name: "Jonathan",
    company: "Melanin Doctor",
    year: "2024",
    avatar: "/images/partners/jonathan.avif",
    logo: "/images/partners/melanin-doctor.avif",
    feedback:
      "Working with FIVEO felt like adding a senior design team overnight: sharp systems, clear communication, and beautiful delivery.",
    services: ["Brand Guidelines", "UIUX Design", "Social Media", "Webflow"],
  },
  {
    id: "05",
    name: "Rico",
    company: "Blomer",
    year: "2023",
    avatar: "/images/partners/rico.avif",
    logo: "/images/partners/blomer.avif",
    feedback:
      "They feel like an extension of our team: fast, precise, and obsessively consistent across every touchpoint.",
    services: ["Product Design", "Motion Design", "Illustration", "Landing Page"],
  },
  {
    id: "06",
    name: "Wael Amor",
    company: "Al Furqon",
    year: "2025",
    avatar: "/images/partners/wael-amor.avif",
    logo: "/images/partners/al-furqon.avif",
    feedback:
      "From first concept to final files, FIVEO kept everything seamless. The work landed strong and stayed on brand.",
    services: ["Branding", "Packaging", "Motion Graphic", "Framer"],
  },
] as const;

export const PARTNER_LOGOS_TOP = [
  { name: "Hyllo", src: "/images/logos/hyllo.avif" },
  { name: "Uneek", src: "/images/logos/uneek.avif" },
  { name: "Bridge", src: "/images/logos/bridge.avif" },
  { name: "Sahlah", src: "/images/logos/sahlah.avif" },
  { name: "Blomer", src: "/images/logos/blomer.avif" },
  { name: "Hamlet", src: "/images/logos/hamlet.avif" },
] as const;

export const PARTNER_LOGOS_BOTTOM = [
  { name: "Melanin Doctor", src: "/images/logos/melanin-doctor.avif" },
  { name: "HDS", src: "/images/logos/hds.avif" },
  { name: "Axcel Partners", src: "/images/logos/axcel-partners.avif" },
  { name: "Solvent Life", src: "/images/logos/solvent-life.avif" },
  { name: "Omoc", src: "/images/logos/omoc.avif" },
  { name: "Bridge", src: "/images/logos/bridge.avif" },
] as const;

/** Habito footer link grid - three columns, exact labels */
export const FOOTER_LINK_COLUMNS = [
  [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Our Works", href: "#works" },
    { label: "Services", href: "#services" },
  ],
  [
    { label: "How it works", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Condition", href: "#" },
  ],
  [
    { label: "Social Media", href: "#partners" },
    { label: "Dribbble", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Instagram", href: "#" },
  ],
] as const;

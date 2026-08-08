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

export const WORKS = [
  {
    id: "w1",
    title: "Smarter Spending Starts Here",
    client: "Nova Finance",
    src: "/images/work-1.svg",
    span: "large",
  },
  {
    id: "w2",
    title: "Identity for Scale",
    client: "Orbit Labs",
    src: "/images/work-2.svg",
    span: "tall",
  },
  {
    id: "w3",
    title: "Calm Product Language",
    client: "Pulse Health",
    src: "/images/work-3.svg",
    span: "wide",
  },
  {
    id: "w4",
    title: "Launch-Ready Brand System",
    client: "Fieldnote",
    src: "/images/work-4.svg",
    span: "large",
  },
  {
    id: "w5",
    title: "Motion that Converts",
    client: "Relay Co",
    src: "/images/work-5.svg",
    span: "tall",
  },
] as const;

export const SERVICES = [
  "Brand Identity",
  "UI / UX Design",
  "Design Systems",
  "Motion Graphics",
  "Product Launch",
  "Creative Direction",
] as const;

export const PRICING_PLANS = [
  {
    name: "Starter Plan",
    price: "$2,999",
    period: "/mo",
    description: "Foundational branding for early-stage products.",
    features: [
      "Logo & visual identity",
      "Brand guidelines",
      "2 revision rounds",
      "48h average turnaround",
    ],
  },
  {
    name: "Business Plan",
    price: "$4,999",
    period: "/mo",
    description: "Full creative support for growing teams.",
    features: [
      "Everything in Starter",
      "UI/UX & product design",
      "Unlimited requests*",
      "Dedicated creative lead",
    ],
  },
  {
    name: "Custom Plan",
    price: "Custom",
    period: "",
    description: "Tailored partnership for scale-ups.",
    features: [
      "Multi-brand systems",
      "Motion & illustration",
      "Priority queue",
      "On-site workshops",
    ],
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover & Align",
    description:
      "We map your product goals, audience, and constraints so every visual decision moves the business forward.",
  },
  {
    number: "02",
    title: "Design & Iterate",
    description:
      "Rapid exploration, clear feedback loops, and production-ready assets delivered on a predictable cadence.",
  },
  {
    number: "03",
    title: "Launch & Scale",
    description:
      "Systems, motion, and templates that stay coherent as your product and team grow.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Working with FIVEO elevated our brand to a whole new level. Their branding and UX expertise made every collaboration effortless.",
    author: "Maya Chen",
    role: "Founder, Nova Finance",
  },
  {
    quote:
      "They feel like an extension of our team — fast, precise, and obsessively consistent across every touchpoint.",
    author: "Jordan Blake",
    role: "Head of Product, Orbit Labs",
  },
] as const;

export const PARTNERS = [
  "NOVA",
  "ORBIT",
  "PULSE",
  "FIELD",
  "RELAY",
  "NORTH",
  "PIXEL",
  "STACK",
] as const;

export const FOOTER_COLUMNS = {
  navigation: [
    { label: "About", href: "#about" },
    { label: "Works", href: "#works" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X / Twitter", href: "#" },
    { label: "Behance", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
} as const;

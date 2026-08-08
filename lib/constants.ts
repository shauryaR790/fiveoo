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

/**
 * `span` drives the asymmetric grid: "sm" takes a quarter of the row, "lg"
 * takes half, so rows read 3 + 3 + 6 and 6 + 3 + 3.
 */
export const WORKS = [
  {
    id: "w1",
    title: "Crafted for your perfect cup",
    client: "Kopvie",
    year: "2026",
    src: "/images/kopvie.png",
    span: "sm",
  },
  {
    id: "w2",
    title: "Everyday deals, boldly packaged",
    client: "Krosan",
    year: "2026",
    src: "/images/krosan.jpg",
    span: "sm",
  },
  {
    id: "w3",
    title: "Smarter spending starts here",
    client: "Tustee",
    year: "2025",
    src: "/images/tustee.png",
    span: "lg",
  },
  {
    id: "w4",
    title: "A club identity built for play",
    client: "Padelhub",
    year: "2025",
    src: "/images/padelhub.png",
    span: "lg",
  },
  {
    id: "w5",
    title: "Sunlight in a can",
    client: "Osuika",
    year: "2024",
    src: "/images/osuika.png",
    span: "sm",
  },
  {
    id: "w6",
    title: "Editorial systems for beauty",
    client: "Arvela",
    year: "2024",
    src: "/images/arvela.png",
    span: "sm",
  },
] as const;

export const BRANDING_FEATURES = [
  {
    id: "01",
    title: "Fast-track your MVP with seamless branding",
    body: "We help you launch with a strong visual identity from day one. Logo, UI/UX, and brand elements are crafted to reflect your product's essence. Quick execution without sacrificing quality.",
  },
  {
    id: "02",
    title: "Designed for startups, built to scale",
    body: "Our branding approach grows with you — from MVP to full-scale launch. With flexible plans and scalable design systems, your brand is never boxed in by early limitations.",
  },
  {
    id: "03",
    title: "All-in-one creative partner for your MVP",
    body: "Logo, UI/UX, motion, and illustration — all done by one unified team. No need to manage multiple freelancers or vendors. You focus on the product, we handle the visuals.",
  },
  {
    id: "04",
    title: "Fast turnaround, on your timeline",
    body: "We understand startup timelines — our Business Plan guarantees execution within a month. Get investor-ready designs and presentation-friendly assets to confidently pitch your MVP.",
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

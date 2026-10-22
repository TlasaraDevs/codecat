// Table: developers — one row per developer on the Tlasara platform.
// photo_url may be a path under public/ (e.g. "/images/x.jpg") or a full URL.
// Empty strings in `links` mean "not available yet": the UI shows the icon
// disabled with a "coming soon" tooltip.
export const developers = [
  {
    slug: "codecat",
    name: "Wanjiru Mbuthia",
    handle: "codecat",
    title:
      "Web Developer · IT Support · Aspiring Software Engineer & Cybersecurity Professional",
    roles: [
      "Web Developer",
      "IT Support",
      "Aspiring Software Engineer",
      "Aspiring Cybersecurity Pro",
    ],
    tagline:
      "I build clean, fast websites, keep systems (and the people using them) running, and I'm levelling up toward secure, thoughtful software.",
    bio: [
      "Hi, I'm Wanjiru, known online as codecat. I'm a web developer and IT support technician from Nairobi, Kenya, with a BBIT from Strathmore University and a lifelong habit of taking things apart to see how they work.",
      "Most days I'm building websites or fixing whatever's broken, and I'm working my way toward software engineering and cybersecurity. Machine learning and AI keep pulling me in too. I'm part of Tlasara, a women-focused tech brand building for the web.",
      "When I'm offline I watch a lot of tech YouTube, dig way too deep into the lore of animated shows, and read everything I can: Substack, novels, poetry and, above all, comics. I also write short stories and poems. My ideal afternoon is lounging outside with my feet in the grass, or reading a novel on public transport on a bright, sunny day.",
    ],
    interests: [
      "Comics",
      "Animation & show lore",
      "Creative writing",
      "Novels & poetry",
      "Substack",
      "Tech YouTube",
    ],
    location: "Nairobi, Kenya",
    photo_url: "/images/profile.jpg",
    email: "info@tlasara.dev",
    links: {
      github: "",
      linkedin: "https://www.linkedin.com/in/wanjiru-mbuthia-326091233/",
    },
    organization: {
      name: "Tlasara",
      url: "https://tlasara.dev",
      description: "a women-focused tech brand",
    },
  },
];

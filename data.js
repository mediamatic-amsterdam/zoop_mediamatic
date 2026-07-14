// ─────────────────────────────────────────
// ZOÖNOMIC ANNUAL PLAN — data.js
// Live content (goals, interventions, progress values, intro text) is now
// edited through admin.html and stored in Supabase — see admin-setup.sql.
// This file is the offline fallback the site falls back to if Supabase is
// unreachable or not configured, and the starting content for the "Import
// current content" button in admin.html.
// ─────────────────────────────────────────

const defaultGoals = [
  {
    number: "01",
    // Replace emoji with a path to an SVG in assets/icons/ when ready:
    // icon: "assets/icons/goal-01.svg"
    icon: "🌿",
    name: "Sensitize toward the more-than-human world",
    shortName: "Sensitize",
    desc: "Identification and inventory of all resident and transient more-than-human species within the biotope — building a foundation for long-term, careful stewardship of shared space.",
    interventions: [
      {
        name: "Sense the environment",
        progress: 40, // placeholder 0–100
        period: "April – November 2026",
        body: "Expert research of the water and soil of the biotope. The aquatope is part of PhD research by Max Verweg. Two oxygen sensors and three HARM samplers have been placed. Collaborations with Gemeente Amsterdam, city ecologists Kees Dekker and Jorina Noordman, eco-architect Ikram Hamdi Mansour, and Alwahat Collective.",
        indicators: [
          "Measurements of pollutants in soil & water quality parameters and organisms.",
          "Expert interpretation by UvA researchers: how healthy are the soil and water?"
        ]
      },
      {
        name: "Watch the habitat",
        progress: 25,
        period: "Jan 2026 – Jan 2027",
        body: "Four wildlife cameras and two underwater cameras positioned around the building. Recordings shared on a projection screen, social media, and the website to make visitors aware we share this place with local wildlife.",
        indicators: [
          "A catalog of current species present on land and below the waterline (Aquatoop project).",
          "5–10 aquatic and terrestrial species newly identified that were previously undocumented."
        ]
      },
      {
        name: "Feed the system",
        progress: 55,
        period: "January – December 2026",
        body: "Exploring food as a means to shift power dynamics between humans and more-than-human life. Landscape architect Thijs de Zeeuw researches human-animal food relationships throughout 2026.",
        indicators: [
          "Scraps directly feed animals or indirectly fuel the ecosystem.",
          "Visitors take collective ownership of the feeding process.",
          "Measurable increase in richness and abundance of species around the biotope."
        ]
      },
      {
        name: "Program beyond the human",
        progress: 30,
        period: "Jan 2026 – Jan 2027",
        body: "Actively welcoming arts and programming that moves beyond a human-centric perspective. Non-human entities are treated as active collaborators and co-creators in exhibitions and research.",
        indicators: [
          "% of projects where a more-than-human entity is highlighted as main subject or co-creator.",
          "Programs developed in documented collaboration with ecologists and natural scientists.",
          "Audience feedback showing increased use of 'more-than-human' language."
        ]
      }
    ]
  },
  {
    number: "02",
    icon: "♻️",
    name: "Evolve all material lifecycles into life-supporting systems",
    shortName: "Material cycles",
    desc: "Transform every material we use into a regenerative resource — from restaurant organic waste to biotope fuel, building a closed-loop life-supporting system.",
    interventions: [
      {
        name: "Audit all materials",
        progress: 20,
        period: "January – May 2026",
        body: "Systematic research into all existing and proposed materials to assess true environmental impact, circularity, and regenerative potential. Output: a Mandatory Order List and Disposal Policy.",
        indicators: [
          "% of materials researched and ranked by regenerative potential.",
          "Mandatory Order List and Disposal Policy approved by the Supervisory Board.",
          "Staff trained on the new policy."
        ]
      },
      {
        name: "Reactivate composting",
        progress: 60,
        period: "May – August 2026",
        body: "Reestablishing the composting system at Mediamatic Biotope. Organic material from TestTafel and De Sering Centraal is transformed into a resource cycled back to feed more-than-human life. A closed-loop of four compost bins.",
        indicators: [
          "Reduced organic waste output tracked by diversion from traditional disposal.",
          "Quantity of produced food for more-than-human life forms.",
          "More biological activity in the garden: worms, insects, larvae."
        ]
      }
    ]
  },
  {
    number: "03",
    icon: "📡",
    name: "Reduce dependence on extractive digital platforms",
    shortName: "Digital ecology",
    desc: "Reducing our digital footprint and gradually switching to regenerative alternatives — from Mastodon to lower energy consumption across all operations.",
    interventions: [
      {
        name: "Grow Mastodon presence",
        progress: 35,
        period: "January – December 2026",
        body: "Using @MediamaticZoöp on Mastodon to embody the more-than-human perspective. Goal: migrate 22,000+ Instagram followers toward a more regenerative social media option.",
        indicators: [
          "After 6 months, cross-promotion from Instagram reduced — Mastodon becomes self-sustaining.",
          "Audience engagement steadily increasing over 2026."
        ]
      },
      {
        name: "Clean our digital footprint",
        progress: 15,
        period: "September – December 2026",
        body: "Cleaning Mediamatic's digital footprint and that of people working here. Focus: reducing future consumption, minimizing data transfer, and reducing dependence on extractive platforms.",
        indicators: [
          "Lower energy bills.",
          "Fewer purchases of new tech devices.",
          "Website carbon footprint check completed with follow-up actions."
        ]
      }
    ]
  },
  {
    number: "04",
    icon: "🤝",
    name: "Cultivate mutualistic collaboration among human actors",
    shortName: "Mutualism",
    desc: "Ensuring all participants in our biotope adopt behaviors that directly support Zoöp objectives — through mandatory requirements, behavioral design, and incentives.",
    interventions: [
      {
        name: "Sign collaboration agreements",
        progress: 45,
        period: "September – December 2026",
        body: "All six foundations and creative studio desks at Mediamatic must sign a collaboration agreement confirming their operations align with the regenerative goals of the Zoöp.",
        indicators: [
          "All partner organizations have read and signed the collaboration agreement, formally joining the Zoöp."
        ]
      },
      {
        name: "Eco-Lexicon Hunt",
        progress: 70,
        period: "January – March 2026",
        body: "Twelve small plates spread around Mediamatic, each featuring an ecological term. Placed in unusual locations with illustrations by Silke Riis. A QR code links to a full lexicon on the website.",
        indicators: [
          "Amount of visitors who scanned the QR codes.",
          "Social media interaction and visitor numbers.",
          "Increased use of lexicon terms in Mediamatic articles."
        ]
      }
    ]
  },
  {
    number: "05",
    icon: "📢",
    name: "Highlight more-than-human stakeholders in all communications",
    shortName: "Communication",
    desc: "Shifting our community's focus by integrating more-than-human stakeholders into all communications — from the website to Open Friday tours.",
    interventions: [
      {
        name: "Rewrite organizational identity",
        progress: 20,
        period: "July – September 2026",
        body: "Revising the Code of Conduct, updating 'About' and 'Mission' sections, and renaming the 'People' tab to 'Organisms' — formally listing more-than-human life as key collaborators.",
        indicators: [
          "Navigation tab renamed from 'People' to 'Organisms.'",
          "Increase in external media mentioning Mediamatic in connection with 'Zoöp' or 'multispecies.'",
          "Frequency of keywords like 'multispecies' or 'water' increasing on the website."
        ]
      },
      {
        name: "Update Open Friday tours",
        progress: 10,
        period: "July – September 2026",
        body: "The Open Friday tour script adapted to include a dedicated segment on Zoöp values. Mediamatic receives 700+ international student visitors per year — tours reach audiences beyond social media.",
        indicators: [
          "% of surveyed tour participants who can correctly define the Zoöp after the tour.",
          "Increase in written visitor comments mentioning the Zoöp or multispecies thinking."
        ]
      }
    ]
  }
];

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
    icon: "assets/icons/goal1.png",
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
    icon: "assets/icons/goal2.png",
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
    icon: "assets/icons/goal3.png",
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
    icon: "assets/icons/goal4.png",
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
    icon: "assets/icons/goal5.png",
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

// ─────────────────────────────────────────
// ECO-LEXICON — floating word cloud content
// Body copy below is placeholder text (accurate in spirit, easy to
// swap out later) — edit freely, order controls the "Eco-Lexicon #N" tag.
// ─────────────────────────────────────────

const ecoLexiconData = [
  {
    id: "biomimicry",
    label: "Biomimicry",
    img: "assets/eco-lexicon/biomimicry.png",
    backImg: "assets/eco-lexicon/biomimicry-back.png",
    body: "The practice of innovating by imitating nature’s powerful models. So using nature as an inspiration to solve human problems. Since evolution forces natural elements to be highly effective and efficient, there is a lot to learn from nature. Adapting nature’s strategies has already led to innovation and improvements in materials, aerodynamics, architecture and human health care. A fascinating example of biomimicry can be seen in the Tokyo railway system. Researchers arranged oat flakes in the pattern of Japanese cities and presented them to a slime mold (Physarum polycephalum)"
  },
  {
    id: "eco-somatics",
    label: "Eco-Somatics",
    img: "assets/eco-lexicon/eco-somatics.png",
    backImg: "assets/eco-lexicon/eco-somatics-back.png",
    body: "Interdisciplinary field that explores the deep connection between the body, mind and the natural environment. It emphasizes how the physical- and mental health of humans is intrinsically linked to ecological health. You can see it as psychosomatics + ecosystem well being.",
  },
  {
    id: "deep-ecology",
    label: "Deep Ecology",
    img: "assets/eco-lexicon/deep-ecology.png",
    backImg: "assets/eco-lexicon/deep-ecology-back.png",
    body: "A philosophical movement, established by Arne Naess, that values the flourishing of all life on earth. It considers humans as an intrinsic part of nature and emphasizes the need to heal the relationship between human life and other-than-human life. This movement wants to protect natural life for its intrinsic value, without reference to their usefulness to humans. The movement is inspired  by Indian Hindu and Buddhist traditions and made to be accessible to people with all beliefs and backgrounds.",
  },
  {
    id: "chthulucene",
    label: "Chthulucene",
    img: "assets/eco-lexicon/chthulucene.png",
    backImg: "assets/eco-lexicon/chthulucene-back.png",
    body: "Yes this is an actual term. Coined by Donna Haraway as a critical alternative to the Anthropocene. It refers to an era where we move beyond the human-centric dominance and create new collaborations with species to foster survival of all organisms. It also means acknowledging the imperfect reality of living on a damaged earth with deteriorated ecosystems. So co-creating (by interpespecies collaboration) a livable future with what’s left of planet earth.",
  },
  {
    id: "eco-sexuality",
    label: "Eco-Sexuality",
    img: "assets/eco-lexicon/eco-sexuality.png",
    backImg: "assets/eco-lexicon/eco-sexuality-back.png",
    body: "As with any sexuality-term it can be widely interpreted and it can have different meanings for every individual. Some ways to describe eco-sexuality is ‘A person that finds nature romantic, sensual and sexy’, ‘A person who imagines the Earth as their lover’ or ‘A person interested in environmentalism’. A term that entices people to develop a more mutual, pleasurable and less destructive relationship with the environment. By turning ‘Mother earth’ to ‘Lover earth’, the relationship between humans and the earth turns more reciprocal and emphatic.",
  },
  {
    id: "eco-emotions",
    label: "Eco-Emotions",
    img: "assets/eco-lexicon/eco-emotions.png",
    backImg: "assets/eco-lexicon/eco-emotions-back.png",
    body: "The physiological response in humans to climate change and ecological deterioration. Emotions that are caused by the current climate crisis, affecting mental health. As the climate crisis keeps unfolding, more and more people start to suffer from negative eco emotions. Such as eco-anxiety, eco-grief, eco-frustration and so on. There are also positive emotions toward ecology, such as eco-interest, eco-hope or eco-gratitute.  A good example is the frustration you feel when you hear on the news about the hundreds of acres of amazon forest disappearing every day while there is nothing you can do about it.",
  },
  {
    id: "ecocentrism",
    label: "Ecocentrism",
    img: "assets/eco-lexicon/ecocentrism.png",
    backImg: "assets/eco-lexicon/ecocentrism-back.png",
    body: "The opposite of Anthropocentrism: A nature-centric vision of the world, which recognizes that all entities in the natural world have intrinsic value, independent of human interests. In this view, other-than-human life is not valued for its usefulness to humans. Adopting this philosophical stance is crucial for Mediamatic in order to be a Zoöp.",
  },
  {
    id: "speaker-for-the-living",
    label: "Speaker for the Living",
    img: "assets/eco-lexicon/speaker-for-the-living.png",
    backImg: "assets/eco-lexicon/speaker-for-the-living-back.png",
    body: "Part of the Zoöp organisation model. A human that translates the interests and needs of the other-than-human life forms. Just because other organisms don’t communicate in the same way, doesn’t mean that they shouldn’t be listened to. Every Zoöp has their own Speaker for the living. They have (at least) basic ecological knowledge and have some understanding of the working atmosphere of the Zoöp. Jolanda Verspagen will do this translating for Mediamatic and will be involved in the decision making progress.",
  },
  {
    id: "zoonomic-institute",
    label: "Zoönomic Institute",
    img: "assets/eco-lexicon/zoonomic-institute.png",
    backImg: "assets/eco-lexicon/zoonomic-institute-back.png",
    body: "A small group of people that form the base of the Zoöp movement. They help organisations, like Mediamatic, to become a Zoöp and reach their regenerative goals. The ZI supports Zoöps by providing them with tools, tips, methods and training. For more information on the Zoöp movement, check our website!",
  },
  {
    id: "anthroponic-system",
    label: "Anthroponic System",
    img: "assets/eco-lexicon/anthroponic-system.png",
    backImg: "assets/eco-lexicon/anthroponic-system-back.png",
    body: "A type of hydroponic system that uses human waste as a nutrient source for the plants that grow in the system. Primarily urine is used. Bacteria in the system convert urea (from the waste) into plant-usable nitrates through nitrification.",
  },
  {
    id: "biotope",
    label: "Biotope",
    img: "assets/eco-lexicon/biotope.png",
    backImg: "assets/eco-lexicon/biotope-back.png",
    body: "An area with a uniform landscape type (soil, water, climate) in which a particular community of organisms can thrive. You can see the biotope as some kind of ‘home’ for several organisms, and the different types of organisms have their own ‘room’ in the house: their habitat.",
  },
  {
    id: "other-than-human-lifeform",
    label: "Other-Than-Human Lifeform",
    img: "assets/eco-lexicon/other-than-human-lifeform.png",
    backImg: "assets/eco-lexicon/other-than-human-lifeform-back.png",
    body: "Any type of organism that is not a homo sapien. So all the living things, us humans, share the planet with. So from the biggest mammals to the smallest archaea. As a Zoöp, mediamatic gives the other-than-human life forms surrounding us a voice in decision making.", 
  }
].map((term, i) => ({ ...term, subtitle: `Eco-Lexicon #${i + 1}` }));

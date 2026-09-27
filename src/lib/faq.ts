export type FaqMode = "employer" | "client";

export type FaqItem = {
  q: string;
  a: string;
};

export const EMPLOYER_FAQ: FaqItem[] = [
  {
    q: "How do you work in a team?",
    a: "I'm open, patient, and easy to work with. I listen, communicate clearly, and enjoy collaborating, but I'm also comfortable sharing my opinion, taking initiative, and leading a direction when needed.",
  },
  {
    q: "How do you handle feedback?",
    a: "I'm comfortable admitting when something needs improvement. I take constructive feedback seriously, evaluate it objectively, and make the changes needed to move the work forward.",
  },
  {
    q: "How do you handle pressure and deadlines?",
    a: "I work well under pressure and I'm willing to be available when needed. I'm highly motivated to work, learn, and keep improving even when things move fast.",
  },
  {
    q: "How do you approach a problem you haven't solved before?",
    a: "I use AI tools as part of my workflow to research, test, and understand new problems quickly. I like to investigate first, come prepared, and then focus on finding the right solution.",
  },
  {
    q: "What kind of team do you thrive in?",
    a: "I thrive in a positive, supportive team where people help each other, but I also enjoy challenge and healthy competition. I'm always looking to learn from experienced people, both in my field and beyond it.",
  },
  {
    q: "What do you bring to a team beyond design skills?",
    a: "I'm highly motivated to learn, grow, and improve the things around me. I take initiative, care about the success of the team and the company, and I naturally try to contribute to a positive environment where people support each other.",
  },
];

export const CLIENT_FAQ: FaqItem[] = [
  {
    q: "How long does a typical project take?",
    a: "It depends on the project, but most take between one and three weeks. More complex projects or larger branding work may take longer, depending on the scope and timeline we agree on.",
  },
  {
    q: "How does the process work, and how do I share feedback?",
    a: "Whatever is easiest for you - WhatsApp, email, or a phone call. I stay available, share progress along the way, and make sure you feel involved throughout the process.",
  },
  {
    q: "What files will I receive at the end of the project?",
    a: "Everything you need based on the project - logo files in formats such as SVG, PNG, and PDF, social media assets, print-ready files, and anything else agreed on in advance.",
  },
  {
    q: "Do you offer support after the project is finished?",
    a: "Yes. I'm still available after delivery if you need a small adjustment, an update, or another professional opinion.",
  },
  {
    q: "How many revision rounds are included?",
    a: "Usually 2-3 rounds. I focus less on counting changes and more on making sure the final result feels accurate and right for both sides.",
  },
  {
    q: "Can you also help prepare files for print or development?",
    a: "Yes. When needed, I can coordinate with print suppliers or developers to help make sure the final result works properly in both digital and print.",
  },
];

export const FAQ_SETS: Record<FaqMode, FaqItem[]> = {
  employer: EMPLOYER_FAQ,
  client: CLIENT_FAQ,
};

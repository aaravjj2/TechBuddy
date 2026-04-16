export type PracticeScenario = {
  slug: string;
  title: string;
  shortDescription: string;
  /** Passed to Claude as SCENARIO: {scenario_description} */
  scenarioDescription: string;
};

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    slug: "fake-tech-support",
    title: "Fake Tech Support Call",
    shortDescription:
      "Someone claims to be from Microsoft and says your computer has a virus.",
    scenarioDescription:
      "Fake Tech Support Call — The scammer pretends to be Microsoft (or similar). They say: 'This is Microsoft. Your computer has a virus. We need remote access.' They pressure the senior to install software or pay for fake repairs.",
  },
  {
    slug: "grandchild-in-trouble",
    title: "Grandchild in Trouble",
    shortDescription:
      "A caller pretends to be a grandchild who urgently needs bail money.",
    scenarioDescription:
      "Grandchild in Trouble — The scammer says something like: 'Grandma, it's me, I'm in jail and need bail money wired right now.' They create panic and secrecy.",
  },
  {
    slug: "fake-amazon-alert",
    title: "Fake Amazon Alert",
    shortDescription:
      "A text says your Amazon order was flagged and you must verify your account.",
    scenarioDescription:
      "Fake Amazon Alert — A text message says: 'Your Amazon order has been flagged. Verify your account.' It includes a link that is not the real Amazon website.",
  },
  {
    slug: "social-security-suspension",
    title: "Social Security Suspension",
    shortDescription:
      "A caller claims your Social Security number is suspended due to suspicious activity.",
    scenarioDescription:
      "Social Security Suspension — The scammer says: 'Your Social Security number has been suspended due to suspicious activity.' They ask for personal information or payment.",
  },
  {
    slug: "lottery-winner",
    title: "Lottery Winner",
    shortDescription:
      "You're told you won a large prize but must pay a fee first.",
    scenarioDescription:
      "Lottery Winner — The scammer says: 'Congratulations! You've won $50,000. Just pay the processing fee of $200.' Real prizes do not ask winners to pay fees upfront.",
  },
  {
    slug: "medicare-scam",
    title: "Medicare Card Update",
    shortDescription:
      "A caller says Medicare needs your new card number or you'll lose benefits.",
    scenarioDescription:
      "Medicare Card Update — The scammer says: 'This is Medicare. We are issuing new cards and need to verify your Medicare number to keep your benefits active.' They try to get the senior's Medicare number and bank details.",
  },
  {
    slug: "romance-scam",
    title: "Online Sweetheart",
    shortDescription:
      "Someone you met online professes love quickly, then asks for money.",
    scenarioDescription:
      "Online Sweetheart — The scammer builds a relationship over weeks on social media or email. They say they live far away, profess deep love, then create an emergency situation requiring the senior to wire money. They always have an excuse for not meeting in person or video calling.",
  },
  {
    slug: "refund-scam",
    title: "Refund for Overpayment",
    shortDescription:
      "Someone claims you overpaid and need to 'verify' your bank details for a refund.",
    scenarioDescription:
      "Refund for Overpayment — The scammer says: 'You overpaid for your electricity bill. We need your bank account number to deposit the refund of $350.' They want access to the senior's bank account.",
  },
  {
    slug: "government-grant",
    title: "Government Grant Offer",
    shortDescription:
      "A caller says you qualify for a free government grant, but need to pay a processing fee.",
    scenarioDescription:
      "Government Grant Offer — The scammer says: 'You have been selected for a government grant of $9,000. You just need to pay a $250 processing fee via wire transfer or gift card.' The government does not contact people this way or ask for fees.",
  },
];

export function getScenarioBySlug(slug: string): PracticeScenario | undefined {
  return PRACTICE_SCENARIOS.find((s) => s.slug === slug);
}

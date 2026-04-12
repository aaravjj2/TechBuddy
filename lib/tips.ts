export type TipCategory = "Scam Safety" | "Phone Skills" | "Online Safety" | "Privacy";

export type DailyTip = {
  title: string;
  body: string;
  action?: string;
  category: TipCategory;
};

export const TIP_CATEGORIES: TipCategory[] = [
  "Scam Safety",
  "Phone Skills",
  "Online Safety",
  "Privacy",
];

/** 20 tips; selection uses local calendar day: day-of-year % 20 */
export const TIPS: DailyTip[] = [
  {
    title: "Your bank will never text you for your password",
    body: "Real banks do not send texts asking you to reply with your password or full account number. If you get a message like that, it is almost always a scam.",
    action: "If you're worried, call the number on the back of your card—not the number in the text.",
    category: "Scam Safety",
  },
  {
    title: "Make text bigger on any website",
    body: "On most computers, hold the Ctrl key and press the plus key (+) to zoom in. On a phone, use Settings to increase text size for the whole device.",
    action: "Try pressing Ctrl and + once on this device to see the page grow.",
    category: "Phone Skills",
  },
  {
    title: "AI assistants don't truly 'know' you",
    body: "Apps like ChatGPT can sound personal, but they do not store your private life the way a friend would. Treat them like a helpful pamphlet, not a trusted confidant for secrets.",
    category: "Online Safety",
  },
  {
    title: "HTTPS means a safer connection",
    body: "If a website address starts with 'https://', the connection is usually encrypted. 'http://' alone is older and less safe for entering passwords.",
    action: "Look for the little lock icon next to the address bar before you log in.",
    category: "Online Safety",
  },
  {
    title: "You can hang up on uncomfortable calls",
    body: "If a phone call makes you feel rushed, scared, or confused, you are allowed to hang up. You do not owe a stranger your time or your information.",
    action: "Practice saying: 'I am not interested. Goodbye.' Then hang up.",
    category: "Scam Safety",
  },
  {
    title: "Public WiFi is not for passwords",
    body: "Free WiFi at coffee shops or airports is handy for browsing news, but it is not a safe place to log into banking or enter credit card numbers.",
    action: "Wait until you are home or use your phone's cellular data for sensitive tasks.",
    category: "Online Safety",
  },
  {
    title: "Check urgent 'family' calls carefully",
    body: "If someone claims to be your grandchild and needs money right away, hang up and call your family member on a number you already trust.",
    category: "Scam Safety",
  },
  {
    title: "Updates help keep your phone safer",
    body: "App and system updates often fix security problems. You do not need to do them the second they appear, but try not to ignore them for months.",
    category: "Phone Skills",
  },
  {
    title: "Screenshots are handy proof",
    body: "Learning to take a screenshot lets you save a picture of a suspicious text or web page to show a family member or report a scam.",
    category: "Phone Skills",
  },
  {
    title: "Slow down before you click",
    body: "Scammers rely on hurry. If a message says 'act now or your account will close,' take a breath and verify through an official website or phone number you look up yourself.",
    category: "Scam Safety",
  },
  {
    title: "Gift cards are a red flag",
    body: "Real government offices and real tech companies will not demand payment with gift cards. Anyone insisting on gift cards is almost certainly a scammer.",
    category: "Scam Safety",
  },
  {
    title: "Use bookmarks for important sites",
    body: "Save your bank and email login pages as bookmarks so you return to the real site instead of a fake link from an email.",
    category: "Online Safety",
  },
  {
    title: "Silence unknown callers",
    body: "Many phones let you send unknown numbers straight to voicemail. That reduces interruptions from robocalls while still letting friends leave messages.",
    category: "Phone Skills",
  },
  {
    title: "Two-factor authentication adds a lock",
    body: "When a site offers a second step after your password—like a text code—it makes it harder for strangers to break in, even if they guess your password.",
    category: "Privacy",
  },
  {
    title: "Be careful what you post publicly",
    body: "Scammers read social media too. Avoid sharing travel dates, full birthdays, or details that help someone pretend to know you.",
    category: "Privacy",
  },
  {
    title: "Password managers reduce reuse",
    body: "Reusing one password everywhere is risky. A password manager can remember unique passwords for you so you only memorize one strong master password.",
    category: "Privacy",
  },
  {
    title: "Check sender addresses in email",
    body: "Scammers can fake the display name 'Amazon' or 'Bank' but the email address behind it is often random letters. Look closely before you click.",
    category: "Scam Safety",
  },
  {
    title: "Your phone's flashlight and camera are separate",
    body: "Knowing where basic tools live—flashlight, camera, phone app—helps you feel steadier when someone tries to confuse you on a call.",
    category: "Phone Skills",
  },
  {
    title: "Write down trusted help numbers",
    body: "Keep a short paper list of family, your bank's real number, and local non-emergency help. Paper does not run out of battery in an emergency.",
    category: "Scam Safety",
  },
  {
    title: "It's okay to ask for a second opinion",
    body: "If something feels wrong, show the message to a friend, neighbor, or librarian. Getting a second pair of eyes is smart—not embarrassing.",
    action: "Pick one person you trust and agree to check strange messages with each other.",
    category: "Scam Safety",
  },
];

export function dayOfYearLocal(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getTipForDate(date: Date): DailyTip {
  const idx = dayOfYearLocal(date) % TIPS.length;
  return TIPS[idx]!;
}

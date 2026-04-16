export type PhoneHelpStep = {
  instruction: string;
  imageSrc: string;
  imageAlt: string;
};

export type PhoneHelpTopic = {
  slug: string;
  title: string;
  steps: PhoneHelpStep[];
};

/** 1-based step number in the filename: `/phone-help/{slug}-{n}.png` */
export function stepImagePath(topicSlug: string, stepIndexZeroBased: number): string {
  return `/phone-help/${topicSlug}-${stepIndexZeroBased + 1}.png`;
}

function buildSteps(
  topicSlug: string,
  defs: { instruction: string; imageAlt: string }[],
): PhoneHelpStep[] {
  return defs.map((s, i) => ({
    instruction: s.instruction,
    imageSrc: stepImagePath(topicSlug, i),
    imageAlt: s.imageAlt,
  }));
}

export const PHONE_HELP_TOPICS: PhoneHelpTopic[] = [
  {
    slug: "video-call",
    title: "How to make a video call (FaceTime / Google Meet)",
    steps: buildSteps("video-call", [
      {
        instruction:
          "Open the app you use for video calls, such as FaceTime on iPhone or Google Meet on Android.",
        imageAlt:
          "Illustration highlighting the video call app icon on a phone home screen.",
      },
      {
        instruction:
          "Choose the person you want to call from your contacts or enter their email or phone number.",
        imageAlt:
          "Illustration showing a contact selected before starting a video call.",
      },
      {
        instruction:
          "Tap the video camera button to start the call—wait a moment for it to ring on their side.",
        imageAlt:
          "Illustration pointing to the video camera start button in a calling app.",
      },
      {
        instruction:
          "Hold the phone steady and look toward the small camera at the top of the screen.",
        imageAlt:
          "Illustration of holding a phone at eye level during a video call.",
      },
      {
        instruction:
          "To end the call, tap the red hang up button—same as a normal phone call.",
        imageAlt:
          "Illustration highlighting the red end call button on a video call screen.",
      },
    ]),
  },
  {
    slug: "share-photo",
    title: "How to share a photo with family",
    steps: buildSteps("share-photo", [
      {
        instruction:
          "Open your Photos or Gallery app and tap the picture you want to share.",
        imageAlt: "Illustration of opening a single photo in the gallery app.",
      },
      {
        instruction:
          "Tap the share icon—it usually looks like a box with an arrow pointing up.",
        imageAlt: "Illustration pointing to the share icon on a photo screen.",
      },
      {
        instruction:
          "Choose how to send it, such as Messages or Email, then pick your family member's name.",
        imageAlt: "Illustration of choosing Messages from the share sheet.",
      },
      {
        instruction: "Add a short note if you like, then tap Send.",
        imageAlt:
          "Illustration highlighting the Send button after composing a message.",
      },
    ]),
  },
  {
    slug: "update-apps",
    title: "How to update your apps",
    steps: buildSteps("update-apps", [
      {
        instruction:
          "On iPhone, open the App Store; on Android, open the Play Store.",
        imageAlt: "Illustration of the App Store or Play Store icon.",
      },
      {
        instruction:
          "Look for your profile picture or 'Updates' and tap to see apps waiting for updates.",
        imageAlt: "Illustration pointing to the updates list in an app store.",
      },
      {
        instruction:
          "Tap 'Update' next to one app, or 'Update All' if you are on WiFi and ready.",
        imageAlt: "Illustration highlighting Update All in the app store.",
      },
    ]),
  },
  {
    slug: "bigger-text",
    title: "How to make text bigger on your screen",
    steps: buildSteps("bigger-text", [
      {
        instruction: "Open Settings on your phone.",
        imageAlt: "Illustration of the Settings gear icon.",
      },
      {
        instruction:
          "Tap Display or Accessibility—wording varies slightly by phone.",
        imageAlt:
          "Illustration pointing to Display or Accessibility in Settings.",
      },
      {
        instruction:
          "Find Text size or Font size and move the slider to the right to make text larger.",
        imageAlt: "Illustration of a text size slider being increased.",
      },
      {
        instruction:
          "Go back to your home screen and open Messages to see the new size.",
        imageAlt:
          "Illustration comparing text size before and after changing settings.",
      },
    ]),
  },
  {
    slug: "wifi",
    title: "How to connect to WiFi",
    steps: buildSteps("wifi", [
      {
        instruction: "Open Settings and tap WiFi or Network and Internet.",
        imageAlt: "Illustration of WiFi settings entry.",
      },
      {
        instruction:
          "Turn WiFi on if it is off, then wait for network names to appear.",
        imageAlt: "Illustration showing a list of available WiFi networks.",
      },
      {
        instruction:
          "Tap the name of the network you trust—often your home network—and enter the password if asked.",
        imageAlt:
          "Illustration of selecting a WiFi network and password field.",
      },
      {
        instruction:
          "When you see 'Connected,' you are online—try opening a website to confirm.",
        imageAlt:
          "Illustration showing a connected status next to a WiFi name.",
      },
    ]),
  },
  {
    slug: "charging",
    title: "How to charge your phone correctly",
    steps: buildSteps("charging", [
      {
        instruction:
          "Use the charger that came with your phone or a trusted replacement from the same brand when possible.",
        imageAlt: "Illustration of plugging a phone into a wall charger.",
      },
      {
        instruction:
          "Plug the cable into the charging port gently—do not force it if it does not fit.",
        imageAlt: "Illustration showing correct alignment of a charging cable.",
      },
      {
        instruction:
          "Leave it plugged in until the battery icon shows mostly full—you do not need 100% every time.",
        imageAlt: "Illustration of battery icon filling on the lock screen.",
      },
    ]),
  },
  {
    slug: "mute-call",
    title: "How to mute or unmute yourself on a call",
    steps: buildSteps("mute-call", [
      {
        instruction:
          "During a call, look at the on-screen buttons—mute is often a microphone icon.",
        imageAlt: "Illustration of in-call controls with microphone icon.",
      },
      {
        instruction:
          "Tap the microphone once to mute yourself; others will not hear you until you tap again.",
        imageAlt:
          "Illustration highlighting muted microphone state on a call screen.",
      },
      {
        instruction:
          "Tap the microphone again to unmute when you are ready to speak.",
        imageAlt: "Illustration showing microphone active after unmuting.",
      },
    ]),
  },
  {
    slug: "screenshot",
    title: "How to take a screenshot",
    steps: buildSteps("screenshot", [
      {
        instruction:
          "On many Android phones, press the power button and volume down at the same time for a second.",
        imageAlt: "Illustration of two-button screenshot gesture on Android.",
      },
      {
        instruction:
          "On many iPhones, press the side button and volume up at the same time quickly.",
        imageAlt:
          "Illustration of side and volume up buttons for screenshot on iPhone.",
      },
      {
        instruction:
          "You should see a small preview appear—tap it to edit or share, or swipe it away to save quietly.",
        imageAlt: "Illustration of screenshot thumbnail preview in the corner.",
      },
    ]),
  },
  {
    slug: "strong-passwords",
    title: "How to create a strong password",
    steps: buildSteps("strong-passwords", [
      {
        instruction:
          "Think of a short sentence only you would know, like 'My first dog was named Biscuit in 1995.'",
        imageAlt: "Illustration of thinking of a personal sentence for a password.",
      },
      {
        instruction:
          "Take the first letter of each word and keep the numbers: 'MfdwnBi1995' — that is a strong password.",
        imageAlt: "Illustration showing how to turn a sentence into a password.",
      },
      {
        instruction:
          "Make it even stronger by adding a symbol: 'MfdwnBi1995!' — now it has uppercase, lowercase, numbers, and a symbol.",
        imageAlt: "Illustration of adding a symbol to make the password stronger.",
      },
      {
        instruction:
          "Write it down on paper and keep it somewhere safe at home — not on a sticky note near your computer.",
        imageAlt: "Illustration of storing written passwords in a safe place.",
      },
    ]),
  },
  {
    slug: "install-app",
    title: "How to install a new app",
    steps: buildSteps("install-app", [
      {
        instruction:
          "On iPhone, open the App Store. On Android, open the Play Store. These are the safe places to get apps.",
        imageAlt: "Illustration of the App Store or Play Store icon.",
      },
      {
        instruction:
          "Tap the search bar at the top and type the name of the app you want, like 'WhatsApp' or 'Zoom.'",
        imageAlt: "Illustration of typing an app name in the search bar.",
      },
      {
        instruction:
          "Find the correct app — look for the one with the most reviews and the official developer name. Tap 'Get' or 'Install.'",
        imageAlt: "Illustration highlighting the Install button and developer name.",
      },
      {
        instruction:
          "Wait for the download to finish, then tap 'Open' or find the new app on your home screen.",
        imageAlt: "Illustration of a completed download with the Open button.",
      },
    ]),
  },
  {
    slug: "two-factor",
    title: "What is two-factor authentication and how to turn it on",
    steps: buildSteps("two-factor", [
      {
        instruction:
          "Two-factor authentication (also called 2FA) means that after your password, the website sends a code to your phone to make sure it is really you.",
        imageAlt: "Illustration showing a phone receiving a code after a password is entered.",
      },
      {
        instruction:
          "Open the website or app where you want to turn it on (like your email or bank) and look for 'Settings' then 'Security' or 'Privacy.'",
        imageAlt: "Illustration of navigating to Security settings in an app.",
      },
      {
        instruction:
          "Look for 'Two-factor authentication' or 'Login verification' and tap 'Turn on.' You will usually need to enter your phone number.",
        imageAlt: "Illustration of the toggle to turn on two-factor authentication.",
      },
      {
        instruction:
          "The next time you log in, you will get a text with a code. Enter that code and you are in! This makes your account much harder to break into.",
        imageAlt: "Illustration of entering a texted code on a login screen.",
      },
    ]),
  },
];

export function getTopicBySlug(slug: string): PhoneHelpTopic | undefined {
  return PHONE_HELP_TOPICS.find((t) => t.slug === slug);
}

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
];

export function getTopicBySlug(slug: string): PhoneHelpTopic | undefined {
  return PHONE_HELP_TOPICS.find((t) => t.slug === slug);
}

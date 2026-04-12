import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechBuddy",
    short_name: "TechBuddy",
    description:
      "A patient technology helper for senior citizens—scam checks, phone help, AI Q&A, and practice.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#2d7dd2",
    lang: "en",
    orientation: "portrait-primary",
  };
}

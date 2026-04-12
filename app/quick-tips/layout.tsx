import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Tips",
  description:
    "Practical daily tips on scam safety, phone skills, online safety, and privacy. Filter by topic to find what matters to you.",
};

export default function QuickTipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

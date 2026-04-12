export type ScamVerdictType = "SCAM" | "SAFE" | "SUSPICIOUS";

export type ScamCheckResult = {
  verdict: ScamVerdictType;
  headline: string;
  explanation: string;
  warning_signs?: string[];
  action_steps?: string[];
  already_clicked?: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type PracticePhase = "roleplay" | "debrief";

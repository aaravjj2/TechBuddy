const STORAGE_KEY = "techbuddy-progress";

export type Badge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

export type UserProgress = {
  completedTutorials: string[];
  completedScenarios: string[];
  readTips: string[];
  badges: string[];
  streakDays: number;
  lastVisitDate: string;
};

export const ALL_BADGES: Badge[] = [
  {
    id: "first-scam-check",
    title: "Scam Detective",
    description: "Checked your first suspicious message",
    emoji: "🔍",
  },
  {
    id: "first-tutorial",
    title: "Eager Learner",
    description: "Completed your first phone tutorial",
    emoji: "📚",
  },
  {
    id: "first-practice",
    title: "Practice Makes Perfect",
    description: "Completed your first practice scenario",
    emoji: "🎯",
  },
  {
    id: "first-ai-question",
    title: "Curious Mind",
    description: "Asked your first question about AI",
    emoji: "🤖",
  },
  {
    id: "three-scenarios",
    title: "Scam Warrior",
    description: "Completed 3 practice scenarios",
    emoji: "🛡️",
  },
  {
    id: "all-scenarios",
    title: "Scam Master",
    description: "Completed all practice scenarios",
    emoji: "🏅",
  },
  {
    id: "three-tutorials",
    title: "Phone Pro",
    description: "Completed 3 phone tutorials",
    emoji: "📱",
  },
  {
    id: "all-tutorials",
    title: "Tech Champion",
    description: "Completed all phone tutorials",
    emoji: "👑",
  },
  {
    id: "daily-tip",
    title: "Tip of the Day",
    description: "Read today's quick tip",
    emoji: "💡",
  },
  {
    id: "streak-3",
    title: "Consistent Learner",
    description: "Visited TechBuddy 3 days in a row",
    emoji: "🔥",
  },
];

export function getProgress(): UserProgress {
  if (typeof window === "undefined") {
    return {
      completedTutorials: [],
      completedScenarios: [],
      readTips: [],
      badges: [],
      streakDays: 0,
      lastVisitDate: "",
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedTutorials: [],
        completedScenarios: [],
        readTips: [],
        badges: [],
        streakDays: 0,
        lastVisitDate: "",
      };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return {
        completedTutorials: [],
        completedScenarios: [],
        readTips: [],
        badges: [],
        streakDays: 0,
        lastVisitDate: "",
      };
    }
    const data = parsed as Record<string, unknown>;
    return {
      completedTutorials: Array.isArray(data.completedTutorials)
        ? (data.completedTutorials as string[])
        : [],
      completedScenarios: Array.isArray(data.completedScenarios)
        ? (data.completedScenarios as string[])
        : [],
      readTips: Array.isArray(data.readTips)
        ? (data.readTips as string[])
        : [],
      badges: Array.isArray(data.badges) ? (data.badges as string[]) : [],
      streakDays:
        typeof data.streakDays === "number" ? data.streakDays : 0,
      lastVisitDate:
        typeof data.lastVisitDate === "string" ? data.lastVisitDate : "",
    };
  } catch {
    return {
      completedTutorials: [],
      completedScenarios: [],
      readTips: [],
      badges: [],
      streakDays: 0,
      lastVisitDate: "",
    };
  }
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordVisit(): UserProgress {
  const progress = getProgress();
  const today = todayStr();

  if (progress.lastVisitDate === today) {
    return progress;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreak =
    progress.lastVisitDate === yesterdayStr
      ? progress.streakDays + 1
      : 1;

  const updated: UserProgress = {
    ...progress,
    lastVisitDate: today,
    streakDays: newStreak,
  };

  if (newStreak >= 3 && !progress.badges.includes("streak-3")) {
    updated.badges = [...updated.badges, "streak-3"];
  }

  saveProgress(updated);
  return updated;
}

export function awardBadge(badgeId: string): UserProgress {
  const progress = getProgress();
  if (progress.badges.includes(badgeId)) return progress;
  const updated: UserProgress = {
    ...progress,
    badges: [...progress.badges, badgeId],
  };
  saveProgress(updated);
  return updated;
}

export function markTutorialCompleted(slug: string): UserProgress {
  const progress = getProgress();
  if (progress.completedTutorials.includes(slug)) return progress;

  const updated: UserProgress = {
    ...progress,
    completedTutorials: [...progress.completedTutorials, slug],
  };

  if (
    !progress.badges.includes("first-tutorial") &&
    updated.completedTutorials.length >= 1
  ) {
    updated.badges = [...updated.badges, "first-tutorial"];
  }

  if (
    !progress.badges.includes("three-tutorials") &&
    updated.completedTutorials.length >= 3
  ) {
    updated.badges = [...updated.badges, "three-tutorials"];
  }

  saveProgress(updated);
  return updated;
}

export function markScenarioCompletedFromProgress(slug: string): UserProgress {
  const progress = getProgress();
  if (progress.completedScenarios.includes(slug)) return progress;

  const updated: UserProgress = {
    ...progress,
    completedScenarios: [...progress.completedScenarios, slug],
  };

  if (
    !progress.badges.includes("first-practice") &&
    updated.completedScenarios.length >= 1
  ) {
    updated.badges = [...updated.badges, "first-practice"];
  }

  if (
    !progress.badges.includes("three-scenarios") &&
    updated.completedScenarios.length >= 3
  ) {
    updated.badges = [...updated.badges, "three-scenarios"];
  }

  saveProgress(updated);
  return updated;
}

export function markTipRead(tipTitle: string): UserProgress {
  const progress = getProgress();
  if (progress.readTips.includes(tipTitle)) return progress;

  const updated: UserProgress = {
    ...progress,
    readTips: [...progress.readTips, tipTitle],
  };

  if (!progress.badges.includes("daily-tip")) {
    updated.badges = [...updated.badges, "daily-tip"];
  }

  saveProgress(updated);
  return updated;
}

export function getTotalProgress(progress: UserProgress): {
  completed: number;
  total: number;
  percentage: number;
} {
  const tutorialCount = 11; // 8 original + 3 new
  const scenarioCount = 10; // 5 original + 5 new
  const tipCount = 20;

  const completed =
    progress.completedTutorials.length +
    progress.completedScenarios.length +
    Math.min(progress.readTips.length, tipCount);

  const total = tutorialCount + scenarioCount + 1; // tutorials + scenarios + at least 1 tip
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage: Math.min(percentage, 100) };
}

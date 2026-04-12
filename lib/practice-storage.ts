const STORAGE_KEY = "techbuddy-practice-completed";

export function getCompletedScenarios(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function markScenarioCompleted(slug: string): void {
  if (typeof window === "undefined") return;
  const set = new Set(getCompletedScenarios());
  set.add(slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

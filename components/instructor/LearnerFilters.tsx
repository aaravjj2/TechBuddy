"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Status = "all" | "active" | "inactive";

export function LearnerFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const initialQ = params?.get("q") ?? "";
  const initialStatus = (params?.get("status") ?? "all") as Status;

  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState<Status>(initialStatus);

  // Debounce search input
  useEffect(() => {
    const handle = setTimeout(() => {
      applyFilters(q, status);
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function applyFilters(nextQ: string, nextStatus: Status) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (nextQ) next.set("q", nextQ);
    else next.delete("q");
    if (nextStatus && nextStatus !== "all") next.set("status", nextStatus);
    else next.delete("status");
    next.delete("page");

    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <form
      role="search"
      aria-label="Filter learners"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(q, status);
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]"
    >
      <div>
        <label htmlFor="learner-search" className="block text-senior-sm font-medium text-neutral-800">
          Search by name
        </label>
        <input
          id="learner-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a learner's name"
          className="mt-1 block w-full min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
        />
      </div>

      <div>
        <label htmlFor="learner-status" className="block text-senior-sm font-medium text-neutral-800">
          Filter
        </label>
        <select
          id="learner-status"
          value={status}
          onChange={(e) => {
            const s = e.target.value as Status;
            setStatus(s);
            applyFilters(q, s);
          }}
          className="mt-1 block w-full min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2 sm:w-44"
        >
          <option value="all">All learners</option>
          <option value="active">Active (last 30 days)</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          aria-busy={pending || undefined}
          className="inline-flex min-h-touch w-full items-center justify-center rounded-senior bg-trust-700 px-5 text-senior-base font-semibold text-white hover:bg-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2 sm:w-auto"
        >
          {pending ? "Applying…" : "Apply"}
        </button>
      </div>
    </form>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { InstructorShell } from "@/components/instructor/InstructorShell";

export const dynamic = "force-dynamic";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/instructor/dashboard");
  }
  if (session.user.role === "SENIOR") {
    redirect("/");
  }

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <a
        href="#instructor-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:min-h-touch focus:rounded-senior focus:bg-trust-700 focus:px-4 focus:py-2 focus:text-senior-base focus:font-semibold focus:text-white focus:outline-none focus:ring-4 focus:ring-trust-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <InstructorShell
        scope="instructor"
        userName={session.user.name ?? session.user.email ?? "Instructor"}
        userRole={session.user.role}
        signOutAction={doSignOut}
      >
        <main
          id="instructor-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 py-8 text-senior-base text-neutral-900 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </InstructorShell>

      <noscript>
        <p className="p-4 text-senior-sm">
          This dashboard works best with JavaScript on, but all core data is
          rendered on the server. Use the navigation links above:{" "}
          <Link href="/instructor/dashboard" className="underline">
            Dashboard
          </Link>
          .
        </p>
      </noscript>
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InstructorShell } from "@/components/instructor/InstructorShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/admin/impact");
  }
  if (session.user.role === "SENIOR") {
    redirect("/");
  }

  // Fallback policy: if there is no ADMIN user in the system yet,
  // allow INSTRUCTOR to use /admin routes. Otherwise require ADMIN.
  if (session.user.role !== "ADMIN") {
    const anyAdmin = await prisma.user.count({ where: { role: "ADMIN" } });
    if (anyAdmin > 0) {
      redirect("/instructor/dashboard");
    }
  }

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:min-h-touch focus:rounded-senior focus:bg-trust-700 focus:px-4 focus:py-2 focus:text-senior-base focus:font-semibold focus:text-white focus:outline-none focus:ring-4 focus:ring-trust-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <InstructorShell
        scope="admin"
        userName={session.user.name ?? session.user.email ?? "Admin"}
        userRole={session.user.role}
        signOutAction={doSignOut}
      >
        <main
          id="admin-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 py-8 text-senior-base text-neutral-900 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </InstructorShell>
    </div>
  );
}

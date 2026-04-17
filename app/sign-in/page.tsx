import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

type SearchParams = {
  callbackUrl?: string;
  error?: string;
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const callbackUrl = sp.callbackUrl ?? "/instructor/dashboard";
  const prefillError = sp.error ? "Incorrect email or password. Try again, or ask your instructor for help." : null;

  const session = await auth();
  if (session?.user) {
    if (session.user.role === "SENIOR") redirect("/");
    redirect(callbackUrl);
  }

  async function doSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const cb = String(formData.get("callbackUrl") ?? "/instructor/dashboard");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: cb,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(
          `/sign-in?error=CredentialsSignin&callbackUrl=${encodeURIComponent(cb)}`
        );
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <main
        id="main-content"
        className="w-full max-w-md"
      >
        <Card tone="trust" className="p-8">
          <header className="space-y-2 text-center">
            <h1 className="text-senior-2xl font-semibold text-neutral-900">
              Sign in to TechBuddy
            </h1>
            <CardDescription className="!mt-0">
              Instructors and admins only. Seniors can use the site without
              signing in.
            </CardDescription>
          </header>

          {prefillError ? (
            <div
              role="alert"
              className="mt-6 rounded-senior border-l-4 border-scam-500 bg-scam-50 p-4 text-senior-base text-scam-700"
            >
              {prefillError}
            </div>
          ) : null}

          <form action={doSignIn} className="mt-6 space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
              <label
                htmlFor="email"
                className="block text-senior-base font-medium text-neutral-900"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 block w-full min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-senior-base font-medium text-neutral-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 block w-full min-h-touch rounded-senior border-2 border-neutral-300 bg-white px-4 text-senior-base text-neutral-900 focus:border-trust-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              className="flex min-h-touch w-full items-center justify-center rounded-senior bg-trust-700 px-5 text-senior-base font-semibold text-white hover:bg-trust-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <section aria-labelledby="help-heading" className="mt-8">
            <CardTitle id="help-heading" className="text-senior-base">
              Need test credentials?
            </CardTitle>
            <ul className="mt-2 space-y-1 text-senior-sm text-neutral-700">
              <li>
                Instructor:{" "}
                <code className="rounded bg-neutral-100 px-2 py-0.5">
                  instructor@test.com
                </code>{" "}
                /{" "}
                <code className="rounded bg-neutral-100 px-2 py-0.5">
                  TestPass123
                </code>
              </li>
              <li>
                Senior:{" "}
                <code className="rounded bg-neutral-100 px-2 py-0.5">
                  senior1@test.com
                </code>{" "}
                /{" "}
                <code className="rounded bg-neutral-100 px-2 py-0.5">
                  SeniorPass123
                </code>
              </li>
            </ul>
          </section>

          <p className="mt-6 text-center text-senior-sm text-neutral-600">
            <Link
              href="/"
              className="rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-trust-500 focus-visible:ring-offset-2"
            >
              ← Back to TechBuddy home
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}

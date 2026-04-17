import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isProtected =
    nextUrl.pathname.startsWith("/instructor") ||
    nextUrl.pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  const user = req.auth?.user;

  if (!user) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set(
      "callbackUrl",
      nextUrl.pathname + (nextUrl.search || "")
    );
    return NextResponse.redirect(signInUrl);
  }

  if (user.role === "SENIOR") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/instructor/:path*", "/admin/:path*"],
};

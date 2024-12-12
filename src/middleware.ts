import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/api/auth/session/session.service";

const protectedRoutes = ["/reservations"];
const protectedApiRoutes = ["/api/reservations"];
const publicRoutes = ["/", "/api/auth"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isApi = path.includes("/api/");
  const isProtectedApiRoute = protectedApiRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isApi) {
    // REST api handler
    if (isProtectedApiRoute && !session?.sessionId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
  } else {
    if (isProtectedRoute && !session?.sessionId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isPublicRoute && session?.sessionId) {
      return NextResponse.redirect(new URL("/reservations", req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};

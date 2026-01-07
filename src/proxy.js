import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt"; // if jwt.js is in src/lib/jwt.js

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // allow auth pages + api + next internals
    if (
        pathname.startsWith("/auth") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Protect "/" and "/dashboard"
    if (pathname === "/" || pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            const res = NextResponse.redirect(new URL("/auth/login", request.url));
            res.cookies.set("token", "", { path: "/", maxAge: 0 });
            return res;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};

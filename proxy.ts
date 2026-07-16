import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";
import { getAuthSession } from "./lib/session";

const PROTECTED_ROUTE_PATTERNS = ["/dashboard/**", "/posts/**", "/tags/**", "/settings/**", "/account/**"];

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function globToRegExp(pattern: string) {
    if (pattern.endsWith("/**")) {
        const base = pattern.slice(0, -3);
        return new RegExp(`^${escapeRegExp(base)}(?:/.*)?$`);
    }

    const withPlaceholders = pattern.replace(/\*\*/g, "__DOUBLE_STAR__");
    const escaped = escapeRegExp(withPlaceholders);
    const regexSource = escaped
        .replace(/__DOUBLE_STAR__/g, ".*")
        .replace(/\\\*/g, "[^/]*");

    return new RegExp(`^${regexSource}$`);
}

const protectedRouteRegexes = PROTECTED_ROUTE_PATTERNS.map((pattern) =>
    globToRegExp(pattern)
);

function isProtectedRoute(pathname: string) {
    return protectedRouteRegexes.some((regex) => regex.test(pathname));
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Let Auth0 SDK handle all /auth routes directly.
    if (pathname.startsWith("/auth")) {
        return auth0.middleware(request);
    }

    const session = await getAuthSession(request);

    if (pathname.startsWith('/api/admin')) {
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized', description: 'Admin endpoints require authentication.' },
                { status: 401 }
            );
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', session.user.sub);
        requestHeaders.set('x-user-name', session.user.name || session.user.nickname || 'User');
        requestHeaders.set('x-user-email', session.user.email || '');
        requestHeaders.set('x-user-picture', session.user.picture || '');

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    if (pathname === "/" && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedRoute(pathname) && !session) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return auth0.middleware(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};

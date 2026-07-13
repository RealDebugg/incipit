import type { NextRequest } from "next/server";

import { auth0 } from "./auth0";

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

type SessionLike = {
  user?: {
    name?: string;
    nickname?: string;
    email?: string;
    picture?: string;
  };
} | null;

export async function getAuthSession(request?: NextRequest) {
  if (request) {
    return auth0.getSession(request);
  }

  return auth0.getSession();
}

export function toSidebarUser(session: SessionLike): SidebarUser | null {
  if (!session?.user) {
    return null;
  }

  return {
    name: session.user.name ?? session.user.nickname ?? "Authenticated User",
    email: session.user.email ?? "No email",
    avatar: session.user.picture ?? "",
  };
}

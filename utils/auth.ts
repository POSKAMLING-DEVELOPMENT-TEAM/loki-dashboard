import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return request.cookies.get("auth-token")?.value || null;
}

export function isTokenValid(token: string): boolean {
  try {
    // Note: In production, you should verify with your actual JWT secret
    // This is just a basic structure check
    const parts = token.split(".");
    return parts.length === 3;
  } catch {
    return false;
  }
}

export function getRolePermissions(role: string): string[] {
  const permissions = {
    OWNER: [
      "create",
      "read",
      "update",
      "delete",
      "manage_users",
      "manage_stores",
    ],
    SUPERVISOR: ["create", "read", "update", "delete", "manage_staff"],
    STAFF: ["read", "update_own"],
  };

  return permissions[role as keyof typeof permissions] || [];
}

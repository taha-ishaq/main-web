import { verifyToken, getTokenFromRequest } from "./auth";

function getTokenFromCookie(request) {
  // NextRequest (middleware) + Route handlers both have cookies()
  return request.cookies?.get("token")?.value || null;
}

export async function requireAuth(request) {
  const token = getTokenFromRequest(request) || getTokenFromCookie(request);

  if (!token) {
    return { error: "Unauthorized - No token provided", status: 401 };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return { error: "Unauthorized - Invalid token", status: 401 };
  }

  return { user: payload };
}

export async function requireRole(request, allowedRoles) {
  const authResult = await requireAuth(request);

  if (authResult.error) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.user.role)) {
    return { error: "Forbidden - Insufficient permissions", status: 403 };
  }

  return { user: authResult.user };
}

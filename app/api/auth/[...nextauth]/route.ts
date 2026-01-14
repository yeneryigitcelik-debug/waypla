import { handlers } from "@/lib/auth";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rate-limit";

export const { GET } = handlers;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const requestClone = request.clone();
  let email = "unknown";

  try {
    const formData = await requestClone.formData();
    const formEmail = formData.get("email");
    if (typeof formEmail === "string") {
      email = formEmail.trim().toLowerCase();
    }
  } catch {
    // Ignore body parsing issues to avoid blocking auth flow.
  }

  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit({
      key: `auth:login:ip:${ip}`,
      limit: 15,
      windowMs: 15 * 60 * 1000,
    }),
    checkRateLimit({
      key: `auth:login:email:${email}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    }),
  ]);

  if (!ipLimit.allowed || !emailLimit.allowed) {
    const limitResult = ipLimit.allowed ? emailLimit : ipLimit;
    return createRateLimitResponse(limitResult);
  }

  return handlers.POST(request);
}

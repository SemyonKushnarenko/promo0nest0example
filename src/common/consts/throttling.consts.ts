import type { ThrottlerOptions } from "@nestjs/throttler";

export const DEFAULT_THROTTLER_OPTIONS: ThrottlerOptions = {
  ttl: 60_000,
  limit: 100,
};


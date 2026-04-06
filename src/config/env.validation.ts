export type EnvVars = {
  DATABASE_URL: string;
  PORT: number;
  SWAGGER: boolean;
};

function parseBoolean(input: unknown, fallback: boolean): boolean {
  if (input === undefined) return fallback;
  if (input === "true") return true;
  if (input === "false") return false;
  throw new Error(`Invalid boolean value: ${String(input)} (expected "true" or "false")`);
}

function parsePort(input: unknown, fallback: number): number {
  if (input === undefined) return fallback;
  const n = Number(input);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(`Invalid PORT: ${String(input)} (expected integer 1..65535)`);
  }
  return n;
}

export function validateEnv(config: Record<string, unknown>): EnvVars {
  const DATABASE_URL = String(config.DATABASE_URL ?? "").trim();
  if (!DATABASE_URL) {
    throw new Error("Missing required env var: DATABASE_URL");
  }

  const PORT = parsePort(config.PORT, 3000);
  const SWAGGER = parseBoolean(config.SWAGGER, false);

  return {
    DATABASE_URL,
    PORT,
    SWAGGER,
  };
}


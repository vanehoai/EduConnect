interface EnvironmentVariables {
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  MOCK_PAYMENT_WEBHOOK_SECRET: string;
}

const requiredVariables: Array<keyof EnvironmentVariables> = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'MOCK_PAYMENT_WEBHOOK_SECRET',
];

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
  const missingVariables = requiredVariables.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingVariables.length > 0) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${missingVariables.join(', ')}`);
  }

  const port = Number(config.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT phải là số nguyên từ 1 đến 65535');
  }

  const minimumSecretLength = 32;
  const isProduction = config.NODE_ENV === 'production';
  for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const) {
    const value = String(config[key]);
    if (value.length < minimumSecretLength) {
      throw new Error(`${key} phải có ít nhất ${minimumSecretLength} ký tự`);
    }
    if (isProduction && value.includes('development')) {
      throw new Error(`${key} không được chứa từ khóa development trong môi trường production`);
    }
  }

  const loginRateLimitTtlMs = Number(config.LOGIN_RATE_LIMIT_TTL_MS ?? 60_000);
  const loginRateLimitMax = Number(config.LOGIN_RATE_LIMIT_MAX ?? 5);
  if (!Number.isInteger(loginRateLimitTtlMs) || loginRateLimitTtlMs < 1_000) {
    throw new Error('LOGIN_RATE_LIMIT_TTL_MS phải là số nguyên từ 1000 trở lên');
  }
  if (!Number.isInteger(loginRateLimitMax) || loginRateLimitMax < 1) {
    throw new Error('LOGIN_RATE_LIMIT_MAX phải là số nguyên dương');
  }

  const cookieSecure = String(config.COOKIE_SECURE ?? 'false').toLowerCase() === 'true';

  return {
    ...config,
    PORT: port,
    COOKIE_SECURE: cookieSecure,
    LOGIN_RATE_LIMIT_TTL_MS: loginRateLimitTtlMs,
    LOGIN_RATE_LIMIT_MAX: loginRateLimitMax,
  };
}

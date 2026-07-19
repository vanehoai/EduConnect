const durationMultipliers = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
} as const;

export function parseDurationInSeconds(value: string | number, fallback: number): number {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (/^\d+$/.test(normalized)) {
    const seconds = Number(normalized);
    return seconds > 0 ? seconds : fallback;
  }

  const match = /^(\d+)([smhd])$/.exec(normalized);
  if (!match) return fallback;

  const amount = Number(match[1]);
  const unit = match[2] as keyof typeof durationMultipliers;
  return amount > 0 ? amount * durationMultipliers[unit] : fallback;
}

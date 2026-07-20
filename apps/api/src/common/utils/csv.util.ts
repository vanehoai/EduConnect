/**
 * Escape a CSV cell value to prevent CSV Formula Injection and handle special characters.
 * Shared utility - do not duplicate in individual services.
 */
export function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // CSV Formula Injection protection: prefix dangerous chars with single quote
  if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
    str = "'" + str;
  }
  // Escape if contains special CSV chars: quote, comma, newline
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function buildCsvContent(headers: string[], rows: unknown[][]): string {
  return [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\n');
}

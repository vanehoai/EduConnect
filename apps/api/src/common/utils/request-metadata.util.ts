import type { Request } from 'express';
import type { RequestMetadata } from '../../auth/interfaces/request-metadata.interface';

export function requestMetadata(request: Request): RequestMetadata {
  const rawUserAgent = request.headers['user-agent'];
  return {
    ipAddress: (request.ip ?? request.socket.remoteAddress ?? '').slice(0, 64) || null,
    userAgent:
      (typeof rawUserAgent === 'string' ? rawUserAgent : rawUserAgent?.[0])?.slice(0, 500) ?? null,
  };
}

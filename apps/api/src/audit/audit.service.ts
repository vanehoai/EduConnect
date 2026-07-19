import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { PrismaService } from '../prisma/prisma.service';

type AuditClient = Pick<Prisma.TransactionClient, 'auditLog'>;

export interface AuditInput {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
  metadata: RequestMetadata;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: AuditInput, client: AuditClient = this.prisma) {
    return client.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValues: input.oldValues,
        newValues: input.newValues,
        ipAddress: input.metadata.ipAddress,
        userAgent: input.metadata.userAgent,
      },
    });
  }
}

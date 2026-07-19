import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { ApiResponse, PaginationMeta } from '@school/shared-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MessageEnvelope<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T | MessageEnvelope<T>,
  ApiResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T | MessageEnvelope<T>>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (this.isMessageEnvelope(response)) {
          return {
            success: true,
            message: response.message ?? 'Thao tác thành công',
            data: response.data,
            ...(response.meta ? { meta: response.meta } : {}),
          };
        }

        return {
          success: true,
          message: 'Thao tác thành công',
          data: response,
        };
      }),
    );
  }

  private isMessageEnvelope(value: T | MessageEnvelope<T>): value is MessageEnvelope<T> {
    return typeof value === 'object' && value !== null && 'data' in value;
  }
}

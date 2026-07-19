import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ValidationErrorResponse {
  message?: string | string[];
  code?: string;
  details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.getMessage(exception);
    const code = this.getCode(exception);
    const details = this.getDetails(exception);

    response.status(status).json({
      success: false,
      message,
      data: null,
      error: {
        statusCode: status,
        ...(code ? { code } : {}),
        ...(details === undefined ? {} : { details }),
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private getMessage(exception: unknown): string | string[] {
    if (!(exception instanceof HttpException)) {
      return 'Đã xảy ra lỗi nội bộ. Vui lòng thử lại sau.';
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    const validationResponse = exceptionResponse as ValidationErrorResponse;
    return validationResponse.message ?? exception.message;
  }

  private getCode(exception: unknown): string | undefined {
    if (!(exception instanceof HttpException)) return 'INTERNAL_SERVER_ERROR';
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') return undefined;
    return (exceptionResponse as ValidationErrorResponse).code;
  }

  private getDetails(exception: unknown): unknown {
    if (!(exception instanceof HttpException)) return undefined;
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') return undefined;
    return (exceptionResponse as ValidationErrorResponse).details;
  }
}

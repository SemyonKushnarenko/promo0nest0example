import type { Request, Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const requestId =
      (response.getHeader("x-request-id") as string | undefined) ||
      (request.headers["x-request-id"] as string | undefined) ||
      ((request as any).requestId as string | undefined);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const rawMessage =
        typeof res === "string"
          ? res
          : typeof res === "object" && res && "message" in res
            ? (res as any).message
            : exception.message;

      const errors = Array.isArray(rawMessage)
        ? rawMessage.map((x) => String(x))
        : undefined;
      const message = Array.isArray(rawMessage) ? "Validation failed" : String(rawMessage);

      if (status >= 500) {
        this.logger.error(
          `${method} ${path} -> ${status}${requestId ? ` (requestId=${requestId})` : ""}`,
          exception instanceof Error ? exception.stack : undefined,
        );
      }

      response.status(status).json({
        code: `HTTP_${status}`,
        message,
        errors,
        details: typeof res === "object" ? res : undefined,
        requestId,
        timestamp,
        path,
      });
      return;
    }

    this.logger.error(
      `${method} ${path} -> 500${requestId ? ` (requestId=${requestId})` : ""}`,
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      requestId,
      timestamp,
      path,
    });
  }
}


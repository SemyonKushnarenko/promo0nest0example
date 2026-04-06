import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

const HEADER_NAME = "x-request-id";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header(HEADER_NAME);
  const requestId = (incoming && incoming.trim()) || randomUUID();

  (req as any).requestId = requestId;
  res.setHeader(HEADER_NAME, requestId);
  next();
}


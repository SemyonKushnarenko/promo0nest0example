import { BadRequestException } from "@nestjs/common";
import { parseISO } from "date-fns";

export function parseOptionalIsoDate(value?: string): Date | undefined {
  if (value === undefined) return undefined;

  const d = parseISO(value);
  if (Number.isNaN(d.getTime())) throw new BadRequestException("Invalid date");

  return d;
}


import { isAfter, isBefore } from "date-fns";

export function isWithinValidityWindow(input: {
  now: Date;
  validFrom: Date | null;
  validTo: Date | null;
}): boolean {
  const { now, validFrom, validTo } = input;
  if (validFrom && isBefore(now, validFrom)) return false;
  if (validTo && isAfter(now, validTo)) return false;
  return true;
}


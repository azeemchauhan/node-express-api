import { ParsedQs } from "qs";

/**
 * Convert to Date
 */
const convertToDate = (value: string | ParsedQs | (string | ParsedQs)[] | undefined | object): Date | null => {
  
  if (value instanceof Date) return value;
  
  if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date;
  }

  return null;
}


export { convertToDate }
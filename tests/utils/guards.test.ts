import { ParsedQs } from "qs";
import { convertToDate } from '@utils/guards'

describe('convertToDate', () => {
  it('should convert a valid date string to a Date object', () => {
    const dateString = '2025-03-12';
    const result = convertToDate(dateString);
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString().startsWith('2025-03-12')).toBe(true); // Check if the date is correct
  });

  it('should return null for an invalid date string', () => {
    const invalidDateString = 'invalid-date';
    const result = convertToDate(invalidDateString);
    expect(result).toBeNull();
  });

  it('should return the Date object if value is already a Date object', () => {
    const date = new Date('2025-03-12');
    const result = convertToDate(date);
    expect(result).toBe(date);
  });

  it('should return null for undefined input', () => {
    const result = convertToDate(undefined);
    expect(result).toBeNull();
  });

  it('should return null for a number', () => {
    const result = convertToDate(123 as any);
    expect(result).toBeNull();
  });

  it('should return null for an object', () => {
    const result = convertToDate({} as any);
    expect(result).toBeNull();
  });
  it('should return null for a ParsedQs object', () => {
    const parsedQs: ParsedQs = { key: 'value' };
    const result = convertToDate(parsedQs);
    expect(result).toBeNull();
  });
});
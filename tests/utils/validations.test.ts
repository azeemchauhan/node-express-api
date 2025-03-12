import { AppError } from "@utils/appError";
import { dateValidatorQuery, numberValidatorParam, numberValidatorQuery } from "@utils/validations";

describe('Validators', () => {
  describe('numberValidator', () => {
    it('should parse a valid number from a param', async () => {
      const req = {
        params: { jobId: '123' },
      } as any;

      await numberValidatorParam('jobId').run(req);

      expect(req.params.jobId).toBe(123);
    });

    it('should throw an AppError for an invalid number param', async () => {
      const req = {
        params: { jobId: 'abc' },
      } as any;

      await expect(numberValidatorParam('jobId').run(req)).rejects.toThrow(AppError);
    });

    it('should parse a valid number from a query', async () => {
      const req = {
        query: { jobId: '456' },
      } as any;

      await numberValidatorQuery('jobId').run(req)

      expect(req.query.jobId).toBe(456);
    });

    it('should throw an AppError for an invalid number query', async () => {
      const req = {
        query: { jobId: 'abc' },
      } as any;

      await expect(numberValidatorQuery('jobId').run(req)).rejects.toThrow(AppError);
    });
  });

  describe('dateValidatorQuery', () => {
    it('should parse a valid date from a query', async () => {
      const req = {
        query: { date: '2023-12-25' },
      } as any;

      await dateValidatorQuery('date').run(req);

      expect(req.query.date).toBeInstanceOf(Date);
      expect(req.query.date.toISOString()).toBe('2023-12-25T00:00:00.000Z');
    });

    it('should throw an AppError for an invalid date query', async () => {
      const req = {
        query: { date: 'invalid-date' },
      } as any;

      await expect(dateValidatorQuery('date').run(req)).rejects.toThrow(AppError);
    });
  });
});
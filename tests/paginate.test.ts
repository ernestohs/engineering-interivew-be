import { describe, it, expect } from 'vitest';
import { paginate, PaginatedResult } from '../src/server/paginate';

describe('paginate', () => {
  it('should paginate correctly when perPage is greater than data length', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 1;
    const perPage = 10;
    const result: PaginatedResult<number> = paginate(data, page, perPage);

    expect(result.data).toEqual(data);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(data.length);
  });

  it('should handle page being greater than total pages', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 10;
    const perPage = 2;
    debugger
    const result: PaginatedResult<number> = paginate(data, page, perPage);

    expect(result.data).toEqual([5]);
    expect(result.total).toBe(3);
    expect(result.page).toBe(3);
    expect(result.perPage).toBe(perPage);
  });

  it('should paginate correctly with valid input', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 2;
    const perPage = 2;
    const result: PaginatedResult<number> = paginate(data, page, perPage);

    expect(result.data).toEqual([3, 4]);
    expect(result.total).toBe(3);
    expect(result.page).toBe(page);
    expect(result.perPage).toBe(perPage);
  });

  it('should throw an error when perPage is less than or equal to 0', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 1;
    const perPage = 0;

    expect(() => paginate(data, page, perPage)).toThrow('perPage argument must be greater than 0.');
  });

  it('should return empty data if data is empty', () => {
    const data: number[] = [];
    const page = 1;
    const perPage = 2;
    const result: PaginatedResult<number> = paginate(data, page, perPage);

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(0);
    expect(result.perPage).toBe(0);
  });

  it('should paginate correctly with perPage equal to data length', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 1;
    const perPage = 5;
    const result: PaginatedResult<number> = paginate(data, page, perPage);

    expect(result.data).toEqual(data);
    expect(result.total).toBe(1);
    expect(result.page).toBe(page);
    expect(result.perPage).toBe(perPage);
  });
});

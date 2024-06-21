import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from '../src/repositories/Repository';
import pool from '../src/repositories/postgres';
import logger from '../src/logger';
import { Entity } from '../src/repositories/Entity';

// Mocking pool and logger
vi.mock('../src/repositories/postgres', () => ({
  default: {
    connect: vi.fn(),
  },
}));

vi.mock('../src/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));

// Create mock client with necessary methods
const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

describe('Repository', () => {
  let repository: Repository<Entity>;

  beforeEach(() => {
    repository = new Repository<Entity>('test_table', ['id', 'name']);
    (pool.connect as vi.Mock).mockResolvedValue(mockClient);
    mockClient.query.mockReset();
    mockClient.release.mockReset();
  });

  it('should create an entity', async () => {
    const entity = { id: '1', name: 'Test Entity' };
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [entity] });

    const result = await repository.create(entity);

    expect(mockClient.query).toHaveBeenCalledWith(
      `INSERT INTO test_table (id,name) VALUES ($1,$2)`,
      ['1', 'Test Entity']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      `SELECT * FROM test_table WHERE id = '1'`
    );
    expect(result).toEqual(entity);
  });

  it('should find an entity by id', async () => {
    const entity = { id: '1', name: 'Test Entity' };
    mockClient.query.mockResolvedValueOnce({ rows: [entity] });

    const result = await repository.findById('1');

    expect(mockClient.query).toHaveBeenCalledWith(
      `SELECT * FROM test_table WHERE id = $1`,
      ['1']
    );
    expect(result).toEqual(entity);
  });

  it('should find all entities', async () => {
    const entities = [{ id: '1', name: 'Test Entity' }];
    mockClient.query.mockResolvedValueOnce({ rows: entities });

    const result = await repository.findAll();

    expect(mockClient.query).toHaveBeenCalledWith(
      `SELECT * FROM test_table`,
      []
    );
    expect(result).toEqual(entities);
  });

  it('should update an entity', async () => {
    const entity = { id: '1', name: 'Updated Entity' };
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 });
    mockClient.query.mockResolvedValueOnce({ rows: [entity] });

    const result = await repository.update('1', entity);

    expect(mockClient.query).toHaveBeenCalledWith(
      `UPDATE test_table SET id = $1,name = $2 WHERE id = $3`,
      ['1', 'Updated Entity', '1']
    );
    expect(result).toEqual(entity);
  });

  it('should delete an entity', async () => {
    mockClient.query.mockResolvedValueOnce({});

    await repository.delete('1');

    expect(mockClient.query).toHaveBeenCalledWith(
      `DELETE FROM test_table WHERE id = $1`,
      ['1']
    );
  });

  it('should log an error if create fails', async () => {
    const entity = { id: '1', name: 'Test Entity' };
    const error = new Error('Test error');
    mockClient.query.mockRejectedValueOnce(error);

    await repository.create(entity);

    expect(logger.error).toHaveBeenCalledWith('Repository::create', error);
  });

  it('should log an error if findById fails', async () => {
    const error = new Error('Test error');
    mockClient.query.mockRejectedValueOnce(error);

    await repository.findById('1');

    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('should log an error if findAll fails', async () => {
    const error = new Error('Test error');
    mockClient.query.mockRejectedValueOnce(error);

    await repository.findAll();

    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('should log an error if update fails', async () => {
    const entity = { id: '1', name: 'Updated Entity' };
    const error = new Error('Test error');
    mockClient.query.mockRejectedValueOnce(error);

    await repository.update('1', entity);

    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('should log an error if delete fails', async () => {
    const error = new Error('Test error');
    mockClient.query.mockRejectedValueOnce(error);

    await repository.delete('1');

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});

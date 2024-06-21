import logger from '../logger';
import { Entity } from './Entity';
import pool from './postgres';

export class Repository<T extends Entity> {
  tableName: string;
  constructor(name: string) {
    this.tableName = name;
  }

  async create(entity: T): Promise<T> {
    let payload: any = {};
    const client = await pool.connect();
    try {
      const tableFields = Object.keys(entity);
      const statement = `INSERT INTO ${this.tableName} (${tableFields.join(',')}) VALUES (${tableFields.map((_, index) => `$${index + 1}`)})`;
      await client.query(statement, Object.values(entity));
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE id = '${entity.id}'`,
      );
      payload = result.rows[0];
    } catch (error: any) {
      logger.error('Repository::create', error);
    } finally {
      client.release();
      return payload as T;
    }
  }

  async findById<T>(id: string): Promise<T> {
    let payload: any;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE id = $1`,
        [id],
      );
      payload = (result.rows[0] as T) || ({} as T);
    } catch (error: any) {
      logger.error(error);
    } finally {
      client.release();
      return payload as T;
    }
  }

  async findAll(
    field?: string,
    order?: string,
    filter?: Record<string, any>,
  ): Promise<Array<T>> {
    let payload: Array<any> = [];
    // Build the query string with optional parameters
    let query = `SELECT * FROM ${this.tableName}`;
    if (filter) {
      const whereClause = [];
      for (const key in filter) {
        whereClause.push(`${key} = $${whereClause.length + 1}`);
      }
      query += ` WHERE ${whereClause.join(' AND ')}`;
    }
    if (field) {
      query += ` ORDER BY ${field}`;
      if (order) {
        query += ` ${order}`;
      }
    }

    const client = await pool.connect();
    try {
      const values = filter ? Object.values(filter) : [];
      const result = await client.query(query, values);
      payload = result.rows;
    } catch (error: any) {
      logger.error(error);
    } finally {
      client.release();
      return payload as Array<T>;
    }
  }

  async update(id: string, entity: T): Promise<T | null> {
    let payload: any = {};
    const client = await pool.connect();
    try {
      const fields = Object.keys(entity);
      // Build the SET clause with entity fields
      const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(',');
      const statement = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${fields.length + 1}`;
      const values = [...Object.values(entity), id]; // Include id for WHERE clause

      const result = await client.query(statement, values);

      // Check if a row was updated (affected rows count)
      if (result.rowCount && result.rowCount > 0) {
        payload = await this.findById(entity.id as string); // Fetch the updated entity
      }
    } catch (error: any) {
      logger.error(error);
    } finally {
      client.release();
      return payload as T;
    }
  }

  async delete(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    } catch (error: any) {
      logger.error(error);
    } finally {
      client.release();
    }
  }
}

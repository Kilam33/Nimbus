import { Pool, PoolClient, QueryArrayConfig, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Extend PoolClient interface to include our custom properties
declare module 'pg' {
  interface PoolClient {
    lastQuery?: any[];
    query: <T extends QueryResultRow = any>(
      queryTextOrConfig: string | QueryConfig<T>,
      values?: any[]
    ) => Promise<QueryResult<T>>;
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${(client as any).lastQuery}`);
  }, 5000);

  // Store the original query method
  const originalQuery = client.query;

  // Monkey patch the query method to keep track of the last query executed
client.query = async <T extends QueryResultRow = any>(
  queryTextOrConfig: string | QueryConfig<T>,
  values?: any[]
): Promise<QueryResult<T>> => {
  // Store the last query for debugging
  client.lastQuery = typeof queryTextOrConfig === 'string' 
    ? [queryTextOrConfig, values] 
    : [queryTextOrConfig.text, queryTextOrConfig.values];
  
  // Call the original query method with proper type casting
  return originalQuery.call(client, queryTextOrConfig, values) as Promise<QueryResult<T>>;
};

  // Store the original release method
  const originalRelease = client.release;

  // Monkey patch the release method
  client.release = (err?: Error | boolean) => {
    // Clear the timeout
    clearTimeout(timeout);
    
    // Reset the client to its original state
    client.query = originalQuery;
    client.release = originalRelease;
    
    // Release the client back to the pool
    return originalRelease.call(client, err);
  };

  return client;
};

export default {
  query,
  getClient,
};
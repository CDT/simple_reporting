const sqlite3 = require('sqlite3').verbose();
const oracledb = require('oracledb');
const sql = require('mssql');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

class DatabaseManager {
  constructor() {
    this.connections = new Map();
    this.activeConnection = null;
  }

  // Load connections from file
  async loadConnections() {
    try {
      const connectionsFile = path.join(__dirname, '../data/connections.json');
      const data = await fs.readFile(connectionsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Get active connection
  async getActiveConnection() {
    const connections = await this.loadConnections();
    return connections.find(c => c.isActive);
  }

  // Create database connection based on type
  async createConnection(connectionConfig) {
    const { type, host, port, database, username, password } = connectionConfig;
    
    switch (type) {
      case 'oracle':
        return await oracledb.getConnection({
          user: username,
          password: password,
          connectString: `${host}:${port}/${database}`
        });
        
      case 'sqlserver':
        const config = {
          user: username,
          password: password,
          server: host,
          port: parseInt(port),
          database: database,
          options: {
            encrypt: false,
            trustServerCertificate: true
          }
        };
        return await sql.connect(config);
        
      case 'postgres':
        const pool = new Pool({
          host: host,
          port: parseInt(port),
          database: database,
          user: username,
          password: password
        });
        return await pool.connect();
        
      case 'sqlite':
        return new Promise((resolve, reject) => {
          const db = new sqlite3.Database(database, (err) => {
            if (err) reject(err);
            else resolve(db);
          });
        });
        
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }

  // Execute query using active connection
  async query(sqlQuery, params = []) {
    const activeConnection = await this.getActiveConnection();
    
    if (!activeConnection) {
      throw new Error('No active database connection found. Please configure a connection in Settings.');
    }

    const connection = await this.createConnection(activeConnection);
    
    try {
      switch (activeConnection.type) {
        case 'oracle':
          const result = await connection.execute(sqlQuery, params);
          await connection.close();
          return result.rows || [];
          
        case 'sqlserver':
          const request = connection.request();
          params.forEach((param, index) => {
            request.input(`param${index}`, param);
          });
          const sqlResult = await request.query(sqlQuery);
          await sql.close();
          return sqlResult.recordset || [];
          
        case 'postgres':
          const pgResult = await connection.query(sqlQuery, params);
          connection.release();
          return pgResult.rows || [];
          
        case 'sqlite':
          return new Promise((resolve, reject) => {
            connection.all(sqlQuery, params, (err, rows) => {
              connection.close();
              if (err) reject(err);
              else resolve(rows || []);
            });
          });
          
        default:
          throw new Error(`Unsupported database type: ${activeConnection.type}`);
      }
    } catch (error) {
      // Ensure connection is closed on error
      try {
        if (activeConnection.type === 'oracle') {
          await connection.close();
        } else if (activeConnection.type === 'sqlserver') {
          await sql.close();
        } else if (activeConnection.type === 'postgres') {
          connection.release();
        } else if (activeConnection.type === 'sqlite') {
          connection.close();
        }
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
      throw error;
    }
  }

  // Get available tables for active connection
  async getTables() {
    const activeConnection = await this.getActiveConnection();
    
    if (!activeConnection) {
      throw new Error('No active database connection found. Please configure a connection in Settings.');
    }

    let tablesQuery;
    switch (activeConnection.type) {
      case 'oracle':
        tablesQuery = `
          SELECT table_name as name 
          FROM user_tables 
          ORDER BY table_name
        `;
        break;
        
      case 'sqlserver':
        tablesQuery = `
          SELECT table_name as name 
          FROM information_schema.tables 
          WHERE table_type = 'BASE TABLE'
          ORDER BY table_name
        `;
        break;
        
      case 'postgres':
        tablesQuery = `
          SELECT table_name as name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name
        `;
        break;
        
      case 'sqlite':
        tablesQuery = `
          SELECT name 
          FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `;
        break;
        
      default:
        throw new Error(`Unsupported database type: ${activeConnection.type}`);
    }

    const results = await this.query(tablesQuery);
    return results.map(row => row.name || row.table_name);
  }

  // Get table schema for active connection
  async getTableSchema(tableName) {
    const activeConnection = await this.getActiveConnection();
    
    if (!activeConnection) {
      throw new Error('No active database connection found. Please configure a connection in Settings.');
    }

    let schemaQuery;
    switch (activeConnection.type) {
      case 'oracle':
        schemaQuery = `
          SELECT column_name as name, data_type as type, 
                 CASE WHEN nullable = 'N' THEN 1 ELSE 0 END as notNull,
                 CASE WHEN column_name IN (
                   SELECT column_name FROM user_cons_columns 
                   WHERE constraint_name IN (
                     SELECT constraint_name FROM user_constraints 
                     WHERE constraint_type = 'P' AND table_name = UPPER('${tableName}')
                   )
                 ) THEN 1 ELSE 0 END as primaryKey
          FROM user_tab_columns 
          WHERE table_name = UPPER('${tableName}')
          ORDER BY column_id
        `;
        break;
        
      case 'sqlserver':
        schemaQuery = `
          SELECT column_name as name, data_type as type,
                 CASE WHEN is_nullable = 'NO' THEN 1 ELSE 0 END as notNull,
                 CASE WHEN column_name IN (
                   SELECT column_name FROM information_schema.key_column_usage
                   WHERE table_name = '${tableName}' AND constraint_name IN (
                     SELECT constraint_name FROM information_schema.table_constraints
                     WHERE table_name = '${tableName}' AND constraint_type = 'PRIMARY KEY'
                   )
                 ) THEN 1 ELSE 0 END as primaryKey
          FROM information_schema.columns
          WHERE table_name = '${tableName}'
          ORDER BY ordinal_position
        `;
        break;
        
      case 'postgres':
        schemaQuery = `
          SELECT column_name as name, data_type as type,
                 CASE WHEN is_nullable = 'NO' THEN 1 ELSE 0 END as notNull,
                 CASE WHEN column_name IN (
                   SELECT column_name FROM information_schema.key_column_usage
                   WHERE table_name = '${tableName}' AND constraint_name IN (
                     SELECT constraint_name FROM information_schema.table_constraints
                     WHERE table_name = '${tableName}' AND constraint_type = 'PRIMARY KEY'
                   )
                 ) THEN 1 ELSE 0 END as primaryKey
          FROM information_schema.columns
          WHERE table_name = '${tableName}'
          ORDER BY ordinal_position
        `;
        break;
        
      case 'sqlite':
        schemaQuery = `PRAGMA table_info(${tableName})`;
        break;
        
      default:
        throw new Error(`Unsupported database type: ${activeConnection.type}`);
    }

    const results = await this.query(schemaQuery);
    
    if (activeConnection.type === 'sqlite') {
      return results.map(col => ({
        name: col.name,
        type: col.type,
        notNull: col.notnull === 1,
        primaryKey: col.pk === 1
      }));
    } else {
      return results.map(col => ({
        name: col.name,
        type: col.type,
        notNull: col.notNull === 1,
        primaryKey: col.primaryKey === 1
      }));
    }
  }

  // Test connection
  async testConnection(connectionConfig) {
    try {
      const connection = await this.createConnection(connectionConfig);
      
      // Close the connection properly based on type
      switch (connectionConfig.type) {
        case 'oracle':
          await connection.close();
          break;
        case 'sqlserver':
          await sql.close();
          break;
        case 'postgres':
          await connection.release();
          break;
        case 'sqlite':
          connection.close();
          break;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DatabaseManager();

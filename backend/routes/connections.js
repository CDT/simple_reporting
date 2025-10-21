const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to store connections configuration
const CONNECTIONS_FILE = path.join(__dirname, '../data/connections.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(CONNECTIONS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Load connections from file
const loadConnections = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONNECTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Save connections to file
const saveConnections = async (connections) => {
  await ensureDataDir();
  await fs.writeFile(CONNECTIONS_FILE, JSON.stringify(connections, null, 2));
};

// Test database connection
const testConnection = async (connection) => {
  const { type, host, port, database, username, password } = connection;
  
  try {
    let client;
    
    switch (type) {
      case 'oracle':
        const oracledb = require('oracledb');
        client = await oracledb.getConnection({
          user: username,
          password: password,
          connectString: `${host}:${port}/${database}`
        });
        await client.close();
        break;
        
      case 'sqlserver':
        const sql = require('mssql');
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
        client = await sql.connect(config);
        await sql.close();
        break;
        
      case 'postgres':
        const { Pool } = require('pg');
        const pool = new Pool({
          host: host,
          port: parseInt(port),
          database: database,
          user: username,
          password: password
        });
        const client_pg = await pool.connect();
        await client_pg.release();
        await pool.end();
        break;
        
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all connections
router.get('/', async (req, res) => {
  try {
    const connections = await loadConnections();
    res.json({
      success: true,
      connections: connections
    });
  } catch (error) {
    console.error('Error loading connections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load connections',
      message: error.message
    });
  }
});

// Create new connection
router.post('/', async (req, res) => {
  try {
    const { name, type, host, port, database, username, password } = req.body;
    
    // Validate required fields
    if (!name || !type || !host || !port || !database || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    // Validate database type
    const validTypes = ['oracle', 'sqlserver', 'postgres'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid database type. Must be one of: ' + validTypes.join(', ')
      });
    }
    
    const connections = await loadConnections();
    
    // Check if connection name already exists
    if (connections.find(c => c.name === name)) {
      return res.status(400).json({
        success: false,
        error: 'Connection name already exists'
      });
    }
    
    const newConnection = {
      id: Date.now().toString(),
      name,
      type,
      host,
      port: parseInt(port),
      database,
      username,
      password,
      isActive: false,
      createdAt: new Date().toISOString()
    };
    
    connections.push(newConnection);
    await saveConnections(connections);
    
    res.json({
      success: true,
      connection: newConnection
    });
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create connection',
      message: error.message
    });
  }
});

// Update connection
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, host, port, database, username, password } = req.body;
    
    // Validate required fields
    if (!name || !type || !host || !port || !database || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    // Validate database type
    const validTypes = ['oracle', 'sqlserver', 'postgres'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid database type. Must be one of: ' + validTypes.join(', ')
      });
    }
    
    const connections = await loadConnections();
    const connectionIndex = connections.findIndex(c => c.id === id);
    
    if (connectionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    // Check if connection name already exists (excluding current connection)
    if (connections.find(c => c.name === name && c.id !== id)) {
      return res.status(400).json({
        success: false,
        error: 'Connection name already exists'
      });
    }
    
    const updatedConnection = {
      ...connections[connectionIndex],
      name,
      type,
      host,
      port: parseInt(port),
      database,
      username,
      password,
      updatedAt: new Date().toISOString()
    };
    
    connections[connectionIndex] = updatedConnection;
    await saveConnections(connections);
    
    res.json({
      success: true,
      connection: updatedConnection
    });
  } catch (error) {
    console.error('Error updating connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update connection',
      message: error.message
    });
  }
});

// Delete connection
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connections = await loadConnections();
    const connectionIndex = connections.findIndex(c => c.id === id);
    
    if (connectionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    connections.splice(connectionIndex, 1);
    await saveConnections(connections);
    
    res.json({
      success: true,
      message: 'Connection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete connection',
      message: error.message
    });
  }
});

// Test connection
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    const connections = await loadConnections();
    const connection = connections.find(c => c.id === id);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    const result = await testConnection(connection);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Connection test successful'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Connection test failed',
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test connection',
      message: error.message
    });
  }
});

// Set active connection
router.post('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    const connections = await loadConnections();
    
    // Deactivate all connections first
    connections.forEach(c => c.isActive = false);
    
    // Activate the selected connection
    const connection = connections.find(c => c.id === id);
    if (connection) {
      connection.isActive = true;
      connection.activatedAt = new Date().toISOString();
    }
    
    await saveConnections(connections);
    
    res.json({
      success: true,
      message: 'Connection activated successfully'
    });
  } catch (error) {
    console.error('Error activating connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate connection',
      message: error.message
    });
  }
});

module.exports = router;

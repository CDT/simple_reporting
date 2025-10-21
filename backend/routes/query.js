const express = require('express');
const router = express.Router();
const databaseManager = require('../config/database-manager');

// Execute SQL query
router.post('/', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // Basic SQL injection protection - only allow SELECT statements
    const trimmedSql = sql.trim().toLowerCase();
    if (!trimmedSql.startsWith('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    console.log('Executing query:', sql);
    console.log('Parameters:', params);

    const results = await databaseManager.query(sql, params);
    
    res.json({
      success: true,
      data: results,
      rowCount: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      error: 'Query execution failed',
      message: error.message
    });
  }
});

// Get available tables
router.get('/tables', async (req, res) => {
  try {
    const tables = await databaseManager.getTables();
    
    res.json({
      success: true,
      tables: tables
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tables',
      message: error.message
    });
  }
});

// Get table schema
router.get('/schema/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    const schema = await databaseManager.getTableSchema(tableName);
    
    res.json({
      success: true,
      tableName,
      columns: schema
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch table schema',
      message: error.message
    });
  }
});

module.exports = router;

#!/usr/bin/env node

/**
 * Database Drivers Installation Script
 * 
 * This script helps install the required database drivers for the Simple Reporting application.
 * Run this script after installing the main dependencies to ensure all database drivers are properly installed.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing database drivers for Simple Reporting...\n');

const drivers = [
  {
    name: 'Oracle Database Driver',
    package: 'oracledb',
    description: 'Required for Oracle database connections'
  },
  {
    name: 'SQL Server Driver',
    package: 'mssql',
    description: 'Required for Microsoft SQL Server connections'
  },
  {
    name: 'PostgreSQL Driver',
    package: 'pg',
    description: 'Required for PostgreSQL database connections'
  }
];

async function installDriver(driver) {
  try {
    console.log(`📦 Installing ${driver.name}...`);
    execSync(`npm install ${driver.package}`, { stdio: 'inherit' });
    console.log(`✅ ${driver.name} installed successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to install ${driver.name}:`, error.message);
    console.log(`   Please install manually: npm install ${driver.package}\n`);
  }
}

async function main() {
  console.log('This will install the following database drivers:\n');
  
  drivers.forEach((driver, index) => {
    console.log(`${index + 1}. ${driver.name} (${driver.package})`);
    console.log(`   ${driver.description}\n`);
  });

  console.log('Starting installation...\n');

  for (const driver of drivers) {
    await installDriver(driver);
  }

  console.log('🎉 Database drivers installation completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure your database connections in the Settings tab');
  console.log('2. Test your connections to ensure they work properly');
  console.log('3. Start using the application with your databases\n');
  
  console.log('⚠️  Note: Some drivers may require additional system dependencies:');
  console.log('   - Oracle: Oracle Instant Client may be required');
  console.log('   - SQL Server: No additional dependencies required');
  console.log('   - PostgreSQL: No additional dependencies required');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { installDriver, drivers };

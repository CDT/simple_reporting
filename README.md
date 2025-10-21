# Simple Reporting

A Vue 3 + Tailwind + Node.js application for building SQL-based Excel reports with support for multiple database connections.

## Features

- **Multi-Database Support**: Connect to Oracle, SQL Server, and PostgreSQL databases
- **SQL Query Editor**: Write and execute SQL queries with parameter support
- **Excel Export**: Export query results to Excel with formatting
- **Connection Management**: Configure and manage multiple database connections
- **Interactive Tables**: View and sort data in interactive tables with pagination
- **Report Templates**: Pre-built query templates for common reporting needs

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install main dependencies
   npm install
   
   # Install database drivers
   cd backend
   node install-db-drivers.js
   ```

3. Start the application:
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend (in another terminal)
   cd frontend
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Configuration

### Database Connections

1. Navigate to the **Settings** tab
2. Click **Add Connection** to configure a new database connection
3. Fill in the connection details:
   - **Connection Name**: A friendly name for your connection
   - **Database Type**: Choose from Oracle, SQL Server, or PostgreSQL
   - **Host**: Database server hostname or IP address
   - **Port**: Database port (defaults provided)
   - **Database Name**: Name of the database/schema
   - **Username/Password**: Database credentials

4. Test the connection to ensure it works
5. Set one connection as active to use for queries

### Supported Database Types

- **Oracle**: Requires Oracle Instant Client (optional, for better performance)
- **SQL Server**: No additional dependencies required
- **PostgreSQL**: No additional dependencies required

## Usage

### Creating Reports

1. Navigate to the **Reports** tab
2. Ensure you have an active database connection configured
3. Write your SQL query in the editor
4. Use the **Load Tables** button to see available tables
5. Click **Execute Query** to run your query
6. Use the **Export to Excel** button to download results

### Query Parameters

Use `?` placeholders in your SQL queries for parameters:
```sql
SELECT * FROM employees WHERE department_id = ? AND salary > ?
```

The application will prompt you to enter values for each parameter.

### Report Templates

The application includes several pre-built report templates:
- Employee Directory
- Sales Summary by Product
- Department Performance
- Top Performers
- Monthly Sales Trend
- Salary Analysis

## API Endpoints

### Query API
- `POST /api/query` - Execute SQL query
- `GET /api/query/tables` - Get available tables
- `GET /api/query/schema/:tableName` - Get table schema

### Export API
- `POST /api/export` - Export query results to Excel

### Connections API
- `GET /api/connections` - Get all connections
- `POST /api/connections` - Create new connection
- `PUT /api/connections/:id` - Update connection
- `DELETE /api/connections/:id` - Delete connection
- `POST /api/connections/:id/test` - Test connection
- `POST /api/connections/:id/activate` - Set active connection

## Security

- Only SELECT queries are allowed for security
- SQL injection protection through parameterized queries
- Connection credentials are stored locally (consider encryption for production)

## Development

### Project Structure

```
simple_reporting/
├── backend/
│   ├── config/
│   │   ├── database.js          # SQLite database config
│   │   └── database-manager.js  # Multi-database manager
│   ├── routes/
│   │   ├── query.js            # Query execution routes
│   │   ├── export.js           # Excel export routes
│   │   └── connections.js      # Connection management routes
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueryEditor.vue  # SQL query editor
│   │   │   ├── ReportTable.vue  # Data table component
│   │   │   └── ExportButton.vue # Excel export component
│   │   ├── pages/
│   │   │   ├── Home.vue         # Landing page
│   │   │   ├── Reports.vue      # Reports page
│   │   │   └── Settings.vue     # Settings page
│   │   └── App.vue              # Main app component
│   └── main.js                  # Vue app entry point
└── README.md
```

### Adding New Database Types

To add support for a new database type:

1. Install the appropriate Node.js driver
2. Update `backend/config/database-manager.js` to handle the new type
3. Add the new type to the Settings page dropdown
4. Update the connection test logic in `backend/routes/connections.js`

## License

MIT License
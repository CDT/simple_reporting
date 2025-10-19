<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Simple Reporting</h1>
      <p class="mt-2 text-lg text-gray-600">
        Create SQL-based Excel reports with ease
      </p>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card text-center">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">SQL Queries</h3>
        <p class="text-gray-600">
          Execute SQL queries against your database with parameter support
        </p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Excel Export</h3>
        <p class="text-gray-600">
          Export query results to Excel with formatting and styling options
        </p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Data Tables</h3>
        <p class="text-gray-600">
          View and sort data in interactive tables with pagination
        </p>
      </div>
    </div>

    <!-- Quick Start -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
          <div>
            <h3 class="font-medium text-gray-900">Navigate to Reports</h3>
            <p class="text-gray-600">Click on the "Reports" tab to access the query editor</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
          <div>
            <h3 class="font-medium text-gray-900">Write Your Query</h3>
            <p class="text-gray-600">Enter your SQL query in the editor. Use the "Load Tables" button to see available tables</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
          <div>
            <h3 class="font-medium text-gray-900">Execute and Export</h3>
            <p class="text-gray-600">Run your query to see results, then export to Excel with one click</p>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <router-link to="/reports" class="btn btn-primary">
          Get Started
        </router-link>
      </div>
    </div>

    <!-- Sample Queries -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Sample Queries</h2>
      <div class="space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-2">Employee List</h3>
          <code class="text-sm text-gray-700 font-mono">
            SELECT first_name, last_name, email, salary FROM employees ORDER BY last_name
          </code>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-2">Sales Summary</h3>
          <code class="text-sm text-gray-700 font-mono">
            SELECT product_name, SUM(quantity * unit_price) as total_sales FROM sales GROUP BY product_name
          </code>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-2">Department Budget</h3>
          <code class="text-sm text-gray-700 font-mono">
            SELECT d.name, d.budget, COUNT(e.id) as employee_count FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

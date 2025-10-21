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
      <FeatureCard
        title="SQL Queries"
        description="Execute SQL queries against your database with parameter support"
        icon="chart"
        color="primary"
      />
      <FeatureCard
        title="Excel Export"
        description="Export query results to Excel with formatting and styling options"
        icon="download"
        color="green"
      />
      <FeatureCard
        title="Data Tables"
        description="View and sort data in interactive tables with pagination"
        icon="table"
        color="purple"
      />
    </div>

    <!-- Quick Start -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
      <div class="space-y-4">
        <StepIndicator
          :step-number="1"
          title="Navigate to Reports"
          description="Click on the 'Reports' tab to access the query editor"
        />
        <StepIndicator
          :step-number="2"
          title="Write Your Query"
          description="Enter your SQL query in the editor. Use the 'Load Tables' button to see available tables"
        />
        <StepIndicator
          :step-number="3"
          title="Execute and Export"
          description="Run your query to see results, then export to Excel with one click"
        />
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
        <CodeBlock
          title="Employee List"
          code="SELECT first_name, last_name, email, salary FROM employees ORDER BY last_name"
        />
        <CodeBlock
          title="Sales Summary"
          code="SELECT product_name, SUM(quantity * unit_price) as total_sales FROM sales GROUP BY product_name"
        />
        <CodeBlock
          title="Department Budget"
          code="SELECT d.name, d.budget, COUNT(e.id) as employee_count FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FeatureCard, StepIndicator, CodeBlock } from '../components/ui'

export default {
  name: 'Home',
  components: {
    FeatureCard,
    StepIndicator,
    CodeBlock
  }
}
</script>

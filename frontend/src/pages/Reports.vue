<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <p class="text-gray-600">Create and execute SQL queries, then export results to Excel</p>
      </div>
      <ExportButton
        v-if="queryData.length > 0"
        :sql="currentSql"
        :params="currentParams"
        :data="queryData"
        filename="report"
      />
    </div>

    <!-- Query Editor -->
    <QueryEditor @query-executed="handleQueryExecuted" />

    <!-- Results -->
    <ReportTable
      v-if="queryData.length > 0"
      :data="queryData"
      :page-size="25"
    />

    <!-- Report Templates -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Report Templates</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in reportTemplates"
          :key="template.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
          @click="loadTemplate(template)"
        >
          <h3 class="font-medium text-gray-900 mb-2">{{ template.name }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
          <code class="text-xs text-gray-700 font-mono bg-gray-50 p-2 rounded block">
            {{ template.sql.substring(0, 100) }}{{ template.sql.length > 100 ? '...' : '' }}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QueryEditor from '../components/QueryEditor.vue'
import ReportTable from '../components/ReportTable.vue'
import ExportButton from '../components/ExportButton.vue'

interface QueryResult {
  data: any[]
  sql: string
  params: any[]
}

interface ReportTemplate {
  id: number
  name: string
  description: string
  sql: string
}

const queryData = ref<any[]>([])
const currentSql = ref<string>('')
const currentParams = ref<any[]>([])

const reportTemplates = ref<ReportTemplate[]>([
  {
    id: 1,
    name: 'Employee Directory',
    description: 'Complete list of all employees with their details',
    sql: `SELECT 
  e.first_name,
  e.last_name,
  e.email,
  e.salary,
  e.hire_date,
  d.name as department,
  d.location
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
ORDER BY e.last_name, e.first_name`
  },
  {
    id: 2,
    name: 'Sales Summary by Product',
    description: 'Total sales grouped by product with quantities and revenue',
    sql: `SELECT 
  s.product_name,
  SUM(s.quantity) as total_quantity,
  SUM(s.quantity * s.unit_price) as total_revenue,
  COUNT(*) as sale_count,
  AVG(s.unit_price) as avg_unit_price
FROM sales s
GROUP BY s.product_name
ORDER BY total_revenue DESC`
  },
  {
    id: 3,
    name: 'Department Performance',
    description: 'Department budgets, employee counts, and average salaries',
    sql: `SELECT 
  d.name as department,
  d.location,
  d.budget,
  COUNT(e.id) as employee_count,
  AVG(e.salary) as avg_salary,
  SUM(e.salary) as total_salary_cost
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name, d.location, d.budget
ORDER BY d.name`
  },
  {
    id: 4,
    name: 'Top Performers',
    description: 'Employees with highest sales performance',
    sql: `SELECT 
  e.first_name,
  e.last_name,
  e.email,
  COUNT(s.id) as sales_count,
  SUM(s.quantity * s.unit_price) as total_sales,
  AVG(s.quantity * s.unit_price) as avg_sale_value
FROM employees e
LEFT JOIN sales s ON e.id = s.employee_id
GROUP BY e.id, e.first_name, e.last_name, e.email
HAVING total_sales > 0
ORDER BY total_sales DESC
LIMIT 10`
  },
  {
    id: 5,
    name: 'Monthly Sales Trend',
    description: 'Sales performance by month',
    sql: `SELECT 
  strftime('%Y-%m', sale_date) as month,
  COUNT(*) as sale_count,
  SUM(quantity) as total_quantity,
  SUM(quantity * unit_price) as total_revenue
FROM sales
GROUP BY strftime('%Y-%m', sale_date)
ORDER BY month`
  },
  {
    id: 6,
    name: 'Salary Analysis',
    description: 'Salary statistics by department',
    sql: `SELECT 
  d.name as department,
  COUNT(e.id) as employee_count,
  MIN(e.salary) as min_salary,
  MAX(e.salary) as max_salary,
  AVG(e.salary) as avg_salary,
  SUM(e.salary) as total_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE e.salary IS NOT NULL
GROUP BY d.id, d.name
ORDER BY avg_salary DESC`
  }
])

const handleQueryExecuted = (result: QueryResult) => {
  queryData.value = result.data
  currentSql.value = result.sql
  currentParams.value = result.params
}

const loadTemplate = (template: ReportTemplate) => {
  // This would need to be implemented in QueryEditor component
  // For now, we'll just show the SQL in console
  console.log('Loading template:', template)
  // You could emit an event to QueryEditor to set the SQL
}
</script>

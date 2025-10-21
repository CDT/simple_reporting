<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Query Results</h3>
      <div class="text-sm text-gray-500">
        {{ data.length }} row{{ data.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <EmptyState
      v-if="data.length === 0"
      title="No data to display"
      icon="chart"
    />

    <div v-else class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th 
              v-for="(column, index) in columns" 
              :key="index"
              class="cursor-pointer hover:bg-gray-100"
              @click="sortBy(column)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ formatColumnName(column) }}</span>
                <div class="flex flex-col">
                  <ChevronUpIcon 
                    class="w-3 h-3 text-gray-400" 
                    :class="{ 'text-gray-600': sortColumn === column && sortDirection === 'asc' }"
                  />
                  <ChevronDownIcon 
                    class="w-3 h-3 text-gray-400 -mt-1" 
                    :class="{ 'text-gray-600': sortColumn === column && sortDirection === 'desc' }"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in sortedData" :key="rowIndex">
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              <span v-if="typeof row[column] === 'number'" class="font-mono">
                {{ formatNumber(row[column]) }}
              </span>
              <span v-else-if="isDate(row[column])" class="text-gray-600">
                {{ formatDate(row[column]) }}
              </span>
              <span v-else>
                {{ row[column] || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="data.length > pageSize" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, data.length) }} of {{ data.length }} results
      </div>
      <div class="flex space-x-2">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-3 py-1 text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { EmptyState, ChevronUpIcon, ChevronDownIcon } from './ui'

interface Props {
  data: any[]
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  pageSize: 50
})

const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref<number>(1)

// Extract columns from data
const columns = computed<string[]>(() => {
  if (props.data.length === 0) return []
  return Object.keys(props.data[0])
})

// Sort data
const sortedData = computed<any[]>(() => {
  if (!sortColumn.value) return paginatedData.value

  return [...paginatedData.value].sort((a, b) => {
    const aVal = a[sortColumn.value!]
    const bVal = b[sortColumn.value!]

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (sortDirection.value === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  })
})

// Paginate data
const paginatedData = computed<any[]>(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.data.slice(start, end)
})

// Calculate total pages
const totalPages = computed<number>(() => {
  return Math.ceil(props.data.length / props.pageSize)
})

// Sort by column
const sortBy = (column: string): void => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Format column name
const formatColumnName = (column: string): string => {
  return column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Format number
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '-'
  if (Number.isInteger(num)) return num.toLocaleString()
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// Check if value is a date
const isDate = (value: any): boolean => {
  if (!value) return false
  const date = new Date(value)
  return !isNaN(date.getTime())
}

// Format date
const formatDate = (value: any): string => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString()
}

// Reset pagination when data changes
watch(() => props.data, () => {
  currentPage.value = 1
  sortColumn.value = null
  sortDirection.value = 'asc'
})
</script>

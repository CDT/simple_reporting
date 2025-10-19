<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">SQL Query Editor</h3>
      <div class="flex space-x-2">
        <button
          @click="loadTables"
          :disabled="isLoading"
          class="btn btn-secondary text-sm"
        >
          Load Tables
        </button>
        <button
          @click="executeQuery"
          :disabled="!sql.trim() || isLoading"
          class="btn btn-primary"
        >
          Execute Query
        </button>
      </div>
    </div>

    <!-- SQL Editor -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        SQL Query
      </label>
      <textarea
        v-model="sql"
        class="input font-mono text-sm"
        rows="8"
        placeholder="Enter your SQL query here..."
        @keydown.ctrl.enter="executeQuery"
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        Press Ctrl+Enter to execute query
      </p>
    </div>

    <!-- Parameters -->
    <div v-if="parameters.length > 0" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Parameters
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="(param, index) in parameters" :key="index">
          <label class="block text-xs text-gray-600 mb-1">
            Parameter {{ index + 1 }}
          </label>
          <input
            v-model="paramValues[index]"
            type="text"
            class="input text-sm"
            :placeholder="`Enter value for parameter ${index + 1}`"
          />
        </div>
      </div>
    </div>

    <!-- Available Tables -->
    <div v-if="tables.length > 0" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Available Tables
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="table in tables"
          :key="table"
          @click="insertTableName(table)"
          class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          {{ table }}
        </button>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm text-red-700">{{ error }}</span>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm text-green-700">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import axios from 'axios'

export default {
  name: 'QueryEditor',
  emits: ['query-executed'],
  setup(props, { emit }) {
    const sql = ref('')
    const parameters = ref([])
    const paramValues = ref([])
    const tables = ref([])
    const error = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)

    const setLoading = inject('setLoading')

    // Extract parameters from SQL
    const extractParameters = (sqlText) => {
      const paramRegex = /\?/g
      const matches = sqlText.match(paramRegex)
      return matches ? Array(matches.length).fill('') : []
    }

    // Watch SQL changes to update parameters
    const updateParameters = () => {
      parameters.value = extractParameters(sql.value)
      paramValues.value = Array(parameters.value.length).fill('')
    }

    // Load available tables
    const loadTables = async () => {
      try {
        const response = await axios.get('/api/query/tables')
        if (response.data.success) {
          tables.value = response.data.tables
        }
      } catch (err) {
        console.error('Error loading tables:', err)
      }
    }

    // Insert table name into SQL
    const insertTableName = (tableName) => {
      const textarea = document.querySelector('textarea')
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = sql.value.substring(0, start)
      const after = sql.value.substring(end)
      sql.value = before + tableName + after
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + tableName.length, start + tableName.length)
      }, 0)
    }

    // Execute query
    const executeQuery = async () => {
      if (!sql.value.trim()) {
        error.value = 'Please enter a SQL query'
        return
      }

      isLoading.value = true
      setLoading(true)
      error.value = ''
      successMessage.value = ''

      try {
        const response = await axios.post('/api/query', {
          sql: sql.value,
          params: paramValues.value.filter(val => val !== '')
        })

        if (response.data.success) {
          successMessage.value = `Query executed successfully. ${response.data.rowCount} rows returned.`
          emit('query-executed', {
            data: response.data.data,
            sql: sql.value,
            params: paramValues.value.filter(val => val !== '')
          })
        } else {
          error.value = response.data.message || 'Query execution failed'
        }
      } catch (err) {
        console.error('Query execution error:', err)
        error.value = err.response?.data?.message || err.message || 'Query execution failed'
      } finally {
        isLoading.value = false
        setLoading(false)
      }
    }

    // Load tables on component mount
    loadTables()

    return {
      sql,
      parameters,
      paramValues,
      tables,
      error,
      successMessage,
      isLoading,
      loadTables,
      insertTableName,
      executeQuery,
      updateParameters
    }
  },
  watch: {
    sql() {
      this.updateParameters()
    }
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">SQL Query Editor</h3>
        <StatusIndicator
          v-if="activeConnection"
          status="success"
          :text="`Connected to: ${activeConnection.name} (${activeConnection.type.toUpperCase()})`"
        />
        <StatusIndicator
          v-else
          status="error"
          text="No active connection. Please configure a connection in Settings."
        />
      </div>
      <div class="flex space-x-2">
        <button
          @click="loadTables"
          :disabled="isLoading || !activeConnection"
          class="btn btn-secondary text-sm"
        >
          Load Tables
        </button>
        <button
          @click="executeQuery"
          :disabled="!sql.trim() || isLoading || !activeConnection"
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
    <AlertMessage
      v-if="error"
      type="error"
      :message="error"
      class="mb-4"
    />

    <!-- Success Message -->
    <AlertMessage
      v-if="successMessage"
      type="success"
      :message="successMessage"
      class="mb-4"
    />
  </div>
</template>

<script>
import { ref, computed, inject, onMounted } from 'vue'
import axios from 'axios'
import { StatusIndicator, AlertMessage } from './ui'

export default {
  name: 'QueryEditor',
  components: {
    StatusIndicator,
    AlertMessage
  },
  emits: ['query-executed'],
  setup(props, { emit }) {
    const sql = ref('')
    const parameters = ref([])
    const paramValues = ref([])
    const tables = ref([])
    const error = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const activeConnection = ref(null)

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
      if (!activeConnection.value) {
        error.value = 'No active connection. Please configure a connection in Settings.'
        return
      }

      try {
        const response = await axios.get('/api/query/tables')
        if (response.data.success) {
          tables.value = response.data.tables
          error.value = ''
        }
      } catch (err) {
        console.error('Error loading tables:', err)
        error.value = err.response?.data?.message || 'Failed to load tables'
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

    // Load active connection
    const loadActiveConnection = async () => {
      try {
        const response = await axios.get('/api/connections')
        if (response.data.success) {
          const connections = response.data.connections
          activeConnection.value = connections.find(c => c.isActive) || null
        }
      } catch (err) {
        console.error('Error loading active connection:', err)
      }
    }

    // Load tables on component mount
    onMounted(() => {
      loadActiveConnection()
      loadTables()
    })

    return {
      sql,
      parameters,
      paramValues,
      tables,
      error,
      successMessage,
      isLoading,
      activeConnection,
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

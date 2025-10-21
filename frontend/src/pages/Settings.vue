<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-600">Configure database connections and application settings</p>
    </div>

    <!-- Connections Section -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Database Connections</h2>
        <button
          @click="showAddConnection = true"
          class="btn btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Connection
        </button>
      </div>

      <!-- Connections List -->
      <EmptyState
        v-if="connections.length === 0"
        title="No connections configured yet"
        description="Add your first database connection to get started"
        icon="database"
      />

      <div v-else class="space-y-4">
        <ConnectionCard
          v-for="connection in connections"
          :key="connection.id"
          :connection="connection"
          :testing="testingConnection === connection.id"
          @test="testConnection"
          @edit="editConnection"
          @delete="deleteConnection"
        />
      </div>
    </div>

    <!-- Add/Edit Connection Modal -->
    <Modal
      :show="showAddConnection || !!editingConnection"
      :title="editingConnection ? 'Edit Connection' : 'Add New Connection'"
      @close="cancelEdit"
    >
      <form @submit.prevent="saveConnection" class="space-y-4">
          <FormField
            v-model="connectionForm.name"
            label="Connection Name"
            placeholder="e.g., Production Database"
            required
          />

          <FormField
            v-model="connectionForm.type"
            type="select"
            label="Database Type"
            placeholder="Select database type"
            :options="[
              { value: 'oracle', label: 'Oracle' },
              { value: 'sqlserver', label: 'SQL Server' },
              { value: 'postgres', label: 'PostgreSQL' }
            ]"
            required
          />

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-model="connectionForm.host"
              label="Host"
              placeholder="localhost"
              required
            />
            <FormField
              v-model="connectionForm.port"
              type="number"
              label="Port"
              :placeholder="getDefaultPort(connectionForm.type)"
              required
            />
          </div>

          <FormField
            v-model="connectionForm.database"
            label="Database Name"
            placeholder="database_name"
            required
          />

          <FormField
            v-model="connectionForm.username"
            label="Username"
            placeholder="username"
            required
          />

          <FormField
            v-model="connectionForm.password"
            type="password"
            label="Password"
            placeholder="password"
            required
          />

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingConnection ? 'Update' : 'Add') }}
            </button>
          </div>
        </form>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { EmptyState, ConnectionCard, Modal, FormField } from '../components/ui'

export default {
  name: 'Settings',
  components: {
    EmptyState,
    ConnectionCard,
    Modal,
    FormField
  },
  setup() {
    const connections = ref([])
    const showAddConnection = ref(false)
    const editingConnection = ref(null)
    const testingConnection = ref(null)
    const saving = ref(false)

    const connectionForm = ref({
      name: '',
      type: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: ''
    })

    const getDefaultPort = (type) => {
      const ports = {
        oracle: '1521',
        sqlserver: '1433',
        postgres: '5432'
      }
      return ports[type] || ''
    }

    const getConnectionIcon = (type) => {
      const icons = {
        oracle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        sqlserver: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        postgres: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
      }
      return icons[type] || icons.postgres
    }

    const getConnectionIconClass = (type) => {
      const classes = {
        oracle: 'bg-red-100 text-red-600',
        sqlserver: 'bg-blue-100 text-blue-600',
        postgres: 'bg-indigo-100 text-indigo-600'
      }
      return classes[type] || classes.postgres
    }

    const loadConnections = async () => {
      try {
        const response = await fetch('/api/connections')
        if (response.ok) {
          const data = await response.json()
          connections.value = data.connections || []
        }
      } catch (error) {
        console.error('Error loading connections:', error)
      }
    }

    const saveConnection = async () => {
      saving.value = true
      try {
        const url = editingConnection.value 
          ? `/api/connections/${editingConnection.value.id}`
          : '/api/connections'
        
        const method = editingConnection.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(connectionForm.value)
        })

        if (response.ok) {
          await loadConnections()
          cancelEdit()
        } else {
          const error = await response.json()
          alert('Error saving connection: ' + (error.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error saving connection:', error)
        alert('Error saving connection: ' + error.message)
      } finally {
        saving.value = false
      }
    }

    const editConnection = (connection) => {
      editingConnection.value = connection
      connectionForm.value = { ...connection }
      showAddConnection.value = false
    }

    const deleteConnection = async (id) => {
      if (!confirm('Are you sure you want to delete this connection?')) {
        return
      }

      try {
        const response = await fetch(`/api/connections/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadConnections()
        } else {
          const error = await response.json()
          alert('Error deleting connection: ' + (error.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting connection:', error)
        alert('Error deleting connection: ' + error.message)
      }
    }

    const testConnection = async (connection) => {
      testingConnection.value = connection.id
      try {
        const response = await fetch(`/api/connections/${connection.id}/test`, {
          method: 'POST'
        })

        if (response.ok) {
          alert('Connection test successful!')
        } else {
          const error = await response.json()
          alert('Connection test failed: ' + (error.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error testing connection:', error)
        alert('Connection test failed: ' + error.message)
      } finally {
        testingConnection.value = null
      }
    }

    const cancelEdit = () => {
      showAddConnection.value = false
      editingConnection.value = null
      connectionForm.value = {
        name: '',
        type: '',
        host: '',
        port: '',
        database: '',
        username: '',
        password: ''
      }
    }

    onMounted(() => {
      loadConnections()
    })

    return {
      connections,
      showAddConnection,
      editingConnection,
      testingConnection,
      saving,
      connectionForm,
      getDefaultPort,
      getConnectionIcon,
      getConnectionIconClass,
      saveConnection,
      editConnection,
      deleteConnection,
      testConnection,
      cancelEdit
    }
  }
}
</script>

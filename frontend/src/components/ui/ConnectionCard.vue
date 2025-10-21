<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="iconClass"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path :d="iconPath" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">{{ connection.name }}</h3>
          <p class="text-sm text-gray-600">{{ connection.type }} - {{ connection.host }}:{{ connection.port }}</p>
          <p class="text-xs text-gray-500">{{ connection.database }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusClass"
        >
          {{ connection.isActive ? 'Active' : 'Inactive' }}
        </span>
        <button
          v-if="showTestButton"
          @click="$emit('test', connection)"
          :disabled="testing"
          class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {{ testing ? 'Testing...' : 'Test' }}
        </button>
        <button
          v-if="showEditButton"
          @click="$emit('edit', connection)"
          class="text-sm text-gray-600 hover:text-gray-800"
        >
          Edit
        </button>
        <button
          v-if="showDeleteButton"
          @click="$emit('delete', connection.id)"
          class="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectionCard',
  props: {
    connection: {
      type: Object,
      required: true
    },
    testing: {
      type: Boolean,
      default: false
    },
    showTestButton: {
      type: Boolean,
      default: true
    },
    showEditButton: {
      type: Boolean,
      default: true
    },
    showDeleteButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['test', 'edit', 'delete'],
  computed: {
    iconClass() {
      const classes = {
        oracle: 'bg-red-100 text-red-600',
        sqlserver: 'bg-blue-100 text-blue-600',
        postgres: 'bg-indigo-100 text-indigo-600'
      }
      return classes[this.connection.type] || classes.postgres
    },
    statusClass() {
      return this.connection.isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    },
    iconPath() {
      // Generic database icon - you can customize this per database type
      return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    }
  }
}
</script>

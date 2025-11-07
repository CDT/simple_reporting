<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="iconClass"
        >
          <DatabaseIcon class="w-5 h-5" />
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

<script setup lang="ts">
import { computed } from 'vue'
import { DatabaseIcon } from './icons'

interface Connection {
  id: number
  name: string
  type: string
  host: string
  port: string
  database: string
  isActive: boolean
  username: string
  password: string
}

interface Props {
  connection: Connection
  testing?: boolean
  showTestButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  testing: false,
  showTestButton: true,
  showEditButton: true,
  showDeleteButton: true
})

const emit = defineEmits<{
  test: [connection: Connection]
  edit: [connection: Connection]
  delete: [id: number]
}>()

const iconClass = computed<string>(() => {
  const classes: Record<string, string> = {
    oracle: 'bg-red-100 text-red-600',
    sqlserver: 'bg-blue-100 text-blue-600',
    postgres: 'bg-indigo-100 text-indigo-600'
  }
  return classes[props.connection.type] || classes.postgres
})

const statusClass = computed<string>(() => {
  return props.connection.isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
})
</script>

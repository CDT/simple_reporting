<template>
  <div class="flex items-center">
    <div 
      class="w-2 h-2 rounded-full mr-2"
      :class="statusClass"
    ></div>
    <span 
      class="text-sm"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'success' | 'error' | 'warning' | 'info'
  text: string
}

const props = defineProps<Props>()

const statusClass = computed<string>(() => {
  const classes: Record<string, string> = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400'
  }
  return classes[props.status] || classes.info
})

const textClass = computed<string>(() => {
  const classes: Record<string, string> = {
    success: 'text-gray-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[props.status] || classes.info
})
</script>

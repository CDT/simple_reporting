<template>
  <div 
    v-if="show"
    class="p-3 rounded-lg border"
    :class="alertClass"
  >
    <div class="flex items-center">
      <component :is="iconComponent" class="w-5 h-5 mr-2" />
      <span class="text-sm" :class="textClass">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/useIcon'

interface Props {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true
})

const alertClass = computed<string>(() => {
  const classes: Record<string, string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }
  return classes[props.type] || classes.info
})

const textClass = computed<string>(() => {
  const classes: Record<string, string> = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  return classes[props.type] || classes.info
})

// Use the icon utility
const iconComponent = useIcon(props.type)
</script>

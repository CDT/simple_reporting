<template>
  <div class="card text-center">
    <div 
      class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
      :class="iconBgClass"
    >
      <component :is="iconComponent" class="w-6 h-6" :class="iconClass" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/useIcon'

interface Props {
  title: string
  description: string
  icon?: 'chart' | 'download' | 'table' | 'database'
  color?: 'primary' | 'green' | 'purple' | 'blue'
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'chart',
  color: 'primary'
})

// Use the icon utility
const iconComponent = useIcon(props.icon)

const iconBgClass = computed<string>(() => {
  const classes: Record<string, string> = {
    primary: 'bg-primary-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    blue: 'bg-blue-100'
  }
  return classes[props.color] || classes.primary
})

const iconClass = computed<string>(() => {
  const classes: Record<string, string> = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600'
  }
  return classes[props.color] || classes.primary
})
</script>

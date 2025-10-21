<template>
  <div class="flex items-start space-x-3">
    <div 
      class="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-semibold"
      :class="stepClass"
    >
      {{ stepNumber }}
    </div>
    <div>
      <h3 class="font-medium text-gray-900">{{ title }}</h3>
      <p class="text-gray-600">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stepNumber: number
  title: string
  description: string
  color?: 'primary' | 'green' | 'blue' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const stepClass = computed<string>(() => {
  const classes: Record<string, string> = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600'
  }
  return classes[props.color] || classes.primary
})
</script>

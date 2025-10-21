<template>
  <div class="text-center py-8 text-gray-500">
    <component :is="iconComponent" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <p class="text-lg font-medium text-gray-900 mb-2">{{ title }}</p>
    <p v-if="description" class="text-sm">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { resolveIcon } from '../../composables/useIcon'

interface Props {
  title: string
  description?: string
  icon?: 'chart' | 'database' | 'document' | 'users'
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  icon: 'chart'
})

// Use the icon utility
const iconComponent = resolveIcon(props.icon)
</script>

<template>
  <router-link 
    :to="to" 
    class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
    :class="{ 'text-primary-600 bg-primary-50': isActive }"
  >
    <component v-if="icon" :is="iconComponent" class="w-4 h-4" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { useIcon } from '../../composables/useIcon'

interface Props {
  to: string
  name: string
  label: string
  icon?: string
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  isActive: false
})

// Use the icon utility
const iconComponent = useIcon(props.icon)
</script>

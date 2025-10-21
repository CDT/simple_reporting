<template>
  <div class="text-center py-8 text-gray-500">
    <component :is="iconComponent" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <p class="text-lg font-medium text-gray-900 mb-2">{{ title }}</p>
    <p v-if="description" class="text-sm">{{ description }}</p>
  </div>
</template>

<script>
import { ChartIcon, DatabaseIcon, DocumentIcon, UsersIcon } from './icons'

export default {
  name: 'EmptyState',
  components: {
    ChartIcon,
    DatabaseIcon,
    DocumentIcon,
    UsersIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'chart',
      validator: (value) => ['chart', 'database', 'document', 'users'].includes(value)
    }
  },
  computed: {
    iconComponent() {
      return `${this.icon.charAt(0).toUpperCase() + this.icon.slice(1)}Icon`
    }
  }
}
</script>

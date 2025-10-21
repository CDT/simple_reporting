<template>
  <div class="text-center py-8 text-gray-500">
    <svg 
      class="mx-auto h-12 w-12 text-gray-400 mb-4" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path :d="iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
    </svg>
    <p class="text-lg font-medium text-gray-900 mb-2">{{ title }}</p>
    <p v-if="description" class="text-sm">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
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
    iconPath() {
      const paths = {
        chart: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
        document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z'
      }
      return paths[this.icon] || paths.chart
    }
  }
}
</script>

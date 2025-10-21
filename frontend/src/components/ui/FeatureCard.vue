<template>
  <div class="card text-center">
    <div 
      class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
      :class="iconBgClass"
    >
      <svg class="w-6 h-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path :d="iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'chart',
      validator: (value) => ['chart', 'download', 'table', 'database'].includes(value)
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'green', 'purple', 'blue'].includes(value)
    }
  },
  computed: {
    iconPath() {
      const paths = {
        chart: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        download: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        table: 'M4 6h16M4 10h16M4 14h16M4 18h16',
        database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
      }
      return paths[this.icon] || paths.chart
    },
    iconBgClass() {
      const classes = {
        primary: 'bg-primary-100',
        green: 'bg-green-100',
        purple: 'bg-purple-100',
        blue: 'bg-blue-100'
      }
      return classes[this.color] || classes.primary
    },
    iconClass() {
      const classes = {
        primary: 'text-primary-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        blue: 'text-blue-600'
      }
      return classes[this.color] || classes.primary
    }
  }
}
</script>

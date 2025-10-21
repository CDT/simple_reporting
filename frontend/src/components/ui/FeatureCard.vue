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

<script>
import { ChartIcon, DownloadIcon, TableIcon, DatabaseIcon } from './icons'

export default {
  name: 'FeatureCard',
  components: {
    ChartIcon,
    DownloadIcon,
    TableIcon,
    DatabaseIcon
  },
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
    iconComponent() {
      return `${this.icon.charAt(0).toUpperCase() + this.icon.slice(1)}Icon`
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

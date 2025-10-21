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

<script>
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon } from './icons'

export default {
  name: 'AlertMessage',
  components: {
    SuccessIcon,
    ErrorIcon,
    WarningIcon,
    InfoIcon
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    message: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    alertClass() {
      const classes = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
      }
      return classes[this.type] || classes.info
    },
    textClass() {
      const classes = {
        success: 'text-green-700',
        error: 'text-red-700',
        warning: 'text-yellow-700',
        info: 'text-blue-700'
      }
      return classes[this.type] || classes.info
    },
    iconComponent() {
      return `${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Icon`
    }
  }
}
</script>

<template>
  <div class="flex items-center">
    <div 
      class="w-2 h-2 rounded-full mr-2"
      :class="statusClass"
    ></div>
    <span 
      class="text-sm"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    statusClass() {
      const classes = {
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-yellow-400',
        info: 'bg-blue-400'
      }
      return classes[this.status] || classes.info
    },
    textClass() {
      const classes = {
        success: 'text-gray-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
      }
      return classes[this.status] || classes.info
    }
  }
}
</script>

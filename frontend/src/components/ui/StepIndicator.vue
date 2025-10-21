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

<script>
export default {
  name: 'StepIndicator',
  props: {
    stepNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'green', 'blue', 'purple'].includes(value)
    }
  },
  computed: {
    stepClass() {
      const classes = {
        primary: 'bg-primary-600',
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600'
      }
      return classes[this.color] || classes.primary
    }
  }
}
</script>

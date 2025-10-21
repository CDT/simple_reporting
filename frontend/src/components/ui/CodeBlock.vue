<template>
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 v-if="title" class="font-medium text-gray-900 mb-2">{{ title }}</h3>
    <code class="text-sm text-gray-700 font-mono">
      {{ code }}
    </code>
  </div>
</template>

<script>
export default {
  name: 'CodeBlock',
  props: {
    code: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

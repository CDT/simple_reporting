<template>
  <BaseIcon :path="path" />
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DatabaseIcon',
  components: {
    BaseIcon
  },
  data() {
    return {
      path: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
    }
  }
}
</script>

<template>
  <BaseIcon :path="path" />
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'TableIcon',
  components: {
    BaseIcon
  },
  data() {
    return {
      path: 'M4 6h16M4 10h16M4 14h16M4 18h16'
    }
  }
}
</script>

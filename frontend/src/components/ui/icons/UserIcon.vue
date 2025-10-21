<template>
  <BaseIcon :path="path" />
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'UserIcon',
  components: {
    BaseIcon
  },
  data() {
    return {
      path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  }
}
</script>

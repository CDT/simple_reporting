<template>
  <BaseIcon :path="path" />
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'PlusIcon',
  components: {
    BaseIcon
  },
  data() {
    return {
      path: 'M12 4v16m8-8H4'
    }
  }
}
</script>

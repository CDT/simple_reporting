<template>
  <BaseIcon :path="path" />
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'FormattedExportIcon',
  components: {
    BaseIcon
  },
  data() {
    return {
      path: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
    }
  }
}
</script>

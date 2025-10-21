<template>
  <svg 
    class="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    stroke-linecap="round" 
    stroke-linejoin="round" 
    stroke-width="2"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  path: string
}

defineProps<Props>()
</script>

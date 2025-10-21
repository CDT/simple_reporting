<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div 
      class="bg-white rounded-lg p-6 w-full mx-4"
      :class="modalClass"
    >
      <div v-if="title" class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button
          v-if="closable"
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <CloseIcon class="w-6 h-6" />
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CloseIcon } from './icons'

interface Props {
  show?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  size: 'md',
  closable: true
})

const emit = defineEmits<{
  close: []
}>()

const modalClass = computed<string>(() => {
  const classes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  return classes[props.size] || classes.md
})
</script>

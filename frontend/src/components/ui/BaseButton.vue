<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <component
      v-if="icon"
      :is="icon"
      :class="iconClasses"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: any
  iconSize?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  iconSize: 'w-4 h-4',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    'inline-flex items-center justify-center',
    {
      'opacity-50 cursor-not-allowed': props.disabled,
      'w-full': props.fullWidth
    }
  ]
})

const iconClasses = computed(() => {
  return [
    props.iconSize,
    {
      'mr-2': !!props.icon // Add right margin if icon exists
    }
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>


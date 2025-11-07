<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    ></textarea>
    <p v-if="helpText" class="text-xs text-gray-500 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  helpText: '',
  required: false,
  disabled: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>


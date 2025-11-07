<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    />
    <p v-if="helpText" class="text-xs text-gray-500 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: '',
  helpText: '',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>


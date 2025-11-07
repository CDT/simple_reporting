<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.escape="closeDropdown"
      @keydown.down.prevent="navigateDown"
      @keydown.up.prevent="navigateUp"
      tabindex="0"
      :class="[
        'w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-all duration-200 cursor-pointer',
        isOpen ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300 hover:border-gray-400',
        disabled ? 'opacity-50 cursor-not-allowed hover:border-gray-300' : ''
      ]"
    >
      <div class="flex items-center justify-between">
        <span :class="selectedOption ? 'text-gray-900' : 'text-gray-500'">
          {{ selectedOption ? selectedOption.label : placeholder || 'Select an option' }}
        </span>
        <svg 
          class="w-5 h-5 text-gray-500 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
    
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-10px] scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-[-10px] scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto py-1">
          <div
            v-for="(option, index) in options"
            :key="option.value"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
            :class="[
              'px-4 py-2.5 cursor-pointer transition-all duration-150',
              selectedOption?.value === option.value 
                ? 'bg-primary-50 text-primary-700 font-medium' 
                : highlightedIndex === index
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <div class="flex items-center justify-between">
              <span>{{ option.label }}</span>
              <svg 
                v-if="selectedOption?.value === option.value"
                class="w-5 h-5 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <p v-if="helpText" class="text-xs text-gray-500 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  options: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  helpText: '',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)
const highlightedIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value && selectedOption.value) {
    highlightedIndex.value = props.options.findIndex(opt => opt.value === selectedOption.value?.value)
  }
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const selectOption = (option: Option) => {
  if (props.disabled) return
  emit('update:modelValue', option.value)
  closeDropdown()
}

const navigateDown = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
}

const navigateUp = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


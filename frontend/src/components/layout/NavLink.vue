<template>
  <router-link 
    :to="to" 
    class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
    :class="{ 'text-primary-600 bg-primary-50': isActive }"
  >
    <component v-if="icon" :is="iconComponent" class="w-4 h-4" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script>
import { HomeIcon, ChartIcon, SettingsIcon, UserIcon, DatabaseIcon } from '../ui/icons'

export default {
  name: 'NavLink',
  components: {
    HomeIcon,
    ChartIcon,
    SettingsIcon,
    UserIcon,
    DatabaseIcon
  },
  computed: {
    iconComponent() {
      return this.icon ? `${this.icon.charAt(0).toUpperCase() + this.icon.slice(1)}Icon` : null
    }
  },
  props: {
    to: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '',
      validator: (value) => ['', 'home', 'chart', 'settings', 'user', 'database'].includes(value)
    },
    isActive: {
      type: Boolean,
      default: false
    }
  }
}
</script>

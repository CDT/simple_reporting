<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <h1 class="text-xl font-bold text-primary-600">{{ brandName }}</h1>
          </router-link>
        </div>
        
        <!-- Navigation Links -->
        <div class="flex items-center space-x-4">
          <NavLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            :name="item.name"
            :label="item.label"
            :icon="item.icon"
            :is-active="$route.name === item.name"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import NavLink from './NavLink.vue'

export default {
  name: 'AppNavigation',
  components: {
    NavLink
  },
  props: {
    brandName: {
      type: String,
      default: 'Simple Reporting'
    },
    navigationItems: {
      type: Array,
      default: () => [
        {
          name: 'Home',
          to: '/',
          label: 'Home',
          icon: 'home'
        },
        {
          name: 'Reports',
          to: '/reports',
          label: 'Reports',
          icon: 'chart'
        },
        {
          name: 'Settings',
          to: '/settings',
          label: 'Settings',
          icon: 'settings'
        }
      ]
    }
  }
}
</script>

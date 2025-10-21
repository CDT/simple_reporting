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

<script setup lang="ts">
import NavLink from './NavLink.vue'

interface NavigationItem {
  name: string
  to: string
  label: string
  icon: string
}

interface Props {
  brandName?: string
  navigationItems?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  brandName: 'Simple Reporting',
  navigationItems: () => [
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
})
</script>

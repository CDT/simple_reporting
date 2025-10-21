<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavigation 
      :brand-name="brandName"
      :navigation-items="navigationItems"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot></slot>
    </main>

    <!-- Loading Overlay -->
    <LoadingSpinner :show="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { LoadingSpinner } from '../ui'
import AppNavigation from './AppNavigation.vue'

interface NavigationItem {
  name: string
  to: string
  label: string
  icon: string
}

interface Props {
  brandName?: string
  navigationItems?: NavigationItem[]
  isLoading?: boolean
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
  ],
  isLoading: false
})
</script>

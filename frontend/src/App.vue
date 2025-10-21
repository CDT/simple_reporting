<template>
  <AppLayout 
    :is-loading="isLoading"
    :brand-name="brandName"
    :navigation-items="navigationItems"
  >
    <router-view />
  </AppLayout>
</template>

<script>
import { ref, provide } from 'vue'
import { AppLayout } from './components/layout'

export default {
  name: 'App',
  components: {
    AppLayout
  },
  setup() {
    const isLoading = ref(false)
    
    // Navigation configuration
    const brandName = ref('Simple Reporting')
    const navigationItems = ref([
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
    ])
    
    // Provide loading state to child components
    provide('isLoading', isLoading)
    provide('setLoading', (loading) => {
      isLoading.value = loading
    })

    return {
      isLoading,
      brandName,
      navigationItems
    }
  }
}
</script>

import { computed, defineAsyncComponent, type Component } from 'vue'

/**
 * Composable for dynamically resolving icon components by name
 * @param iconName - The name of the icon (e.g., 'home', 'chart', 'settings')
 * @returns A computed property that returns the resolved icon component
 */
export function useIcon(iconName: string | undefined | null) {
  return computed<Component | null>(() => {
    if (!iconName) return null
    
    // Convert icon name to PascalCase (e.g., 'home' -> 'HomeIcon')
    const componentName = iconName.charAt(0).toUpperCase() + iconName.slice(1) + 'Icon'
    
    // Dynamically import the icon component
    return defineAsyncComponent(() => import(`../components/ui/icons/${componentName}.vue`))
  })
}

/**
 * Alternative function for direct icon resolution (non-reactive)
 * @param iconName - The name of the icon
 * @returns The resolved icon component
 */
export function resolveIcon(iconName: string): Component {
  const componentName = iconName.charAt(0).toUpperCase() + iconName.slice(1) + 'Icon'
  return defineAsyncComponent(() => import(`../components/ui/icons/${componentName}.vue`))
}

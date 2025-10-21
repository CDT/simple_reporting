# Layout Components

This directory contains modular layout components for the application.

## Components

### AppLayout.vue
The main layout wrapper component that provides the overall application structure including navigation, main content area, and loading overlay.

**Props:**
- `brandName` (String): The application brand name displayed in navigation
- `navigationItems` (Array): Array of navigation items with name, to, label, and icon
- `isLoading` (Boolean): Controls the loading spinner visibility

**Usage:**
```vue
<AppLayout :is-loading="isLoading" :brand-name="'My App'">
  <router-view />
</AppLayout>
```

### AppNavigation.vue
The navigation bar component that renders the top navigation with brand and menu items.

**Props:**
- `brandName` (String): The application brand name
- `navigationItems` (Array): Array of navigation items

### NavLink.vue
Individual navigation link component with icon support and active state styling.

**Props:**
- `to` (String): Router link destination
- `name` (String): Route name for active state detection
- `label` (String): Display text for the link
- `icon` (String): Icon name (home, chart, settings, user, database)
- `isActive` (Boolean): Whether the link is currently active

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used in different contexts
3. **Maintainability**: Easy to update navigation or layout without affecting other parts
4. **Flexibility**: Navigation items and brand name are configurable
5. **Consistency**: Standardized navigation styling and behavior

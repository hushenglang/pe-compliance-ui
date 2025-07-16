# CSS Organization Guide for React Projects

## 🎯 Recommended Structure: CSS Modules + Co-location

### File Organization
```
src/components/
├── ComponentName/
│   ├── index.tsx                    # Main component file
│   ├── ComponentName.module.css     # Scoped styles
│   ├── ComponentName.test.tsx       # Unit tests
│   └── ComponentName.stories.tsx    # Storybook stories (optional)
```

### Benefits of This Approach

#### 1. **Scoped Styles**
```css
/* Sidebar.module.css */
.navItem {
  color: blue;
}

/* NewsCard.module.css */
.navItem {  /* Different .navItem - no conflicts! */
  color: red;
}
```

#### 2. **Type Safety**
```tsx
import styles from './Sidebar.module.css'

// TypeScript will warn if 'navItm' doesn't exist
<button className={styles.navItm}>  // ❌ Error!
<button className={styles.navItem}> // ✅ Works!
```

#### 3. **Better Developer Experience**
- **IntelliSense**: Auto-complete CSS class names
- **Find All References**: Easy to track where styles are used
- **Refactoring**: Rename CSS classes with confidence

#### 4. **Performance Benefits**
- **Tree Shaking**: Unused styles are removed
- **Smaller Bundles**: Only used CSS is included
- **Cache Optimization**: Component styles can be cached separately

## 🔄 Alternative Approaches

### CSS-in-JS (Styled Components)
```tsx
import styled from 'styled-components'

const Button = styled.button`
  color: ${props => props.primary ? 'white' : 'black'};
  background: ${props => props.primary ? 'blue' : 'white'};
`

// Usage
<Button primary>Click me</Button>
```

**When to use:**
- Dynamic styling based on props
- Theming requirements
- No separate CSS files desired

**Trade-offs:**
- Larger bundle size
- Runtime overhead
- Learning curve

### Tailwind CSS
```tsx
const Sidebar = () => (
  <div className="w-64 bg-white border-r border-gray-200">
    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
      Nav Item
    </button>
  </div>
)
```

**When to use:**
- Rapid prototyping
- Consistent design system
- Utility-first approach

**Trade-offs:**
- Large HTML class strings
- Learning curve for utility classes
- Potential bundle size (if not purged)

### Global CSS
```css
/* styles.css */
.sidebar { /* Global styles */ }
.nav-item { /* Global styles */ }
```

**When to use:**
- Simple projects
- Consistent global styles
- Legacy codebases

**Trade-offs:**
- Style conflicts
- Hard to maintain
- No scoping

## 🛠 Implementation Examples

### CSS Modules Example
```tsx
// Component: Button/index.tsx
import styles from './Button.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button = ({ variant = 'primary', children }: ButtonProps) => (
  <button className={`${styles.button} ${styles[variant]}`}>
    {children}
  </button>
)
```

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.button:hover {
  transform: translateY(-1px);
}
```

### Conditional Classes Helper
```tsx
// utils/classNames.ts
export const classNames = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Usage
<button className={classNames(
  styles.button,
  variant === 'primary' && styles.primary,
  isDisabled && styles.disabled
)}>
```

## 📏 Best Practices

### 1. **Naming Conventions**
```css
/* Use camelCase for CSS Module classes */
.navItem { }         /* ✅ Good */
.nav-item { }        /* ❌ Avoid - harder to use in JS */
.NavItem { }         /* ❌ Avoid - not conventional */
```

### 2. **File Organization**
```
Component/
├── index.tsx                 # Default export
├── Component.module.css      # Styles
├── Component.test.tsx        # Tests
├── Component.stories.tsx     # Storybook
└── types.ts                  # Component-specific types
```

### 3. **CSS Module Patterns**
```css
/* Use :global() for overriding third-party styles */
.container :global(.third-party-class) {
  color: red;
}

/* Use composes for extending styles */
.primaryButton {
  composes: button;
  background-color: blue;
}
```

## 🎯 Migration Strategy

### From Global CSS to CSS Modules

1. **Start with new components** using CSS Modules
2. **Gradually migrate existing components** one by one
3. **Keep global styles for** reset, typography, utilities
4. **Use CSS variables for** theming across modules

### Example Migration
```tsx
// Before (Global CSS)
<button className="nav-item active">

// After (CSS Modules)
<button className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
```

## 🔍 Tools and Setup

### Vite Configuration (Automatic)
```js
// vite.config.js - CSS Modules work out of the box
export default {
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
}
```

### TypeScript Support
```ts
// vite-env.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
```

This approach gives you the best of both worlds: maintainable, scoped styles with excellent developer experience! 
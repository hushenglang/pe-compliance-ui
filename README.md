# PE Compliance UI

A modern React-based user interface for PE compliance news monitoring and management. This application provides a clean, professional interface to view and manage compliance news from multiple regulatory sources including HKEX, HKMA, SEC, and SFC.

## 🚀 Tech Stack

### Core Technologies
- **React 18** with **TypeScript** - Modern React with type safety
- **Vite** - Fast build tool and development server
- **TanStack Ecosystem** - Comprehensive data management solution
- **Tailwind CSS** - Utility-first styling framework

### TanStack Ecosystem
- **TanStack Query** - Data fetching, caching, and server state management
- **TanStack Table** - Powerful data tables with sorting, filtering, and pagination
- **TanStack Router** - File-based routing system
- **TanStack Form** - Form handling and validation

### Why This Stack?

✅ **Cohesive Ecosystem** - All TanStack tools work seamlessly together  
✅ **Performance** - Smart caching, virtual scrolling, minimal bundle size  
✅ **Developer Experience** - Type-safe, minimal configuration, consistent APIs  
✅ **Maintainability** - Fewer dependencies, unified patterns  
✅ **Professional UI** - Tailwind provides clean, responsive design  

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running pe-compliance-app backend

### Quick Start

1. **Create the project**
```bash
npm create vite@latest pe-compliance-ui -- --template react-ts
cd pe-compliance-ui
```

2. **Install core dependencies**
```bash
# TanStack ecosystem
npm install @tanstack/react-query @tanstack/react-table @tanstack/react-router

# Styling
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms

# Optional: Form handling
npm install @tanstack/react-form
```

3. **Initialize Tailwind CSS**
```bash
npx tailwindcss init -p
```

4. **Start development server**
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=PE Compliance UI
```

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        compliance: {
          primary: '#1e40af',
          secondary: '#6b7280',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

## 📊 Features

### Data Sources
- **HKEX** - Hong Kong Exchange news and announcements
- **HKMA** - Hong Kong Monetary Authority updates
- **SEC** - Securities and Exchange Commission filings
- **SFC** - Securities and Futures Commission notices

### Core Functionality
- 📰 Real-time compliance news aggregation
- 🔍 Advanced search and filtering
- 📊 Data tables with sorting and pagination
- 📱 Responsive design for mobile and desktop
- ⚡ Fast data loading with intelligent caching
- 🔄 Automatic background updates

## 🏃‍♂️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Development Workflow
1. Start the backend: `cd pe-compliance-app && python main.py`
2. Start the frontend: `cd pe-compliance-ui && npm run dev`
3. Open http://localhost:5173

## 🔗 API Integration

The UI connects to the Python backend at `http://localhost:8000` and consumes these endpoints:

- `GET /health` - Health check
- `GET /news/hkex` - HKEX news data
- `GET /news/hkma` - HKMA news data  
- `GET /news/sec` - SEC news data
- `GET /news/sfc` - SFC news data

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1e40af) - Trust and professionalism
- **Secondary**: Gray (#6b7280) - Supporting content
- **Success**: Green (#059669) - Positive actions
- **Warning**: Amber (#d97706) - Attention needed
- **Error**: Red (#dc2626) - Critical issues

### Typography
- **Headings**: Inter font family, various weights
- **Body**: Inter font family, regular weight
- **Code**: JetBrains Mono for technical content

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test components before committing
5. Follow the established folder structure

## 📄 License

This project is for internal PE compliance monitoring use.

---

**Backend Repository**: `pe-compliance-app`  
**Tech Stack**: React + TanStack + Tailwind  
**Target Users**: Compliance officers and regulatory teams







# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

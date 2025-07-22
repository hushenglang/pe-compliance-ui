# PE Compliance UI

A modern React-based user interface for PE compliance news monitoring and management. This application provides a clean, professional interface to view and manage compliance news from multiple regulatory sources including SFC, HKMA, SEC, and HKEX.

## 🚀 Tech Stack

### Core Technologies
- **React 19** with **TypeScript** - Modern React with type safety
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first styling framework
- **CSS Modules** - Component-scoped styling

### Key Features
- **Real-time News Monitoring** - Aggregate compliance news from multiple sources
- **Interactive News Editor** - Edit, review, and manage news articles
- **Statistics Dashboard** - Overview of news processing status
- **Advanced Filtering** - Filter by date range, source, and status
- **Responsive Design** - Mobile and desktop optimized
- **Error Handling** - Comprehensive error boundaries and retry mechanisms

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running pe-compliance-app backend

### Quick Start

1. **Clone and install**
```bash
git clone <repository-url>
cd pe-compliance-ui
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open browser**
Navigate to http://localhost:5173

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file (optional):
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=PE Compliance UI
```

### Tailwind Configuration
The project uses Tailwind CSS 4 with custom configuration in `tailwind.config.js`.

## 📊 Features

### Core Modules

#### 1. News Summary Dashboard
- **Statistics Overview** - Total articles to process and processed
- **Source Breakdown** - Individual statistics for SFC, HKMA, SEC, HKEX
- **Real-time Updates** - Automatic refresh of statistics
- **Error Handling** - Graceful fallback with retry functionality

#### 2. News Editor
- **Article Management** - View, edit, and update news articles
- **Status Management** - Update article status (Pending → Verified/Discarded)
- **Content Editing** - Edit titles and AI summaries inline
- **Bulk Operations** - Select multiple articles for batch operations
- **Advanced Filtering** - Filter by date range, source, and status
- **Export Functionality** - Generate reports for selected articles

### Data Sources
- **SFC** - Securities and Futures Commission (Hong Kong)
- **HKMA** - Hong Kong Monetary Authority
- **SEC** - Securities and Exchange Commission (US)
- **HKEX** - Hong Kong Exchange

### Navigation
- **Sidebar Navigation** - Clean, professional sidebar with tab switching
- **Responsive Layout** - Adapts to different screen sizes
- **Active State Indicators** - Clear visual feedback for current section

## 🔗 API Integration

The UI connects to the Python FastAPI backend at `http://localhost:8000` and consumes these endpoints:

### Statistics API
- **GET** `/api/news/statistics` - News statistics by source and status
```json
[
  {
    "source": "SFC",
    "status": "PENDING", 
    "record_count": 15
  },
  {
    "source": "SFC",
    "status": "VERIFIED",
    "record_count": 8
  }
]
```

### News Data APIs
- **GET** `/api/news/last7days` - Recent news from all sources
- **GET** `/api/news/date-range/grouped` - Grouped news by date range and filters
- **POST** `/api/news/today` - Fetch and persist today's news
- **POST** `/api/news/date/{date}` - Fetch news for specific date

### Content Management APIs
- **PUT** `/api/news/update-status/{news_id}` - Update article status
- **PUT** `/api/news/update-content/{news_id}` - Update article title and summary

### Health Check
- **GET** `/health` - Backend health status

## 🏃‍♂️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run deploy       # Deploy to GitHub Pages
```

### Development Workflow
1. Start the backend: `cd pe-compliance-app && python main.py`
2. Start the frontend: `cd pe-compliance-ui && npm run dev`
3. Open http://localhost:5173

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar/        # Navigation sidebar
│   ├── NewsSourceCard/ # Statistics cards
│   ├── ArticleItem.tsx # Individual article component
│   ├── FilterControls.tsx # Filtering interface
│   ├── NewsSummary.tsx # Dashboard overview
│   └── NewsEditor.tsx  # Article management interface
├── hooks/              # Custom React hooks
│   ├── useAppState.ts  # Global application state
│   ├── useNewsData.ts  # News data fetching
│   ├── useStatistics.ts # Statistics data
│   └── useStatusUpdates.ts # Status update logic
├── services/           # API integration
│   └── api.ts         # HTTP client and error handling
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and constants
└── styles/            # Global styles and CSS modules
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1e40af) - Trust and professionalism
- **Secondary**: Gray (#6b7280) - Supporting content
- **Success**: Green (#059669) - Positive actions
- **Warning**: Amber (#d97706) - Attention needed
- **Error**: Red (#dc2626) - Critical issues

### Components
- **Sidebar Navigation** - Clean, modern sidebar with active states
- **Article Cards** - Comprehensive article display with inline editing
- **Filter Controls** - Advanced filtering with date ranges and dropdowns
- **Status Dropdowns** - Interactive status management
- **Loading States** - Consistent loading indicators
- **Error Boundaries** - Graceful error handling

## 🔄 State Management

### Custom Hooks Architecture
- **useAppState** - Central state management for the entire application
- **useNewsData** - Handles news data fetching and filtering
- **useStatistics** - Manages statistics data and updates
- **useStatusUpdates** - Handles article status changes and notifications
- **useLocalStorage** - Persistent local storage management

### Status Flow
```
Pending → Verified ✅
Pending → Discarded ❌
Verified ↔ Discarded (bidirectional)
```

## 🚀 Deployment

### GitHub Pages Deployment
```bash
npm run deploy
```

The app is configured for deployment to GitHub Pages with the homepage set to: `https://hushenglang.github.io/pe-compliance-ui`

### Production Build
```bash
npm run build
```

### Docker Deployment (Example)
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

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full feature set with sidebar navigation
- **Tablet** - Adapted layout with touch-friendly controls
- **Mobile** - Optimized for small screens with collapsible navigation

## 🔒 Error Handling

### Error Boundary
- Global error boundary catches and displays React errors
- Graceful fallback UI with error reporting

### API Error Handling
- Automatic retry mechanisms for failed requests
- User-friendly error messages
- Fallback to mock data when API is unavailable

### Loading States
- Consistent loading indicators across the application
- Skeleton loading for better user experience
- Filter-specific loading states

## 📈 Performance

### Optimization Features
- **React 19** - Latest React features and optimizations
- **Vite** - Fast build tool with hot module replacement
- **Code Splitting** - Optimized bundle sizes
- **Memoization** - Prevents unnecessary re-renders
- **Efficient State Management** - Minimal state updates

## 📝 Contributing

1. Follow the existing code style and TypeScript conventions
2. Use the established component architecture
3. Add proper type definitions for all new code
4. Test components before committing
5. Follow the established folder structure
6. Use CSS modules for component-specific styles

## 🎯 Target Users

- **Compliance Officers** - Monitor and review regulatory news
- **Legal Teams** - Assess regulatory impact on business operations
- **Risk Management** - Stay informed about regulatory changes
- **Investment Teams** - Track regulatory developments affecting investments

## 📄 License

This project is for internal PE compliance monitoring use.

---

**Backend Repository**: `pe-compliance-app`  
**Frontend Stack**: React 19 + TypeScript + Vite + Tailwind CSS 4  
**Deployment**: GitHub Pages  
**API**: FastAPI Python backend

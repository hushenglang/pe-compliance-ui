import type { NewsSource } from '../types'

export const TIME_PERIODS = {
  'last-7-days': 'Last 7 days',
  'last-30-days': 'Last 30 days',
  'last-90-days': 'Last 90 days'
} as const

export const SOURCES = {
  'all-sources': 'All sources',
  'sfc': 'SFC',
  'hkma': 'HKMA',
  'sec': 'SEC',
  'hkex': 'HKEX'
} as const

export const ARTICLE_STATUS = {
  pending: { icon: '⏳', label: 'Pending', color: 'yellow' },
  verified: { icon: '✅', label: 'Verified', color: 'green' },
  discarded: { icon: '❌', label: 'Discarded', color: 'red' }
} as const

// Source configuration with icons and metadata
export const SOURCE_CONFIG: Record<NewsSource, { icon: string; name: string; description: string }> = {
  SFC: { 
    icon: '🏢', 
    name: 'SFC', 
    description: 'Securities and Futures Commission'
  },
  HKMA: { 
    icon: '🏦', 
    name: 'HKMA', 
    description: 'Hong Kong Monetary Authority'
  },
  SEC: { 
    icon: '🇺🇸', 
    name: 'SEC', 
    description: 'U.S. Securities and Exchange Commission'
  },
  HKEX: { 
    icon: '📈', 
    name: 'HKEX', 
    description: 'Hong Kong Exchanges and Clearing'
  }
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    STATISTICS: '/api/news/statistics',
    GROUPED_NEWS: '/api/news/date-range/grouped',
    UPDATE_STATUS: '/api/news/update-status',
    UPDATE_CONTENT: '/api/news/update-content'
  }
} as const

// Status mapping: API status to frontend status
export const STATUS_MAPPING = {
  'PENDING': 'pending',
  'VERIFIED': 'verified', 
  'DISCARD': 'discarded'
} as const

// Status mapping: Frontend status to API status
export const API_STATUS_MAPPING = {
  'pending': 'PENDING',
  'verified': 'VERIFIED',
  'discarded': 'DISCARD'
} as const 
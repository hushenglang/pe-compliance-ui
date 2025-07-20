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

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    STATISTICS: '/api/news/statistics',
    GROUPED_NEWS: '/api/news/date-range/grouped'
  }
} as const

// Status mapping: API status to frontend status
export const STATUS_MAPPING = {
  'PENDING': 'pending',
  'VERIFIED': 'verified', 
  'DISCARD': 'discarded'
} as const 
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
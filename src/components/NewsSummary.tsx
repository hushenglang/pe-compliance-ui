import { NewsSourceCard } from './NewsSourceCard'
import { LoadingSpinner } from './LoadingSpinner'
import { StatisticsSummary } from './StatisticsSummary'
import { useStatistics } from '../hooks/useStatistics'
import type { NewsData } from '../types'

export const NewsSummary = () => {
  const { data, loading, error, refetch } = useStatistics()

  // Fallback data structure if API data is not available
  const fallbackData: NewsData = {
    sfc: { toProcess: 0, processed: 0, icon: '🏢' },
    hkma: { toProcess: 0, processed: 0, icon: '🏦' },
    sec: { toProcess: 0, processed: 0, icon: '🇺🇸' },
    hkex: { toProcess: 0, processed: 0, icon: '📈' }
  }

  // Use real data if available, otherwise fall back to empty data
  const statisticsData = data || fallbackData

  if (loading) {
    return (
      <>
        <div className="header">
          <h1>📰 PE Compliance News Dashboard</h1>
        </div>
        <div className="news-sources-section">
          <LoadingSpinner />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>📰 PE Compliance News Dashboard</h1>
        {error && (
          <div className="error-banner">
            <span className="error-message">⚠️ {error}</span>
            <button onClick={refetch} className="retry-button">
              🔄 Retry
            </button>
          </div>
        )}
      </div>

      {/* Overall Statistics Summary */}
      <StatisticsSummary data={statisticsData} />

      {/* News Sources Section */}
      <div className="news-sources-section">
        <div className="news-sources-grid">
          <NewsSourceCard source="SFC" data={statisticsData.sfc} />
          <NewsSourceCard source="HKMA" data={statisticsData.hkma} />
          <NewsSourceCard source="SEC" data={statisticsData.sec} />
          <NewsSourceCard source="HKEX" data={statisticsData.hkex} />
        </div>
      </div>
    </>
  )
} 
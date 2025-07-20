import { NewsSourceCard } from './NewsSourceCard'
import { LoadingSpinner } from './LoadingSpinner'
import { StatisticsSummary } from './StatisticsSummary'
import { useStatistics } from '../hooks/useStatistics'
import { newsData } from '../data/mockData'

export const NewsSummary = () => {
  const { data, loading, error, refetch } = useStatistics()

  // Use real data if available, otherwise fall back to mock data
  const statisticsData = data || newsData

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
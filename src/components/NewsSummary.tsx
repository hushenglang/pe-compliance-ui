import { NewsSourceCard } from './NewsSourceCard'
import { newsData } from '../data/mockData'

export const NewsSummary = () => {
  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>📰 PE Compliance News Dashboard</h1>
      </div>

      {/* News Sources Section */}
      <div className="news-sources-section">
        <div className="news-sources-grid">
          <NewsSourceCard source="SFC" data={newsData.sfc} />
          <NewsSourceCard source="HKMA" data={newsData.hkma} />
          <NewsSourceCard source="SEC" data={newsData.sec} />
          <NewsSourceCard source="HKEX" data={newsData.hkex} />
        </div>
      </div>
    </>
  )
} 
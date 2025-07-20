import type { NewsData } from '../types'

interface StatisticsSummaryProps {
  data: NewsData
}

export const StatisticsSummary = ({ data }: StatisticsSummaryProps) => {
  // Calculate totals across all sources
  const totalToProcess = Object.values(data).reduce((sum, source) => sum + source.toProcess, 0)
  const totalProcessed = Object.values(data).reduce((sum, source) => sum + source.processed, 0)
  const grandTotal = totalToProcess + totalProcessed

  return (
    <div className="statistics-summary">
      <div className="summary-header">
        <h2>📊 Overall Statistics</h2>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card total-to-process">
          <div className="card-content">
            <div className="card-icon">⏳</div>
            <div className="card-info">
              <div className="card-value">{totalToProcess}</div>
              <div className="card-label">To Process</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card total-processed">
          <div className="card-content">
            <div className="card-icon">✅</div>
            <div className="card-info">
              <div className="card-value">{totalProcessed}</div>
              <div className="card-label">Processed</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card grand-total">
          <div className="card-content">
            <div className="card-icon">📈</div>
            <div className="card-info">
              <div className="card-value">{grandTotal}</div>
              <div className="card-label">Total Articles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
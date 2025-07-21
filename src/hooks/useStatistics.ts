import { useState, useEffect, useCallback } from 'react'
import { apiService, ApiError } from '../services/api'
import type { ComplianceNewsStatistics } from '../services/api'
import type { NewsData } from '../types'

interface UseStatisticsReturn {
  data: NewsData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useStatistics = (): UseStatisticsReturn => {
  const [data, setData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const transformStatisticsToNewsData = (statistics: ComplianceNewsStatistics[]): NewsData => {
    // Initialize with default values and icons
    const newsData: NewsData = {
      sfc: { toProcess: 0, processed: 0, icon: '🏢' },
      hkma: { toProcess: 0, processed: 0, icon: '🏦' },
      sec: { toProcess: 0, processed: 0, icon: '🇺🇸' },
      hkex: { toProcess: 0, processed: 0, icon: '📈' }
    }

    // Process statistics and aggregate by source
    statistics.forEach(stat => {
      const sourceKey = stat.source.toLowerCase() as keyof NewsData
      
      if (newsData[sourceKey]) {
        // Map API status to our frontend categories
        if (stat.status === 'PENDING') {
          newsData[sourceKey].toProcess += stat.record_count
        } else if (stat.status === 'VERIFIED' || stat.status === 'DISCARD') {
          newsData[sourceKey].processed += stat.record_count
        }
      }
    })

    return newsData
  }

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const statistics = await apiService.getStatistics()
      const transformedData = transformStatisticsToNewsData(statistics)
      
      setData(transformedData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to fetch statistics: ${err.message}`)
      } else {
        setError('An unexpected error occurred while fetching statistics')
      }
      console.error('Statistics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchStatistics()
  }, [fetchStatistics])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return {
    data,
    loading,
    error,
    refetch
  }
} 
import { API_CONFIG } from '../utils/constants'
import type { GroupedComplianceNewsResponse } from '../types'

export interface ComplianceNewsStatistics {
  source: string
  status: string
  record_count: number
}

export class ApiError extends Error {
  status?: number
  response?: Response

  constructor(
    message: string, 
    status?: number, 
    response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.response = response
  }
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          errorMessage = errorData.detail
        }
      } catch {
        // Use the default error message if JSON parsing fails
      }
      
      throw new ApiError(errorMessage, response.status, response)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as unknown as T
  }

  async getStatistics(): Promise<ComplianceNewsStatistics[]> {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.STATISTICS}`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return this.handleResponse<ComplianceNewsStatistics[]>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        `Failed to fetch statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async getGroupedNewsByDateRange(
    startDate: string,
    endDate: string,
    sources?: string
  ): Promise<GroupedComplianceNewsResponse> {
    const url = new URL(`${this.baseUrl}${API_CONFIG.ENDPOINTS.GROUPED_NEWS}`)
    url.searchParams.append('start_date', startDate)
    url.searchParams.append('end_date', endDate)
    
    if (sources) {
      url.searchParams.append('sources', sources)
    }
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return this.handleResponse<GroupedComplianceNewsResponse>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        `Failed to fetch grouped news: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export const apiService = new ApiService() 
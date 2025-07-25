import { API_CONFIG } from '../utils/constants'
import type { GroupedComplianceNewsResponse, UpdateTitleAndSummaryRequest, UpdateTitleAndSummaryResponse } from '../types'

export interface ComplianceNewsStatistics {
  source: string
  status: string
  record_count: number
}

export interface UpdateStatusRequest {
  status: string
}

export interface UpdateStatusResponse {
  id: number
  status: string
  message: string
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
    sources?: string,
    status?: string
  ): Promise<GroupedComplianceNewsResponse> {
    const url = new URL(`${this.baseUrl}${API_CONFIG.ENDPOINTS.GROUPED_NEWS}`)
    url.searchParams.append('start_date', startDate)
    url.searchParams.append('end_date', endDate)
    
    if (sources) {
      url.searchParams.append('sources', sources)
    }
    
    if (status) {
      url.searchParams.append('status', status)
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

  async updateNewsStatus(newsId: string, status: string): Promise<UpdateStatusResponse> {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.UPDATE_STATUS}/${newsId}`
    
    const requestBody: UpdateStatusRequest = {
      status: status.toUpperCase() // Ensure status is uppercase as expected by backend
    }
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      return this.handleResponse<UpdateStatusResponse>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        `Failed to update news status: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async updateNewsContent(newsId: string, title?: string, llmSummary?: string): Promise<UpdateTitleAndSummaryResponse> {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.UPDATE_CONTENT}/${newsId}`
    
    const requestBody: UpdateTitleAndSummaryRequest = {}
    if (title !== undefined) {
      requestBody.title = title
    }
    if (llmSummary !== undefined) {
      requestBody.llm_summary = llmSummary
    }
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      return this.handleResponse<UpdateTitleAndSummaryResponse>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        `Failed to update news content: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async getHtmlEmailByIds(newsIds: number[]): Promise<string> {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.HTML_EMAIL_BY_IDS}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsIds)
      })

      return this.handleResponse<string>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        `Failed to generate HTML email: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export const apiService = new ApiService() 
/**
 * Debounces a function call, ensuring it's only executed after a delay period has passed
 * without any new calls. Useful for search inputs, API calls, etc.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttles a function call, ensuring it's only executed once per time period
 * Useful for scroll handlers, resize handlers, etc.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoizes a function result based on its arguments
 * Useful for expensive calculations or API transformations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Creates a simple cache with TTL (time to live) support
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>()
  private defaultTTL: number

  constructor(defaultTTL: number = 5 * 60 * 1000) { // Default 5 minutes
    this.defaultTTL = defaultTTL
  }

  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key)
    
    if (!item) {
      return undefined
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
  }

  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    // Clean expired items first
    this.cleanup()
    return this.cache.size
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * Creates a batched function that collects calls and executes them together
 * Useful for API calls that can be batched
 */
export function batchify<T, R>(
  batchFunction: (items: T[]) => Promise<R[]>,
  batchSize: number = 10,
  delayMs: number = 100
) {
  const batch: Array<{ item: T; resolve: (value: R) => void; reject: (error: unknown) => void }> = []
  let timeout: ReturnType<typeof setTimeout> | null = null

  const processBatch = async () => {
    if (batch.length === 0) return

    const currentBatch = batch.splice(0, batchSize)
    const items = currentBatch.map(b => b.item)

    try {
      const results = await batchFunction(items)
      currentBatch.forEach((batchItem, index) => {
        batchItem.resolve(results[index])
      })
    } catch (error) {
      currentBatch.forEach(batchItem => {
        batchItem.reject(error)
      })
    }

    if (batch.length > 0) {
      timeout = setTimeout(processBatch, 0)
    }
  }

  return (item: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      batch.push({ item, resolve, reject })

      if (batch.length >= batchSize) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        processBatch()
      } else if (timeout === null) {
        timeout = setTimeout(processBatch, delayMs)
      }
    })
  }
}

/**
 * Simple performance measurement utility
 */
export class PerformanceTracker {
  private marks = new Map<string, number>()

  start(label: string): void {
    this.marks.set(label, performance.now())
  }

  end(label: string): number {
    const start = this.marks.get(label)
    if (!start) {
      console.warn(`Performance mark "${label}" not found`)
      return 0
    }

    const duration = performance.now() - start
    this.marks.delete(label)
    
    console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`)
    return duration
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  }
}

// Global performance tracker instance
export const perf = new PerformanceTracker() 
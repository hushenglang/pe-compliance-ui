import type { NewsSourceData, NewsSource } from '../../types'
import styles from './NewsSourceCard.module.css'

interface NewsSourceCardProps {
  source: NewsSource
  data: NewsSourceData
}

export const NewsSourceCard = ({ source, data }: NewsSourceCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{data.icon}</span>
        <span className={styles.name}>{source}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.status}>
          <div className={styles.toProcess}>To Process: {data.toProcess}</div>
          <div className={styles.processed}>Processed: {data.processed}</div>
        </div>
      </div>
    </div>
  )
} 
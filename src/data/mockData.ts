import type { NewsData, Article } from '../types'

export const newsData: NewsData = {
  sfc: { toProcess: 15, processed: 8, icon: '🏢' },
  hkma: { toProcess: 8, processed: 6, icon: '🏦' },
  sec: { toProcess: 12, processed: 9, icon: '🇺🇸' },
  hkex: { toProcess: 6, processed: 4, icon: '📈' }
}

export const mockArticles: Article[] = [
  {
    id: 'sfc-001',
    source: 'SFC',
    icon: '🏢',
    date: '2024-01-15',
    time: '09:30 AM',
    title: 'Latest SFC Guidelines on Digital Assets Trading',
    aiSummary: 'The SFC has issued new guidelines for digital asset trading platforms, focusing on enhanced risk management and investor protection measures.',
    content: 'The Securities and Futures Commission (SFC) today announced comprehensive new guidelines for digital asset trading platforms operating in Hong Kong. The new regulations emphasize enhanced risk management protocols, mandatory investor protection measures, and stricter compliance requirements for all licensed operators.'
  },
  {
    id: 'hkma-001',
    source: 'HKMA',
    icon: '🏦',
    date: '2024-01-14',
    time: '14:20 PM',
    title: 'Banking Sector Risk Management Updates',
    aiSummary: 'New risk assessment requirements for Hong Kong banks focusing on climate-related financial risks and operational resilience.',
    content: 'The Hong Kong Monetary Authority (HKMA) has updated its risk management guidelines for the banking sector, introducing new requirements for climate-related financial risk assessments and enhanced operational resilience standards.'
  },
  {
    id: 'sec-001',
    source: 'SEC',
    icon: '🇺🇸',
    date: '2024-01-14',
    time: '22:15 PM',
    title: 'SEC Enforcement Actions Against Market Manipulation',
    aiSummary: 'The SEC announced multiple enforcement actions targeting market manipulation schemes in cryptocurrency markets.',
    content: 'The U.S. Securities and Exchange Commission (SEC) today announced enforcement actions against several individuals and entities involved in market manipulation schemes affecting cryptocurrency trading platforms.'
  }
] 
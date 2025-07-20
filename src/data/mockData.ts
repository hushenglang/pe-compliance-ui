import type { NewsData, Article } from '../types'

export const newsData: NewsData = {
  sfc: { toProcess: 15, processed: 8, icon: '🏢' },
  hkma: { toProcess: 8, processed: 6, icon: '🏦' },
  sec: { toProcess: 12, processed: 9, icon: '🇺🇸' },
  hkex: { toProcess: 6, processed: 4, icon: '📈' }
}

export const mockArticles: Article[] = [
  // SFC Articles
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
    id: 'sfc-002',
    source: 'SFC',
    icon: '🏢',
    date: '2024-01-14',
    time: '11:45 AM',
    title: 'SFC Issues Warning on Unlicensed Investment Schemes',
    aiSummary: 'The SFC warns investors about unlicensed investment schemes targeting retail investors through social media platforms.',
    content: 'The Securities and Futures Commission (SFC) has issued a public warning regarding unlicensed investment schemes that are targeting retail investors through various social media platforms and messaging apps.'
  },
  {
    id: 'sfc-003',
    source: 'SFC',
    icon: '🏢',
    date: '2024-01-13',
    time: '16:20 PM',
    title: 'New ESG Disclosure Requirements for Listed Companies',
    aiSummary: 'SFC introduces enhanced environmental, social, and governance disclosure requirements for listed companies effective from Q2 2024.',
    content: 'The SFC has announced new Environmental, Social, and Governance (ESG) disclosure requirements that will apply to all listed companies starting from the second quarter of 2024.'
  },

  // HKMA Articles
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
    id: 'hkma-002',
    source: 'HKMA',
    icon: '🏦',
    date: '2024-01-13',
    time: '10:15 AM',
    title: 'Interest Rate Policy Committee Meeting Results',
    aiSummary: 'HKMA announces decisions from the latest Interest Rate Policy Committee meeting regarding monetary policy stance.',
    content: 'The Hong Kong Monetary Authority (HKMA) has released the results of its latest Interest Rate Policy Committee meeting, outlining the current monetary policy stance and economic outlook for Hong Kong.'
  },

  // SEC Articles
  {
    id: 'sec-001',
    source: 'SEC',
    icon: '🇺🇸',
    date: '2024-01-14',
    time: '22:15 PM',
    title: 'SEC Enforcement Actions Against Market Manipulation',
    aiSummary: 'The SEC announced multiple enforcement actions targeting market manipulation schemes in cryptocurrency markets.',
    content: 'The U.S. Securities and Exchange Commission (SEC) today announced enforcement actions against several individuals and entities involved in market manipulation schemes affecting cryptocurrency trading platforms.'
  },
  {
    id: 'sec-002',
    source: 'SEC',
    icon: '🇺🇸',
    date: '2024-01-13',
    time: '18:30 PM',
    title: 'New Cybersecurity Risk Management Rules',
    aiSummary: 'SEC finalizes new cybersecurity risk management and incident disclosure rules for publicly traded companies.',
    content: 'The Securities and Exchange Commission has finalized new cybersecurity risk management rules that require publicly traded companies to enhance their cybersecurity protocols and incident disclosure procedures.'
  },
  {
    id: 'sec-003',
    source: 'SEC',
    icon: '🇺🇸',
    date: '2024-01-12',
    time: '15:45 PM',
    title: 'Updated Guidance on AI and Machine Learning in Trading',
    aiSummary: 'SEC provides updated guidance on the use of artificial intelligence and machine learning technologies in securities trading and investment management.',
    content: 'The SEC has issued updated guidance addressing the use of artificial intelligence and machine learning technologies in securities trading, algorithmic trading systems, and investment management practices.'
  },

  // HKEX Articles
  {
    id: 'hkex-001',
    source: 'HKEX',
    icon: '📈',
    date: '2024-01-15',
    time: '12:00 PM',
    title: 'HKEX Introduces New Listing Rules for Tech Companies',
    aiSummary: 'Hong Kong Exchanges introduces streamlined listing rules for technology companies and startups seeking to list in Hong Kong.',
    content: 'Hong Kong Exchanges and Clearing Limited (HKEX) has introduced new listing rules designed to attract technology companies and innovative startups to list on the Hong Kong Stock Exchange.'
  },
  {
    id: 'hkex-002',
    source: 'HKEX',
    icon: '📈',
    date: '2024-01-12',
    time: '08:30 AM',
    title: 'Market Volatility Measures and Circuit Breakers',
    aiSummary: 'HKEX announces enhanced market volatility measures and updated circuit breaker mechanisms to ensure market stability.',
    content: 'Hong Kong Exchanges and Clearing Limited (HKEX) has announced enhanced market volatility measures, including updated circuit breaker mechanisms and new trading halt procedures to maintain market stability during periods of high volatility.'
  }
] 
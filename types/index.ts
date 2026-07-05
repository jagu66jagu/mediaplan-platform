export type Sector = {
  id: string
  slug: string
  label: string
  icon: string
  description: string
  color: string
}

export type ChannelRow = {
  platform: string
  campaign_type: string
  funnel: 'Awareness' | 'Consideration' | 'Conversion'
  buy_type: string
  est_metric: number
  metric_label: string
  cpm_cpc: number
  budget: number
  budget_pct: number
  note: string
}

export type MediaPlan = {
  id?: string
  brand: string
  sector: string
  objective: string
  budget: number
  month: string
  duration: string
  audience: string
  brief: string
  created_at?: string
  channels: ChannelRow[]
  summary: {
    awareness_pct: number
    consideration_pct: number
    conversion_pct: number
    google_pct: number
    meta_pct: number
    tiktok_pct: number
    other_pct: number
    key_insight: string
  }
  forecast: {
    has_forecast: boolean
    note: string
    seasonality_note: string
    recommended_budget: number
    vs_prev_pct: number
  }
  strategic_notes: string[]
}

export const SECTORS: Sector[] = [
  { id: 'ecommerce', slug: 'ecommerce', label: 'E-Commerce', icon: '🛒', description: 'Fashion, electronics, marketplace', color: '#6c6fff' },
  { id: 'finance', slug: 'finance', label: 'Bank & Finance', icon: '🏦', description: 'Banking, fintech, insurance, credit', color: '#3ecf8e' },
  { id: 'fmcg', slug: 'fmcg', label: 'FMCG & Retail', icon: '🛍️', description: 'Food, FMCG, grocery, retail chains', color: '#f59e0b' },
  { id: 'travel', slug: 'travel', label: 'Travel & Tourism', icon: '✈️', description: 'Hotels, airlines, OTAs, tourism', color: '#06b6d4' },
  { id: 'b2b', slug: 'b2b', label: 'B2B & SaaS', icon: '⚙️', description: 'Software, enterprise, professional services', color: '#a78bfa' },
  { id: 'app', slug: 'app', label: 'App & Mobile', icon: '📱', description: 'App installs, gaming, subscription apps', color: '#f472b6' },
]

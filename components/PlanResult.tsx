'use client'
import { MediaPlan } from '@/types'

const fmt = (n: number) => Math.round(n).toLocaleString('tr-TR')

const funnelStyle = (f: string) => {
  if (f === 'Awareness') return { background: 'rgba(62,207,142,.12)', color: '#3ecf8e', border: '1px solid rgba(62,207,142,.25)' }
  if (f === 'Consideration') return { background: 'rgba(108,111,255,.12)', color: '#6c6fff', border: '1px solid rgba(108,111,255,.25)' }
  return { background: 'rgba(245,158,11,.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.25)' }
}

export default function PlanResult({ plan }: { plan: MediaPlan }) {
  const s = plan.summary
  const totalBudget = plan.channels.reduce((a, c) => a + (c.budget || 0), 0)

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{plan.brand} — {plan.month} {plan.duration}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{fmt(totalBudget)}₺ toplam medya bütçesi · {plan.objective}</div>
          </div>
        </div>

        {/* Funnel split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Awareness', val: s.awareness_pct, color: '#3ecf8e' },
            { label: 'Consideration', val: s.consideration_pct, color: '#6c6fff' },
            { label: 'Conversion', val: s.conversion_pct, color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.val}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Platform split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Google', val: s.google_pct },
            { label: 'Meta', val: s.meta_pct },
            { label: 'TikTok', val: s.tiktok_pct },
            { label: 'Diğer', val: s.other_pct },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{item.val}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(108,111,255,.08)', border: '1px solid rgba(108,111,255,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-2)' }}>
          💡 {s.key_insight}
        </div>
      </div>

      {/* Channels table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
          Kanal Dağılımı
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Platform', 'Kampanya', 'Funnel', 'Satın Alma', 'Est. Metrik', 'CPM/CPC', 'Bütçe (₺)', '%'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 500, fontSize: 11, color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.channels.map((c, i) => (
              <>
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '9px 14px', fontWeight: 500 }}>{c.platform}</td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-2)' }}>{c.campaign_type}</td>
                  <td style={{ padding: '9px 14px' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 600, ...funnelStyle(c.funnel) }}>{c.funnel}</span>
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-2)' }}>{c.buy_type}</td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-2)' }}>{fmt(c.est_metric)} {c.metric_label}</td>
                  <td style={{ padding: '9px 14px' }}>{c.cpm_cpc || '—'}</td>
                  <td style={{ padding: '9px 14px', fontWeight: 600 }}>{fmt(c.budget)}</td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-3)' }}>{((c.budget_pct || 0) * 100).toFixed(0)}%</td>
                </tr>
                {c.note && (
                  <tr key={`note-${i}`} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td colSpan={8} style={{ padding: '3px 14px 8px', fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>{c.note}</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forecast */}
      {plan.forecast?.has_forecast && (
        <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.07em' }}>Forecast Önerisi</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            Önerilen bütçe: {fmt(plan.forecast.recommended_budget)}₺
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-2)', marginLeft: 8 }}>
              ({plan.forecast.vs_prev_pct > 0 ? '+' : ''}{plan.forecast.vs_prev_pct}% önceki aya göre)
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{plan.forecast.seasonality_note}</div>
        </div>
      )}

      {/* Strategic notes */}
      {plan.strategic_notes?.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Stratejik Notlar</div>
          {plan.strategic_notes.map((n, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--text-2)', padding: '6px 0', borderBottom: i < plan.strategic_notes.length - 1 ? '1px solid var(--border)' : 'none', lineHeight: 1.5 }}>
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

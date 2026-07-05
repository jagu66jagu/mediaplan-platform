'use client'
import { useState } from 'react'
import { MediaPlan } from '@/types'
import PlanResult from './PlanResult'

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

const OBJECTIVES: Record<string, string[]> = {
  ecommerce: ['Full Funnel (Awareness→Conversion)', 'Conversion / Satış', 'Consideration / Traffic', 'App Install'],
  finance: ['Lead Generation', 'App Install', 'Awareness', 'Full Funnel'],
  fmcg: ['Awareness', 'Consideration', 'Full Funnel', 'Conversion'],
  travel: ['Conversion / Satış', 'Consideration / Traffic', 'Awareness', 'Full Funnel'],
  b2b: ['Lead Generation', 'Awareness / Thought Leadership', 'Consideration / Traffic'],
  app: ['App Install', 'App Re-engagement', 'Awareness', 'Full Funnel'],
}

const S = {
  label: { fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', fontSize: 13, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 } as React.CSSProperties,
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 } as React.CSSProperties,
  sectionLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--text-3)', marginBottom: 14 },
  field: { marginBottom: 14 },
}

export default function MediaPlanForm({ sector, sectorLabel }: { sector: string, sectorLabel: string }) {
  const [form, setForm] = useState({
    brand: '', objective: '', budget: '', month: 'Kasım', duration: '1 Ay',
    audience: '', brief: '', prevBudget: '', prevRoas: '', targetRoas: ''
  })
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<MediaPlan | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function generate() {
    if (!form.brand || !form.objective || !form.budget) {
      setError('Marka, amaç ve bütçe zorunlu.')
      return
    }
    setError('')
    setLoading(true)
    setPlan(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand, sector: sectorLabel, objective: form.objective,
          budget: Number(form.budget), month: form.month, duration: form.duration,
          audience: form.audience, brief: form.brief,
          prevBudget: form.prevBudget ? Number(form.prevBudget) : undefined,
          prevRoas: form.prevRoas ? Number(form.prevRoas) : undefined,
          targetRoas: form.targetRoas ? Number(form.targetRoas) : undefined,
        })
      })
      const data = await res.json()
      setPlan({ ...data, brand: form.brand, sector: sectorLabel, objective: form.objective, budget: Number(form.budget), month: form.month, duration: form.duration, audience: form.audience, brief: form.brief })
    } catch {
      setError('Bir hata oluştu. Tekrar dene.')
    }
    setLoading(false)
  }

  const objs = OBJECTIVES[sector] || OBJECTIVES.ecommerce

  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionLabel}>Kampanya Bilgisi</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div style={S.field}>
            <label style={S.label}>Marka Adı *</label>
            <input style={S.input} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="ör. Garanti BBVA, English Home..." />
          </div>
          <div style={S.field}>
            <label style={S.label}>Kampanya Amacı *</label>
            <select style={S.input} value={form.objective} onChange={e => set('objective', e.target.value)}>
              <option value="">Seç...</option>
              {objs.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{ ...S.grid3, marginBottom: 14 }}>
          <div>
            <label style={S.label}>Toplam Bütçe (₺) *</label>
            <input style={S.input} type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="500000" />
          </div>
          <div>
            <label style={S.label}>Dönem</label>
            <select style={S.input} value={form.month} onChange={e => set('month', e.target.value)}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Süre</label>
            <select style={S.input} value={form.duration} onChange={e => set('duration', e.target.value)}>
              {['1 Ay','2 Ay','3 Ay','Always-On (12 Ay)','Kampanya (özel)'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Hedef Kitle</label>
          <input style={S.input} value={form.audience} onChange={e => set('audience', e.target.value)} placeholder="ör. 25-45 yaş, kadın, İstanbul, online alışveriş yapan" />
        </div>
        <div>
          <label style={S.label}>Brief / Kampanya Detayı</label>
          <textarea style={{ ...S.input, resize: 'vertical', minHeight: 72 }} value={form.brief} onChange={e => set('brief', e.target.value)} placeholder="Yeni ürün lansmanı, hedef ROAS, özel dönem, rakip notlar..." />
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Forecast (Opsiyonel)</div>
        <div style={S.grid3}>
          <div>
            <label style={S.label}>Önceki Ay Bütçesi (₺)</label>
            <input style={S.input} type="number" value={form.prevBudget} onChange={e => set('prevBudget', e.target.value)} placeholder="400000" />
          </div>
          <div>
            <label style={S.label}>Önceki Ay ROAS</label>
            <input style={S.input} type="number" step="0.1" value={form.prevRoas} onChange={e => set('prevRoas', e.target.value)} placeholder="8.5" />
          </div>
          <div>
            <label style={S.label}>Hedef ROAS</label>
            <input style={S.input} type="number" step="0.1" value={form.targetRoas} onChange={e => set('targetRoas', e.target.value)} placeholder="10" />
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none',
          background: loading ? 'var(--surface-3)' : 'var(--accent)',
          color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity .15s', opacity: loading ? .7 : 1
        }}
      >
        {loading ? '⏳ Medya planı oluşturuluyor...' : 'Medya Planı Oluştur →'}
      </button>

      {plan && <PlanResult plan={plan} />}
    </div>
  )
}

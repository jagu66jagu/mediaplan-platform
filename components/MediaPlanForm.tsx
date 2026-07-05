'use client'
import { useState } from 'react'
import { MediaPlan } from '@/types'
import PlanResult from './PlanResult'

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

const ALL_OBJECTIVES: Record<string, string[]> = {
  ecommerce: ['Awareness', 'Consideration / Traffic', 'Conversion / Satış', 'App Install', 'Full Funnel'],
  finance: ['Awareness', 'Lead Generation', 'App Install', 'Full Funnel'],
  fmcg: ['Awareness', 'Consideration', 'Conversion', 'Full Funnel'],
  travel: ['Awareness', 'Consideration / Traffic', 'Conversion / Satış', 'Full Funnel'],
  b2b: ['Awareness / Thought Leadership', 'Lead Generation', 'Consideration / Traffic'],
  app: ['Awareness', 'App Install', 'App Re-engagement', 'Full Funnel'],
}

const S = {
  label: { fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', fontSize: 13, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 } as React.CSSProperties,
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 } as React.CSSProperties,
  sectionLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--text-3)', marginBottom: 14 },
  field: { marginBottom: 14 } as React.CSSProperties,
}

function MultiSelect({ options, selected, onChange }: {
  options: string[], selected: string[], onChange: (v: string[]) => void
}) {
  const toggle = (o: string) => {
    if (selected.includes(o)) onChange(selected.filter(x => x !== o))
    else onChange([...selected, o])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o)
        return (
          <button key={o} type="button" onClick={() => toggle(o)} style={{
            fontSize: 12, padding: '6px 12px', borderRadius: 99, cursor: 'pointer',
            border: active ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
            background: active ? 'var(--accent-soft)' : 'var(--surface-2)',
            color: active ? 'var(--accent)' : 'var(--text-2)',
            fontWeight: active ? 600 : 400, transition: 'all .15s',
          }}>
            {active ? '✓ ' : ''}{o}
          </button>
        )
      })}
    </div>
  )
}

export default function MediaPlanForm({ sector, sectorLabel }: { sector: string, sectorLabel: string }) {
  const [form, setForm] = useState({
    brand: '', budget: '', month: 'Kasım', duration: '1 Ay',
    audience: '', brief: '', prevBudget: '', prevRoas: '', targetRoas: ''
  })
  const [objectives, setObjectives] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<MediaPlan | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const opts = ALL_OBJECTIVES[sector] || ALL_OBJECTIVES.ecommerce

  async function generate() {
    if (!form.brand || objectives.length === 0 || !form.budget) {
      setError('Marka, en az 1 kampanya amacı ve bütçe zorunlu.')
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
          brand: form.brand,
          sector: sectorLabel,
          objective: objectives.join(' + '),
          budget: Number(form.budget),
          month: form.month,
          duration: form.duration,
          audience: form.audience,
          brief: form.brief,
          prevBudget: form.prevBudget ? Number(form.prevBudget) : undefined,
          prevRoas: form.prevRoas ? Number(form.prevRoas) : undefined,
          targetRoas: form.targetRoas ? Number(form.targetRoas) : undefined,
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPlan({ ...data, brand: form.brand, sector: sectorLabel, objective: objectives.join(' + '), budget: Number(form.budget), month: form.month, duration: form.duration, audience: form.audience, brief: form.brief })
    } catch (e) {
      setError(`Hata: ${e instanceof Error ? e.message : 'Bilinmeyen hata'}`)
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionLabel}>Kampanya Bilgisi</div>
        <div style={{ ...S.field }}>
          <label style={S.label}>Marka Adı *</label>
          <input style={S.input} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="ör. Garanti BBVA, English Home..." />
        </div>

        <div style={S.field}>
          <label style={{ ...S.label, marginBottom: 10 }}>Kampanya Amacı * <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(birden fazla seçilebilir)</span></label>
          <MultiSelect options={opts} selected={objectives} onChange={setObjectives} />
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

      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, padding: '10px 14px', background: 'rgba(248,113,113,.08)', borderRadius: 8, border: '1px solid rgba(248,113,113,.2)' }}>{error}</div>}

      <button onClick={generate} disabled={loading} style={{
        width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none',
        background: loading ? 'var(--surface-3)' : 'var(--accent)',
        color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? .7 : 1
      }}>
        {loading ? '⏳ Medya planı oluşturuluyor...' : 'Medya Planı Oluştur →'}
      </button>

      {plan && <PlanResult plan={plan} />}
    </div>
  )
}

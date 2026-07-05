'use client'
import { SECTORS } from '@/types'
import Link from 'next/link'
import { useState } from 'react'

export default function Dashboard() {
  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Sektör seç, brief gir, medya planı oluştur.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 40 }}>
        {SECTORS.map(s => (
          <SectorCard key={s.id} sector={s} />
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Son Planlar</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
          Henüz plan oluşturulmadı. Bir sektör seç ve başla.
        </div>
      </div>
    </div>
  )
}

function SectorCard({ sector }: { sector: typeof SECTORS[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/sector/${sector.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--surface)', border: `1px solid ${hovered ? sector.color : 'var(--border)'}`,
          borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'border-color .15s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>{sector.icon}</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{sector.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{sector.description}</div>
      </div>
    </Link>
  )
}

import { SECTORS } from '@/types'
import { notFound } from 'next/navigation'
import MediaPlanForm from '@/components/MediaPlanForm'

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sector = SECTORS.find(s => s.slug === slug)
  if (!sector) notFound()

  return (
    <div style={{ padding: 40, maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{sector.icon}</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{sector.label}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{sector.description}</p>
      </div>
      <MediaPlanForm sector={sector.id} sectorLabel={sector.label} />
    </div>
  )
}

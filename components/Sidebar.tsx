'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SECTORS } from '@/types'
import { LayoutDashboard, History, Rss } from 'lucide-react'

export default function Sidebar() {
  const path = usePathname()

  const isActive = (href: string) => path === href || path.startsWith(href + '/')

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', padding: '24px 0', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Hype</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>MediaPlan</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <NavItem href="/" icon={<LayoutDashboard size={15} />} label="Dashboard" active={path === '/'} />
        <NavItem href="/history" icon={<History size={15} />} label="Geçmiş Planlar" active={isActive('/history')} />
        <NavItem href="/research" icon={<Rss size={15} />} label="Sektör Araştırma" active={isActive('/research')} badge="Yakında" />

        <div style={{ marginTop: 24, marginBottom: 8, padding: '0 8px', fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Sektörler
        </div>

        {SECTORS.map(s => (
          <NavItem
            key={s.id}
            href={`/sector/${s.slug}`}
            icon={<span style={{ fontSize: 14 }}>{s.icon}</span>}
            label={s.label}
            active={isActive(`/sector/${s.slug}`)}
            color={s.color}
          />
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-3)' }}>
        v0.1 · Hype İletişim
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active, badge, color }: {
  href: string, icon: React.ReactNode, label: string,
  active?: boolean, badge?: string, color?: string
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
        borderRadius: 8, marginBottom: 2, cursor: 'pointer',
        background: active ? 'var(--accent-soft)' : 'transparent',
        border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
        transition: 'all .15s',
      }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)' }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <span style={{ color: active ? 'var(--accent)' : color || 'var(--text-3)', display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 13, color: active ? 'var(--text)' : 'var(--text-2)', flex: 1, fontWeight: active ? 500 : 400 }}>{label}</span>
        {badge && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99, background: 'var(--surface-3)', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{badge}</span>}
      </div>
    </Link>
  )
}

export default function HistoryPage() {
  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Geçmiş Planlar</h1>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 32 }}>Supabase bağlantısı kurulunca burada tüm planlar listelenecek.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🗂️</div>
        <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Henüz kaydedilmiş plan yok.</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Supabase bağlantısı kurulduktan sonra planlar otomatik kaydedilecek.</div>
      </div>
    </div>
  )
}

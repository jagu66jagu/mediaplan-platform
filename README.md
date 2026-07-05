# Hype MediaPlan Platform

AI-powered medya planı üreticisi. Next.js + Supabase + Anthropic.

## Kurulum

```bash
npm install
cp .env.local.example .env.local
# .env.local dosyasını doldur
npm run dev
```

## Deploy (Vercel)

1. GitHub'a push et
2. vercel.com → Import Project → bu repo
3. Environment variables ekle:
   - ANTHROPIC_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

## Supabase Kurulum

1. supabase.com → New Project
2. SQL Editor → SUPABASE_SETUP.sql içeriğini çalıştır
3. Project Settings → API → URL ve anon key'i kopyala

## Özellikler

- 6 sektör: E-Commerce, Bank & Finance, FMCG, Travel, B2B, App
- AI medya planı üretici (16 gerçek Hype planından öğrenilmiş)
- Forecast (sezonsallık + ROAS bazlı bütçe önerisi)
- Geçmiş plan kaydı (Supabase)
- Yakında: Sektör araştırma spideri

import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const userMsg = buildUserPrompt(body)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  const data = await res.json()
  const text = data.content?.map((b: { text?: string }) => b.text || '').join('') || ''
  const clean = text.replace(/```json|```/g, '').trim()
  const plan = JSON.parse(clean)

  // Save to Supabase
  try {
    await supabase.from('media_plans').insert({
      brand: body.brand,
      sector: body.sector,
      objective: body.objective,
      budget: body.budget,
      month: body.month,
      duration: body.duration,
      audience: body.audience,
      brief: body.brief,
      plan_data: plan,
    })
  } catch (e) {
    // Supabase not configured yet — continue anyway
    console.warn('Supabase save skipped:', e)
  }

  return NextResponse.json(plan)
}

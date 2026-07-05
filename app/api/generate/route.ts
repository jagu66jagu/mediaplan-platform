import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
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

    if (!res.ok) {
      const err = await res.text()
      console.error('Anthropic API error:', res.status, err)
      return NextResponse.json({ error: `Anthropic API hatası: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()
    const text = data.content?.map((b: { text?: string }) => b.text || '').join('') || ''
    const clean = text.replace(/```json|```/g, '').trim()
    
    let plan
    try {
      plan = JSON.parse(clean)
    } catch {
      console.error('JSON parse error, raw text:', text.slice(0, 500))
      return NextResponse.json({ error: 'Plan parse hatası' }, { status: 500 })
    }

    // Save to Supabase (optional)
    try {
      await supabase.from('media_plans').insert({
        brand: body.brand,
        sector: body.sector,
        objective: Array.isArray(body.objective) ? body.objective.join(', ') : body.objective,
        budget: body.budget,
        month: body.month,
        duration: body.duration,
        audience: body.audience,
        brief: body.brief,
        plan_data: plan,
      })
    } catch (e) {
      console.warn('Supabase save skipped:', e)
    }

    return NextResponse.json(plan)
  } catch (e) {
    console.error('Generate error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

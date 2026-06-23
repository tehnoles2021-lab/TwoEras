addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Telegram bot token задаётся через: wrangler secret put TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = '2003616265'

function corsOrigin(request) {
  const origin = request.headers.get('Origin') || ''
  if (!origin) return '*'
  if (origin.includes('tehnoles2021-lab.github.io')) return origin
  if (origin.startsWith('http://localhost')) return origin
  if (origin.startsWith('http://127.0.0.1')) return origin
  return origin
}

function corsHeaders(request) {
  return {
    'Access-Control-Allow-Origin': corsOrigin(request),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

async function handleRequest(request) {
  const ch = corsHeaders(request)

  if (request.method === 'OPTIONS') {
    return new Response('', { headers: ch })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: ch })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: ch })
  }

  const { name, phone, email, dates, message } = body
  const TOKEN = typeof TELEGRAM_BOT_TOKEN !== 'undefined' ? TELEGRAM_BOT_TOKEN : ''

  const tgText = `📩 <b>Новая заявка с сайта «Две Эпохи»</b>

<b>Имя:</b> ${esc(name)}
<b>Телефон:</b> ${esc(phone)}
<b>Email:</b> ${esc(email)}
<b>Даты:</b> ${esc(dates || 'не указаны')}
<b>Сообщение:</b> ${esc(message || '—')}`

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: tgText,
        parse_mode: 'HTML',
      }),
    })

    if (tgRes.ok) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...ch, 'Content-Type': 'application/json' },
      })
    }

    const errText = await tgRes.text()
    console.error('Telegram error:', errText)
    return new Response(JSON.stringify({ ok: false, error: 'Telegram error' }), {
      status: 500,
      headers: { ...ch, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Fetch error:', e.message)
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { ...ch, 'Content-Type': 'application/json' },
    })
  }
}

function esc(s) {
  if (!s) return '—'
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

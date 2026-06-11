addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const SENDGRID_KEY = 'Q44MQK8WSLUY5TDMJ6M7NFF1'
const TO_EMAIL = 'tehnoles2007@yandex.ru'
const FROM_EMAIL = 'tehnoles2007@yandex.ru'
const ALLOWED_ORIGIN = 'https://tehnoles2021-lab.github.io'
const SITE_URL = 'https://tehnoles2021-lab.github.io/TwoEras/'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('', { headers: CORS_HEADERS })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  const origin = request.headers.get('Origin') || ''
  if (!origin.startsWith(ALLOWED_ORIGIN)) {
    return new Response('Forbidden', { status: 403, headers: CORS_HEADERS })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS })
  }

  const { name, phone, email, dates, message } = body

  const text = `Имя: ${name || '—'}
Телефон: ${phone || '—'}
Email: ${email || '—'}
Даты: ${dates || 'не указаны'}
Сообщение: ${message || '—'}`

  const html = `
<h2>📩 Новая заявка с сайта «Две Эпохи»</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px">
  <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Имя</td><td style="padding:8px 12px">${esc(name)}</td></tr>
  <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Телефон</td><td style="padding:8px 12px">${esc(phone)}</td></tr>
  <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Email</td><td style="padding:8px 12px">${esc(email)}</td></tr>
  <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Даты</td><td style="padding:8px 12px">${esc(dates)}</td></tr>
  <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Сообщение</td><td style="padding:8px 12px">${esc(message)}</td></tr>
</table>
<p style="color:#888;font-size:12px">Отправлено с сайта <a href="${SITE_URL}">Две Эпохи</a></p>`

  try {
    const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: TO_EMAIL }] }],
        from: { email: FROM_EMAIL, name: 'Две Эпохи' },
        subject: '📩 Новая заявка с сайта «Две Эпохи»',
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    })

    if (sgRes.ok) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const errText = await sgRes.text()
    return new Response(JSON.stringify({ ok: false, error: errText }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
}

function esc(s) {
  if (!s) return '—'
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

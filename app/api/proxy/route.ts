export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const copyHeaders = [
  'content-type',
  'content-length',
  'accept-ranges',
  'content-range',
  'etag',
  'last-modified',
  'cache-control',
]

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const target = url.searchParams.get('url')
    if (!target) return new Response('Missing url', { status: 400 })
    if (!/^https?:\/\//i.test(target)) return new Response('Invalid url', { status: 400 })

    // Forward Range header to support streaming/seeking
    const range = req.headers.get('range')
    const upstream = await fetch(target, {
      headers: range ? { Range: range } : undefined,
      // avoid caching proxies for dynamic media
      cache: 'no-store',
    })

    const headers = new Headers()
    for (const h of copyHeaders) {
      const v = upstream.headers.get(h)
      if (v) headers.set(h, v)
    }
    // Make it embeddable under COEP
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    // Open CORS for anonymous media
    headers.set('Access-Control-Allow-Origin', '*')

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    })
  } catch (e: any) {
    return new Response('Proxy error: ' + (e?.message || 'unknown'), { status: 502 })
  }
}

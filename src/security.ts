import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { Bindings, TenantContext } from './types'

const encoder = new TextEncoder()
const SESSION_COOKIE = 'nuralabs_session'

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

async function signature(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))))
}

type AppContext = Context<{ Bindings: Bindings; Variables: { owner: TenantContext } }>

export async function issueSession(c: AppContext, context: TenantContext): Promise<void> {
  if (!c.env.APP_SIGNING_SECRET || c.env.APP_SIGNING_SECRET.length < 32) throw new Error('APP_SIGNING_SECRET must contain at least 32 characters')
  const payload = toBase64Url(encoder.encode(JSON.stringify(context)))
  const token = `${payload}.${await signature(payload, c.env.APP_SIGNING_SECRET)}`
  setCookie(c, SESSION_COOKIE, token, { httpOnly: true, secure: new URL(c.req.url).protocol === 'https:', sameSite: 'Strict', path: '/', maxAge: 60 * 60 * 24 * 30 })
}

export async function readSession(c: AppContext): Promise<TenantContext | null> {
  const token = getCookie(c, SESSION_COOKIE)
  if (!token || !c.env.APP_SIGNING_SECRET) return null
  const [payload, supplied] = token.split('.')
  if (!payload || !supplied || supplied !== await signature(payload, c.env.APP_SIGNING_SECRET)) return null
  try {
    const normalized = payload.replaceAll('-', '+').replaceAll('_', '/')
    const decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(normalized), char => char.charCodeAt(0)))) as TenantContext
    return decoded.tenantId && decoded.userId ? decoded : null
  } catch { return null }
}

const secretPatterns = [
  /(?:api[_-]?key|token|secret|authorization)\s*[:=]\s*[^\s,;]+/gi,
  /\b(?:sk|gsk|cfat|cfut)_[A-Za-z0-9_-]{12,}\b/g,
]
export function redact(value: string, maxLength = 12_000): string {
  let clean = value.slice(0, maxLength)
  for (const pattern of secretPatterns) clean = clean.replace(pattern, '[REDACTED]')
  return clean
}

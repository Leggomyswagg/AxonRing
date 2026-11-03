import { isIP } from 'node:net';
import { CommerceError } from './config.js';

export function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

export function publicError(res, error) {
  const status = error instanceof CommerceError ? error.status : 503;
  const message = status === 400 ? 'Please check your selected size and quantity.' :
    status === 409 ? 'Availability changed. Please refresh and choose your size again.' :
    'Online purchases are temporarily unavailable. Please contact support@axonring.com for availability.';
  reply(res, status, { error: message });
}

export function checkCheckoutRequest(req, env = process.env) {
  const origins = new Set(['https://axonring.com', 'https://www.axonring.com']);
  if (env.VERCEL_ENV === 'preview' && /^[a-z0-9.-]+\.vercel\.app$/i.test(env.VERCEL_URL || '')) {
    origins.add(`https://${env.VERCEL_URL}`);
  }
  if (!origins.has(req.headers.origin)) throw new CommerceError('invalid_origin', 400);
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
    throw new CommerceError('invalid_content_type', 400);
  }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { throw new CommerceError('invalid_body', 400); }
  if (!body || Buffer.byteLength(JSON.stringify(body)) > 8192) throw new CommerceError('invalid_body', 400);
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = req.headers['x-real-ip'] || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined);
  return { body, buyerIp: typeof rawIp === 'string' && isIP(rawIp) ? rawIp : undefined };
}

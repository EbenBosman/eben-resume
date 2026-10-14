import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Mirrors the client-side rules in Sidebar.tsx; the server is the one that has to enforce them.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 5000;

// Simple per-IP limit. In-memory is enough for a single web dyno; it resets on restart.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentSends = new Map<string, number[]>();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Heroku's router appends the real client IP as the last X-Forwarded-For entry.
const clientIp = (request: Request) =>
  request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() || 'unknown';

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentSends.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    recentSends.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentSends.set(ip, recent);
  return false;
}

const badRequest = (text: string) => new NextResponse(text, { status: 400 });

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const mailboxToMonitor = process.env.MAILBOX_TO_MONITOR;
  if (!apiKey || !mailboxToMonitor) {
    console.error('RESEND_API_KEY or MAILBOX_TO_MONITOR is not defined');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid request.');
  }
  if (!body || typeof body !== 'object') return badRequest('Invalid request.');
  const { email: rawEmail, message: rawMessage, company } = body as Record<string, unknown>;

  // Honeypot: the hidden "company" field is invisible to people, so only bots fill it in.
  // Pretend success so they don't retry.
  if (typeof company === 'string' && company.trim()) {
    return new NextResponse('Email sent', { status: 200 });
  }

  const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
  const message = typeof rawMessage === 'string' ? rawMessage.trim() : '';
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return badRequest('Please provide a valid email address.');
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return badRequest(`Please write a message of at least ${MIN_MESSAGE_LENGTH} characters.`);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return badRequest(`Please keep the message under ${MAX_MESSAGE_LENGTH} characters.`);
  }

  if (isRateLimited(clientIp(request))) {
    return new NextResponse('Too many messages. Please try again later.', { status: 429 });
  }

  const emailContent = `You have a new message from: <strong>${escapeHtml(email)}</strong><br><br>The original message is:<br><br>${escapeHtml(message).replace(/(\r\n|\n|\r)/g, '<br />')}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Eben Bosman Website <no-reply@ebenbosman.com>',
      to: [mailboxToMonitor],
      replyTo: email,
      subject: 'Message from ebenbosman.com',
      html: emailContent,
      text: `You have a new message from: ${email}\n\n${message}`,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    // Details stay in the server log; the visitor gets a generic message.
    console.error('Contact form send failed:', error);
    return new NextResponse('Message not sent. Please try again later.', { status: 500 });
  }

  return new NextResponse('Email sent', { status: 200 });
}

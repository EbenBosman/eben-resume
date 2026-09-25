import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.RESEND_API_KEY;
    const mailboxToMonitor = process.env.MAILBOX_TO_MONITOR;

    if (!apiKey || !apiKey?.length || !mailboxToMonitor || !mailboxToMonitor?.length) {
      console.error('RESEND_API_KEY or MAILBOX_TO_MONITOR is not defined');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const email = String(body.email ?? '');
    const message = String(body.message ?? '');
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const emailContent = `You have a new message from: <strong>${escapeHtml(email)}</strong><br><br>The original message is:<br><br>${escapeHtml(message).replace(/(\r\n|\n|\r)/g, '<br />')}`;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Eben Bosman Website <no-reply@ebenbosman.com>',
      to: [mailboxToMonitor],
      replyTo: isValidEmail ? email : undefined,
      subject: 'Message from ebenbosman.com',
      html: emailContent,
      text: `You have a new message from: ${email}\n\n${message}`,
    });

    if (error) {
      return new NextResponse(`Message not sent: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Email sent', { status: 200 });
  } catch (error) {
    // @ts-ignore
    const errorMessage = error?.message || 'Unknown error';
    return new NextResponse(`Message not sent: ${errorMessage}`, { status: 500 });
  }
}

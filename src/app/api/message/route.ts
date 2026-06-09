import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.MAILERSEND_API_KEY;
    const mailboxToMonitor = process.env.MAILBOX_TO_MONITOR;

    if (!apiKey || !apiKey?.length || !mailboxToMonitor || !mailboxToMonitor?.length) {
      console.error('MAILERSEND_API_KEY or MAILBOX_TO_MONITOR is not defined');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const mailerSend = new MailerSend({
      apiKey: apiKey,
    });

    const sentFrom = new Sender('no-reply@ataru.it', 'Eben Bosman Website');
    const recipients = [new Recipient(mailboxToMonitor, 'Eben Bosman')];

    const emailContent = `You have a new message from: <strong>${body.email}</strong><br><br>The original message is:<br><br>${body.message.replace(/(\r\n|\n|\r)/g, '<br />')}`;

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Message from ebenbosman.com')
      .setHtml(emailContent)
      .setText(body.message);

    await mailerSend.email.send(emailParams);
    return new NextResponse('Email sent', { status: 200 });
  } catch (error) {
    // @ts-ignore
    const errorMessage = error?.body?.message || error?.message || 'Unknown error';
    return new NextResponse(`Message not sent: ${errorMessage}`, { status: 500 });
  }
}

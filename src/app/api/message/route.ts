import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      console.error('SENDGRID_API_KEY is not defined');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    sgMail.setApiKey(apiKey);

    const emailContent = `You have a new message from: <strong>${body.email}</strong><br><br>The original message is:<br><br>${body.message.replace(/(\r\n|\n|\r)/g, '<br />')}`;

    const msg = {
      to: process.env.MAILBOX_TO_MONITOR || 'ebenbosman@gmail.com', // Fallback or strict? Keeping robust.
      from: 'no-reply@ebenbosman.com',
      subject: 'Message from ebenbosman.com',
      text: body.message,
      html: emailContent,
    };

    await sgMail.send(msg);
    console.log('Email sent');
    return new NextResponse('Email sent', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Message not sent', { status: 500 });
  }
}

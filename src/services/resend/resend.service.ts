import { Resend } from 'resend';
import fs from 'fs';

export async function sendEmailResend(to: string, inviteUrl: string): Promise<void> {
  const htmlTemplate = fs.readFileSync('invite.html', 'utf-8');

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: 'Invite to join our platform',
    html: htmlTemplate.replace('{{invite_url}}', inviteUrl).replace('{{email}}', to)
  });
}

import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export async function sendEmailResend(to: string, inviteUrl: string): Promise<void> {
  const templatePath = path.resolve(process.cwd(), 'src', 'templates', 'Invite.html');
  const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: 'Invite to join our platform',
    html: htmlTemplate.replace('{{invite_url}}', inviteUrl).replace('{{email}}', to)
  });
}

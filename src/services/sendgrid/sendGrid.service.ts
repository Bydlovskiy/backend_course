import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, inviteUrl: string): Promise<void> {

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: process.env.SENDGRID_TEMPLATE_INVITE_ID,
    dynamicTemplateData: {
      invite_url: inviteUrl,
      email: to
    }
  });
}

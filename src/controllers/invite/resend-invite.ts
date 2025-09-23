import { generateSignature } from 'src/services/kms/kms.service';
import { sendEmail } from 'src/services/sendgrid/sendGrid.service';
import { sendEmailResend } from 'src/services/resend/resend.service';

import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { HttpError } from 'src/api/errors/HttpError';

export async function resendInvite(params: {
  userRepo: IProfileRepo;
  email: string;
  sender: 'sendGrid' | 'resend';
}) {
  const { userRepo, email, sender } = params;

  const profile = await userRepo.findByEmail(email);
  if (!profile) {
    throw new HttpError(404, 'Profile not found for provided email');
  }

  const expireAt = Date.now() + 1000 * 60 * 60 * 24; // 24h
  const signature = await generateSignature(email, expireAt);

  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?email=${encodeURIComponent(email)}&expireAt=${expireAt}&signature=${encodeURIComponent(signature)}`;

  if (sender === 'sendGrid') {
    await sendEmail(email, inviteUrl);
  } else if (sender === 'resend') {
    await sendEmailResend(email, inviteUrl);
  }
  return { success: true };
}

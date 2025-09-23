import { generateSignature } from 'src/services/kms/kms.service';
import { sendEmail } from 'src/services/sendgrid/sendGrid.service';
import { sendEmailResend } from 'src/services/resend/resend.service';

import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ERole } from 'src/types/profile/Role';

import { HttpError } from 'src/api/errors/HttpError';

export async function sendInvite(params: {
  userRepo: IProfileRepo;
  email: string;
  role: ERole;
  sender: 'sendGrid' | 'resend';
}) {
  const { userRepo, email, sender } = params;

  const existing = await userRepo.findByEmail(email);

  if (existing) {
    throw new HttpError(400, 'User already exists');
  }

  const expireAt = Date.now() + 1000 * 60 * 60 * 24;
  const signature = await generateSignature(email, expireAt);

  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?email=${encodeURIComponent(email)}&expireAt=${expireAt}&signature=${encodeURIComponent(signature)}`;

  if (sender === 'sendGrid') {
    await sendEmail(email, inviteUrl);
  } else if (sender === 'resend') {
    await sendEmailResend(email, inviteUrl);
  }

  return { success: true };
}

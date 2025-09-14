import { generateSignature } from 'src/services/kms/kms.service';
import { sendEmail } from 'src/services/sendgrid/sendGrid.service';
import { identityService } from 'src/services/aws/cognito/cognito.service';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ERole } from 'src/types/profile/Role';
import { sendEmailResend } from 'src/services/resend/resend.service';

export async function sendInvite(params: {
  userRepo: IProfileRepo;
  email: string;
  role: ERole;
  sender: 'sendGrid' | 'resend';
}) {
  const { userRepo, email, role, sender } = params;

  const expireAt = Date.now() + 1000 * 60 * 60 * 24;
  const signature = await generateSignature(email, expireAt);

  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?email=${encodeURIComponent(email)}&expireAt=${expireAt}&signature=${encodeURIComponent(signature)}`;

  if (sender === 'sendGrid') {
    await sendEmail(email, inviteUrl);
  } else if (sender === 'resend') {
    await sendEmailResend(email, inviteUrl);
  }

  await identityService.createUser(email, '', '');

  await userRepo.createProfile({
    email,
    role,
    firstName: '',
    lastName: ''
  });

  return { success: true };
}

import crypto from 'crypto';

function getSecret(): string {
  const secret = process.env.INVITE_SECRET;
  if (!secret) {
    return 'dev-invite-secret-change-me';
  }
  return secret;
}

export async function generateSignature(email: string, expireAt: number): Promise<string> {
  const secret = getSecret();
  const data = `${email}:${expireAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return hmac;
}

export async function verifySignature(email: string, expireAt: number, signature: string):
Promise<boolean> {
  if (Date.now() > expireAt) {return false;}
  const expected = await generateSignature(email, expireAt);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || '');
  if (a.length !== b.length) {return false;}
  return crypto.timingSafeEqual(a, b);
}

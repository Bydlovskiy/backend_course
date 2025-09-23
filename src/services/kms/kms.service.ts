import {
  KMSClient,
  GenerateMacCommand,
  VerifyMacCommand,
  MacAlgorithmSpec
} from '@aws-sdk/client-kms';

const kmsClient = new KMSClient({ region: process.env.AWS_REGION });

export async function generateSignature(email: string, expireAt: number): Promise<string> {
  const data = Buffer.from(`${email}:${expireAt}`, 'utf-8');

  const command = new GenerateMacCommand({
    KeyId: process.env.KMS_KEY_ID,
    Message: data,
    MacAlgorithm: MacAlgorithmSpec.HMAC_SHA_256
  });

  const response = await kmsClient.send(command);

  return Buffer.from(response.Mac as Uint8Array).toString('base64');
}

export async function verifySignature(
  email: string,
  expireAt: number | string,
  signature: string
): Promise<boolean> {
  try {
    const emailDecoded = decodeURIComponent(email);
    const signatureDecoded = decodeURIComponent(signature);

    const expireTimestamp = Number(expireAt);
    if (isNaN(expireTimestamp)) {return false;}

    if (Date.now() > expireTimestamp) {return false;}

    const macBuffer = Buffer.from(signatureDecoded, 'base64');
    const data = Buffer.from(`${emailDecoded}:${expireTimestamp}`, 'utf-8');
    const command = new VerifyMacCommand({
      KeyId: process.env.KMS_KEY_ID,
      Message: data,
      MacAlgorithm: MacAlgorithmSpec.HMAC_SHA_256,
      Mac: macBuffer
    });

    const response = await kmsClient.send(command);

    return response.MacValid || false;
  } catch (err) {
    console.error('KMS verification error:', err);
    return false;
  }
}

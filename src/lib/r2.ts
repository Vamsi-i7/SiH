import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'statvidya-documents';
export const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || `https://pub-${accountId}.r2.dev`;

// Cloudflare R2 S3 API Endpoint format: https://<account_id>.r2.cloudflarestorage.com
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey);
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ url: string; key: string }> {
  if (!isR2Configured()) {
    // Demo / mock URL fallback when R2 credentials are not set
    return {
      key: params.key,
      url: `${PUBLIC_URL}/${params.key}`,
    };
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  });

  await r2Client.send(command);

  return {
    key: params.key,
    url: `${PUBLIC_URL}/${params.key}`,
  };
}

export async function getPresignedR2DownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  if (!isR2Configured()) {
    return `${PUBLIC_URL}/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured()) return true;

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}

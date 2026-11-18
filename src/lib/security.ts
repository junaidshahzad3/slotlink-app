import { z } from 'zod';

/** Validates an optional or required HTTP(S) URL, rejecting javascript:, data:, etc. */
export const safeHttpUrlSchema = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL must start with http:// or https://');

/** Escapes special HTML characters to prevent injection in HTML emails/templates. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns true when real (non-placeholder) Paddle billing credentials are configured. */
export function isLivePaddleConfigured(): boolean {
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.trim() ?? '';
  const proPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO?.trim() ?? '';
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET?.trim() ?? '';

  if (!clientToken || !proPrice || !webhookSecret) return false;
  if (clientToken.startsWith('live_...') || clientToken.startsWith('test_...')) return false;
  if (proPrice.startsWith('pri_...')) return false;
  if (webhookSecret.startsWith('pdl_ntfset_...')) return false;

  return true;
}

/** Validates whether an arbitrary URL uses http: or https: for safe href output. */
export function isSafeHttpUrl(value: string): boolean {
  return safeHttpUrlSchema.safeParse(value).success;
}

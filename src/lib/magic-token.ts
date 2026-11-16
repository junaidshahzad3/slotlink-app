import { randomBytes } from 'crypto';

export function generateMagicToken(): string {
  return 'sl_' + randomBytes(16).toString('hex');
}

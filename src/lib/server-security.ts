import { createHash, timingSafeEqual } from 'node:crypto';

/** Constant-time string comparison using SHA-256 digests so length mismatches do not leak. */
export function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

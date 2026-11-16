'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={handleLogout}
      className="rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#575248] hover:bg-[#EFECE4] hover:text-[#141413] disabled:opacity-50 transition"
    >
      {busy ? '...' : 'Sign Out'}
    </button>
  );
}

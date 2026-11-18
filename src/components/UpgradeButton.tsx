'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void;
      Checkout: {
        open: (opts: {
          items: { priceId: string; quantity: number }[];
          customData?: Record<string, string>;
        }) => void;
      };
    };
  }
}

export function UpgradeButton({
  userId,
  priceId,
  label,
  currentTier,
}: {
  userId: string;
  priceId: string;
  label: string;
  currentTier?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token || token.startsWith('live_...') || document.getElementById('paddle-v2-js')) return;
    const script = document.createElement('script');
    script.id = 'paddle-v2-js';
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => window.Paddle?.Initialize({ token });
    document.body.appendChild(script);
  }, []);

  if (currentTier === 'PRO_19') {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#15803D]">
        <Check className="h-3 w-3" />
        PRO_19 Active
      </span>
    );
  }

  async function openCheckout() {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (window.Paddle && priceId && clientToken && !clientToken.startsWith('live_...')) {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId },
      });
      return;
    }

    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/pro/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'PRO_19' }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error ?? 'Could not activate Pro upgrade.');
      }
    } catch {
      setErrorMsg('Network error while upgrading.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={openCheckout}
        className="rounded-lg bg-[#D94E28] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#C2411E] disabled:opacity-50 transition cursor-pointer"
      >
        {busy ? 'Upgrading...' : label}
      </button>
      {errorMsg && (
        <span role="alert" className="text-[11px] font-medium text-[#B91C1C]">
          {errorMsg}
        </span>
      )}
    </div>
  );
}

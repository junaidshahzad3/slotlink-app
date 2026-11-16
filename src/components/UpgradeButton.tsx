'use client';

import { useEffect } from 'react';

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
}: {
  userId: string;
  priceId: string;
  label: string;
}) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token || document.getElementById('paddle-v2-js')) return;
    const script = document.createElement('script');
    script.id = 'paddle-v2-js';
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => window.Paddle?.Initialize({ token });
    document.body.appendChild(script);
  }, []);

  function openCheckout() {
    if (!window.Paddle || !priceId) return;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId },
    });
  }

  return (
    <button
      type="button"
      onClick={openCheckout}
      className="rounded-lg bg-[#D94E28] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#C2411E] transition"
    >
      {label}
    </button>
  );
}

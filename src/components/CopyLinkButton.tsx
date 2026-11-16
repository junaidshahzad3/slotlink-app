'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyLinkButton({ path, label }: { path: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        const url = `${window.location.origin}${path}`;
        navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-[#F6F4EE] px-2.5 py-1.5 font-mono text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
    >
      {copied ? <Check className="h-3 w-3 text-[#15803D]" /> : <Copy className="h-3 w-3 text-[#6E685C]" />}
      {copied ? 'Copied!' : label ?? path}
    </button>
  );
}

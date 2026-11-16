import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center text-[#141413]">
      <div className="surface-card rounded-2xl p-8 space-y-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D94E28]">
          404 // Not Found
        </span>
        <h1 className="font-serif text-3xl text-[#141413]">Portal or page not found</h1>
        <p className="text-xs leading-relaxed text-[#575248]">
          Check the booking link slug or ask your tutor for an updated magic portal link.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
        >
          Back to SlotLink
        </Link>
      </div>
    </main>
  );
}

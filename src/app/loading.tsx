export default function GlobalLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <div className="surface-card animate-pulse rounded-2xl p-6 space-y-4">
        <div className="h-5 w-44 rounded bg-[#EFECE4]" />
        <div className="h-3 w-72 rounded bg-[#F6F4EE]" />
        <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
          <div className="h-24 rounded-xl bg-[#EFECE4]" />
          <div className="h-24 rounded-xl bg-[#EFECE4]" />
          <div className="h-24 rounded-xl bg-[#EFECE4]" />
        </div>
      </div>
    </main>
  );
}

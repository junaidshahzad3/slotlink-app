export default function GlobalLoading() {
  return (
    <main className="min-h-[100dvh] bg-[#F6F4EE] bg-editorial-mesh flex items-center justify-center">
      <div className="viewport-container py-12">
        <div className="surface-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#EFECE4] pb-4">
            <div className="space-y-1.5 animate-pulse">
              <div className="h-4 w-44 rounded bg-[#EFECE4]" />
              <div className="h-2.5 w-64 rounded bg-[#F6F4EE]" />
            </div>
            <span className="font-mono text-[11px] font-medium text-[#6E685C]">Loading...</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-pulse">
            <div className="h-28 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]" />
            <div className="h-28 rounded-xl border border-[#DCD6C8] bg-[#EFECE4]" />
            <div className="h-28 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]" />
          </div>
        </div>
      </div>
    </main>
  );
}

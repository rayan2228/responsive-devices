export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div className="h-14" />
      <div className="space-y-4 py-12">
        <div className="mx-auto h-10 w-2/3 max-w-lg animate-pulse rounded-control bg-elevated" />
        <div className="mx-auto h-4 w-1/2 max-w-md animate-pulse rounded-control bg-elevated" />
        <div className="h-[72px] animate-pulse rounded-panel bg-elevated" />
        <div className="h-[220px] animate-pulse rounded-panel bg-elevated" />
        <div className="h-[420px] animate-pulse rounded-panel bg-elevated" />
      </div>
    </div>
  );
}

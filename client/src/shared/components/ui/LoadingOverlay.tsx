import { useAppSelector } from "@/store/hooks";

const LoadingOverlay = () => {
  const activeRequests = useAppSelector((state) => state.ui.activeRequests);

  if (activeRequests === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="flex min-w-[280px] flex-col items-center gap-4 rounded-[28px] border border-slate-700/80 bg-slate-950/95 px-10 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.75)] transition-all duration-300">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl animate-pulse" />
          <span className="absolute inset-0 rounded-full border border-blue-400/20" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 shadow-inner">
            <div className="h-9 w-9 animate-spin rounded-full border border-slate-700/70 border-t-blue-400/90" />
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-white">Loading</p>
          <p className="mt-1 text-sm text-slate-400">
            Fetching data, please wait...
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-bounce" />
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400/80 animate-bounce delay-150" />
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400/60 animate-bounce delay-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

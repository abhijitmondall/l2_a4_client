import { Activity, Loader2 } from "lucide-react";

function loading() {
  return;
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F1F5F9] gap-4">
      <div className="relative">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <Activity
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400"
          size={20}
        />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
        Initializing Registry...
      </p>
    </div>
  );
}

export default loading;

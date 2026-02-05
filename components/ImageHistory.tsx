"use client";

type Item = { id: string; url: string; prompt?: string };

type Props = {
  items: Item[];
  onSelect: (url: string) => void;
  onClear?: () => void;
};

export function ImageHistory({ items, onSelect, onClear }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Generations
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-800 text-xs text-slate-400">
            {items.length}
          </span>
        </h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.url)}
              className="group flex-shrink-0 relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-violet-500/50 transition-all duration-200">
                <img
                  src={item.url}
                  alt={item.prompt ?? "Generated"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

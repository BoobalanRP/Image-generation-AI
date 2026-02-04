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
    <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-300">Session history</h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.url)}
            className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-accent/50 focus:border-accent transition-colors focus-ring"
          >
            <img
              src={item.url}
              alt={item.prompt ?? "Generated"}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

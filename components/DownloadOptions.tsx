"use client";

import { useRef, useState } from "react";
import type { DownloadFormat } from "@/app/types";

type Props = {
  imageUrl: string | null;
  disabled?: boolean;
};

const FORMATS: { value: DownloadFormat; label: string; ext: string; icon: string }[] = [
  { value: "image/jpeg", label: "JPG", ext: "jpg", icon: "J" },
  { value: "image/png", label: "PNG", ext: "png", icon: "P" },
  { value: "image/webp", label: "WEBP", ext: "webp", icon: "W" },
];

const SIZES = [
  { label: "Standard", scale: 1, desc: "1x" },
  { label: "HD", scale: 1.5, desc: "1.5x" },
  { label: "Ultra HD", scale: 2, desc: "2x" },
];

export function DownloadOptions({ imageUrl, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function download(format: DownloadFormat, scale: number, key: string) {
    if (!imageUrl) return;
    setDownloading(key);
    
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      const ext = FORMATS.find((f) => f.value === format)?.ext ?? "png";
      const mime = format;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, 0.92)
      );
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } finally {
      setDownloading(null);
    }
  }

  if (!imageUrl || disabled) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Download Options
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((f) => (
            <div key={f.value} className="space-y-1.5">
              <div className="text-xs text-slate-500 text-center font-medium">{f.label}</div>
              <div className="flex flex-col gap-1">
                {SIZES.map((s) => {
                  const key = `${f.value}-${s.label}`;
                  const isDownloading = downloading === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => download(f.value, s.scale, key)}
                      disabled={isDownloading}
                      className="px-2 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-violet-500/30 text-slate-300 hover:text-white text-xs transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      <span>{s.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

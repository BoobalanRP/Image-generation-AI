"use client";

import { useRef } from "react";
import type { DownloadFormat } from "@/app/types";

type Props = {
  imageUrl: string | null;
  disabled?: boolean;
};

const FORMATS: { value: DownloadFormat; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WEBP", ext: "webp" },
];

const SIZES = [
  { label: "Standard", scale: 1 },
  { label: "HD", scale: 1.5 },
  { label: "Ultra HD", scale: 2 },
];

export function DownloadOptions({ imageUrl, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function download(format: DownloadFormat, scale: number) {
    if (!imageUrl) return;
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
    a.download = `image.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  if (!imageUrl || disabled) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Download</h3>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) =>
            SIZES.map((s) => (
              <button
                key={`${f.value}-${s.label}`}
                type="button"
                onClick={() => download(f.value, s.scale)}
                className="px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-accent/20 text-zinc-200 hover:text-white text-sm transition-colors"
              >
                {f.label} · {s.label}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

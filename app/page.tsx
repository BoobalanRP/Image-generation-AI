"use client";

import { useState, useCallback } from "react";
import {
  STYLE_LABELS,
  STYLE_PROMPT_SUFFIX,
  RESOLUTION_OPTIONS,
  type ImageStyle,
  type Resolution,
} from "./types";
import { DownloadOptions } from "@/components/DownloadOptions";
import { ImageHistory } from "@/components/ImageHistory";

const STYLES: ImageStyle[] = [
  "none",
  "realistic",
  "cartoon",
  "anime",
  "illustration",
  "oil painting",
  "digital art",
];

type HistoryItem = { id: string; url: string; prompt?: string };

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("none");
  const [resolution, setResolution] = useState<Resolution>("standard");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = useCallback((url: string, promptText?: string) => {
    setHistory((prev) => [
      { id: crypto.randomUUID(), url, prompt: promptText },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt to generate an image.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const styleSuffix =
        style === "none" ? "" : STYLE_PROMPT_SUFFIX[style];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: styleSuffix,
          resolution,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setResultUrl(data.imageUrl);
      addToHistory(data.imageUrl, prompt.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = prompt.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                ImageAI Studio
              </h1>
              <p className="text-xs text-slate-400">
                Transform ideas into stunning visuals
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Ready
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Prompt Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative rounded-2xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-sm">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-4">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Describe your image
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A majestic mountain range at golden hour, with snow-capped peaks reflecting the warm sunlight..."
                  rows={4}
                  className="w-full rounded-xl bg-slate-800/50 border border-white/5 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Tip: Be specific with details like lighting, style, and mood for better results
                </p>
              </div>
            </div>

            {/* Style Selection */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-sm">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-4">
                <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Art Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      style === s
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                        : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-white/5"
                    }`}
                  >
                    {STYLE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selection */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-sm">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-4">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RESOLUTION_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setResolution(r.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      resolution === r.value
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                        : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-white/5"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canSubmit || loading}
              className="w-full relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200 group-disabled:opacity-30"></div>
              <div className={`relative w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? "bg-slate-800" : "bg-gradient-to-r from-violet-600 to-fuchsia-600"
              } ${(!canSubmit || loading) ? "cursor-not-allowed" : "cursor-pointer"}`}>
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-300">Generating your masterpiece...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Image
                  </>
                )}
              </div>
            </button>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </h3>
                {resultUrl && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Generated
                  </span>
                )}
              </div>
              <div className="p-4">
                {resultUrl ? (
                  <div className="rounded-xl overflow-hidden bg-slate-800/50">
                    <img
                      src={resultUrl}
                      alt="Generated"
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-slate-800/30 border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center text-slate-500">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Your creation will appear here</p>
                    <p className="text-xs mt-1 text-slate-600">Enter a prompt and click generate</p>
                  </div>
                )}
              </div>
              
              {/* Download Options */}
              {resultUrl && (
                <div className="px-6 pb-6">
                  <DownloadOptions imageUrl={resultUrl} disabled={loading} />
                </div>
              )}
            </div>

            {/* Session History */}
            <ImageHistory
              items={history}
              onSelect={(url) => setResultUrl(url)}
              onClear={() => setHistory([])}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>Powered by advanced AI image generation models</p>
          <div className="flex items-center gap-4">
            <span>FLUX.1</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Hugging Face</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

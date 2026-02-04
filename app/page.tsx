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

type Mode = "generate" | "edit";

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
  const [mode, setMode] = useState<Mode>("generate");
  const [prompt, setPrompt] = useState("");
  const [instruction, setInstruction] = useState("");
  const [style, setStyle] = useState<ImageStyle>("none");
  const [resolution, setResolution] = useState<Resolution>("standard");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setUploadedImage(dataUri);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

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

  const handleEdit = async () => {
    if (!uploadedImage) {
      setError("Upload an image first.");
      return;
    }
    const text = (mode === "edit" ? instruction : prompt).trim();
    if (!text) {
      setError("Describe the modification (e.g. add a sunset background).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          instruction: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Edit failed");
      setResultUrl(data.imageUrl);
      addToHistory(data.imageUrl, text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Edit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "generate") handleGenerate();
    else handleEdit();
  };

  const canSubmit =
    mode === "generate"
      ? prompt.trim().length > 0
      : uploadedImage && (instruction.trim().length > 0 || prompt.trim().length > 0);

  return (
    <div className="min-h-screen bg-surface text-zinc-100">
      <header className="border-b border-surface-muted px-4 py-4">
        <h1 className="text-xl font-semibold text-white">
          Image Generation AI
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Text-to-image and instruction-based editing
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Mode toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-surface-elevated border border-surface-muted w-fit">
          <button
            type="button"
            onClick={() => setMode("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "generate"
                ? "bg-accent text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Generate
          </button>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "edit"
                ? "bg-accent text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Edit image
          </button>
        </div>

        {/* Prompt / instruction */}
        <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {mode === "generate" ? "Prompt" : "Modification instruction"}
          </label>
          <textarea
            value={mode === "generate" ? prompt : instruction}
            onChange={(e) =>
              mode === "generate"
                ? setPrompt(e.target.value)
                : setInstruction(e.target.value)
            }
            placeholder={
              mode === "generate"
                ? "e.g. A serene mountain lake at sunset"
                : "e.g. Add a sunset background, change dress to red, remove person in background"
            }
            rows={3}
            className="w-full rounded-lg bg-surface border border-surface-muted px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Style (generate only) */}
        {mode === "generate" && (
          <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Style
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    style === s
                      ? "bg-accent text-white"
                      : "bg-surface-muted text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {STYLE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resolution (generate only) */}
        {mode === "generate" && (
          <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Resolution
            </label>
            <div className="flex flex-wrap gap-2">
              {RESOLUTION_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setResolution(r.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    resolution === r.value
                      ? "bg-accent text-white"
                      : "bg-surface-muted text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload (edit only) */}
        {mode === "edit" && (
          <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Upload image
            </label>
            <div className="border-2 border-dashed border-surface-muted rounded-xl p-8 text-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="upload"
              />
              <label
                htmlFor="upload"
                className="cursor-pointer text-zinc-500 hover:text-zinc-300 text-sm"
              >
                {uploadedImage ? (
                  <span className="block">
                    {uploadedFileName ?? "Image selected"}
                  </span>
                ) : (
                  "Click to choose an image (JPG, PNG, WebP)"
                )}
              </label>
              {uploadedImage && (
                <div className="mt-4 max-h-48 rounded-lg overflow-hidden inline-block">
                  <img
                    src={uploadedImage}
                    alt="Upload preview"
                    className="max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate / Modify button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition-colors"
        >
          {loading
            ? "Generating…"
            : mode === "generate"
              ? "Generate"
              : "Modify image"}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-950/50 border border-red-800 px-4 py-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Result preview */}
        {resultUrl && (
          <div className="rounded-xl bg-surface-elevated border border-surface-muted p-4 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
            <div className="rounded-lg overflow-hidden bg-surface-muted">
              <img
                src={resultUrl}
                alt="Generated"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <DownloadOptions imageUrl={resultUrl} disabled={loading} />
          </div>
        )}

        {/* Session history */}
        <ImageHistory
          items={history}
          onSelect={(url) => setResultUrl(url)}
          onClear={() => setHistory([])}
        />
      </main>
    </div>
  );
}

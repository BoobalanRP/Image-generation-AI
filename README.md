# Image Generation AI

Generate and edit images with AI: **text-to-image** and **instruction-based editing**. **Entirely free** — no payment or credit card; uses Hugging Face only.

## Features

- **Text-to-image** — Enter a prompt, choose a style (realistic, cartoon, anime, etc.) and resolution (Standard / HD / Ultra HD), then generate.
- **Image editing** — Upload an image and describe changes (e.g. “add a sunset background”, “change dress to red”). The AI modifies the image from your instructions.
- **Download** — JPG, PNG, WEBP with Standard, HD, and Ultra HD options; preview before downloading.
- **Session history** — See recent generations in the current session; click to preview or re-download.

## Setup (free)

1. **Clone and install**

   ```bash
   cd Image-generation-AI
   npm install
   ```

2. **Hugging Face token (free)**

   - Sign up at [huggingface.co](https://huggingface.co/join) (free).
   - Create a token at [Settings → Access tokens](https://huggingface.co/settings/tokens) (read access is enough).
   - Copy `.env.example` to `.env.local` and set your token:

   ```bash
   cp .env.example .env.local
   # Edit .env.local and set HUGGINGFACE_TOKEN=hf_...
   ```

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Tech

- **Next.js 14** (App Router)
- **Hugging Face Inference API** (free) — Stable Diffusion 2.1 for text-to-image, InstructPix2Pix for image editing
- **Tailwind CSS** for styling

## Optional

- **Image history** — Stored in memory for the session; clear with “Clear” in the history section.
- **Refine / regenerate** — Use “Edit image” with the last result (or any from history) and a new instruction to refine.

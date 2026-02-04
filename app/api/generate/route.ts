import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const WIDTH_BY_RES: Record<string, number> = {
  standard: 1024,
  hd: 1280,
  "ultra-hd": 1536,
};

const HF_IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell";

export async function POST(request: NextRequest) {
  const token = process.env.HUGGINGFACE_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "HUGGINGFACE_TOKEN is not set. Add it in .env.local (free at https://huggingface.co/settings/tokens).",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { prompt, style, resolution = "standard" } = body as {
      prompt?: string;
      style?: string;
      resolution?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const size = WIDTH_BY_RES[resolution] ?? 1024;
    const fullPrompt = style
      ? `${prompt.trim()}, ${style}`
      : prompt.trim();

    const client = new InferenceClient(token);

    const imageUrl = await client.textToImage(
      {
        model: HF_IMAGE_MODEL,
        inputs: fullPrompt,
        parameters: {
          width: Math.min(size, 768),
          height: Math.min(size, 768),
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
        provider: "hf-inference",
      },
      { outputType: "dataUrl" }
    );

    return NextResponse.json({ imageUrl });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message =
      err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

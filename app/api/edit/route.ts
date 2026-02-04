import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const HF_IMAGE_TO_IMAGE_MODEL = "timbrooks/instruct-pix2pix";

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const base64 = parts[1];
  const binary = Buffer.from(base64, "base64");
  return new Blob([binary], { type: mime });
}

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
    const { imageUrl, instruction } = body as {
      imageUrl?: string;
      instruction?: string;
    };

    if (!imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Image URL is required (upload an image first)" },
        { status: 400 }
      );
    }

    if (!instruction?.trim()) {
      return NextResponse.json(
        { error: "Instruction is required (e.g. add a sunset background)" },
        { status: 400 }
      );
    }

    const client = new InferenceClient(token);

    // Convert data URL to Blob for the SDK
    const imageBlob = dataUrlToBlob(imageUrl);

    const resultBlob = await client.imageToImage({
      model: HF_IMAGE_TO_IMAGE_MODEL,
      inputs: imageBlob,
      parameters: {
        prompt: instruction.trim(),
        num_inference_steps: 20,
        image_guidance_scale: 1.5,
        guidance_scale: 7.5,
      },
      provider: "hf-inference",
    });

    const buf = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    const mime = resultBlob.type || "image/png";
    const imageOutUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({ imageUrl: imageOutUrl });
  } catch (err: unknown) {
    console.error("Edit error:", err);
    const message = err instanceof Error ? err.message : "Edit failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// app/api/lipsync/route.js

import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { GOOEY_API_KEY } = process.env;

  if (!GOOEY_API_KEY) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }
  console.log("generating");
  const body = await req.json();
  const inputText = body.inputText;
  const imageUrl = body.imageUrl;
  const gender = body.gender;
  const poseUrl = body.poseUrl;
  const eyeblinkUrl = body.eyeblinkUrl;
  const still = body.still;
  const audioUrl = body.audioUrl;
  console.log("eyeblink url:");
  console.log(eyeblinkUrl);
  console.log("pose url:");
  console.log(poseUrl);
  console.log("generating started:");

  const payload = {
    text_prompt: inputText,
    tts_provider: "GOOGLE_TTS",
    google_voice_name: gender,
    input_face: imageUrl,
    sadtalker_settings: {
      still: still,
      preprocess: "full",
      pose_style: 1,
      expression_scale: 1,
      ref_eyeblink: eyeblinkUrl,
      ref_pose: poseUrl,
    },
    selected_model: "SadTalker",
  };
  try {
    const response = await fetch("https://api.gooey.ai/v3/LipsyncTTS/async/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOEY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const statusUrl = data.status_url;
    console.log("status:");
    console.log(statusUrl);
    return NextResponse.json({ status_url: statusUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

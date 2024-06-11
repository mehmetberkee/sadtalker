import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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
  let payload = {};
  if (poseUrl && !eyeblinkUrl) {
    payload = {
      input_face: imageUrl,
      sadtalker_settings: {
        still: still,
        preprocess: "full",
        pose_style: 1,
        expression_scale: 1,
        ref_pose: poseUrl,
      },
      selected_model: "SadTalker",
      input_audio: audioUrl,
    };
  }
  if (!poseUrl && eyeblinkUrl) {
    payload = {
      input_face: imageUrl,
      sadtalker_settings: {
        still: still,
        preprocess: "full",
        pose_style: 1,
        expression_scale: 1,
        ref_pose: poseUrl,
      },
      selected_model: "SadTalker",
      input_audio: audioUrl,
    };
  }
  if (poseUrl && eyeblinkUrl) {
    payload = {
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
      input_audio: audioUrl,
    };
  }
  if (!poseUrl && !eyeblinkUrl) {
    payload = {
      input_face: imageUrl,
      sadtalker_settings: {
        still: still,
        preprocess: "full",
        pose_style: 1,
        expression_scale: 1,
      },
      selected_model: "SadTalker",
      input_audio: audioUrl,
    };
  }

  const response = await fetch("https://api.gooey.ai/v2/Lipsync/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.GOOEY_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log(response.status, result);

  return new Response(JSON.stringify({ url: result.output.output_video }));
}

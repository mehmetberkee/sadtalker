import Replicate from "replicate";
interface Input {
  driven_audio: string;
  source_image: string;
  ref_eyeblink?: string;
  ref_pose?: string;
}
export async function POST(req: Request) {
  const body = await req.json();
  const audioUrl = body.audioUrl;
  const imageUrl = body.imageUrl;
  const eyeblinkUrl = body.eyeblinkUrl;
  const poseUrl = body.poseUrl;
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  const input: Input = {
    driven_audio: audioUrl,
    source_image: imageUrl,
  };
  if (eyeblinkUrl) {
    input.ref_eyeblink = eyeblinkUrl;
  }

  if (poseUrl) {
    input.ref_pose = poseUrl;
  }
  const output = await replicate.run(
    "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
    { input }
  );

  return new Response(JSON.stringify({ url: output }));
}

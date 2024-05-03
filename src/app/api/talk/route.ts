import Replicate from "replicate";
interface Input {
  driven_audio: string;
  source_image: string;
  ref_eyeblink?: string;
  ref_pose?: string;
}

export async function POST(req: Request) {
  console.log("started");
  const body = await req.json();
  const { audioUrl, imageUrl, eyeblinkUrl, poseUrl } = body;

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  const input: Input = {
    driven_audio: audioUrl,
    source_image: imageUrl,

    ...(poseUrl ? { ref_pose: poseUrl } : {}),
  };

  console.log(input);
  const output = await replicate.run(
    "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
    { input }
  );

  console.log("output", output);

  return new Response(JSON.stringify({ url: output }));
}

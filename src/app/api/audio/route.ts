import { Storage } from "@google-cloud/storage";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const bucketName = "childrenstory-bucket";
const storage = new Storage({
  projectId: "childrenstory-413616",
  keyFilename: "public/childrenstory-413616-132e7537e436.json",
});
export async function POST(req: Request) {
  const body = await req.json();
  const text = body.text;
  const gender = body.gender;

  const request = {
    input: { text: text },
    voice: {
      languageCode: gender === "female" ? "en-US" : "en-US",
      name: gender === "female" ? "en-US-Standard-F" : "en-US-Casual-K",
      ssmlGender: gender === "female" ? "FEMALE" : "MALE",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );

  const resInfo = await response.json();
  console.log(resInfo);
  const audioContentBase64 = resInfo.audioContent;

  const audioBuffer = Buffer.from(audioContentBase64, "base64");

  const fileName = `output-${uuidv4()}.mp3`;
  const fileDestination = `${fileName}`;

  const file = storage.bucket(bucketName).file(fileDestination);

  await file.save(audioBuffer, {
    metadata: {
      contentType: "audio/mp3",
    },
  });

  console.log(
    "File URL:",
    `https://storage.googleapis.com/${bucketName}/${fileDestination}`
  );

  const url = `https://storage.googleapis.com/${bucketName}/${fileDestination}`;

  return new Response(
    JSON.stringify({
      url: url,
    })
  );
}

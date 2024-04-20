import Replicate from "replicate";

export async function POST(req: Request) {
  const replicate = new Replicate();

  const input = {
    driven_audio:
      "https://replicate.delivery/pbxt/IkgWA4bLoXpk5NwVsfOBzHh7MswfNLTgtf44Qr2gdOTOWvSX/japanese.wav",
    source_image:
      "https://replicate.delivery/pbxt/IkgW9tngATq608Qf6haUXDpg81s5YBJfS9GaBiCFjdKXk4F5/art_1.png",
  };

  const output = await replicate.run(
    "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
    { input }
  );
  console.log(output);
}

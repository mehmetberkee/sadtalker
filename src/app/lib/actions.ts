"use server";

import { Storage } from "@google-cloud/storage";

export const UploadFile = async (form: FormData) => {
  try {
    const file = form.get("file") as File;
    if (!file) throw new Error("No file provided");
    if (file.size < 1) throw new Error("File is empty");

    const buffer = await file.arrayBuffer();

    const storage = new Storage({
      projectId: "childrenstory-413616",
      keyFilename: "public/childrenstory-413616-132e7537e436.json",
    });

    const bucketName = "childrenstory-bucket";
    const bucket = storage.bucket(bucketName);
    const fileBlob = bucket.file(file.name);

    // Save the file to Google Cloud Storage
    await fileBlob.save(Buffer.from(buffer));

    await fileBlob.makePublic();

    // Construct the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileBlob.name}`;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error(error);
    return false;
  }
};

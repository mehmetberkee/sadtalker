"use server";
import AWS from "aws-sdk";
import { S3 } from "aws-sdk";

export const UploadFile = async (form: FormData) => {
  try {
    const file = form.get("file") as File;
    if (!file) throw new Error("No file provided");
    if (file.size < 1) throw new Error("File is empty");

    const buffer = Buffer.from(await file.arrayBuffer());

    // Configure AWS SDK for JavaScript
    AWS.config.update({
      accessKeyId: process.env.AUTH_S3_ID,
      secretAccessKey: process.env.AUTH_S3_SECRET,
      region: "us-east-1",
    });

    const s3 = new S3();

    const bucketName = "zapbucket";
    const params = {
      Bucket: bucketName,
      Key: file.name,
      Body: buffer,
      ACL: "public-read",
    };

    // Upload file to S3
    const data = await s3.upload(params).promise();

    return { success: true, url: data.Location };
  } catch (error) {
    console.error(error);
    return { success: false, error: String(error) };
  }
};

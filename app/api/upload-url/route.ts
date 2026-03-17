import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    const s3 = new S3Client({
      region: process.env.AWS_S3_UPLOADER_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_UPLOADER_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_UPLOADER_SECRET_ACCESS_KEY!,
      },
    });

    const key = `entrevistas/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return Response.json({ uploadURL, key });
  } catch (error) {
    console.error("❌ Error generating presigned URL:", error);
    return new Response("Error generating presigned URL", { status: 500 });
  }
}
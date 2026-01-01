"use server";

import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || "eu-central-1",
});

const BUCKET_NAME = "entrevistas-videos";

export async function GET() {
  try {
    // Listar todos los archivos JSON de entrevistas
    const res = await s3
      .listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: "entrevistas/",
      })
      .promise();

    const jsonFiles = res.Contents?.filter((f) => f.Key?.endsWith(".json")) || [];

    // Obtener y parsear cada JSON
    const entrevistas: any[] = await Promise.all(
      jsonFiles.map(async (file) => {
        const obj = await s3
          .getObject({ Bucket: BUCKET_NAME, Key: file.Key! })
          .promise();
        return JSON.parse(obj.Body!.toString());
      })
    );

    // Ordenar por fecha (descendente)
    entrevistas.sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));

    return NextResponse.json({ entrevistas });
  } catch (err) {
    console.error("Error leyendo entrevistas de S3:", err);
    return NextResponse.json({ entrevistas: [] });
  }
}

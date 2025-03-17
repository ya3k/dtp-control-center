import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const storage = new Storage({
      projectId: process.env.NEXT_GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.NEXT_GCP_CLIENT_EMAIL,
        private_key: process.env.NEXT_GCP_PRIVATE_KEY,
      },
    });

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);
    const fileName = `${Date.now()}-${file.name}`;
    const blob = bucket.file(fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream
        .on("error", (err) => reject(err))
        .on("finish", () => resolve(true))
        .end(buffer);
    });

    await blob.makePublic();
    const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
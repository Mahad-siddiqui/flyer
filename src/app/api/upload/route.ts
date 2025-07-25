import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractFlyerData } from "@/lib/gemini";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Generate unique filename
    const fileId = uuidv4();
    const extension = file.name.split(".").pop();
    const filename = `${fileId}.${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Save file to disk
    const filePath = join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Extract data using Gemini AI
    let extractedData;
    try {
      extractedData = await extractFlyerData(Buffer.from(buffer), file.type);
    } catch (error) {
      console.error("AI extraction error:", error);
      // Fallback to basic data if AI fails
      extractedData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: "AI extraction failed. Please edit manually.",
        category: "Event",
        ctaButtons: {
          primary: { text: "Contact Us", action: "contact" },
          secondary: { text: "Learn More", action: "info" },
        },
      };
    }

    const responseData = {
      filePath: `/uploads/${filename}`,
      extractedData,
      fileInfo: {
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

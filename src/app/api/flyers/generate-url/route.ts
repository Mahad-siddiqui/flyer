// src/app/api/flyers/generate-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flyerId, templateId } = await request.json();

    if (!flyerId || !templateId) {
      return NextResponse.json(
        { error: "Flyer ID and Template ID are required" },
        { status: 400 }
      );
    }

    // Verify the flyer belongs to the user
    const flyer = await prisma.flyer.findFirst({
      where: {
        id: flyerId,
        userId: session.user.id,
      },
    });

    if (!flyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    // Verify the template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Generate a short URL if it doesn't exist
    let shortUrl = flyer.shortUrl;
    let generatedUrl = flyer.generatedUrl;
    
    if (!shortUrl) {
      shortUrl = generateShortUrl();
      generatedUrl = `${process.env.NEXTAUTH_URL}/f/${shortUrl}`;
    }

    // Generate QR code if it doesn't exist
    let qrCodePath = flyer.qrCodePath;
    if (!qrCodePath && generatedUrl) {
      qrCodePath = await generateQRCodeDataUrl(generatedUrl);
    }

    // Update the flyer with template, URL, and QR code info
    const updatedFlyer = await prisma.flyer.update({
      where: { id: flyerId },
      data: {
        templateId,
        shortUrl,
        generatedUrl,
        qrCodePath,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      url: updatedFlyer.generatedUrl,
      shortUrl: updatedFlyer.shortUrl,
      flyerId: updatedFlyer.id,
    });
  } catch (error) {
    console.error("Error generating URL:", error);
    return NextResponse.json(
      { error: "Failed to generate URL" },
      { status: 500 }
    );
  }
}

function generateShortUrl(): string {
  // Generate a short, URL-safe ID
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

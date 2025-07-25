import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");

    const offset = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(category && { category }),
    };

    const [flyers, totalCount] = await Promise.all([
      prisma.flyer.findMany({
        where,
        select: {
          id: true,
          title: true,
          category: true,
          viewCount: true,
          createdAt: true,
          generatedUrl: true,
          qrCodePath: true,
          isPublic: true,
          originalFileName: true,
          fileType: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.flyer.count({ where }),
    ]);

    return NextResponse.json({
      flyers,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Flyers API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check user's plan limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
        _count: {
          select: { flyers: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has reached their plan limit
    if (
      user.plan?.flyerLimit !== -1 &&
      user._count.flyers >= (user.plan?.flyerLimit || 5)
    ) {
      return NextResponse.json(
        { error: "Plan limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      originalFileName,
      filePath,
      fileType,
      fileSize,
      extractedData,
      category,
      templateId,
    } = body;

    // Generate short URL
    const shortUrl = Math.random().toString(36).substring(2, 10);
    const generatedUrl = `${process.env.NEXTAUTH_URL}/f/${shortUrl}`;

    const flyer = await prisma.flyer.create({
      data: {
        userId,
        title,
        originalFileName,
        filePath,
        fileType,
        fileSize,
        extractedData,
        category,
        templateId,
        generatedUrl,
        shortUrl,
      },
    });

    // Update user's flyer count
    await prisma.user.update({
      where: { id: userId },
      data: { flyersUsed: { increment: 1 } },
    });

    return NextResponse.json(flyer, { status: 201 });
  } catch (error) {
    console.error("Create flyer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

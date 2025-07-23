// src/app/api/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isPremium = searchParams.get("premium");

    const where: any = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (isPremium !== null) {
      where.isPremium = isPremium === "true";
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { isPremium: "asc" }, // Free templates first
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        previewImage: true,
        isPremium: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get template counts by category
    const categoryCounts = await prisma.template.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: {
        id: true,
      },
    });

    const totalCount = await prisma.template.count({
      where: { isActive: true },
    });

    const premiumCount = await prisma.template.count({
      where: { isActive: true, isPremium: true },
    });

    return NextResponse.json({
      templates,
      stats: {
        total: totalCount,
        premium: premiumCount,
        free: totalCount - premiumCount,
        categories: categoryCounts.reduce((acc, item) => {
          acc[item.category] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

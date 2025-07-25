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

    const userId = session.user.id;

    // Get user with plan info
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

    // Get total views and scans
    const flyers = await prisma.flyer.findMany({
      where: { userId },
      select: { viewCount: true, createdAt: true },
    });

    // Calculate stats
    const totalFlyers = flyers.length;
    const totalViews = flyers.reduce((sum, flyer) => sum + flyer.viewCount, 0);
    const totalScans = 0; // This would come from QR analytics when implemented

    // Get flyers created this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const flyersThisMonth = flyers.filter(
      (flyer) => new Date(flyer.createdAt) >= currentMonth
    ).length;

    const stats = {
      totalFlyers,
      totalViews,
      totalScans,
      flyersThisMonth,
      planLimit: user.plan?.flyerLimit || 5,
      planName: user.plan?.name || "Free",
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flyer = await prisma.flyer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        template: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!flyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    return NextResponse.json(flyer);
  } catch (error) {
    console.error("Error fetching flyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { editableFields, templateId, isPublic } = body;

    // Verify the flyer belongs to the user
    const existingFlyer = await prisma.flyer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingFlyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    // Update the flyer
    const updatedFlyer = await prisma.flyer.update({
      where: { id: params.id },
      data: {
        ...(editableFields && { editableFields }),
        ...(templateId && { templateId }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date(),
      },
      include: {
        template: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedFlyer);
  } catch (error) {
    console.error("Error updating flyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the flyer belongs to the user
    const existingFlyer = await prisma.flyer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingFlyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    // Delete the flyer
    await prisma.flyer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Flyer deleted successfully" });
  } catch (error) {
    console.error("Error deleting flyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
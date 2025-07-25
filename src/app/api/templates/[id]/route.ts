// src/app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const template = await prisma.template.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      htmlContent,
      cssContent,
      jsContent,
      isActive,
      isPremium,
    } = body;

    const template = await prisma.template.update({
      where: {
        id: params.id,
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(htmlContent && { htmlContent }),
        ...(cssContent && { cssContent }),
        ...(jsContent !== undefined && { jsContent }),
        ...(isActive !== undefined && { isActive }),
        ...(isPremium !== undefined && { isPremium }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { qrCodePath } = await req.json();

    const updatedFlyer = await prisma.flyer.update({
      where: { id: params.id },
      data: {
        qrCodePath,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedFlyer);
  } catch (error) {
    console.error('Error updating flyer:', error);
    return NextResponse.json({ error: 'Failed to update flyer' }, { status: 500 });
  }
}

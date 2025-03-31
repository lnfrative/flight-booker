import { prisma } from "@/db";
import { NextRequest } from "next/server";

type Params = Promise<{ usuarioId: string }>;

export async function GET(request: NextRequest, segmentData: { params: Params }) {
  const { usuarioId } = await segmentData.params;
  
  if (!usuarioId) {
    return new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: usuarioId,
    },
    include: {
      status: true,
    },
  });

  
  return Response.json(reservations);
}
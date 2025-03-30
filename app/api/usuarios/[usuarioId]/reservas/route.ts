import { prisma } from "@/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { usuarioId: string } }) {
  
  if (!params.usuarioId) {
    return new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: params.usuarioId,
    },
    include: {
      status: true,
    },
  });

  
  return Response.json(reservations);
}
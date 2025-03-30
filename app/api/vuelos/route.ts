import { prisma } from "@/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departure = searchParams.get("departure");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const dateDeparture = new Date(departure || "");

    const vuelos = await prisma.flight.findMany({
      where: {
        AND: [
          origin ? { origin: { iataCode: origin } } : {},
          destination ? { destination: { iataCode: destination } } : {},
          departure ? { departure: { gt: dateDeparture } } : {},
        ],
      },
      include: {
        origin: true,
        destination: true,
      },
      orderBy: {
        departure: "asc",
      },
      take: 10,
      skip: offset,
    })

    return Response.json(vuelos);

  } catch (error) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }
}
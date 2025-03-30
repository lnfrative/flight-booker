import { validateAuthorization } from "@/auth";
import { prisma } from "@/db";

import { RESERVATION_CANCELLED_STATUS_ID, RESERVATION_CREATED_STATUS_ID } from "@/constants";

export async function POST(request: Request) {
  const decodedAccessToken = await validateAuthorization(request.headers);

  if (!decodedAccessToken || !decodedAccessToken.sub) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const body = await request.json();
  const { flightId, seatCount = 1 } = body;

  if (!flightId) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {

    const flight = await prisma.flight.findUnique({
      where: {
        id: flightId,
      },
    });

    if (!flight) {
      return new Response(null, {
        status: 404,
        statusText: "Flight Not Found",
      });
    }

    const reservations = await prisma.reservation.aggregate({
      _sum: {
        seatCount: true,
      },
      where: {
        flightId: flightId,
        statusId: {
          not: RESERVATION_CANCELLED_STATUS_ID,
        }
      },
    });

    if (flight.availableCapacity < seatCount + reservations._sum.seatCount) {
      return new Response(null, {
        status: 400,
        statusText: "Not Enough Seats Available",
      });
    }

    const reserva = await prisma.reservation.create({
      data: {
        flightId: flightId,
        userId: decodedAccessToken.sub,
        seatCount,
        statusId: RESERVATION_CREATED_STATUS_ID
      },
    });

    return Response.json(reserva);

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint violated")) {
        return new Response(null, {
          status: 404,
          statusText: "Flight Not Found",
        });
      }
    }

    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
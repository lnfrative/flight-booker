import { validateAuthorization } from "@/auth";
import { RESERVATION_CANCELLED_STATUS_ID } from "@/constants";
import { prisma } from "@/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const decodedAccessToken = await validateAuthorization(request.headers);

  if (!decodedAccessToken || !decodedAccessToken.sub) {
    return new Response(null, { status: 401, statusText: "Unauthorized" });
  }

  try {
    await prisma.reservation.update({
      where: { id: params.id, userId: decodedAccessToken.sub },
      data: {
        statusId: RESERVATION_CANCELLED_STATUS_ID
      },
    })

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return new Response(null, { status: 404, statusText: "Resource Not Found" });
      }
    }
  }
}
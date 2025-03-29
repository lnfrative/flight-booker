import { validateAuthorization } from "@/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await validateAuthorization(request.headers);
  if (!auth) {
    return Response.json({ message: "No autorizado" }, { status: 401 });
  }

  // TODO: Eliminar la reserva con el id proporcionado
  return Response.json(auth);
}
import { validateAuthorization } from "@/auth";

export async function POST(request: Request) {
  const auth = await validateAuthorization(request.headers);
  if (!auth) {
    return Response.json({ message: "No autorizado" }, { status: 401 });
  }
  // TODO: Hacer la consulta a la API de vuelos
  return Response.json(auth);
}
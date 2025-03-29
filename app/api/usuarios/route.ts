import { createAccessToken } from "@/auth";
import { prisma } from "@/db";
import { hash } from "argon2";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const userCreated = await prisma.user.create({
      data: {
        email,
        password: await hash(password),
      },
    });

    const accessToken = await createAccessToken(userCreated);

    return Response.json({
      access_token: accessToken,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return new Response(null, {
        status: 409,
        statusText: "Conflict",
      });
    }
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
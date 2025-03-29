import { createAccessToken } from "@/auth";
import { prisma } from "@/db";
import { verify } from "argon2";
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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const accessToken = await createAccessToken(user);

    return Response.json({
      access_token: accessToken,
    });

  } catch (error) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }
    
}
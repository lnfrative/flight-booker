import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRATION_TIME = parseInt(process.env.JWT_EXPIRATION_TIME as string, 10);

interface DecodedAccessToken extends JwtPayload {
  email: string;
  name: string;
}

export async function createAccessToken(user: User) {
  const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRATION_TIME,
    subject: user.id,
  });
  return token;
}

export async function validateAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as DecodedAccessToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function setAccessTokenCookie(token: string): Promise<void> {
  const cookie = await cookies();
  
  cookie.set("access_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: JWT_EXPIRATION_TIME
  });

}

export async function getAccessTokenCookie(): Promise<string | null> {
  const cookie = await cookies();
  return cookie.get("access_token")?.value || null;
}

export async function deleteAccessTokenCookie(): Promise<void> {
  const cookie = await cookies();
  cookie.delete("access_token");
}

export async function getSession() {
  const token = await getAccessTokenCookie();
  if (!token) {
    return null;
  }

  const decoded = await validateAccessToken(token);
  if (!decoded) {
    return null;
  }

  return decoded;
}

export async function validateAuthorization(headers: Headers) {
  const token = headers.get('Authorization')?.split(" ")[1];
  if (!token) {
    return null;
  }

  const decoded = await validateAccessToken(token);
  if (!decoded) {
    return null;
  }

  return decoded;
}
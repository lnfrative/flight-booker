import { hash, verify } from 'argon2'
import { prisma } from '@/db';

export async function createUser(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return {
      message: 'Faltan datos',
      success: false,
    }
  }

  const hashedPassword = await hash(password)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    return {
      message: 'El email ya está en uso',
      success: false,
    }
  }

  // TODO: Generate a JWT token

  return {
    message: 'Usuario creado',
    success: true,
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return {
      message: 'Faltan datos',
      success: false,
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return {
      message: 'Usuario no encontrado',
      success: false,
    }
  }

  const isPasswordValid = await verify(user.password, password)

  if (!isPasswordValid) {
    return {
      message: 'Contraseña incorrecta',
      success: false,
    }
  }

  // TODO: Generate a JWT token

  return {
    message: 'Usuario logueado',
    success: true,
  }
}
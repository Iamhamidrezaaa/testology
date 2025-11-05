import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

export async function getAuthSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await getServerSession(req, res, authOptions)
}

export async function verifyToken(req: NextApiRequest): Promise<string | null> {
  const token = await getToken({ req })
  return token?.sub ?? null
}

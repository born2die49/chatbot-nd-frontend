import { cookies } from "next/headers"

export async function getUserId() {
  const userId = (await cookies()).get('session_userId')?.value
  return userId ? userId : null
}
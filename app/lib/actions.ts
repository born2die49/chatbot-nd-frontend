'use server';

import { cookies } from "next/headers"


export async function getUserId() {
  const userId = (await cookies()).get('session_userId')?.value
  return userId ? userId : null
}


export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
  (await cookies()).set('session_userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // one week
      path: '/'
  });

  (await cookies()).set('session_access_token', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 60 minutes
      path: '/'
  });

  (await cookies()).set('session_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // one week
      path: '/'
  });
}


export async function resetAuthCookies() {
  (await cookies()).set('session_userId', '');
  (await cookies()).set('session_access_token', '');
  (await cookies()).set('session_refresh_token', '');
}
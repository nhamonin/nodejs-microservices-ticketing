import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('Authorization');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signup', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};

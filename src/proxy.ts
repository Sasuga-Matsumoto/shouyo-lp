import { NextRequest, NextResponse } from 'next/server';
import {
  getTestsForPath,
  getCookieName,
  selectVariant,
  DEFAULT_COOKIE_MAX_AGE,
} from './lib/ab-tests';
import type { ProxyConfig } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const tests = getTestsForPath(pathname);

  if (tests.length === 0) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  for (const test of tests) {
    const cookieName = getCookieName(test.id);
    const existingValue = request.cookies.get(cookieName)?.value;

    // Validate existing cookie value
    const isValid = existingValue && test.variants.includes(existingValue);

    if (!isValid) {
      const variant = selectVariant(test);
      const maxAge = test.cookieMaxAge ?? DEFAULT_COOKIE_MAX_AGE;
      const isProduction = process.env.NODE_ENV === 'production';

      response.cookies.set(cookieName, variant, {
        maxAge,
        sameSite: 'lax',
        secure: isProduction,
        httpOnly: false,
        path: '/',
      });
    }
  }

  return response;
}

export const config: ProxyConfig = {
  matcher: ['/', '/thanks-contact', '/thanks-download'],
};

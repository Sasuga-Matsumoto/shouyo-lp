export type Variant = string;

export interface ABTest {
  id: string;
  variants: Variant[];
  weights: number[];
  paths: string[];
  cookieMaxAge?: number;
  enabled: boolean;
}

export const AB_TESTS: ABTest[] = [];

export function getCookieName(testId: string): string {
  return `ab_${testId}`;
}

export function selectVariant(test: ABTest): Variant {
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < test.weights.length; i++) {
    cumulative += test.weights[i];
    if (rand < cumulative) return test.variants[i];
  }
  return test.variants[test.variants.length - 1];
}

export function getTestsForPath(pathname: string): ABTest[] {
  return AB_TESTS.filter(test =>
    test.enabled && test.paths.some(p => pathname.startsWith(p))
  );
}

export const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * ブラウザ側で有効なA/Bテストのバリアントを取得する（クライアントコンポーネント用）。
 * 有効なテストが複数ある場合は最初に見つかったものを返す。
 * 有効なテストがない、またはCookieが未設定の場合は空文字を返す。
 */
export function getActiveVariant(): string {
  if (typeof document === 'undefined') return '';
  const activeTests = AB_TESTS.filter(t => t.enabled);
  for (const test of activeTests) {
    const cookieName = getCookieName(test.id);
    const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
    if (match) return match[1];
  }
  return '';
}

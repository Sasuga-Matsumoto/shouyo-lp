export type Variant = string;

export interface ABTest {
  id: string;
  variants: Variant[];
  weights: number[];
  paths: string[];
  cookieMaxAge?: number;
  enabled: boolean;
}

export const AB_TESTS: ABTest[] = [
  {
    id: 'contact-direct-calendar',
    variants: ['form', 'calendar'],
    weights: [0.5, 0.5],
    // CTAテキストもA/Bテスト対象とするため全ページでCookieを発行する。
    // form variant     : Header/Footer/FinalCTA は「お問い合わせ」、/contact はフォーム
    // calendar variant : Header/Footer/FinalCTA は「無料で相談する」、/contact はカレンダー
    paths: ['/'],
    cookieMaxAge: 60 * 60 * 24 * 30,
    enabled: true,
    // 比較指標: calendar_booking_complete 件数 ÷ /contact PV
  },
];

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

/**
 * ブラウザ側で有効な全A/Bテストのバリアントを取得する（クライアントコンポーネント用）。
 * 複数テスト同時実行に対応し、JSON文字列で返す。
 * 有効なテストがない場合は空文字を返す。
 */
export function getActiveVariants(): string {
  if (typeof document === 'undefined') return '';
  const variants: Record<string, string> = {};
  const activeTests = AB_TESTS.filter(t => t.enabled);
  for (const test of activeTests) {
    const cookieName = getCookieName(test.id);
    const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
    if (match) variants[test.id] = match[1];
  }
  const keys = Object.keys(variants);
  if (keys.length === 0) return '';
  return JSON.stringify(variants);
}

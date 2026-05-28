'use client';

import { useState, useLayoutEffect } from 'react';
import { getCookieName } from './ab-tests';

/**
 * クライアントサイドで A/Bテストの variant を取得するフック。
 * Cookie は proxy.ts が server-side でセット済みなので document.cookie から読む。
 *
 * 初回ハイドレーション前は null を返す。CTA文言などを variant で出し分ける時は
 * null の間「お問い合わせ」（form variant 相当）を表示するなど、null フォールバックを呼び出し側で実装する。
 */
export function useABVariant(testId: string): string | null {
  const [variant, setVariant] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const name = getCookieName(testId);
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    setVariant(match?.[1] ?? null);
  }, [testId]);

  return variant;
}

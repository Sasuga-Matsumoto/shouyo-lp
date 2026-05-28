'use client';

import { useEffect, useState } from 'react';
import CalendarBookingClient, { type ServiceKey } from './CalendarBookingClient';

interface Prefill {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const STORAGE_KEY = 'plex_calendar_prefill';

export interface CalendarEmbedProps {
  /**
   * サービスキー。各LPで該当するキーを指定する。
   *  - shataku  : PLEX福利厚生社宅
   *  - shouyo   : PLEX社保最適化
   *  - ryohi    : PLEX出張旅費制度
   *  - marunage : PLEX丸投げ節税
   * 未指定なら GAS 側の DEFAULT (shataku) が使われる。
   */
  service?: ServiceKey;
}

/**
 * サンクスページ等への埋め込み用 wrapper。
 * sessionStorage から直前のフォーム送信内容を読み取り、プリフィルした上で
 * CalendarBookingClient を表示する。
 */
export default function CalendarEmbed({ service }: CalendarEmbedProps = {}) {
  const [prefill, setPrefill] = useState<Prefill>({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPrefill({
          name: String(parsed.name || ''),
          email: String(parsed.email || ''),
          phone: String(parsed.phone || ''),
          company: String(parsed.company || ''),
        });
      }
    } catch {
      // sessionStorage 読み取り失敗時はプリフィルなしで表示
    }
    setHydrated(true);
  }, []);

  // モバイルブラウザがプリフィル済みフォーム入力欄に自動スクロールする挙動を打ち消す。
  // サンクスページのお礼メッセージ → カレンダー の順で見せたいため、
  // CalendarBookingClient マウント後にページ最上部に戻す。
  useEffect(() => {
    if (!hydrated) return;
    if (!(prefill.name || prefill.email || prefill.phone || prefill.company)) return;
    // ブラウザの自動スクロールが起きた後に上書きするため、requestAnimationFrame で次フレームに実行
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [hydrated, prefill]);

  // SSR / 初回レンダリング時は state がまだセットされていないため、
  // sessionStorage 読み取り後にマウントする（フォームの「制御されたインプット」を
  // 後から書き換えるとフォーカス挙動などが崩れるため）
  if (!hydrated) {
    return null;
  }

  return (
    <CalendarBookingClient
      initialName={prefill.name}
      initialEmail={prefill.email}
      initialPhone={prefill.phone}
      initialCompany={prefill.company}
      hideBenchmark
      service={service}
    />
  );
}

/**
 * フォーム送信時にプリフィル用のデータを sessionStorage に保存する。
 * ContactForm / DownloadForm の handleSubmit から呼ぶ。
 */
export function saveCalendarPrefill(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
}) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
      }),
    );
  } catch {
    // ignore — プリフィル失敗時は手動入力になるだけで実害なし
  }
}

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './calendar.css';

/** GAS 側 SERVICES マップで定義しているサービスキー */
export type ServiceKey = 'shataku' | 'shouyo' | 'ryohi' | 'marunage';

export interface CalendarBookingClientProps {
  /** 氏名のプリフィル（フォーム送信元から渡す） */
  initialName?: string;
  /** メールアドレスのプリフィル */
  initialEmail?: string;
  /** 電話番号のプリフィル */
  initialPhone?: string;
  /** 会社名のプリフィル */
  initialCompany?: string;
  /** ベンチマーク UI（モード切替・速度表示）を隠すか。本番埋め込みでは true */
  hideBenchmark?: boolean;
  /**
   * サービス種別。GAS 側で予定タイトル / スプシ転記先 / Slack ルート /
   * メール件名・本文 / サービス資料URL の出し分けに使われる。
   * 未指定なら GAS 側の DEFAULT_SERVICE_KEY (shataku) が使われる。
   */
  service?: ServiceKey;
}

type Slot = {
  start: string;  // ISO
  end: string;    // ISO
  date: string;   // YYYY-MM-DD (JST)
  time: string;   // HH:MM (JST)
};

type Mode = 'realtime' | 'cached';

type BenchInfo = {
  fetchMs: number;
  serverMs: number;
  mode: string;
  cacheStatus?: string;
  generatedAt?: string;
  computedAt?: string;
};

type BookResult =
  | { success: true; meetUrl?: string; slotStart: string; slotEnd: string; eventId: string }
  | { success: false; error: string; field?: string };

const GAS_URL = process.env.NEXT_PUBLIC_CALENDAR_GAS_URL || '';
const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const DISPLAY_DAYS_OPTIONS = [1, 3, 5] as const;
type DisplayDays = (typeof DISPLAY_DAYS_OPTIONS)[number];
const DEFAULT_DISPLAY_DAYS: DisplayDays = 5;
const MAX_LOOKAHEAD_DAYS = 60;

function pad2(n: number) {
  return n < 10 ? '0' + n : String(n);
}
function formatYmd(d: Date): string {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}
function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function isWeekday(d: Date): boolean {
  const dow = d.getDay();
  return dow !== 0 && dow !== 6;
}
/** 引数が平日ならそのまま、土日なら次の月曜（最短の平日）を返す */
function toNextWeekday(d: Date): Date {
  const c = startOfDay(d);
  while (!isWeekday(c)) c.setDate(c.getDate() + 1);
  return c;
}
/** N平日後の日付（土日をスキップしてカウント）。N=0 のときは自身を平日に丸める */
function addWeekdays(d: Date, n: number): Date {
  const c = startOfDay(d);
  if (n === 0) return toNextWeekday(c);
  const step = n > 0 ? 1 : -1;
  let remaining = Math.abs(n);
  while (remaining > 0) {
    c.setDate(c.getDate() + step);
    if (isWeekday(c)) remaining--;
  }
  return c;
}
function formatTimeJP(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const mm = pad2(m);
  if (h < 12) return `午前${h}:${mm}`;
  if (h === 12) return `午後12:${mm}`;
  return `午後${h - 12}:${mm}`;
}
function formatDateJP(ymd: string): string {
  const [y, mo, d] = ymd.split('-').map(Number);
  const dt = new Date(y, mo - 1, d);
  return `${mo}月${d}日（${DAY_LABELS[dt.getDay()]}）`;
}

export default function CalendarBookingClient({
  initialName = '',
  initialEmail = '',
  initialPhone = '',
  initialCompany = '',
  hideBenchmark = false,
  service,
}: CalendarBookingClientProps = {}) {
  const [mode, setMode] = useState<Mode>('cached');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bench, setBench] = useState<BenchInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 週ビュー：起点日（最短で空き枠のある日）と表示日数（1/3/5、土日除く）
  // 初期値は仮で「次の平日」。スロット取得後に「最短で空き枠のある日」に snap される。
  const [weekStart, setWeekStart] = useState<Date>(() => toNextWeekday(new Date()));
  const [displayDays, setDisplayDays] = useState<DisplayDays>(DEFAULT_DISPLAY_DAYS);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const earliestInitializedRef = useRef(false);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [company, setCompany] = useState(initialCompany);

  const [submitting, setSubmitting] = useState(false);
  const [bookResult, setBookResult] = useState<BookResult | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const fetchSlots = useCallback(async (m: Mode) => {
    setLoading(true);
    setLoadError(null);
    const t0 = performance.now();
    try {
      // realtime: GAS Web App 直叩き（比較用ベンチ）
      // cached:   Vercel Edge Cache 経由のプロキシ (/api/slots) → 高速
      let url: string;
      if (m === 'realtime') {
        if (!GAS_URL) {
          setLoadError('NEXT_PUBLIC_CALENDAR_GAS_URL が設定されていません');
          setLoading(false);
          return;
        }
        url = `${GAS_URL}?action=slots`;
      } else {
        url = '/api/slots';
      }
      const res = await fetch(url, { method: 'GET' });
      const json = await res.json();
      const fetchMs = Math.round(performance.now() - t0);
      if (!Array.isArray(json.slots)) {
        setLoadError(json.error ? String(json.error) : '空き枠の取得に失敗しました');
        setSlots([]);
        setBench(null);
      } else {
        setSlots(json.slots);
        setBench({
          fetchMs,
          serverMs: typeof json.elapsedMs === 'number' ? json.elapsedMs : 0,
          mode: json.mode || m,
          cacheStatus: json.cacheStatus,
          generatedAt: json.generatedAt,
          computedAt: json.computedAt,
        });
      }
    } catch (err) {
      setLoadError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(mode);
  }, [mode, fetchSlots]);

  // 選択時にフォームへスクロール
  useEffect(() => {
    if (selectedSlot && formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight - 100 || rect.bottom < 100) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedSlot]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [slots]);

  // 日付+時刻 → スロット の高速ルックアップ
  const slotByDateTime = useMemo(() => {
    const map: Record<string, Slot> = {};
    slots.forEach((s) => {
      map[`${s.date}_${s.time}`] = s;
    });
    return map;
  }, [slots]);

  const weekDays = useMemo(() => {
    // weekStart から土日をスキップして N 平日を生成
    const days: Date[] = [];
    let cur = toNextWeekday(weekStart);
    for (let i = 0; i < displayDays; i++) {
      if (!isWeekday(cur)) cur = toNextWeekday(cur);
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [weekStart, displayDays]);

  // 表示週で「いずれかの日に空きがある時刻」だけを行として表示（カレンダー的に時刻軸を揃える）
  const visibleTimes = useMemo(() => {
    const set = new Set<string>();
    weekDays.forEach((d) => {
      (slotsByDate[formatYmd(d)] || []).forEach((s) => set.add(s.time));
    });
    return Array.from(set).sort();  // "HH:MM" 文字列ソートで時刻順
  }, [weekDays, slotsByDate]);

  // 「最短日」= 取得済みスロットの最初の日付（=今日から最短で空き枠が存在する日）。
  //  - スロットは GAS computeAvailableSlots_ で日付昇順に生成されるため slots[0] が最早
  //  - 24時間以内の枠は除外済み（GAS側の minStart）。BIZ_DAYS以外の日は slot 自体無い
  //  - スロット未取得時のフォールバックは「今日 or 次の月曜」（土日避け）
  const earliestStart = useMemo(() => {
    if (slots.length > 0 && slots[0]?.start) {
      return startOfDay(new Date(slots[0].start));
    }
    return toNextWeekday(new Date());
  }, [slots]);

  // 初回スロット取得時に weekStart を最短日へ snap
  useEffect(() => {
    if (!earliestInitializedRef.current && slots.length > 0) {
      setWeekStart(earliestStart);
      earliestInitializedRef.current = true;
    }
  }, [slots, earliestStart]);
  // 表示可能な最大 weekStart（60日先までの平日に収まる範囲）
  const maxWeekStart = useMemo(() => {
    const limit = addDays(new Date(), MAX_LOOKAHEAD_DAYS - 1);
    // limit から逆向きに (displayDays - 1) 平日戻る → 最後の weekStart
    return addWeekdays(limit, -(displayDays - 1));
  }, [displayDays]);

  const canGoPrev = weekStart.getTime() > earliestStart.getTime();
  const canGoNext = weekStart.getTime() < maxWeekStart.getTime();
  const isAtEarliest = weekStart.getTime() === earliestStart.getTime();

  const goPrev = () => {
    const d = addWeekdays(weekStart, -displayDays);
    setWeekStart(d.getTime() < earliestStart.getTime() ? earliestStart : d);
  };
  const goNext = () => {
    const d = addWeekdays(weekStart, displayDays);
    setWeekStart(d.getTime() > maxWeekStart.getTime() ? maxWeekStart : d);
  };
  const goEarliest = () => {
    setWeekStart(earliestStart);
  };
  const handlePickRange = (n: DisplayDays) => {
    setDisplayDays(n);
    setWeekStart(earliestStart);
    setPickerOpen(false);
  };

  // ピッカーの外側クリックで閉じる
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);


  const weekRangeLabel = (() => {
    const a = weekDays[0];
    const b = weekDays[weekDays.length - 1];
    if (!a || !b) return '';
    if (displayDays === 1) {
      return `${a.getFullYear()}年${a.getMonth() + 1}月${a.getDate()}日（${DAY_LABELS[a.getDay()]}）`;
    }
    if (a.getMonth() === b.getMonth()) {
      return `${a.getFullYear()}年${a.getMonth() + 1}月${a.getDate()}日 〜 ${b.getDate()}日`;
    }
    return `${a.getMonth() + 1}/${a.getDate()} 〜 ${b.getMonth() + 1}/${b.getDate()}`;
  })();

  const canSubmit =
    !!selectedSlot &&
    !!name.trim() &&
    !!email.trim() &&
    !!phone.trim() &&
    !!company.trim() &&
    !submitting;

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (!name.trim() || !email.trim() || !phone.trim() || !company.trim()) return;
    setSubmitting(true);
    setBookResult(null);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'book',
          slot: selectedSlot.start,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          ...(service ? { service } : {}),
        }),
      });
      const json = (await res.json()) as BookResult;
      setBookResult(json);
      if (json.success) fetchSlots(mode);
    } catch (err) {
      setBookResult({ success: false, error: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // 予約成功画面
  if (bookResult && bookResult.success) {
    const startDate = new Date(bookResult.slotStart);
    const endDate = new Date(bookResult.slotEnd);
    return (
      <section className="cal-section">
        <div className="cal-inner cal-inner--narrow">
          <div className="cal-success-card">
            <div className="cal-success-icon">✓</div>
            <h2>商談予約を承りました</h2>
            <div className="cal-success-time">
              {startDate.toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' 〜 '}
              {endDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="cal-success-note">
              ご入力いただいたメールアドレスに確認メールをお送りしました。
              <br />
              Google Meet の URL も確認メールに記載しています。
              <br />
              前日にもリマインドメールをお送りします。
            </p>
          </div>
        </div>
      </section>
    );
  }

  const earliestYmd = formatYmd(earliestStart);

  return (
    <section className="cal-section">
      <div className="cal-inner">
        {/* ベンチマークパネル（テストページのみ） */}
        {!hideBenchmark && (
          <div className="cal-bench">
            <div className="cal-bench-row">
              <div className="cal-bench-toggle" role="tablist">
                <button
                  role="tab"
                  aria-selected={mode === 'realtime'}
                  className={mode === 'realtime' ? 'active' : ''}
                  onClick={() => setMode('realtime')}
                  disabled={loading}
                >
                  リアルタイム
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'cached'}
                  className={mode === 'cached' ? 'active' : ''}
                  onClick={() => setMode('cached')}
                  disabled={loading}
                >
                  事前計算
                </button>
              </div>
              <button
                type="button"
                onClick={() => fetchSlots(mode)}
                disabled={loading}
                className="cal-bench-reload"
              >
                ↻
              </button>
            </div>
            <div className="cal-bench-stats">
              {loading ? (
                <span className="cal-bench-loading">読み込み中…</span>
              ) : bench ? (
                <>
                  <span>fetch <b>{bench.fetchMs}ms</b></span>
                  <span>server <b>{bench.serverMs}ms</b></span>
                  <span>
                    mode <b>{bench.mode}{bench.cacheStatus ? `(${bench.cacheStatus})` : ''}</b>
                  </span>
                </>
              ) : null}
            </div>
          </div>
        )}

        {loadError && <div className="cal-error-banner">エラー: {loadError}</div>}

        {/* 週ビュー */}
        <div className="cal-week-block">
          <div className="cal-sticky-head">
            <div className="cal-week-top">
              <div className="cal-week-meta">
                <div className="cal-week-range">{weekRangeLabel}</div>
                <div className="cal-tz">(GMT+09:00) 日本標準時</div>
              </div>
            <div className="cal-week-tools">
              <div className="cal-nav-group" role="group" aria-label="日付ナビゲーション">
                <button
                  type="button"
                  className="cal-nav-arrow"
                  onClick={goPrev}
                  disabled={!canGoPrev || loading}
                  aria-label="前へ"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="cal-today-btn"
                  onClick={goEarliest}
                  disabled={isAtEarliest || loading}
                  aria-label="最短日に戻る"
                >
                  最短日
                </button>
                <button
                  type="button"
                  className="cal-nav-arrow"
                  onClick={goNext}
                  disabled={!canGoNext || loading}
                  aria-label="次へ"
                >
                  ›
                </button>
              </div>
              <div className="cal-picker-wrap" ref={pickerRef}>
                <button
                  type="button"
                  className={`cal-picker-toggle ${pickerOpen ? 'open' : ''}`}
                  onClick={() => setPickerOpen((o) => !o)}
                  aria-label="表示日数の切替"
                  aria-expanded={pickerOpen}
                  aria-haspopup="menu"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <rect x="2" y="2" width="2.4" height="12" rx="0.6" />
                    <rect x="6.8" y="2" width="2.4" height="12" rx="0.6" />
                    <rect x="11.6" y="2" width="2.4" height="12" rx="0.6" />
                  </svg>
                </button>
                {pickerOpen && (
                  <div className="cal-picker-menu" role="menu">
                    {DISPLAY_DAYS_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="menuitemradio"
                        aria-checked={displayDays === n}
                        className={displayDays === n ? 'sel' : ''}
                        onClick={() => handlePickRange(n)}
                      >
                        {n}日表示
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 日付ヘッダーバー: sticky で常時表示。画面幅にフィット */}
            <div className="cal-headers-bar">
              <div className="cal-headers-inner" data-days={displayDays}>
                {weekDays.map((d) => {
                  const ymd = formatYmd(d);
                  const isEarliest = ymd === earliestYmd;
                  const dow = d.getDay();
                  return (
                    <div key={ymd} className="cal-day-header">
                      <div
                        className={[
                          'cal-dow',
                          dow === 0 ? 'sun' : '',
                          dow === 6 ? 'sat' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {DAY_LABELS[dow]}
                      </div>
                      <div className={`cal-date ${isEarliest ? 'today' : ''}`}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>{/* /cal-sticky-head */}

          {/* 時刻グリッド: 画面幅にフィット（横スクロールなし） */}
          <div className="cal-times-wrap">
            <div className="cal-times-grid" data-days={displayDays}>
              {weekDays.map((d) => {
                const ymd = formatYmd(d);
                return (
                  <div key={ymd} className="cal-times-col">
                    {visibleTimes.map((time) => {
                      const slot = slotByDateTime[`${ymd}_${time}`];
                      if (!slot) {
                        return (
                          <div key={time} className="cal-empty" aria-hidden="true">
                            ─
                          </div>
                        );
                      }
                      const isSelected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`cal-time-pill ${isSelected ? 'sel' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span className="cal-time-short">{slot.time}</span>
                          <span className="cal-time-full">{formatTimeJP(slot.time)}</span>
                        </button>
                      );
                    })}
                    {visibleTimes.length === 0 && (
                      <div className="cal-empty" aria-hidden="true">
                        ─
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 選択中バナー */}
        {selectedSlot && (
          <div className="cal-selected-banner">
            <span className="cal-selected-label">選択中</span>
            <span className="cal-selected-time">
              {formatDateJP(selectedSlot.date)}　{formatTimeJP(selectedSlot.time)} 〜
            </span>
          </div>
        )}

        {/* フォーム */}
        <div ref={formRef} className="cal-form">
          <h2 className="cal-form-title">お客様情報を入力</h2>
          <div className="cal-field">
            <label>
              氏名 <span className="req">必須</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              autoComplete="name"
            />
          </div>
          <div className="cal-field">
            <label>
              メールアドレス <span className="req">必須</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yamada@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <div className="cal-field">
            <label>
              電話番号 <span className="req">必須</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0312345678"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <div className="cal-field">
            <label>
              会社名 <span className="req">必須</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="株式会社サンプル"
              autoComplete="organization"
            />
          </div>

          <button
            type="button"
            className="cal-submit"
            disabled={!canSubmit}
            onClick={handleBook}
          >
            {submitting
              ? '送信中…'
              : !selectedSlot
              ? '日時を選択してください'
              : `${formatDateJP(selectedSlot.date)} ${formatTimeJP(selectedSlot.time)} で予約する`}
          </button>

          {bookResult && !bookResult.success && (
            <div className="cal-error-banner">
              予約に失敗しました: {bookResult.error}
              {bookResult.field ? `（${bookResult.field}）` : ''}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

# LP イベントカレンダー (shouyo-lp / PLEX社保最適化)

> このファイルはLPに対する変更履歴を記録し、GA4データ分析時に「いつ何が変わったか」を把握するために使用する。
> Claudeが分析を行う際は、このファイルを参照して変更前後の比較を正しく行うこと。

## 技術スタック

- **フレームワーク**: Next.js App Router + Vercel
- **トラッキング**: GTM (`GTM-WZCDB4TD` / `GTM-NLLT258N`) + GA4 (Property: `531052063`)
- **フォーム送信**: GAS (Google Apps Script)
- **A/Bテスト**: Cookie ベースのサーバーサイド振り分け (`src/proxy.ts`)

---

## 記録フォーマット

```
### YYYY-MM-DD: [変更タイトル]
- **種別**: 新規 / コンテンツ変更 / 構造変更 / デザイン変更 / トラッキング / フォーム変更 / バグ修正 / 基盤変更
- **変更内容**: 何をどう変えたか
- **意図**: なぜその変更をしたか
- **影響範囲**: どのページ・セクションに影響があるか
- **関連コミット**: git commit hash / PR
- **分析時の注意**: この変更がデータにどう影響しうるか
```

---

## 変更履歴

### 2026-05-28: 新規A/Bテスト開始（contact-direct-calendar）★重要★
- **種別**: 基盤変更 / コンテンツ変更 / 計測強化
- **変更内容**:
  - **テスト: `contact-direct-calendar`** — お問い合わせ動線を完全A/Bテスト化
    - control (form): Header/Footer/FinalCTA「お問い合わせ」、/contact は既存フォーム → /thanks-contact 経由でカレンダー予約
    - variant (calendar): Header/Footer/FinalCTA「無料で相談する」、ヒーローに追加「無料で相談する」CTA、/contact 直接カレンダー予約UI
  - calendar variant の /contact: page-hero に案内文「下記からご都合の良いお日にちをお選びください」＋ 視線誘導の下向き矢印（バウンスアニメ）
  - **新規GA4イベント `calendar_booking_complete`**: CalendarBookingClient の予約成功時に発火（`service: 'shouyo'` / ab_test_variant / form_type / cta_location 付与）。両variant共通の真のCV指標
  - paths: ['/'] で全ページCookie発行 → セッション初動から CTA テキスト割当
  - 関連実装: `ab-tests.ts`, `use-ab-variant.ts`(新規), `ContactABRouter.tsx`(新規), `CalendarBookingClient.tsx`, `Header.tsx`, `Footer.tsx`, `FinalCtaSection.tsx`, `HeroSection.tsx`, `app/contact/page.tsx`, `globals.css`
  - 関連PR: shouyo-lp #1
- **意図**:
  - お問い合わせフォーム入力ステップが商談予約への摩擦になっていないか検証
  - calendar variant 側は「相談」表現でハードルを下げ、視線誘導で「次のアクションが明示」される設計に
  - フォーム→thanks経由予約 vs 直接予約、どちらが商談化率高いかを真のCV指標で比較
- **影響範囲**: LP全体（CTAテキスト・hero・/contact・page-hero）、計測（calendar_booking_complete 新規）
- **分析時の注意**:
  - 比較指標は `calendar_booking_complete 件数 ÷ /contact PV` で揃える（両variantで同イベント発火）
  - GTMタグ `GA4 - Calendar Booking Complete` + `DLV - service` + `CE - calendar_booking_complete` トリガーは shataku-lp と共通設定（GTMコンテナ単位で設定済）

---

## 変更記録ルール

1. LPに変更を加えるたびに、このファイルに上記フォーマットで追記する
2. 日付は変更をデプロイした日（コミット日ではなく本番反映日）を使用
3. A/Bテストを実施する場合は、テスト開始日・終了日・バリアント内容・結果を記録
4. GA4分析時は、変更日をセグメント境界として使用し、変更前後を比較する

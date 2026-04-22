# GTM / GA4 計測セットアップガイド

**対象:** ファネル計測（CTAクリック・フォーム送信・CV・日程調整）+ A/Bテスト

---

## 0. GTMコンテナの構成

本プロジェクトでは GTM コンテナを2つ並行設置しています。

| コンテナ | 用途 | 管理者 |
|----------|------|--------|
| `GTM-WZCDB4TD` | 既存の計測（GA4ページビュー等） | 社内共有 |
| `GTM-NLLT258N` | ファネル計測 + A/Bテスト（本ガイドの設定対象） | 自身で管理 |

> **TODO:** `GTM-NLLT258N` を新規作成したGTMコンテナIDに置き換えてください。対象ファイル: `src/app/layout.tsx`

### layout.tsx へのコンテナ追加

`src/app/layout.tsx` の `<head>` 内に、既存の GTM スニペットの**下**に新コンテナを追加済みです:

```tsx
{/* 既存のGTMコンテナ（変更しない） */}
<Script id="gtm" strategy="afterInteractive">{`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-WZCDB4TD');
`}</Script>

{/* ファネル計測 + A/Bテスト用GTMコンテナ */}
<Script id="gtm-ab" strategy="afterInteractive">{`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NLLT258N');
`}</Script>
```

> **注意:** 2つのコンテナは同じ `dataLayer` を共有します。ファネル計測・A/Bテスト用のタグは新コンテナにのみ設定するため、イベントが二重に送信されることはありません。

---

## 前提: dataLayer イベント仕様

サイト側から以下の5種類のイベントが `window.dataLayer` に送信されます。

### 1. CTAクリック（LP上のボタンクリック時）

```javascript
window.dataLayer.push({
  event: 'cta_click',
  form_type: 'download',       // または 'contact'
  cta_location: 'hero',        // hero / merit / pain_solution / service_detail / simulator / final_cta / header / header_mobile
});
```

### 2. フォーム送信完了

```javascript
window.dataLayer.push({
  event: 'form_submit',
  form_type: 'download',       // または 'contact'
  ab_test_variant: 'control',  // A/Bテスト実施中のみ。cookieから取得
});
```

### 3. サンクスページ表示（CV）

```javascript
window.dataLayer.push({
  event: 'conversion_page_view',
  form_type: 'download',       // または 'contact'
});
```

> **重要:** このイベントはA/Bテストの有無に関わらず常にサンクスページで発火します。
> SPA遷移（`router.push`）でサンクスページに到達するため、GTMの "All Pages" トリガーが発火しません。
> `conversion_page_view` がサンクスページでGA4セッションを維持する唯一の手段です。
> **このイベントを削除するとGA4のCV帰属が壊れます。**

### 4. 日程調整クリック（サンクスページ）

```javascript
window.dataLayer.push({
  event: 'schedule_click',
  form_type: 'download',       // または 'contact'
});
```

### 5. A/Bテスト インプレッション（テスト対象ページ表示時）

```javascript
window.dataLayer.push({
  event: 'ab_test_impression',
  ab_test_name: 'hero-headline',  // テストID
  ab_test_variant: 'control',     // または 'variant'
});
```

> A/Bテスト追加時はコード側で `ABTestImpression` コンポーネントを対象ページに配置するだけでOK。
> GTM側の変更は不要です（汎用トリガー `CE - ab_test_impression` が自動で発火します）。

### 6. フォーム開始（フォームフィールドへの最初の focus）

```javascript
window.dataLayer.push({
  event: 'custom_form_start',
  form_type: 'download',       // または 'contact'
  ab_test_variant: 'control',  // A/Bテスト実施中のみ。cookieから取得
});
```

> 2026-04-06追加。GA4拡張計測の `form_start` を置き換えるカスタムイベント。variant属性付きでA/Bテスト分析に対応。

### ファネル全体像

```
LP訪問 (page_view + ab_test_impression)
    ↓
CTAクリック (cta_click)
    ↓
フォーム開始 (custom_form_start)  ← 2026-04-06追加
    ↓
フォーム送信 (form_submit)
    ↓
サンクスページ表示 (conversion_page_view)  ← A/Bテストに依存しない常設イベント
    ↓
日程調整クリック (schedule_click)
```

---

## 1. GA4 カスタムディメンションの作成

GA4 側でイベントパラメータをレポートやエクスプロレーションで使えるようにするため、カスタムディメンションを登録します。

### 手順

1. [GA4 管理画面](https://analytics.google.com/) にログイン
2. 左下の **歯車アイコン（管理）** をクリック
3. プロパティ列の **カスタム定義** をクリック
4. **カスタムディメンション** タブを選択し、**「カスタムディメンションを作成」** をクリック

### ディメンション一覧

| ディメンション名 | 範囲 | 説明 | イベントパラメータ |
|---|---|---|---|
| `AB Test Name` | イベント | A/Bテストの識別名 | `ab_test_name` |
| `AB Test Variant` | イベント | A/Bテストのバリアント | `ab_test_variant` |
| `Form Type` | イベント | フォーム種別（contact / download） | `form_type` |
| `CTA Location` | イベント | CTAボタンの配置場所 | `cta_location` |

> **注意:** カスタムディメンションが GA4 レポートに反映されるまで最大24〜48時間かかることがあります。DebugView ではすぐに確認できます。

### キーイベントの設定（任意）

`conversion_page_view` をGA4のキーイベントとして登録すると、標準レポート（集客レポート等）で「コンバージョン」として表示されます。

1. GA4管理画面 → 左メニュー「管理」→「データの表示」→「キーイベント」
2. 「新しいキーイベント」をクリック
3. イベント名: `conversion_page_view` を入力
4. 「保存」

---

## 2. GTM コンテナ内の設定

以下の設定はすべて **ファネル計測 + A/Bテスト用コンテナ**（`GTM-NLLT258N`）で行います。

### 2-1. 変数（Variables）の作成

GTM で dataLayer から値を取得するための変数を4つ作成します。

| 変数名 | 変数タイプ | データレイヤーの変数名 |
|---|---|---|
| `DLV - ab_test_name` | データレイヤーの変数 | `ab_test_name` |
| `DLV - ab_test_variant` | データレイヤーの変数 | `ab_test_variant` |
| `DLV - form_type` | データレイヤーの変数 | `form_type` |
| `DLV - cta_location` | データレイヤーの変数 | `cta_location` |

### 2-2. トリガー（Triggers）の作成

dataLayer のイベントを検知するトリガーを5つ作成します。すべて**カスタムイベント**タイプです。

| トリガー名 | イベント名 | 発生場所 |
|---|---|---|
| `CE - ab_test_impression` | `ab_test_impression` | すべてのカスタムイベント |
| `CE - cta_click` | `cta_click` | すべてのカスタムイベント |
| `CE - form_submit` | `form_submit` | すべてのカスタムイベント |
| `CE - conversion_page_view` | `conversion_page_view` | すべてのカスタムイベント |
| `CE - schedule_click` | `schedule_click` | すべてのカスタムイベント |
| `CE - custom_form_start` | `custom_form_start` | すべてのカスタムイベント |

### 2-3. Google タグの作成

新コンテナにはまだ GA4 との接続がないため、Google タグを作成します。

1. 左メニューの **「タグ」** をクリック → **「新規」**
2. タグ名を `Google Tag - GA4` に設定
3. **タグの設定** → タグタイプ **「Google タグ」** を選択
4. **タグ ID** に GA4 の測定 ID（`G-2VP83V12T5`）を入力
5. **トリガー** → **「All Pages」** を選択
6. **「保存」**

> **注意:** 既存コンテナ（`GTM-WZCDB4TD`）で既にGA4のページビュー計測をしている場合、新コンテナでの Google タグは **不要** です（ページビューが二重計測されるため）。その場合は、手順2-4のGA4イベントタグで測定IDを直接指定してください。

### 2-4. タグ（Tags）の作成

GA4 にイベントを送信するタグを5つ作成します。
すべてのタグに `ab_test_variant` と `cta_location` を含めることで、ファネル全段でA/Bテスト分析が可能です。
A/Bテスト非実施時は値が空になりますが、GA4への悪影響はありません。

#### タグ 1: GA4 - AB Test Impression

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `ab_test_impression` |
| トリガー | `CE - ab_test_impression` |

| パラメータ名 | 値 |
|---|---|
| `ab_test_name` | `{{DLV - ab_test_name}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |
| `form_type` | `{{DLV - form_type}}` |

#### タグ 2: GA4 - CTA Click

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `cta_click` |
| トリガー | `CE - cta_click` |

| パラメータ名 | 値 |
|---|---|
| `form_type` | `{{DLV - form_type}}` |
| `cta_location` | `{{DLV - cta_location}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |

#### タグ 3: GA4 - Form Submit

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `form_submit` |
| トリガー | `CE - form_submit` |

| パラメータ名 | 値 |
|---|---|
| `form_type` | `{{DLV - form_type}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |
| `cta_location` | `{{DLV - cta_location}}` |

#### タグ 4: GA4 - Conversion Page View

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `conversion_page_view` |
| トリガー | `CE - conversion_page_view` |

| パラメータ名 | 値 |
|---|---|
| `form_type` | `{{DLV - form_type}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |
| `cta_location` | `{{DLV - cta_location}}` |

#### タグ 5: GA4 - Schedule Click

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `schedule_click` |
| トリガー | `CE - schedule_click` |

| パラメータ名 | 値 |
|---|---|
| `form_type` | `{{DLV - form_type}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |
| `cta_location` | `{{DLV - cta_location}}` |

#### タグ 6: GA4 - Custom Form Start

| 項目 | 設定値 |
|---|---|
| タグタイプ | Google アナリティクス: GA4 イベント |
| 測定ID / Googleタグ | Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `custom_form_start` |
| トリガー | `CE - custom_form_start` |

| パラメータ名 | 値 |
|---|---|
| `form_type` | `{{DLV - form_type}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |
| `cta_location` | `{{DLV - cta_location}}` |

---

## 3. 設定確認チェックリスト

### GTM コンテナ内の構成一覧

| 種別 | 名前 | 設定内容 |
|---|---|---|
| 変数 | `DLV - ab_test_name` | データレイヤー変数: `ab_test_name` |
| 変数 | `DLV - ab_test_variant` | データレイヤー変数: `ab_test_variant` |
| 変数 | `DLV - form_type` | データレイヤー変数: `form_type` |
| 変数 | `DLV - cta_location` | データレイヤー変数: `cta_location` |
| トリガー | `CE - ab_test_impression` | カスタムイベント: `ab_test_impression` |
| トリガー | `CE - cta_click` | カスタムイベント: `cta_click` |
| トリガー | `CE - form_submit` | カスタムイベント: `form_submit` |
| トリガー | `CE - conversion_page_view` | カスタムイベント: `conversion_page_view` |
| トリガー | `CE - schedule_click` | カスタムイベント: `schedule_click` |
| タグ | `Google Tag - GA4` | Google タグ: 測定ID（※既存で計測済みなら不要） |
| タグ | `GA4 - AB Test Impression` | GA4イベント（パラメータ: ab_test_name, ab_test_variant, form_type）→ CE - ab_test_impression |
| タグ | `GA4 - CTA Click` | GA4イベント（パラメータ: form_type, cta_location, ab_test_variant）→ CE - cta_click |
| タグ | `GA4 - Form Submit` | GA4イベント（パラメータ: form_type, ab_test_variant, cta_location）→ CE - form_submit |
| タグ | `GA4 - Conversion Page View` | GA4イベント（パラメータ: form_type, ab_test_variant, cta_location）→ CE - conversion_page_view |
| タグ | `GA4 - Schedule Click` | GA4イベント（パラメータ: form_type, ab_test_variant, cta_location）→ CE - schedule_click |

---

## 4. 検証手順

### 4-1. GTM プレビューモードでの確認

1. GTM 管理画面右上の **「プレビュー」** をクリック
2. サイトの URL を入力して **「Connect」** をクリック
3. 別タブでサイトが開き、GTM Tag Assistant が接続される

#### A/Bテスト インプレッション確認

4. LP ページが表示されたら（A/Bテスト実施中の場合）:
5. Tag Assistant の左パネルに **`ab_test_impression`** イベントが表示されることを確認
6. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - AB Test Impression`** が表示されることを確認
7. **「Variables」** タブで `DLV - ab_test_name` と `DLV - ab_test_variant` の値が正しいことを確認

#### CTAクリック確認

8. LP ページの CTA ボタン（「資料ダウンロード」「お問い合わせ」等）をクリック
9. Tag Assistant の左パネルに **`cta_click`** イベントが表示されることを確認
10. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - CTA Click`** が表示されることを確認
11. **「Variables」** タブを開き、以下の値が正しいことを確認:
   - `DLV - form_type` = `download` または `contact`
   - `DLV - cta_location` = `hero` / `merit` / `header` 等

#### フォーム送信確認

12. フォームページ（`/contact/` または `/download/`）でフォームを入力して送信
13. Tag Assistant の左パネルに **`form_submit`** イベントが表示されることを確認
14. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - Form Submit`** が表示されることを確認

#### サンクスページ表示確認

フォーム送信後、サンクスページに遷移したら:

15. Tag Assistant の左パネルに **`conversion_page_view`** イベントが表示されることを確認
16. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - Conversion Page View`** が表示されることを確認
17. **「Variables」** タブで `DLV - form_type` の値が正しいことを確認

#### 日程調整クリック確認

18. サンクスページの CTA ボタン（「空き日程を見る」等）をクリック
19. Tag Assistant の左パネルに **`schedule_click`** イベントが表示されることを確認
20. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - Schedule Click`** が表示されることを確認

### 4-2. GA4 DebugView での確認

1. GA4 管理画面を開く
2. 左メニューの **管理** → **データの表示** → **DebugView** をクリック
3. GTM プレビューモードで接続したブラウザからのイベントが表示される
4. 以下を確認:

| 確認項目 | 期待値 |
|---|---|
| `ab_test_impression` イベント | LP表示時（A/Bテスト実施中のみ） |
| `cta_click` イベント | LP上のCTAクリック後 |
| `form_submit` イベント | フォーム送信後 |
| `conversion_page_view` イベント | サンクスページ表示時 |
| `schedule_click` イベント | カレンダーボタンクリック後 |
| 各イベントに `form_type` パラメータ | `download` or `contact` |

> **ヒント:** DebugView にイベントが表示されない場合は、ブラウザの広告ブロッカーを無効にしてください。Chrome の場合は GTM プレビューモードを使用すると自動的にデバッグモードが有効になります。

---

## 5. GTM の公開

検証が完了したら、GTM コンテナを公開します。

1. GTM 管理画面右上の **「送信」** をクリック
2. バージョン名に `v1 - ファネル計測 + A/Bテスト基盤` と入力
3. バージョンの説明に以下を記載:
   ```
   ファネル計測 + A/Bテスト基盤
   - ab_test_impression: A/Bテストインプレッション
   - cta_click: CTAクリック
   - form_submit: フォーム送信
   - conversion_page_view: サンクスページ表示（GA4セッション帰属維持のため必須）
   - schedule_click: 日程調整クリック
   - 全タグに ab_test_variant, cta_location パラメータを統一追加
   ```
4. **「公開」** をクリック

---

## 6. A/Bテストの運用

### 新しいA/Bテストを追加する場合

コード側のみの変更でGTM変更は不要です。

1. `src/lib/ab-tests.ts` にテスト定義を追加
2. `src/proxy.ts` の matcher に対象パスを追加（必要に応じて）
3. 対象コンポーネントを async サーバーコンポーネントに変換し、`cookies()` でバリアント読み取り
4. 対象ページに `ABTestImpression` コンポーネントを配置
5. 既存の `CE - ab_test_impression` トリガーが自動で発火

### A/Bテストを終了する場合

`ABTestImpression` コンポーネントを削除しても、`conversion_page_view` がサンクスページのGA4セッション追跡を維持するため、帰属が壊れることはありません。

### GA4 探索レポートで CVR を比較する

1. GA4 左メニューの **「探索」** → **「空白」** テンプレート
2. ディメンション: `AB Test Variant`、指標: `イベント数`
3. フィルタ: `AB Test Name` = テストID（例: `hero-headline`）
4. セグメントでイベント別（`ab_test_impression` / `form_submit`）に分け、バリアント別 CVR を算出

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| GTM プレビューでイベントが表示されない | ブラウザコンソールで `dataLayer` を確認。A/Bテスト用コンテナのプレビューを使っているか確認 |
| タグが「Tags Not Fired」になる | トリガーのイベント名のスペルミスを確認（大文字小文字も区別される） |
| GA4 DebugView に表示されない | 広告ブロッカーを無効化 / GTMプレビューモードを使用 |
| カスタムディメンションがレポートに出ない | 作成後24〜48時間待つ / イベントパラメータ名のスペルミスを確認 |
| バリアント値が `undefined` になる | dataLayer.push のタイミングを確認（GTM読み込み前に push されている可能性） |
| リアルタイムにイベントは出るが探索で出ない | データ処理に24〜48時間かかるため待つ |
| イベントが二重に送信される | 既存コンテナ（GTM-WZCDB4TD）に同名のタグがないか確認 |
| サンクスページの帰属が (not set) になる | `conversion_page_view` の ThanksPageView コンポーネントが削除されていないか確認。SPA遷移ではこのイベントがGA4セッション維持の唯一の手段 |

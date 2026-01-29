# 学習項目一覧画面 - 詳細設計

## 目的

- ユーザーが自身の学習項目（カード/トピック）を一覧で確認・検索・フィルタ・ソート・ページ移動できる画面を提供する。
- 学習進捗や復習優先度を把握し、学習を再開しやすくする。

## 前提

- ユーザーはログイン済みであること。
- バックエンドに学習項目を取得する API が存在する（下記参照）。

## 画面構成（上から下）

1. ヘッダー（共通）
2. 検索バー（フリーワード）
3. フィルタ行（タグ、カテゴリ、ステータス、難易度）
4. ソート / 表示切替（リスト/カード）
5. 一覧コンテナ（カード群またはテーブル）
   - 各項目カード（タイトル、要約、タグ、進捗 %, 最終学習日、次回学習推奨日、アクションボタン）
6. ページネーション / 無限スクロール制御
7. フッター（共通）

## 詳細 UI 要素

- 検索バー
  - プレースホルダ: 「タイトル・内容を検索」
  - エンターで検索、入力中に 500ms デバウンスして候補リクエストは送らない
- フィルタ
  - タグ: 複数選択可能（ドロップダウン＋チェックボックス）
  - カテゴリ: 単一選択または複数（要調整）
  - ステータス: 未着手 / 学習中 / 完了
  - 難易度: ★1〜★5
- ソート
  - ソートキー: 推奨（復習優先）・更新日・作成日・タイトル
  - 昇順/降順トグル
- 表示切替
  - リスト（行） / カード（グリッド）切替ボタン
- 各項目カード（要素）
  - 左: サムネイル（任意）
  - 中央: タイトル（強調）
  - 下部: 要約テキスト（最大2行で省略）
  - 右: バッジ（タグ）と進捗バー（％表示）
  - 操作: 開く（詳細へ）、学習を開始（クイック開始）、スター/お気に入り、メニュー（編集／削除）
- ページネーション
  - デフォルトはページネーション（1ページあたり 20 件）。設定で無限スクロールに切替可能。

## ユーザーフロー（代表ケース）

- 画面表示
  1. 画面ロード → 最初のページ（page=1, perPage=20）で API を呼ぶ
  2. レスポンスをレンダリング
- 検索／フィルタ変更
  1. 条件変更 → フロントで状態更新 → page を 1 にリセットして API 再取得
- 項目クリック
  1. 詳細画面へ遷移（React Router 等で `/items/:id`）
- クイック開始
  1. 「学習を開始」クリック → モーダル／別画面で学習セッションを開始する API を呼ぶ

## API 仕様（フロント向け）

- エンドポイント: `GET /api/learning-items`
- クエリパラメータ
  - `q` (string): 検索ワード
  - `tags` (string[] or csv): タグフィルタ
  - `category` (string)
  - `status` (string): `not_started|in_progress|completed`
  - `difficulty` (number)
  - `sort` (string): `recommended|updatedAt|createdAt|title`
  - `order` (string): `asc|desc`
  - `page` (number)
  - `perPage` (number)
- レスポンス (200)
  {
    "items": [
      {
        "id": "string",
        "title": "string",
        "summary": "string",
        "tags": ["string"],
        "progress": 0.0, // 0..100
        "lastStudiedAt": "ISO8601|null",
        "nextRecommendedAt": "ISO8601|null",
        "difficulty": 3,
        "thumbnailUrl": "string|null",
        "status": "not_started|in_progress|completed"
      }
    ],
    "meta": {
      "page": 1,
      "perPage": 20,
      "total": 123
    }
  }

## フロントデータモデル（状態管理）

- State shape (例: React + Context/Redux)
  - `query: string`
  - `filters: { tags: string[], category?: string, status?: string, difficulty?: number }`
  - `sort: { key: string, order: 'asc'|'desc' }`
  - `pagination: { page: number, perPage: number, total?: number }`
  - `items: LearningItem[]`
  - `loading: boolean`
  - `error?: string`

## UX/パフォーマンス設計

- API 呼び出しはキャンセル可能にする（古いリクエストを破棄）
- 検索は 500ms のデバウンスを適用
- リストは仮ローディングスケルトンを表示
- 画像は遅延読み込み（lazy）

## バリデーション・エラーハンドリング

- API エラー: 全体トースト通知と再試行ボタン
- 空結果: 「該当する学習項目はありません。新しい項目を作成しますか？」の案内と CTA
- 入力バリデーション: 無効なクエリはサニタイズして送信

## アクセシビリティ

- 検索バーは label を持つ
- キーボード操作でカード間を移動可能（Tab/Enter で開く）
- 色だけに依存しない進捗表示（テキスト：% を併記）
- ARIA ランドマークを適切に設定（`role="list"` / `role="listitem"`）

## テストケース（受け入れ基準）

- 初回ロードで 20 件表示される
- 検索ワードで絞り込まれる
- タグ複数選択によるフィルタが動作する
- ソートキー切替で表示順が変わる
- ページネーションで次ページが取得できる
- API エラー時に再試行が可能

## 実装ノート / 開発備考

- コンポーネント分割案
  - `LearningItemsPage`（ページラッパー）
  - `SearchBar`
  - `FiltersBar`
  - `SortToggle`
  - `ItemsList`（List / Grid 切替ロジック含む）
  - `LearningItemCard`
  - `Pagination` / `InfiniteLoader`
- スタイリング: デザインシステムの Tokens を使用
- ステート管理: ページ内ローカルは React state、検索条件や一部は URL query に反映
- ロギング: ユーザーのフィルタ/ソート操作をイベントとして計測（分析用）

---

### 参照ファイル

- 画面遷移: [design/BasicDesign/ScreenTransitions/screen-transitions.md](design/BasicDesign/ScreenTransitions/screen-transitions.md)

### 次のアクション

- API 仕様のバックエンド実装者との調整
- ワイヤーフレーム（Figma）作成
- コンポーネント実装チケット化

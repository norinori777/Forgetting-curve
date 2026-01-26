# アプリ要件

## 概要

- 暗記をするために補助アプリケーションとして、忘却曲線を使用したアプリケーションを開発する。
- 忘却曲線を使用したアプリケーションでは、記憶する対象となるものを登録、変更、削除できるようにする。
-忘却曲線のサイクルとして、1日以内、3日後、1週間後、2週間後、1か月のサイクルで登録したものを参照できる機能を設ける。
- どのサイクルのタイミングかは、色分けしてわかるようにする。
- 当日、見る必要がある記憶する対象は、上位に表示されるようにする。

## 環境

- フロント
  - React
- バックエンド
  - Node.js
- DB
  - Postgres

## 機能要件

### 1. 学習項目管理機能

#### 1.1 学習項目登録

- ユーザーは新しい学習項目を登録できる
- 登録時の必須項目
  - タイトル（必須）
  - 内容/説明（必須）
  - カテゴリー（任意）
  - タグ（任意）
- 登録時に初回学習日時が自動的に記録される
- 登録時に次回復習日が自動的に設定される（1日後）

#### 1.2 学習項目編集

- 登録済みの学習項目の内容を編集できる
- 編集可能な項目
  - タイトル
  - 内容/説明
  - カテゴリー
  - タグ

#### 1.3 学習項目削除

- 登録済みの学習項目を削除できる
- 削除前に確認ダイアログを表示する
- 削除後は復元できない旨を警告する

### 2. 復習管理機能

#### 2.1 復習サイクル

- 忘却曲線に基づく以下の復習サイクルを適用
  1. 初回学習後 1日以内
  2. 2回目復習 3日後
  3. 3回目復習 1週間後
  4. 4回目復習 2週間後
  5. 5回目復習 1ヶ月後
- 復習完了後、次の復習サイクルへ自動的に移行する

#### 2.2 復習実行

- ユーザーは学習項目を復習済みとしてマークできる
- 復習実行時に復習日時が記録される
- 次回復習日が自動的に更新される

#### 2.3 復習状態表示

- 各学習項目の復習状態を色分けで表示
  - 赤: 復習期限超過（当日より前）
  - オレンジ: 本日復習予定
  - 黄色: 1-2日以内に復習予定
  - 緑: まだ復習不要
  - グレー: 全サイクル完了

### 3. 一覧表示機能

#### 3.1 学習項目一覧

- 登録されている全学習項目を一覧表示する
- 本日復習が必要な項目を最上位に表示する
- 復習期限が近い順にソートする

#### 3.2 フィルタリング機能

- カテゴリーでフィルタリングできる
- タグでフィルタリングできる
- 復習状態でフィルタリングできる

#### 3.3 検索機能

- タイトルと内容で部分一致検索ができる

### 4. 統計・分析機能

#### 4.1 学習統計

- 総学習項目数
- 本日の復習予定数
- 今週の復習予定数
- 復習完了率

#### 4.2 進捗グラフ

- 日別の復習完了数を表示
- 週別の学習時間を表示

## 非機能要件

### 1. パフォーマンス

- ページ読み込み時間は3秒以内
- 学習項目の登録・更新は1秒以内に完了
- 1000件以上の学習項目でも快適に動作

### 2. セキュリティ

- ユーザー認証機能（将来実装）
- パスワードはハッシュ化して保存
- SQLインジェクション対策
- XSS対策

### 3. ユーザビリティ

- レスポンシブデザイン対応（PC、タブレット、スマートフォン）
- 直感的なUI/UX
- アクセシビリティ対応（WCAG 2.1 AA準拠）

### 4. 可用性

- システムの稼働率99%以上
- データの定期バックアップ

## 画面設計

### 1. ホーム画面

- ヘッダー
  - アプリタイトル
  - 統計情報（本日の復習予定数）
  - ヘッダーメニュー（ホーム/新規登録/統計）
- メインコンテンツ
  - 学習項目一覧
  - 各項目には以下を表示
    - タイトル
    - カテゴリー
    - 次回復習日
    - 復習状態（色付きバッジ）
    - 編集ボタン
    - 削除ボタン
    - 復習完了ボタン
- サイドバー
  - フィルター機能
  - 検索ボックス

### 2. 学習項目登録・編集画面

- フォーム
  - タイトル入力欄
  - 内容入力欄（テキストエリア）
  - カテゴリー選択
  - タグ入力
- ボタン
  - 保存ボタン
  - キャンセルボタン

### 3. 統計画面

- 統計サマリー
  - 総学習項目数
  - 今週の復習完了数
  - 復習完了率
- グラフ
  - 日別復習完了数グラフ
  - カテゴリー別学習項目分布

## データベース設計

### テーブル定義

#### 1. learning_items（学習項目テーブル）

| カラム名 | データ型 | 制約 | 説明 |
| --------- | --------- | ------ | ------ |
| id | SERIAL | PRIMARY KEY | 学習項目ID |
| title | VARCHAR(255) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 内容 |
| category | VARCHAR(100) | NULL | カテゴリー |
| tags | TEXT[] | NULL | タグ（配列） |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 更新日時 |

#### 2. review_history（復習履歴テーブル）

| カラム名 | データ型 | 制約 | 説明 |
| --------- | --------- | ------ | ------ |
| id | SERIAL | PRIMARY KEY | 復習履歴ID |
| learning_item_id | INTEGER | NOT NULL, FOREIGN KEY | 学習項目ID |
| review_cycle | INTEGER | NOT NULL | 復習サイクル（1〜5） |
| reviewed_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 復習実施日時 |
| next_review_date | DATE | NOT NULL | 次回復習予定日 |

#### 3. categories（カテゴリーテーブル）

| カラム名 | データ型 | 制約 | 説明 |
| --------- | --------- | ------ | ------ |
| id | SERIAL | PRIMARY KEY | カテゴリーID |
| name | VARCHAR(100) | NOT NULL UNIQUE | カテゴリー名 |
| color | VARCHAR(7) | NULL | 色コード |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |

### インデックス設計

- learning_items.created_at にインデックス
- learning_items.category にインデックス
- review_history.learning_item_id にインデックス
- review_history.next_review_date にインデックス

### リレーション

```text
learning_items 1 ──< N review_history
learning_items N ──> 1 categories (optional)
```

## API設計

### 学習項目API

#### POST /api/learning-items

学習項目を新規登録する

- リクエストボディ

```json
{
  "title": "string",
  "content": "string",
  "category": "string (optional)",
  "tags": ["string"] (optional)
}
```

- レスポンス: 201 Created

#### GET /api/learning-items

学習項目一覧を取得する

- クエリパラメータ
  - category: カテゴリーフィルター
  - tag: タグフィルター
  - status: 復習状態フィルター
  - search: 検索キーワード
- レスポンス: 200 OK

#### GET /api/learning-items/:id

特定の学習項目を取得する

- レスポンス: 200 OK

#### PUT /api/learning-items/:id

学習項目を更新する

- リクエストボディ

```json
{
  "title": "string",
  "content": "string",
  "category": "string (optional)",
  "tags": ["string"] (optional)
}
```

- レスポンス: 200 OK

#### DELETE /api/learning-items/:id

学習項目を削除する

- レスポンス: 204 No Content

### 復習API

#### POST /api/learning-items/:id/review

復習を完了としてマークする

- レスポンス: 200 OK

#### GET /api/reviews/today

本日の復習予定一覧を取得する

- レスポンス: 200 OK

### 統計API

#### GET /api/statistics

学習統計情報を取得する

- レスポンス: 200 OK

```json
{
  "totalItems": 100,
  "todayReviews": 5,
  "weekReviews": 15,
  "completionRate": 85.5
}
```

## 技術スタック詳細

### フロントエンド

- React 18+
- TypeScript
- React Router (ルーティング)
- Axios (HTTP通信)
- Material-UI または Chakra UI (UIコンポーネント)
- Chart.js または Recharts (グラフ表示)
- Day.js (日時処理)

### バックエンド

- Node.js 18+
- Express.js (Webフレームワーク)
- TypeScript
- Prisma または TypeORM (ORM)
- express-validator (バリデーション)
- morgan (ログ)

### データベース

- PostgreSQL 14+

### 状態管理

- サーバ状態
  - TanStack Query（React Query）
- UI状態
  - ReactのuseState / useReducer + Context

### 開発環境

- ESLint + Prettier (コード品質)
- Jest (テスト)
- Docker (コンテナ化)

## 開発フェーズ

### Phase 1: 基本機能実装

1. 環境構築
2. データベース設計・構築
3. 学習項目のCRUD機能
4. 基本的な一覧表示

### Phase 2: 復習機能実装

1. 復習サイクルロジック実装
2. 復習状態管理
3. 色分け表示
4. ソート機能

### Phase 3: 検索・フィルター機能

1. カテゴリー管理
2. タグ機能
3. 検索機能
4. フィルター機能

### Phase 4: 統計・分析機能

1. 統計情報表示
2. グラフ表示
3. 進捗管理

### Phase 5: UI/UX改善

1. アプリケーションは、PC、タブレット、スマートフォンでの利用を想定し、レスポンシブデザインを採用すること。
   - 各画面サイズの分岐点は、以下とする。
      - スマートフォン: 幅 0px ～ 599px
      - タブレット: 幅 600px ～ 899px
      - PC: 幅 900px 以上
2. アクセシビリティ対応
3. パフォーマンス最適化

## 今後の拡張機能（オプション）

- ユーザー認証・認可
- マルチユーザー対応
- データエクスポート/インポート機能
- 通知機能（復習リマインダー）
- モバイルアプリ化
- AI活用（学習効率の最適化提案）

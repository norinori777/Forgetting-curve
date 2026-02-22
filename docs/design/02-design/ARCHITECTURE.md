# ARCHITECTURE.md

## システム構成

- Frontend: React SPA（frontend）
  - 役割: 画面/状態管理、API呼び出し、ルーティング
  - 配信: 静的ホスティング（同一サーバの静的配信でもOK）
- Backend: Node.js + Express API（backend）
  - 役割: 認証（後で追加しやすい形）、バリデーション、忘却曲線/SRSロジック、CRUD、集計API
  - ORM: Prisma（prisma）
- DB: PostgreSQL
  - 役割: 学習アイテム、復習履歴、スケジュール、ユーザー（将来）を永続化

## 技術スタック

- FE（frontend）
  - React + Vite + TypeScript（既存）
  - Tailwind CSS（既存）
  - ルーティング: react-router-dom
  - API通信: axios
  - フォーム: react-hook-form
  - バリデーション: zod（FE/BEで型共有しやすい）
  - データ取得キャッシュ: @tanstack/react-query（一覧/更新が増えると効く）
  - テスト: 既存どおり vitest（既存前提に合わせる）
  - 状態管理
    - サーバ状態（一覧データなど）: TanStack Query（React Query）
    - 画面条件（検索/フィルタ/ページ/ソート）: URLクエリ（useSearchParams 等）
    - 一時的なUI状態（開閉、入力途中）: コンポーネントローカル state
    - フォーム状態: react-hook-form

- BE（backend）
  - Node.js + Express + TypeScript（既存）
  - ORM: Prisma（既存）
  - バリデーション: zod（リクエスト/レスポンスの型を固定）
  - ログ: pino（最初から入れると運用が楽）
  - テスト: jest + supertest（方針があるならそれに寄せる）
- DB
  - PostgreSQL（既存）
- 認証
  - メール+パスワード + HttpOnly Cookie（JWT）
    - ログイン成功時に HttpOnly + Secure + SameSite なCookieを発行し、BEがJWTを検証
      - パスワードハッシュ: argon2
      - Refresh Token の失効/ローテーション管理: PostgreSQL（MVPはDBでOK）
      - Cookie設定: httpOnly: true, secure: true(本番), sameSite: 'lax'（別ドメイン運用なら調整）

## コンポーネント設計

- pages: 画面コンテナ（ルーティング・状態管理・API呼び出し）
- uniqueParts: 画面専用の部品（一覧の検索/フィルタ行、フォーム一式など）
- uiParts: 汎用UI（Button/Table/DropDown/TextField等。既に BasicButton/BasicTable/DropDown などがある前提）
- services/api: APIクライアント（fetch/axios。ここは薄く）
- hooks: useQuery/useMutation や画面ロジック（React Queryを使うならここに寄せる）
- domain/types: 画面に依存しない型（DTO/ドメイン型）

## ページ表示基盤

- 全体のコンポーネント構成として、Header部とContents部の２つがある。
- Header部には、タイトル部とメニュー部を表示する。
  - メニュー部の遷移として、react-router-domを利用する。
  - URLと表示するコンポーネントの紐づけをcontents/contents.tsに定義する。
- Contents部には、メニュー部で選択しコンテンツを表示する。初期表示は、TOP画面とする。

## 認証

### MVP 方針

- 認証方式は **メール+パスワード**。
- 認証状態は **HttpOnly Cookie に格納した JWT** で管理する（フロントエンドはトークンを直接保持しない）。
- MVPではサインアップは必須にせず、ユーザーは seed 等で事前作成してログインのみ提供してよい。

### トークン運用

- Cookie は 2種類を想定（最低限）。
  - `access_token`（短命）: APIアクセス用
  - `refresh_token`（長命）: access の再発行用
- Refresh Token は DB 側で失効管理する（ログアウトや漏洩対策のため）。
  - 保存時は平文でなくハッシュ化して持つ（パスワード同様に漏洩耐性を上げる）。

### Cookie 属性

- `httpOnly: true`
- `secure: true`（本番）
- `sameSite: 'lax'`（同一オリジン運用が基本。別ドメインの場合は要再検討）
- `path: '/'`

### 主要エンドポイント

- `POST /api/auth/login`
  - 成功: `204 No Content`（`Set-Cookie` でトークンCookieを設定）
  - 失敗: `401 Unauthorized`
- `POST /api/auth/logout`
  - 成功: `204 No Content`（Cookie削除 + refresh 失効）
- `POST /api/auth/refresh`
  - 成功: `204 No Content`（access 再発行、refresh はローテーション推奨）
- `GET /api/auth/me`
  - 成功: ログイン中ユーザー情報（最小: `id`, `email`）
  - 未ログイン: `401 Unauthorized`

### CORS / CSRF の前提

- MVPは **同一オリジン**（同一サイト）での配信を基本にし、Cookie運用を単純化する。
- 開発時にFE/BEが別ポートの場合でも Cookie は送れるよう、
  axios は `withCredentials: true`、BEは `cors({ credentials: true, origin: ... })` を設定する。
- 別ドメイン配信（`SameSite=None`）にする場合は CSRF 対策（CSRFトークン等）を追加する。

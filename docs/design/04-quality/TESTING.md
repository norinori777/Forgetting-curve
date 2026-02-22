# TESTING.md

## 認証

### 目的（認証テスト）

- 認証の境界（ログイン/更新/ログアウト）でセキュリティ要件が満たされることを確認する。
- Cookie（HttpOnly/SameSite 等）が意図した属性で付与・削除されることを確認する。
- 失効・ローテーションが正しく動作し、不正な再利用（リプレイ）を検知できることを確認する。

### テストレベル（認証）

- itのテスト名は、日本語にすること。
- バックエンド（推奨）
  - 統合テスト（jest + supertest）を主戦場とする。
  - `supertest.agent(app)` を使い、Cookieを保持しながら `/login` → `/me` → `/refresh` のような一連の流れを検証する。
- フロントエンド
  - UIの入力検証や遷移（ログイン成功/失敗時の画面状態）を vitest でテストする。
  - Cookieの実体はブラウザ実装依存のため、E2Eを導入しないMVPでは「API呼び出し結果の分岐」に焦点を当てる。

### API テスト観点

#### `POST /api/auth/login`

- 正常系
  - 正しい `email/password` で `204 No Content`。
  - `Set-Cookie` が付与される（少なくとも `access_token`、運用により `refresh_token`）。
- 異常系（入力）
  - 必須欠落/型不正 → `400`（`VALIDATION_ERROR`）。
- 異常系（認証）
  - 認証失敗 → `401 Unauthorized`。
  - 返却メッセージはアカウント列挙を防ぐため汎用文言（例: 「メールアドレスまたはパスワードが違います」）。
- Cookie属性
  - `HttpOnly` が付いていること。
  - `SameSite=Lax`（方針どおり）であること。
  - `Secure` は本番相当の設定時に付くこと（テスト環境では `secure=false` でもよい）。

#### `GET /api/auth/me`

- 正常系
  - 有効な `access_token` Cookie がある場合 `200`（最小: `id`, `email`）。
- 異常系
  - Cookie無し → `401`。
  - 署名不正/期限切れのアクセストークン → `401`。

#### `POST /api/auth/refresh`

- 正常系
  - 有効な `refresh_token` Cookie がある場合 `204`。
  - `Set-Cookie` で新しい `access_token` を付与する。
  - ローテーション方針の場合は `refresh_token` も更新される（古いrefreshは失効）。
- 異常系
  - refresh Cookie無し → `401`。
  - 失効済みrefresh → `401`。
  - 改ざん/期限切れrefresh → `401`。
- リプレイ（再利用）
  - ローテーション有効時、古いrefreshを再度使うと `401` になること。
  - 必要に応じて「ユーザーの全セッション失効」等の強めの挙動を入れる場合は、その挙動もテストする。

#### `POST /api/auth/logout`

- 正常系
  - `204`。
  - Cookie削除（`Set-Cookie` による `Max-Age=0` 等）される。
  - refresh がDB上で失効する（以後 `/refresh` が `401`）。

### 権限（Authorization）

- 認証必須エンドポイントに対して
  - 未ログインは `401`。
  - ログイン済みでも権限不足は `403`（将来の認可導入時）。
- ユーザー別データを扱う場合
  - リクエストに `userId` が含まれても信用せず、サーバ側の認証情報から決定されることをテストする。

### CSRF 想定

- MVPは同一オリジン + `SameSite=Lax` を基本とし、CSRFトークンを必須にしない。
- 別ドメイン配信（`SameSite=None`）に移行する場合は、以下を追加する。
  - `POST/PUT/DELETE` で CSRF トークン（ヘッダ or double-submit cookie）が無い場合 `403`。
  - トークン不一致/期限切れも `403`。

### テストデータ/環境

- テスト用ユーザーを固定で用意し、パスワードはハッシュ（argon2id）で登録しておく。
- 可能ならテストDBを分離し、各テストはトランザクション or クリーンアップで独立性を担保する。

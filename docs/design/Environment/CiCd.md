# CI/CD（GitHub Actions）

本リポジトリでは、以下の流れを GitHub Actions で自動化します。

- Issue指示 → ブランチ作成 → 開発 → Test → PullRequest → マージ → テスト → デプロイ

## 1. ワークフロー一覧

| 目的 | トリガー | ワークフロー |
| --- | --- | --- |
| PR時のCI（lint/test/build） | `pull_request`（main向け） | [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) |
| Issueコメントでブランチ自動作成 | `issue_comment.created` | [.github/workflows/issue-branch.yml](../../../.github/workflows/issue-branch.yml) |
| mainマージ後にデプロイ（GitHub Pages） | `push`（main） / 手動実行 | [.github/workflows/deploy-pages.yml](../../../.github/workflows/deploy-pages.yml) |

## 2. PR向けCI（Pull Request → CI）

対象: [.github/workflows/ci.yml](../../../.github/workflows/ci.yml)

### 2.1 何を検証するか

- Frontend: `npm ci` → `npm run lint` → `npm run test` → `npm run build`
- Backend: `yarn install --immutable` → `yarn lint` → `yarn build` → `yarn test`

### 2.2 前提

- Node.js: 20（Actionsで固定）
- Frontend の依存は `frontend/package-lock.json` により `npm ci` で再現性を担保
- Backend は `backend/package.json` の `packageManager: yarn@4.11.0` を前提に `corepack enable` を利用

## 3. Issue → ブランチ自動作成（Issueコメント → ブランチ生成）

対象: [.github/workflows/issue-branch.yml](../../../.github/workflows/issue-branch.yml)

### 3.1 使い方

- Issue にコメントで `/branch` と投稿します
- `main`（デフォルトブランチ）からブランチを作成し、Issueに作成済みブランチ名をコメント返信します

### 3.2 ブランチ命名規則

- `issue-{issue番号}-{issueタイトル由来のslug}`
  - 例: `issue-12-header-with-menu-links`

### 3.3 注意点

- Pull Request へのコメントでは実行しません（Issue のみ対象）
- 同名ブランチが既に存在する場合は作成せず、既存ブランチとして扱います

## 4. mainマージ後デプロイ（Push main → GitHub Pages）

対象: [.github/workflows/deploy-pages.yml](../../../.github/workflows/deploy-pages.yml)

### 4.1 何をデプロイするか

- `frontend` を build して生成される `frontend/dist` を GitHub Pages にデプロイします

### 4.2 実行内容

- `npm ci` → `npm run lint` → `npm run test` → `npm run build`
- 成果物 `frontend/dist` を Pages artifact としてアップロード → `actions/deploy-pages` で公開

### 4.3 リポジトリ側の設定

GitHub のリポジトリ設定で以下を行ってください。

- Settings → Pages → Build and deployment
  - Source: `GitHub Actions`

## 5. ローカル実行コマンド（参考）

### 5.1 Frontend

```bash
cd frontend
npm ci
npm run lint
npm run test
npm run build
```

### 5.2 Backend

```bash
cd backend
corepack enable
yarn install --immutable
yarn lint
yarn build
yarn test
```

## 6. 補足

- Frontend の `test` は CI 向けに watch を無効化した単発実行（`--run`）になっています
- Backend の `test` は現時点でテストが無い状態でもCIをブロックしないよう `--passWithNoTests` を許可しています（テスト追加が進んだら見直し可）

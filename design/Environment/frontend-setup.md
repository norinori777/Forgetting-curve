# Frontend セットアップ（React + TypeScript / Vite）

前提: Node.js がインストール済みであること。

1) プロジェクト作成（Vite, React + TypeScript）

    ```bash
    # リポジトリ直下で実行
    npm create vite@latest frontend -- --template react-ts
    cd frontend
    npm install
    ```

2) 開発用依存パッケージのインストール（例）

    ```bash
    npm install axios @tanstack/react-query react-router-dom react-hook-form dayjs
    npm install recharts # または chart.js/react-chartjs-2

    # UIライブラリ（任意、好みで選択）
    npm install @mui/material @emotion/react @emotion/styled
    ```

3) 開発支援ツール（ESLint, Prettier など）

    ```bash
    npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import @typescript-eslint/eslint-plugin @typescript-eslint/parser
    ```

4) 推奨スクリプト（`package.json` に追加）

    ```json
    "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint 'src/**/*.{ts,tsx}' --fix"
    }
    ```

5) 推奨セットアップ/運用メモ
   - 状態管理: TanStack Query（サーバー状態）、UIは `useState`/`useReducer`、必要なら Context
   - ルーティング: `react-router-dom`
   - フォルダ構成例: `src/pages`, `src/components`, `src/hooks`, `src/services/api`（APIクライアント）
   - 環境変数: `.env` に `VITE_API_BASE_URL`（例: <http://localhost:3000>）を設定

6) 実行

    ```bash
    # 開発サーバを起動
    npm run dev
    ```

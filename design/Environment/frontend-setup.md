# Frontend セットアップ（React + TypeScript / Vite）

前提: Node.js がインストール済みであること。

1) プロジェクト作成（Vite, React + TypeScript）

    ```bash
    # リポジトリ直下で実行
    yarn create vite frontend --template react-ts
    cd frontend
    yarn
    ```

2) 開発用依存パッケージのインストール（例）

    ```bash
    yarn add axios @tanstack/react-query react-router-dom react-hook-form dayjs
    yarn add recharts # または chart.js/react-chartjs-2

    # UIライブラリ（任意、好みで選択）
    yarn add @mui/material @emotion/react @emotion/styled
    ```

3) 開発支援ツール（ESLint, Prettier など）

    ```bash
    yarn add -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import @typescript-eslint/eslint-plugin @typescript-eslint/parser
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

6) エラー対応

    ```bash
    # 開発サーバを起動
    yarn add -D vite
    ```

7) 実行

    ```bash
    # 開発サーバを起動
    yarn dev
    ```

## フロントエンドテスト（React コンポーネント / ユニット）

備考:

- 本リポジトリのテスト方針は原則 `jest-policy.md` に従います。
- ただし `frontend` は現状 `Vitest` を前提にセットアップ済みです（Jest に近い書き味で、Vite との相性が良い）。

### 1) 必要ソフトウェア（依存パッケージ）

`frontend` ディレクトリで実行します。

```bash
yarn add -D vitest jsdom @vitest/coverage-v8
yarn add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

（任意）Vitest UI を使う場合:

```bash
yarn add -D @vitest/ui
```

（任意）API 通信を含む画面の統合テストでモックを使う場合:

```bash
yarn add -D msw
```

### 2) Vitest 設定（Vite と統合）

`vite.config.ts` の `test` 設定で、少なくとも以下を指定します。

- `environment: 'jsdom'`（React の DOM テスト用）

既に設定済みの場合は変更不要です。

### 3) `package.json` スクリプト例

最低限は `test` があれば実行できます。

```json
"scripts": {
    "test": "vitest --environment jsdom",
    "test:run": "vitest run --environment jsdom",
    "test:watch": "vitest --watch --environment jsdom",
    "test:ui": "vitest --ui --environment jsdom",
    "test:coverage": "vitest run --coverage --environment jsdom"
}
```

### 4) テストの置き場所・命名

- 例: `src/components/.../*.test.tsx`
- 例: `src/utils/.../*.test.ts`

既に `frontend/src` 配下に `*.test.ts(x)` を配置して運用できます。

### 5) 実行コマンド

```bash
# ローカル実行（対話モード/ウォッチになることがあります）
yarn test

# 1回実行（CI/単発向け）
yarn test:run

# 監視（開発時）
yarn test:watch

# カバレッジ
yarn test:coverage
```

### 6) よくあるポイント

- DOM を使うコンポーネントテストは `jsdom` が必要です。
- `@testing-library/user-event` は基本的に `await userEvent.click(...)` のように `await` で扱います。

## Storybook 導入手順（React + Vite + TypeScript + Tailwind を想定）

以下の手順で Storybook を導入します。プロジェクトの UI コンポーネントをドキュメント化し、Storybook 上でインタラクティブに確認できるようになります。

1) 依存パッケージのインストール

```bash
# frontend ディレクトリで実行
yarn add -D @storybook/react @storybook/addon-essentials @storybook/addon-interactions @storybook/testing-library storybook-builder-vite
yarn add -D vite ts-node
```

2) Storybook の初期化

```bash
# 自動セットアップ
npx sb init --type react
# 手動で設定する場合は .storybook ディレクトリを作成して設定ファイルを追加
```

3) `package.json` にスクリプトを追加

```json
"scripts": {
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
}
```

4) Storybook の設定（Vite を使う場合の例）

- `/.storybook/main.js`（または `main.ts`）

```js
module.exports = {
    stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions'
    ],
    framework: {
        name: '@storybook/react',
        options: {}
    },
    core: {
        builder: 'storybook-builder-vite'
    }
};
```

- `/.storybook/preview.js`（グローバルな decorators / parameters）

```js
import '../src/index.css'; // Tailwind を使っている場合に読み込む
export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};
```

5) TypeScript 対応（必要なら）

- `tsconfig.json` に Storybook 向けの型設定を追加するか、`/.storybook/tsconfig.json` を用意します。

6) Tailwind を使用している場合の補足

- `preview.js` に Tailwind の CSS を import し、PostCSS / Tailwind 設定が正しく Vite / Storybook 両方で動作することを確認します。

7) 推奨アドオン・設定

- `@storybook/addon-essentials`（Docs, Controls, Actions 等）
- `@storybook/addon-interactions` と `@storybook/testing-library`（コンポーネントの対話テスト用）

8) Storybook 用の Story の書き方（例）

`src/components/SearchBar/SearchBar.stories.tsx`

```tsx
import React from 'react';
import SearchBar from './SearchBar';

export default {
    title: 'Components/SearchBar',
    component: SearchBar,
};

export const Default = () => <SearchBar placeholder="タイトル・内容を検索" onSearch={() => {}} />;
```

9) ローカル起動 / ビルド

```bash
# ローカル起動
yarn storybook

# 静的ビルド
yarn build-storybook
```

10) CI / デプロイ

- `build-storybook` の成果物 (`storybook-static`) を GitHub Pages / Netlify / Vercel 等にデプロイできます。

注意事項:
- Vite / Tailwind を使っている場合は `storybook-builder-vite` を使うことで設定が容易になります。
- プロジェクト固有の PostCSS/Tailwind 設定がある場合、Storybook の `preview` で CSS を読み込む際にパスやビルド設定の整合性を確認してください。

## Tailwind CSS 導入手順

以下は `frontend`（Vite + React + TypeScript）プロジェクトでの Tailwind CSS 導入手順です。

1) パッケージのインストール

```bash
# frontend ディレクトリで実行
# Tailwind v4 では CLI が別パッケージ（@tailwindcss/cli）になっているため、併せて入れる
yarn add -D tailwindcss @tailwindcss/cli postcss autoprefixer @tailwindcss/postcss


# 初期化（どちらでも可）
yarn tailwindcss init -p
# npx を使う場合
# npx tailwindcss init -p
```

補足:
- `npx tailwindcss init -p` で「could not determine executable to run」や「Binary not found」が出る場合、`@tailwindcss/cli` が入っていない（または Yarn/PnP の実行解決の影響）であることが多いです。
- その場合は `yarn tailwindcss init -p` を優先するか、`tailwind.config.cjs` / `postcss.config.cjs` を手動作成してください。
- `[plugin:vite:css] [postcss] It looks like you're trying to use \`tailwindcss\` directly as a PostCSS plugin` が出る場合、`@tailwindcss/postcss` を入れて `postcss.config.*` のプラグイン指定を `@tailwindcss/postcss` に変更してください。

2) `tailwind.config.cjs`（または `tailwind.config.ts`）の設定（初期化済み）

デフォルトで生成される `tailwind.config.cjs` に `content` を設定します。

```js
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: { extend: {} },
    plugins: [],
};
```

3) グローバル CSS に Tailwind を導入

- `src/index.css`（またはプロジェクトで使用しているエントリCSS）に以下を追加します。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4) Vite の PostCSS 設定

- `tailwindcss init -p` により `postcss.config.cjs` が生成されているはずです。特別な設定がなければそのままで問題ありません。

5) Tailwind を開発サーバで確認

```bash
yarn dev
```

6) Storybook を使っている場合の注意点

- Storybook の `preview.js` や `preview.ts` でプロジェクトの CSS（`src/index.css`）を import してください。
- Vite をビルダーに使っているなら `storybook-builder-vite` と共に Tailwind が動作します。

7) 推奨運用

- コンポーネント単位で Tailwind のユーティリティクラスを使い、必要に応じて `@layer components` で共通コンポーネントスタイルを定義する。
- Purge（content）設定を厳密にし、ビルド時の未使用 CSS を削減する。

参考: https://tailwindcss.com/docs/installation

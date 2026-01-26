# Backend セットアップ（Node.js + TypeScript + Express）

前提: Node.js と PostgreSQL がインストール済みであること。

1. プロジェクト作成

    ```bash
    mkdir backend
    cd backend
    npm init -y
    npm install express cors pg
    npm install -D typescript ts-node-dev @types/node @types/express
    npx tsc --init
    ```

2. TypeScript / 開発スクリプト

    package.json に以下を追加:

    ```json
    "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc"
    }
    ```

3. ORM / DB ツール（Prisma 例）

    ```bash
    npm install prisma --save-dev
    npx prisma init --datasource-provider postgresql
    npm install @prisma/client
    ```

    `prisma/schema.prisma` にテーブル定義を記載し、`npx prisma migrate dev` でマイグレーションを実行します。

4. 推奨ミドルウェア/ユーティリティ

    ```bash
    npm install dotenv express-validator morgan
    npm install -D jest ts-jest @types/jest supertest
    ```

5. 環境変数
   - `.env` に `DATABASE_URL=postgresql://user:pass@localhost:5432/dbname` を設定

6. 実行

    ```bash
    # 開発サーバ起動
    npm run dev
    ```

7. 注意点

   - マイグレーションとシードデータを用意する
   - Prisma を使う場合、`prisma generate` を忘れずに実行
   - DB の接続設定とマイグレーションは CI に組み込むこと

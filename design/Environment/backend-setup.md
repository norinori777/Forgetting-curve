# Backend セットアップ（Node.js + TypeScript + Express）

前提: Node.js と PostgreSQL がインストール済みであること。

1. プロジェクト作成

    ```bash
    mkdir backend
    cd backend
    yarn init -y
    yarn add express cors pg
    yarn add -D typescript ts-node-dev @types/node @types/express
    yarn tsc --init
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
    yarn add -D prisma
    npx prisma init --datasource-provider postgresql
    yarn add @prisma/client
    ```

    `prisma/schema.prisma` にテーブル定義を記載し、`npx prisma migrate dev` でマイグレーションを実行します。

4. 推奨ミドルウェア/ユーティリティ

    ```bash
    yarn add dotenv express-validator morgan
    yarn add -D jest ts-jest @types/jest supertest
    ```

5. 環境変数
   - `.env` に `DATABASE_URL=postgresql://user:pass@localhost:5432/dbname` を設定

Docker で PostgreSQL を立てる（開発向け）

以下はローカル環境で Postgres を Docker コンテナとして起動する手順です。`DATABASE_URL` を `.env` と合わせて更新してください。

- 直接 `docker run` を使う方法:

```bash
# 永続化用ボリュームを作成
docker volume create forgetting_curve_volume

# Postgres コンテナ起動（ユーザ/パスワード/DB 名を環境に合わせて変更）
docker run -d \
    --name forgetting-postgres \
    -e POSTGRES_USER=fc_user \
    -e POSTGRES_PASSWORD=fc_pass \
    -e POSTGRES_DB=forgetting_curve \
    -p 5432:5432 \
    -v forgetting_curve_volume:/var/lib/postgresql/data \
    postgres:15
```

ホストの Windows ディレクトリを直接マウントする例（PowerShell）:

> 事前に `C:\work\forgetting-curve-db` を作成し、Docker Desktop のファイル共有/WSL2 設定を確認してください。

```powershell
# PowerShell の場合（ホストのディレクトリを直接マウント）
docker run -d `
    --name forgetting-postgres `
    -e POSTGRES_USER=fc_user `
    -e POSTGRES_PASSWORD=fc_pass `
    -e POSTGRES_DB=forgetting_curve `
    -p 5432:5432 `
    -v "C:\\work\\forgetting-curve-db:/var/lib/postgresql/data" `
    postgres:15
```

注: Windows のパスをマウントする際は引用符で囲み、バックスラッシュをそのまま使ってください。権限や共有設定でマウントに失敗することがあるため、その場合は名前付きボリュームを使う方法を推奨します。

DATABASE_URL の例（`.env` に設定）:

```
DATABASE_URL=postgresql://fc_user:fc_pass@localhost:5432/forgetting_curve
```

- `docker-compose` を使う方法（推奨、複数サービスを扱う場合便利）:

`docker-compose.yml` の例:

```yaml
version: '3.8'
services:
    db:
        image: postgres:15
        environment:
            POSTGRES_USER: fc_user
            POSTGRES_PASSWORD: fc_pass
            POSTGRES_DB: forgetting_curve
        volumes:
            - db_data:/var/lib/postgresql/data
        ports:
            - '5432:5432'

volumes:
    db_data:
```

起動コマンド:

```bash
docker compose up -d
```

注意:
- コンテナの Postgres バージョンとローカルクライアント互換性に注意してください。
- CI 環境では同様にコンテナを立ち上げる、または CI が提供する PostgreSQL サービスを利用してください。

6. 実行

    ```bash
    # 開発サーバ起動
    yarn dev
    ```

7. 注意点

   - マイグレーションとシードデータを用意する
   - Prisma を使う場合、`prisma generate` を忘れずに実行
   - DB の接続設定とマイグレーションは CI に組み込むこと

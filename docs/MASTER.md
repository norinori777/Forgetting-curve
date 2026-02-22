# 忘却曲線暗記支援アプリ

## 概要

- 忘却曲線に基づく暗記支援アプリを開発する

## 技術スタック

- フロント: React
- バックエンド: Node.js
- アプリケーションサーバ：Express.js
- DB: PostgreSQL
- CSS: Tailwind CSS
- ORM: Prisma
- TypeScript

## 文書索引

| 文書                                 | 説明             | 更新日     |
| ------------------------------------ | ---------------- | ---------- |
| [PROJECT.md](./PROJECT.md)           | ビジョン・要件   | 2026-01-01 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | システム設計     | 2026-01-01 |
| [DOMAIN.md](./DOMAIN.md)             | ビジネスロジック | 2026-01-01 |
| [PATTERNS.md](./PATTERNS.md)         | 実装パターン     | 2026-01-01 |
| [TESTING.md](./TESTING.md)           | テスト戦略       | 2026-01-01 |
| [DEPLOYMENT.md](./DEPLOYMENT.md)     | 運用手順         | 2026-01-01 |

## ディレクトリ

```text
backend/
 ├── api/          # APIエンドポイント
 ├── services/     # ビジネスロジック
 ├── repositories/ # データアクセス 
 ├── domain/       # ドメインモデル 
 └── utils/        # ユーティリティ 
frontend/
 ├── .storybook/       # Storybook設定
 ├── public/           # 静的ファイル
 ├── src/
 │   ├── assets/       # 画像などのアセット
 │   ├── contents/     # ページ表示基盤の紐づけ情報を格納
 │   ├── pages/        # ページ(画面)
 │   ├── components/
 │   │   ├── uiParts/      # 汎用UI部品
 │   │   └── uniqueParts/  # 画面固有部品
 │   ├── hooks/        # React hooks
 │   ├── services/
 │   │   └── api/      # API呼び出し
 │   ├── domain/       # DTO/ドメイン型
 │   └── utils/
 │       └── theme/    # テーマ関連
 ├── dist/             # ビルド成果物
 └── storybook-static/ # Storybookビルド成果物
```

## 重要な制約

- AIを利用したSpec開発を実施する。

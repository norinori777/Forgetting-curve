# ER図（基本設計）

参照: design/Requirements/app.md（データベース設計）

## ER図（Mermaid）

```mermaid
erDiagram
  LEARNING_ITEMS {
    SERIAL id PK
    VARCHAR title
    TEXT content
    INTEGER category_id FK "NULL可"
    TEXT[] tags "NULL可"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  REVIEW_HISTORY {
    SERIAL id PK
    INTEGER learning_item_id FK
    INTEGER review_cycle
    TIMESTAMP reviewed_at
    DATE next_review_date
  }

  CATEGORIES {
    SERIAL id PK
    VARCHAR name "UNIQUE"
    VARCHAR color "NULL可"
    TIMESTAMP created_at
  }

  LEARNING_ITEMS ||--o{ REVIEW_HISTORY : has
  CATEGORIES ||--o{ LEARNING_ITEMS : categorizes
```

## 補足（要件との整合）

- categories と learning_items は、learning_items.category_id（NULL可）で関連付ける。
- これにより、カテゴリ名称は categories.name を正として扱える（カテゴリ名の揺れを防ぐ）。

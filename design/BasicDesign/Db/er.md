# ER図（基本設計）

参照: design/Requirements/app.md（データベース設計）

参照: design/Entity/エンティティ仕様_忘却曲線.md

## ER図（Mermaid）

```mermaid
erDiagram
  USERS {
    UUID id PK
    string email UK
    string name
    string role
    string timezone
    datetime created_at
    datetime updated_at
  }

  LEARNING_ITEMS {
    UUID id PK
    UUID owner_id FK
    UUID category_id
    string title
    string type
    string content
    int difficulty
    datetime created_at
    datetime updated_at
  }

  CATEGORIES {
    UUID id PK
    string name UK
    UUID owner_id
    datetime created_at
    datetime updated_at
  }

  TAGS {
    UUID id PK
    string name
    UUID owner_id
    datetime created_at
  }

  LEARNING_ITEM_TAGS {
    UUID id PK
    UUID item_id FK
    UUID tag_id FK
    int weight
  }

  REVIEW_SESSIONS {
    UUID id PK
    UUID user_id FK
    datetime started_at
    datetime ended_at
    int items_count
    int correct_count
    string metadata
  }

  REVIEW_HISTORIES {
    UUID id PK
    UUID item_id FK
    UUID user_id FK
    UUID session_id FK
    string result
    int quality
    float efactor
    int interval_days
    datetime next_review_at
    int response_time_ms
    datetime created_at
  }

  SCHEDULES {
    UUID item_id PK
    UUID user_id FK
    datetime next_review_at
    int priority
    datetime updated_at
  }

  SRS_SETTINGS {
    UUID user_id PK
    string algorithm
    float difficulty_sensitivity
    float interval_multiplier
    int min_interval_days
    int max_interval_days
    datetime created_at
    datetime updated_at
  }

  NOTIFICATION_SETTINGS {
    UUID user_id PK
    boolean enabled
    string channels
    string time_window
    datetime created_at
  }

  IMPORT_JOBS {
    UUID id PK
    UUID user_id FK
    string type
    string status
    string file_url
    string mapping
    datetime created_at
    datetime finished_at
    string errors
  }

  CLASSES {
    UUID id PK
    UUID teacher_id FK
    string name
    string description
    datetime created_at
  }

  ENROLLMENTS {
    UUID id PK
    UUID class_id FK
    UUID user_id FK
    string role
    datetime joined_at
  }

  PROGRESS_STATS {
    UUID user_id PK
    date period_start
    date period_end
    float correct_rate
    int study_minutes
    int streak_days
    datetime updated_at
  }

  USERS ||--o{ LEARNING_ITEMS : owns
  USERS ||--o{ REVIEW_SESSIONS : performs
  USERS ||--o{ REVIEW_HISTORIES : performs
  USERS ||--o{ ENROLLMENTS : enrolls
  USERS ||--|| NOTIFICATION_SETTINGS : has
  USERS ||--|| SRS_SETTINGS : has
  USERS ||--o{ IMPORT_JOBS : runs
  USERS ||--|| PROGRESS_STATS : has

  CATEGORIES ||--o{ LEARNING_ITEMS : categorizes
  LEARNING_ITEMS ||--o{ REVIEW_HISTORIES : has
  LEARNING_ITEMS ||--|| SCHEDULES : has
  LEARNING_ITEMS ||--o{ LEARNING_ITEM_TAGS : tagged_with
  TAGS ||--o{ LEARNING_ITEM_TAGS : used_in

  REVIEW_SESSIONS ||--o{ REVIEW_HISTORIES : contains

  CLASSES ||--o{ ENROLLMENTS : has
  ENROLLMENTS }o--|| USERS : member
```

## 補足

- `LEARNING_ITEM_TAGS` は多対多の中間テーブルです（`weight` は任意）。
- `SCHEDULES` は `REVIEW_HISTORIES.next_review_at` の最新値をキャッシュする用途です。
- `REVIEW_HISTORIES` は追加（append-only）で監査や統計に利用します。
- 推奨インデックス: `SCHEDULES(next_review_at)`, `REVIEW_HISTORIES(next_review_at)`, `LEARNING_ITEM_TAGS(item_id, tag_id)`

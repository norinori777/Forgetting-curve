
# PATTERNS.md

## 共通

### 命名規則

#### 基本

- **英語 + lowerCamelCase** を基本とする（`userId`, `nextReviewAt`）。
- **省略しない**（`btn`/`tmp`/`data1` などは避ける）。ただし一般的な略語（`id`, `url`, `api`）は可。
- **単位や意味を名前に含める**（`timeoutMs`, `intervalDays`, `responseTimeMs`）。
- **否定形のフラグを避ける**（`isNotAvailable` より `isAvailable`）。

#### boolean

- `is` / `has` / `can` / `should` / `needs` で開始する。
  - 例: `isLoading`, `hasError`, `canSubmit`, `shouldRefetch`, `needsReview`

#### 配列・コレクション

- 複数形にする。
  - 例: `items`, `tags`, `histories`, `selectedIds`
- `map/filter/reduce` のコールバック引数は単数形にする。
  - 例: `items.map((item) => ...)`

#### 関数

- 動詞から始める。
  - 取得: `getXxx`（同期） / `fetchXxx`（非同期・外部IO）
  - 作成: `createXxx`
  - 更新: `updateXxx`
  - 削除: `deleteXxx` / `removeXxx`（意味が「取り除く」）
  - 変換: `toXxx` / `fromXxx` / `xxxToYyy`
- イベントハンドラは `handleXxx`、props は `onXxx`。
  - 例: `handleSubmit`, `handleClickReview`, `onReview`

#### DDD（用語統一）

- ドメイン概念は名詞で統一し、UI都合の別名を増やさない。
  - 例: `LearningItem` / `ReviewHistory` / `Schedule` / `Tag`
- IDは `XxxId`（Value Object / branded type）で統一。
  - 例: `LearningItemId`, `UserId`

#### 定数

- 定数は `UPPER_SNAKE_CASE`。
  - 例: `DEFAULT_PAGE_SIZE`, `SRS_MIN_INTERVAL_DAYS`
- 設定値のまとまりは `const config = { ... }` のように lowerCamelCase のオブジェクトでも可。

## フロントエンド

### Atomic Design 方針（作成粒度）

#### 目的（Atomic Design）

- UIを「小さく・再利用可能な部品」から積み上げて、画面追加や仕様変更に強い構造にする。
- デザインの一貫性を担保しつつ、画面固有の実装を局所化する。

#### レイヤー定義（本プロジェクトの解釈）

- **Atoms（原子）**
  - 最小のUI部品。ボタン、ラベル、入力、アイコン枠など。
  - 例: `BasicButton`, `TextMessage`, `TextField`
- **Molecules（分子）**
  - Atoms を組み合わせた、意味のある小さなブロック。
  - 例: `DropDown`（ラベル + 入力 + リスト）、検索入力（入力 + クリア）
- **Organisms（有機体）**
  - 画面の主要ブロック。ツールバー、フォーム、一覧コンテナ、ヘッダー等。
  - 例: `Header`, `LearningItemsToolbar`, `LoginForm`
- **Templates（テンプレート）**
  - 画面レイアウトの枠組み。配置とスロット（子要素）を提供する。
  - 例: `AppLayout`（Header + main + footer の骨組み）
- **Pages（ページ）**
  - ルーティング単位の画面。Container を置く場所。
  - 例: `LearningItemsPage`, `LoginPage`

#### ディレクトリ対応（目安）

- `frontend/src/components/uiParts/`
  - 原則: **Atoms / Molecules** を置く（汎用UI部品）。
  - Storybook に載せる対象の中心。
- `frontend/src/components/uniqueParts/`
  - 原則: **Organisms / Templates** を置く（画面固有 or 機能固有のブロック）。
  - Presenter をここに置くことが多い。
- `frontend/src/pages/`
  - 原則: **Pages（Container）** を置く。

#### 分割の判断基準

- 小さくする（Atoms/Molecules寄り）
  - 2画面以上で使う。
  - デザインの統一が重要（ボタン、入力、テーブル等）。
  - Storybook でバリエーションを管理したい。
- まとめる（Organisms寄り）
  - その画面（またはその機能）に閉じた複合UI。
  - APIや状態と密に結びつく（ただし Presenter 自体は副作用を持たない）。

#### 実装ルール（最低限）

- 1コンポーネントの責務は1つに寄せ、Props は必要最小限にする。
- `uiParts` は「見た目と操作」中心（ビジネスロジックを入れない）。
- `uniqueParts` は画面固有の表示ブロックを許容するが、API呼び出しは Container 側に寄せる。
- 命名は役割が分かるようにする（例: `*Button`, `*Field`, `*Form`, `*Toolbar`, `*List`, `*Layout`）。

### Container / Presenter 方針

#### 目的（UI/ロジック分離）

- UI（見た目）とロジック（状態/通信/副作用）を分離し、テスト容易性・再利用性・保守性を上げる。

#### Presenter（表示コンポーネント）

- **責務**
  - props を受け取り、描画とユーザー操作イベントの通知のみを行う。
  - 可能な限り副作用を持たない（API呼び出し、ルーティング、localStorage 操作などはしない）。
- **依存**
  - `uiParts`（汎用UI部品）への依存はOK。
  - `services/api` や `react-query`、`react-router` への依存は原則持たない。
- **設計指針**
  - データは「表示に必要な形」に整形済みで受け取る（Presenter 内で複雑な変換をしない）。
  - イベントは `onClickXxx` / `onChangeXxx` のようにコールバックで外へ渡す。

#### Container（ロジック/接続コンポーネント）

- **責務**
  - API呼び出し、状態管理、入力バリデーション（画面ロジックとしての最小）、ルーティング、エラーハンドリング等を担当する。
  - Presenter に渡す props を組み立てる（DTO→表示モデル変換をここで行う）。
- **依存**
  - `services/api`、`hooks`、`react-query`、`react-router-dom` 等への依存はここに集約する。

#### 命名・配置（例）

- 原則: 画面は `pages` に Container を置く。
  - `frontend/src/pages/LearningItemsPage.tsx`（Container）
- Presenter は画面専用であれば `uniqueParts` に置く。
  - `frontend/src/components/uniqueParts/LearningItems/LearningItemsPresenter.tsx`
- 汎用化できる小さな部品は `uiParts` に置く。

#### 分割の目安

- 分ける（推奨）
  - API呼び出しや検索/フィルタ/ページング等の状態がある。
  - 同じ表示を別ページでも使い回したい。
  - Storybook に載せたい（Presenter の方が載せやすい）。
- 分けない（許容）
  - 小さく単純で、ロジックがほぼないコンポーネント。
  - 1ファイルに収めた方が読みやすい規模。

#### インターフェース（props）の基本

- Presenter の props は「表示に必要な最小のデータ」と「イベントコールバック」に限定する。
- `loading` / `error` 表示が必要な場合は、Presenter 側が `loading` / `errorMessage` を受け取って描画してよい。

#### コード例（概念）

```typescript
// Container
export function LearningItemsPage() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useLearningItemsQuery({ query });

  return (
    <LearningItemsPresenter
      query={query}
      onQueryChange={setQuery}
      items={data?.items ?? []}
      loading={isLoading}
      errorMessage={error ? '取得に失敗しました' : undefined}
      onReview={(id) => reviewMutation.mutate({ id })}
    />
  );
}

// Presenter
export function LearningItemsPresenter({
  query,
  onQueryChange,
  items,
  loading,
  errorMessage,
  onReview,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  items: Array<{ id: string; title: string }>;
  loading: boolean;
  errorMessage?: string;
  onReview: (id: string) => void;
}) {
  return (
    <div>
      <TextField value={query} onChange={(e) => onQueryChange(e.target.value)} />
      {loading && <TextMessage text="Loading..." />}
      {errorMessage && <TextMessage text={errorMessage} />}
      <BasicTable
        rows={items}
        onRowAction={(row) => onReview(row.id)}
      />
    </div>
  );
}
```

### ドメイン

#### 方針（DDDを意識したTypeScript型設計）

- TypeScriptの型は「どの層の概念か」を明確にし、**Domain / DTO / Persistence（DB/ORM）** を混ぜない。
- 目的は以下:
  - 仕様（業務ルール）を型で表現し、変更に強くする
  - `string`/`number` の氾濫（Primitive Obsession）を抑えて取り違えを防ぐ
  - APIやDBの都合がドメインに漏れることを防ぐ

#### 型のレイヤー分離

- **Domain Model（ドメイン型）**
  - 業務上の概念（学習アイテム、復習履歴、スケジュール等）を表す。
  - 可能な限り不変（immutable）に扱い、生成時に不変条件（invariant）を満たす。
- **DTO（API入出力型）**
  - HTTPのrequest/responseの形に合わせる型。
  - `snake_case`/`camelCase` や optional の揺れ等、境界で吸収して Domain へ変換する。
- **Persistence（永続化/ORM型）**
  - Prisma等の生成型やDBの都合（NULL許容、正規化形）を表す。
  - Domainに直接露出させず、Repository/Mapperで変換する。

#### Value Object / IDの扱い

- IDや日付、タグ名など「意味のあるプリミティブ」は Value Object（または branded type）で表現する。
  - 例: `LearningItemId`, `UserId`, `Email`, `TagName`
- Domain 内部では `string` を直接使い回さない（取り違え防止）。
- Value Objectは生成関数（factory）で作り、そこでバリデーションを行う。
  - 例: `Email.create(value)` / `TagName.create(value)`

#### Entity / Aggregate（最小ルール）

- Domainの更新は「関数/メソッド」に寄せてルールを閉じ込める。
  - 例: `applyReview(result)` が `nextReviewAt` を更新する、など
- APIやUIの都合で Domain を直接書き換えない（DTO→Domain変換→ルール適用→保存の流れにする）。

#### Mapper（変換）

- 変換は明示的に行う（暗黙な型流用をしない）。
  - `dtoToDomain` / `domainToDto` / `prismaToDomain` / `domainToPrisma` のような関数名で統一する。
- 日付は境界で正規化する（例: APIはISO文字列、Domainは `Date` を許容、などルールを決める）。

#### バリデーション

- バリデーションは「境界」で必ず行う。
  - FE: フォーム送信前の最小バリデーション（UX改善）
  - BE: リクエスト受領時のバリデーション（必須）
- 可能ならスキーマ（例: Zod等）から型を生成して二重管理を避ける（採用可否は別途）。

#### アンチパターン（禁止/注意）

- Prismaの生成型（`Prisma.*` や `@prisma/client` の型）をそのまま画面/ドメインで使い回す。
- `any` や過剰な型アサーション（`as`）で型安全性を崩す。
- DomainにHTTPの概念（status code、request objectなど）を持ち込む。

### 命名規則（変数/関数/型）

#### React

- コンポーネント名は **PascalCase**。
  - 例: `LearningItemsPage`, `LoginForm`, `BasicButton`
- hooks は `use` で開始。
  - 例: `useLearningItemsQuery`, `useLoginMutation`
- state は名詞、setter は `setXxx`。
  - 例: `const [query, setQuery] = useState('')`

#### TypeScriptの型

- 型/インターフェース/enum は **PascalCase**。
  - 例: `LearningItem`, `ReviewHistory`, `SrsAlgorithm`
- DTO は末尾に `Dto` を付ける（Domainと区別）。
  - 例: `LearningItemDto`, `CreateLearningItemRequestDto`
- APIの入出力は `Request` / `Response` を付ける。
  - 例: `LoginRequestDto`, `LoginResponseDto`
- Union の判別には `type`（または `kind`）を使う（discriminated union）。

### デザイン方針

- アプリケーションは、PC、タブレット、スマートフォンでの利用を想定し、レスポンシブデザインを採用すること。
  - 各画面サイズの分岐点は、以下とする。
    - スマートフォン: 幅 0px ～ 599px
    - タブレット: 幅 600px ～ 899px
    - PC: 幅 900px 以上
- UIコンポーネントライブラリとしては、Material-UIを使用し、一貫したデザインとユーザーエクスペリエンスを提供すること。
- バリデーションは、フロントエンドとバックエンドの両方で実装し、ユーザー入力の整合性を確保すること。
- セキュリティを考慮して、バックエンドでは入力データのバリデーションを徹底し、SQLインジェクションやXSS攻撃などの一般的な脆弱性に対策を講じること。
- Reactのコンポーネントは、可能な限り関数コンポーネントとフックを使用して実装し、コードの可読性と再利用性を高めること。
- Reactのコンポーネントは、storybookを用いてドキュメント化し、各コンポーネントの使用例やバリエーションを明示すること。

### 例外操作（ブラウザバック/フォワード/リロード）対応方針

#### 目的

- ブラウザバック/フォワード/リロードを行っても、画面状態（検索条件・ページなど）が破綻せずに復元されるようにする。

#### 基本方針

- **URL（path + query）を画面状態のソース**にする。
  - 一覧画面の検索/フィルタ/ソート/ページング等は URL クエリに反映する。
  - 例: `?q=...&page=2&sort=recommended&order=desc`
- **サーバ状態（取得データ）は再取得可能**にする。
  - リロード後は React Query（または同等）で API を再実行して復元する。
  - 重要なデータを「メモリ上の state にしか存在しない」状態にしない。
- **UI一時状態（モーダル開閉など）は原則リセットされても良い**。
  - リロードで消えて困る状態のみ、URL化または永続化（別途検討）する。

#### 実装指針（React Router）

- 画面（Container）は `location.search`（`useSearchParams` 等）から状態を初期化し、以降も変更を購読して同期する。
  - back/forward で URL が戻った時に state が追従するようにする。
- 画面操作で状態を変える時は、URL を更新する。
  - 文字入力のたびに履歴を汚さないため、検索入力の途中は `replace`、確定操作（Enter、フィルタ確定など）は `push` を基本とする。
  - ページング操作は back/forward で戻れる方が自然なので `push` を基本とする。

#### リロード時の考え方

- URL から復元できる状態は URL で復元する。
- 取得データは API 再取得で復元する（キャッシュ永続化はMVPでは必須にしない）。
- フォームの入力途中データはリロードで失われても良い（MVP）。
  - 失われると困る場合は「下書き保存（localStorage等）」を別要件として扱う。

### PRG（Post/Redirect/Get）対応方針（フォーム二重送信防止）

#### 目的（PRG）

- POST（作成/更新）直後にブラウザのリロードや戻る操作が入っても、**同じPOSTが再送されない**ようにする。
- 成功後の画面は GET で再現できる状態にし、URLを正とする（例外操作方針と整合）。

#### 基本方針（PRG）

- **POST成功後は、結果表示ページ（GET）に遷移させる**。
  - 例: 作成 `POST /learning-items` → 詳細 `GET /learning-items/:id`
- 失敗時（バリデーション/権限/サーバエラー）はリダイレクトせず、その場でエラー表示する。

#### 実装指針（SPA + JSON API の場合）

- 「HTTPのリダイレクトでPRG」を厳密に行う代わりに、**フロントエンドが成功後に `navigate` し、遷移先でGET（再取得）する**ことで同等の効果を得る。
  - POSTレスポンスは `id` など遷移に必要な最小情報に留め、表示データは遷移先のGETで取得する。
- 送信中は二重クリックを防ぐ（送信ボタン disabled / `isPending` ガード）。

#### 実装指針（サーバがHTMLフォームを受ける場合）

- POST成功時は `303 See Other`（または `302`）で GET のURLへリダイレクトする。
  - 例: `POST /learning-items` → `303 Location: /learning-items/:id`

#### 補足（必要になった場合）

- 連打/再送が業務的に致命的な操作は、バックエンド側で冪等性（Idempotency-Key 等）も検討する（MVPでは必須にしない）。

### ページ表示基盤 / ルーティング（react-router-dom）

- URLと表示するコンポーネントの紐づけをcontents/contents.tsに定義する。
- メニュー表示のコンポーネントは、contents.tsを読み込みメニューを表示する。ページを増減がある場合は、contents.tsから追加、削除を実施することで、ページを追加することが可能。

  ```ts
  export const contentItems: ContentItem[] = [　// ルーティング対象のコンテンツ
    { link: '/', key: 'top', componentId: 'Top' },
    { link: '/counter', key: 'counter', componentId: 'Counter' },
  ]

  export const headerMenuItems: HeaderMenuItem[] = [ // メニューに読み込む
    { text: 'Top', initialLink: '/' },
    { text: 'Counter', initialLink: '/counter' },
  ]

  export const componentMap: ComponentMap = {　// componentIdと表示コンポーネントのcontainerのマッピング
    'Top': TopContainer,
    'Counter': Counter,
  };
  ```

- ページ表示基盤は、ヘッダーメニューとコンテンツの構成となる。
  - ヘッダーメニューはページの左端にロゴとアプリ名を表示し、さらに右側にページのリンクを表示したメニューを表示する。
  - コンテンツは、ヘッダーメニューで選択したコンテンツを表示する。初期表示は、TOP画面を表示する。

## バックエンド

### 命名規則（バックエンド）

#### 目的（バックエンド命名規則）

- ルーティング/バリデーション/永続化（Prisma）をまたいでも読み手が迷わない命名に統一する。
- 「URL・ファイル名・関数名・DTO名」が相互に対応し、検索しやすい構造にする。

#### URL（エンドポイント）

- リソースは **複数形 + kebab-case** を基本とする。
  - 例: `/learning-items`, `/review-histories`
- コレクション配下の単一リソースは `/:id`。
  - 例: `GET /learning-items/:id`
- 動詞をURLに入れない（`/learning-items/create` は避ける）。

#### ルート/ハンドラ（Express）

- handler は HTTP 動詞に対応する動詞で開始する。
  - 例: `getLearningItems`, `getLearningItemById`, `createLearningItem`, `updateLearningItem`, `deleteLearningItem`
- Express の引数名は慣習に合わせて `req`, `res`, `next` の短縮を許容する（共通命名規則の例外）。

#### レイヤ別（controller/service/repository）

- Controller
  - HTTP入出力を扱う層。命名は `*Controller`、関数は `getXxx/createXxx` など。
  - 例: `LearningItemController.createLearningItem`
- Service（ユースケース）
  - ビジネス処理の入口。命名は `*Service`、関数はユースケースの動詞。
  - 例: `ReviewService.applyReview`, `LearningItemService.createLearningItem`
- Repository（永続化）
  - DB操作を抽象化。命名は `*Repository`。
  - 取得: `findById`, `findMany`, `findByXxx`
  - 作成: `create`
  - 更新: `update`
  - 削除: `delete`

#### バリデーション（express-validator）

- validator は対象操作が分かる命名にする。
  - 例: `createLearningItemValidators`, `updateLearningItemValidators`
- バリデーション結果の整形関数は `toValidationErrorDetails` のように変換目的が分かる名前にする。

#### DTO / 型

- リクエスト/レスポンスは `*RequestDto` / `*ResponseDto`。
  - 例: `CreateLearningItemRequestDto`, `LearningItemResponseDto`
- IDパラメータ等の軽量な型は `*ParamsDto` / `*QueryDto` を使ってもよい。
  - 例: `LearningItemIdParamsDto`, `LearningItemListQueryDto`

#### Prisma（schema.prisma）

- model
  - **PascalCase + 単数形**（Prisma標準）
  - 例: `LearningItem`, `ReviewHistory`, `Category`
- フィールド
  - **lowerCamelCase**
  - 外部キーは `xxxId`（例: `categoryId`, `learningItemId`）
- enum
  - enum名は **PascalCase**、値は **UPPER_SNAKE_CASE**（Prisma標準）
  - 例: `ReviewOutcome.REMEMBERED`

#### 環境変数（.env）

- 環境変数名は **UPPER_SNAKE_CASE**。
  - 例: `PORT`, `DATABASE_URL`
- boolean系は `FEATURE_X_ENABLED` のように意味が分かる名前にする。

### Prisma トランザクション

#### 目的（Prismaトランザクション）

- 「複数のDB更新をまとめて原子的に行う」必要がある箇所で、データ不整合を防ぐ。
- ロックや競合の影響を最小化し、タイムアウト/デッドロックなど運用上の事故を避ける。

#### 基本方針（Prismaトランザクション）

- トランザクションは **短く** 保つ（CPU重い処理、外部I/O、長い待ちを入れない）。
- トランザクション内では以下を避ける。
  - 外部API呼び出し、メール送信、ファイルI/O
  - 長いループや大量データの加工
  - ユーザー入力待ち（当然）
- 「結果を次のクエリで使う」など **クエリ間に依存関係** がある場合は、
  配列形式ではなく **interactive transaction（コールバック形式）** を使う。

#### 使い分け

- 配列形式（単純で短い、依存が無い場合）

```ts
await prisma.$transaction([
  prisma.learningItem.update({ where: { id }, data: { updatedAt: new Date() } }),
  prisma.reviewHistory.create({ data: { learningItemId: id, outcome, notes } }),
]);
```

- interactive transaction（依存がある/Repositoryに`tx`を渡したい場合）

```ts
await prisma.$transaction(async (tx) => {
  const item = await tx.learningItem.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "NOT_FOUND", "対象が存在しません");

  await tx.reviewHistory.create({ data: { learningItemId: id, outcome, notes } });
  await tx.learningItem.update({ where: { id }, data: { nextReviewAt } });
});
```

#### tx（トランザクションクライアント）の受け渡し

- トランザクションを張る層（多くは Service/UseCase）で `tx` を生成し、
  Repository に `tx` を引数として渡せる設計にしておく。
- `tx` があるのに Repository 内でグローバルな `prisma` を参照しない（同一TX外になり不整合の原因）。

#### タイムアウト/待ち時間

- 可能なら `maxWait` / `timeout` を設定し、トランザクションが詰まった時に早期に失敗させる。
  - 例（概念）: `prisma.$transaction(fn, { maxWait: 5000, timeout: 10000 })`
- タイムアウト時は 500 にせず、原因をログで追えるよう `requestId` と併せて記録する。

#### 分離レベル（isolation level）とリトライ

- 分離レベルはDB既定に依存するため、「厳密さが必要な箇所」だけ明示する。
- `SERIALIZABLE` 等の強い分離レベルでは **競合による失敗が増える** ため、
  競合エラー（デッドロック/書き込み競合）を検知して **短いリトライ** を入れることを検討する。
- リトライする処理は冪等性に注意する（重複作成を防ぐため、ユニーク制約やIdempotency-Keyと併用）。

### エラーハンドリング

#### 目的（バックエンド・エラーハンドリング）

- バックエンドのエラーを **一貫した形式（JSON）** で返し、フロントエンドでの扱いを単純化する。
- 4xx（クライアント起因）と 5xx（サーバ起因）を明確に分け、運用ログで原因追跡しやすくする。
- **内部情報（スタックトレース/SQL/接続情報/個人情報）をレスポンスに漏らさない**。

#### 基本方針（バックエンド・エラーハンドリング）

- ルートハンドラ内で場当たり的に `try/catch` して `res.status(...).json(...)` を乱立させず、
  **共通のエラーハンドリング（middleware）で一元変換**する。
- アプリ内部では「意味のあるエラー」を `throw` し、HTTPへの変換は境界（Express）で行う。
- 返却するのは **安定した `code`** と、ユーザー向けの **安全な `message`**（必要なら `details`）。

#### エラーレスポンス形式（統一）

- 2xx 以外は原則 `application/json` で以下の形に統一する。

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力が不正です。",
    "details": {
      "fields": [
        { "field": "title", "message": "必須です" }
      ]
    }
  },
  "requestId": "01HZX..."
}
```

- `error.code`
  - フロントが分岐に使える **機械可読な識別子**（英大文字 + `_` 推奨）。
  - 例: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`
- `error.message`
  - 画面表示に使える **ユーザー向けメッセージ**。
  - 5xx では原因を特定できる情報を入れず、固定文言（例: `"サーバエラーが発生しました。"`）を基本とする。
- `error.details`
  - 4xx のうち、クライアントが修正に必要な情報のみを返す（バリデーションエラー等）。
  - 5xx では原則返さない。
- `requestId`
  - リクエスト相関用（ログ検索に使用）。`X-Request-Id` が来たら採用、無ければサーバで採番。

#### HTTP ステータス割当（目安）

- `400 Bad Request`
  - リクエスト形式不正、パース不能、バリデーション（入力値不正）
  - `code`: `VALIDATION_ERROR`
- `401 Unauthorized`
  - 認証が必要（未ログイン/トークン不正）
  - `code`: `UNAUTHORIZED`
- `403 Forbidden`
  - 認証済みだが権限不足
  - `code`: `FORBIDDEN`
- `404 Not Found`
  - リソース不存在
  - `code`: `NOT_FOUND`
- `409 Conflict`
  - 一意制約違反、状態競合（重複作成など）
  - `code`: `CONFLICT`
- `422 Unprocessable Entity`
  - 形式は正しいがドメイン規則に反する（ビジネスルール違反）
  - `code`: `DOMAIN_RULE_VIOLATION`
- `429 Too Many Requests`
  - レート制限（必要になった時点で導入）
  - `code`: `RATE_LIMITED`
- `500 Internal Server Error`
  - 予期しない例外 / 依存先障害の隠蔽
  - `code`: `INTERNAL_ERROR`

#### バリデーションエラー（express-validator）

- ルート定義で `express-validator` を使い、`validationResult(req)` で失敗時は `400` を返す。
- `details.fields` は以下の形を推奨（フロントでフォーム項目に紐付けやすい）。

```ts
type ValidationFieldError = { field: string; message: string };
```

#### Prisma 例外の扱い（DBエラーの正規化）

- Prisma由来の例外は、そのまま文字列化して返さず、**HTTP + code にマッピング**する。
  - 一意制約違反（例: `P2002`）→ `409 CONFLICT`
  - 対象なし（例: `P2025`）→ `404 NOT_FOUND`
  - それ以外 → `500 INTERNAL_ERROR`

#### ログ方針

- 5xx は必ず `error` レベルでログ出力する（`requestId`, `method`, `path` を含める）。
- 4xx は原則 `info` もしくは抑制（大量に出るため）。ただし監査上必要なものは別途検討。
- レスポンスにはスタックトレース等を含めないが、ログにはスタックトレースを含めてよい。
- 個人情報・認証情報（パスワード、トークン、メール等）はログに出さない。

#### 実装指針（Express）

- 例外は `ApiError`（または同等）として `throw` し、最後の error-handling middleware で変換する。
- Express の error-handling middleware は **ルーティング登録の最後**に置く。

```ts
// 例: 共通エラー型
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

// 例: error-handling middleware（概念）
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const requestId = (req.headers["x-request-id"] as string | undefined) ?? undefined;

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
      requestId,
    });
  }

  // 予期しない例外
  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "サーバエラーが発生しました。" },
    requestId,
  });
});
```

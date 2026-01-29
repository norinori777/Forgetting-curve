# テスト方針（Jest）

## 目的

- 本プロジェクトにおけるユニット／統合テストは `Jest` を標準とする。
- コンポーネントの品質確保と回帰検知を目的に、開発者が容易にテストを追加・実行できる体制を作る。

## 適用範囲

- UI コンポーネント（React）: `@testing-library/react` を併用して DOM に近い振る舞いを検証
- ロジック層（ユーティリティ、フック）: 純粋なユニットテスト
- API 呼び出しを含む機能: モック/スタブ（`msw` 推奨）を使った統合テスト
- E2E テストは別途（Cypress 等）、Jest はユニット／統合に集中

## テスト分類と責務

- ユニットテスト: 関数・フック・小コンポーネントの振る舞い検証（副作用はモック）
- コンポーネント統合テスト: 親子コンポーネントの連携・イベントハンドリング・レンダリング結果
- API 統合テスト（フロント側）: `msw` でバックエンド応答を模擬して UI の一連挙動を検証

## 推奨ライブラリ / 設定

- jest
- @testing-library/react / @testing-library/user-event
- msw（Mock Service Worker）
- jest-environment-jsdom
- ts-jest または babel-jest（TypeScript 対応）
- jest-extended（任意）

## ディレクトリ構成 / 命名規則

- テストはソースファイルと近く置く（推奨）: `src/components/SearchBar/SearchBar.test.tsx`
- 代替: `__tests__` フォルダを使用しても可
- テストファイル名: `*.test.ts`, `*.test.tsx`（明示的）

## Jest 設定（例）

- `jest.config.js` の主要設定例:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

- `test/setupTests.ts` で `@testing-library/jest-dom` の import、`msw` の起動処理などを行う

## package.json スクリプト例

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --runInBand"
  }
}
```

## CI 統合（簡易）

- GitHub Actions のワークフローで `npm ci` → `npm run test:ci` を実行
- 重要: `--runInBand` や `--maxWorkers=50%` を使い CI の並列制限に合わせる

## テスト設計上のガイドライン

- 小さく独立したテストを書く（1 テスト1 アサーションを目指す）
- 外部依存（API・日時・ランダム）はモック化する
- `msw` を使ってエンドポイントの正常/異常系をテストする
- 非同期処理は `await` / `findBy*` を使い安定させる
- タイマー（debounce 等）は `jest.useFakeTimers()` と `advanceTimersByTime()` で制御する
- テスト間でグローバルな副作用を残さない（`afterEach(() => jest.clearAllMocks())`）
- スナップショットは差分レビューの負担になりがちなので、UI の安定した部分に限定する

## カバレッジ方針

- 初期目標: グローバルで 80%（段階的に引き上げ可）
- 重要ロジック（復習日計算など）は高いカバレッジを要求

## テストデータ / フィクスチャ

- 代表的なケースを小さな JSON フィクスチャとして `test/fixtures` に配置
- テストで使う日時は固定（例: `2026-01-01T00:00:00Z`）にして比較を安定化

## 例外／エッジケースの取り扱い

- 存在しない ID → 404 を返すケースを `msw` で模擬して UI のエラーハンドリングを検証
- 期限超過／当日／未来日のソート順を比較するテストを用意

## `SearchBar` の具体的なテストケース（優先実装）

1. レンダリング
   - placeholder と初期表示が正しいこと
2. 入力と `onChange`
   - 文字入力で `onChange` が呼ばれる
3. デバウンスと `onSearch`
   - `debounceMs` を待って `onSearch` が呼ばれる（`jest.useFakeTimers()` を使用）
   - 連続入力時に古いタイマーがキャンセルされる
4. Enter キーで即時検索
   - Enter 押下でデバウンスをキャンセルして `onSearch` が即時呼ばれる
5. 補完（`fetchSuggestions`）
   - 候補が表示されること、上下キーで選択できること、Enter で候補が選ばれること
6. アクセシビリティ属性
   - `role="combobox"`, `aria-expanded`, `aria-activedescendant` が適切に更新される
7. エラー耐性
   - `fetchSuggestions` が失敗しても UI が破綻しない

## テストの実行例（ローカル）

```bash
# 単発実行
npm run test
# カバレッジ
npm run test:coverage
# ウォッチモード
npm run test:watch
```

## 開発フローでの慣例

- 新しい機能は必ず少なくとも1つのユニットテストを含める
- バグ修正は再発防止のため回帰テストを追加する
- PR にテストが不足している場合は CI で失敗させるルールを導入する（coverage gate）

## 参考実装スニペット（`SearchBar` のデバウンス検証）

```ts
test('debounced onSearch is called after debounceMs', async () => {
  jest.useFakeTimers();
  const onSearch = jest.fn();
  render(<SearchBar debounceMs={500} onSearch={onSearch} />);
  userEvent.type(screen.getByRole('searchbox'), 'hello');
  // まだ呼ばれていない
  expect(onSearch).not.toHaveBeenCalled();
  // タイマーを進める
  act(() => { jest.advanceTimersByTime(500); });
  expect(onSearch).toHaveBeenCalledWith('hello');
  jest.useRealTimers();
});
```

---

## 次の推奨タスク

- `SearchBar` の実際のテスト実装（上記ケース）を追加する。 
- `test/setupTests.ts` と `jest.config.js` をプロジェクトルートに追加して CI 連携を行う。



# コンポーネント設計：SearchBar（検索バー）

## 目的

- 学習項目一覧画面でのフリーワード検索入力を受け付け、入力に応じた検索実行（デバウンス／Enter送信）と補完候補表示を提供する。
- アクセシビリティとキーボード操作を満たす。API 呼び出しは親コンポーネントに委譲可能とする。

---

## 概要

- コンポーネント名: `SearchBar`
- 使用箇所: 学習項目一覧ページ（`LearningItemsPage`）や他の一覧フィルタ領域
- 実装想定: React コンポーネント（TSX）

---

## 公開 Props（API）

- `value?: string` — 入力の初期値（コントロールド利用時に同期）
- `placeholder?: string` — プレースホルダ（デフォルト: "タイトル・内容を検索"）
- `debounceMs?: number` — デバウンス時間（ミリ秒、デフォルト: 500）
- `onSearch: (query: string) => void` — デバウンス後または Enter 押下時に呼ばれる検索ハンドラ
- `onChange?: (value: string) => void` — 入力値が変わるたびに呼ばれる（リアルタイム）
- `fetchSuggestions?: (query: string) => Promise<string[]>` — 自動補完候補を取得する非同期関数（任意）
- `showClearButton?: boolean` — クリアボタンを表示するか（デフォルト: true）
- `ariaLabel?: string` — スクリーンリーダ向けラベル（デフォルトあり）
- `className?: string` — 外部スタイルクラス
- `autoFocus?: boolean` — マウント時にフォーカスするか

---

## 内部状態（state）

- `inputValue: string` — 表示中の入力値（props.value と同期）
- `isFocused: boolean` — 入力がフォーカスされているか
- `suggestions: string[]` — 補完候補リスト
- `loadingSuggestions: boolean` — 補完取得中フラグ
- `activeSuggestionIndex: number | null` — 補完選択のインデックス（キーボード操作で移動）
- `pendingTimer`（Ref）— デバウンス用のタイマー参照
- `abortController`（Ref）— 補完取得キャンセル用（fetchSuggestions がキャンセル対応する場合）

---

## 振る舞い / イベント

- 入力（キー入力）
  - `inputValue` を更新し、`onChange` を即時呼び出す（存在する場合）。
  - 入力後、`debounceMs` の遅延で `onSearch(inputValue)` を呼ぶ。
  - 途中で新しい入力があれば古いデバウンスタイマーをクリアする。
- Enter キー
  - 補完が開いていてアイテムが選択されていればその候補を選択して `onSearch(selected)` を呼ぶ。
  - 補完がない／未選択であれば現在の `inputValue` を即時 `onSearch` 呼び出しする（デバウンス待ちをキャンセルして実行）。
- Esc キー
  - 補完リストを閉じる（開いている場合）、入力をクリアする（`Ctrl` 等の組合せは実装次第）。
- 矢印キー（↑↓）
  - `activeSuggestionIndex` を移動させる。`aria-activedescendant` を更新。
- クリアボタン
  - ワンクリックで `inputValue` を空にし、`onChange('')` と `onSearch('')`（オプション）を実行する。
- 補完候補
  - `fetchSuggestions` が与えられている場合、入力デバウンス後に補完取得を行い、結果を `suggestions` にセットする。
  - 補完取得は前のリクエストをキャンセル（可能なら AbortController）して最新結果のみを表示。

---

## アクセシビリティ（A11y）

- 入力フィールドに対して `label` を必ず提供する（`ariaLabel` prop で上書き可能）。
- 補完は WAI-ARIA `combobox` パターンに従う：
  - input: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded` を設定
  - 補完リスト: `role="listbox"`、各候補: `role="option"`
  - アクティブ候補は `aria-activedescendant` で参照
- 色に依存しない表示（選択は背景 + アイコン + aria 属性）
- 画面リーダに「候補 n 件」等を発話させるためのライブリージョン（`aria-live="polite"`）を活用
- クリアボタン・送信ボタンはキーボードで操作可能（Tab/Enter/Space）

---

## エラーハンドリング

- `fetchSuggestions` が失敗した場合はローカルでフォールバック（候補を空に）し、console.warn を出す。
- ネットワークエラーなど重大なエラーは親へのコールバック（必要なら `onError` prop）で上げる設計も検討可能。

---

## パフォーマンス考慮

- デバウンスはデフォルト 500ms（要件で 500ms 指定）
- 補完結果は小さいためキャッシュ（短時間）を導入しても良い（LRU で最大 50 エントリ程度）
- 大量候補を表示する場合は仮想化を検討（通常は不要）

---

## スタイル／デザイン要件

- 高さ: 40px（フォームコントロール標準）
- パディング: 0 12px
- アイコン: 左に検索アイコン、右にクリアボタン（×）とローディングスピナー
- フォーカス: アクセントカラーのアウトライン（デザインシステムのトークンを使用）
- モバイル: タッチしやすいサイズ（高さ 44px 推奨）

---

## テストケース（受け入れ基準）

- 初期レンダリングで placeholder とクリアボタン（非入力時は非表示）を確認
- 入力値が変わると `onChange` が即時呼ばれる
- デバウンス後に `onSearch` が呼ばれる（500ms、入力連続時は旧タイマーがクリアされる）
- Enter で即時 `onSearch` が呼ばれる
- `fetchSuggestions` が与えられた場合、補完が表示され、上下キーで選択、Enter で選択される
- 補完取得失敗時に UI が破綻しない
- キーボード操作で accessibility 属性が正しく更新される（aria-activedescendant 等）

---

## Storybook ストーリー（推奨）

- `Default` — プレースホルダのみ
- `WithInitialValue` — 初期値を渡したケース
- `WithSuggestions` — `fetchSuggestions` をモックして候補表示
- `LoadingSuggestions` — 補完ロード中のスピナー表示
- `KeyboardNavigation` — キーボードで候補を選択するシナリオ

---

## 実装例（React/TypeScript の擬似コード）

- 主要ロジックの抜粋（概念説明用）:

```tsx
function SearchBar({ value, placeholder, debounceMs = 500, onSearch, onChange, fetchSuggestions }) {
  const [inputValue, setInputValue] = useState(value ?? '');
  const timerRef = useRef<number | null>(null);

  useEffect(() => { setInputValue(value ?? ''); }, [value]);

  const scheduleSearch = (v: string) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => onSearch(v), debounceMs);
  };

  const handleInput = (e) => {
    const v = e.target.value;
    setInputValue(v);
    onChange?.(v);
    scheduleSearch(v);
    // fetchSuggestions も同様にデバウンスして呼ぶ
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      onSearch(inputValue);
    }
    // 矢印キー / Esc 処理
  };

  return (
    <div className="searchbar">
      <input
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={/* 補完開閉 */}
        aria-activedescendant={/* active id */}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {/* clear button, suggestions list */}
    </div>
  );
}
```

---

## バックエンド連携例（親コンポーネント側）
- `LearningItemsPage` 側で `onSearch` を受け取り、`GET /api/learning-items?q={query}` を呼ぶ。
- すべての検索条件は URL クエリに反映してページ遷移や共有を可能にする。

---

## 追加検討事項 / 拡張案
- 履歴機能：過去の検索ワードをローカルストレージに保存して候補として出す
- 高度な補完：タグ候補（オブジェクト）を表示し、選択でタグフィルタに変換する
- AI補完：要約や関連キーワードの自動提案（別プロジェクト検討）

---

## 参照
- 画面: [design/DetailDesign/learning-item-list/learning-items-list.md](design/DetailDesign/learning-item-list/learning-items-list.md)




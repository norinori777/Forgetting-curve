# ヘッダー仕様（Header / HeaderTitle / HeaderMenu）

## 1. 目的（何を提供するか）

- アプリ全体で共通表示するヘッダーを提供する
- 構成要素は「ヘッダー枠」「ヘッダータイトル（ICON+アプリ名）」「ヘッダーメニュー」の3つ

## 2. 非目的（やらないこと）

- Header（枠）コンポーネント内でルーティング制御・API呼び出しをしない
- メニュー項目の文言生成や権限制御（表示/非表示）を内部で判断しない（上位から渡す）

## 3. コンポーネント責務（揺れ止めの核心）

### Header（枠）

- 役割: レイアウト枠のみ。childrenを横並びで受ける
- 仕様: 既存の uiParts Header をそのまま使う（実装変更しない）
  - 参照: frontend/src/components/uiParts/Header/presenter.tsx

### HeaderTitle（ICON + アプリ名）

- 役割: 左側に表示する「アイコン + アプリ名」ブロック
- 入力（Props）
  - appName: string（必須）
  - iconSrc: string（必須）
  - iconAlt: string（必須）
  - to?: string（任意。指定時はクリックでそのURLへ遷移。未指定なら遷移なし）
  - theme?: TextMessage の theme（任意。未指定は normal）
  - size?: TextMessage の size（任意。未指定は base）
- 出力（見た目/挙動）
  - icon → appName の順で横並び
  - to がある場合のみ react-router の Link を使う（aタグ直書き禁止）
  - propsにthemeやsizeを渡すことで、タイトル文字の色やサイズを変更できること

### HeaderMenu（メニュー）

- 役割: 右側に表示するナビゲーションリンク群
- 入力（Props）
  - items: Array<{ label: string; to: string; }>
- 出力（見た目/挙動）
  - itemsの順番どおりにリンクを表示
  - クリックで react-router 経由でページ遷移
  - active表現（選択中スタイル）は「やる/やらない」を仕様で明記（未指定ならやらない）
  - propsにthemeやsizeを渡すことで、タイトル文字の色やサイズを変更できること

## 4. レイアウト/構造（HTMLの骨格）

- Header（枠）: <header>（既存）
- Title: <div> or <a>（to有無で切替）
- Menu: <nav aria-label="Header menu"><ul><li>... の形（ul/liは任意だが nav は必須）

## 5. アクセシビリティ（最低限）

- iconAlt は必須
- nav には aria-label を付ける
- メニューはキーボード操作でフォーカス移動できる（Linkを使う）

## 6. 受け入れ条件（例）

- Header に children を渡すと表示される（既存テストあり）
- HeaderTitle は icon + appName を表示する
- HeaderTitle は to が指定された時だけクリックで遷移できる
- HeaderMenu は items 数だけリンクを表示し、label が表示される
- HeaderMenu のリンク先（to）が正しい

## 7. テスト方針（Vitest）

- HeaderTitle/HeaderMenu は表示とリンク生成をテスト
- Linkを使うテストは MemoryRouter でラップして検証する（クリックでの遷移検証は「href生成」までに留める/またはrouter導入済み前提なら遷移も検証、どちらかを仕様に固定）

## 8. 実装制約（ブレ防止）

- Tailwindの新しい色を勝手に追加しない（既存トークン/既存部品に合わせる）
- 文言（アプリ名、メニュー名）はコンポーネント内でハードコードしない（Props/定義ファイルから注入）

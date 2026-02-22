# DetailDesign（画面設計 / 詳細設計）

このフォルダは「画面ごとの詳細設計」を置く場所です。

## 配置方針

- 画面遷移の一覧・全体図は [docs/design/BasicDesign/ScreenTransitions/](docs/design/BasicDesign/ScreenTransitions/) に置く
- 個別画面の UI 要素・状態・バリデーション・受け入れ条件などはここ（DetailDesign）に置く

## ディレクトリ命名

- 1画面 = 1ディレクトリ
- ディレクトリ名は **kebab-case**（英小文字+ハイフン）
  - 例: `login`, `learning-item-list`, `learning-item-detail`, `review-today`

## ファイル命名

- 基本は「その画面のメイン仕様 1ファイル」で完結させる
- ファイル名はディレクトリ名と一致させる
  - 例: `login/login.md`, `learning-item-list/learning-item-list.md`

※ 既存の `learning-item-list/learning-items-list.md` のように複数形になっているケースがあるため、今後新規追加分は上記ルールに寄せるのがおすすめです（既存の改名は必須ではありません）。

## 画像・添付

- 画面のスクリーンショットやワイヤーフレームを置く場合は、各画面ディレクトリ配下に `images/` を作る

## テンプレ

- 新規作成時は [docs/design/DetailDesign/_template/screen.md](docs/design/DetailDesign/_template/screen.md) を複製して使う

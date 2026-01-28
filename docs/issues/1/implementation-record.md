# Issue #1 実装記録

## 目的

現在のTodoアプリでは「未完了/完了」の2状態のみでタスク管理が限定的だったため、「Todo（未着手）」「InProgress（進行中）」「Done（完了）」の3段階ステータスを導入し、カンバンボード形式の一覧画面によってタスクの進捗状況を視覚的に把握しやすくする。

## 達成したこと

- Todo型定義をcompleted: booleanからstatus: 'todo' | 'inProgress' | 'done'のUnion型に変更
- 3カラム構成（Todo / In Progress / Done）のカンバンボード形式の一覧画面を実装
- @dnd-kit/coreを使用したドラッグ&ドロップによるステータス変更機能を実装
- ドラッグオーバーレイ、ドロップターゲットのビジュアルフィードバック、活性化距離設定によるクリック/ドラッグの区別などのUX向上
- 詳細画面にステータス変更用セレクトボックスを追加（編集モードのみ表示）
- 既存データとの互換性を保つためstorage.tsにマイグレーション処理を実装（completed: true→'done', completed: false→'todo'）
- 完了タスクの視覚的な差別化（透明度低下、取り消し線）
- レスポンシブ対応（モバイル1カラム、タブレット以上3カラム）
- 関連ドキュメント（README、components、data-flow、hooks、画面仕様）の更新
- HumanReviewでの指摘に基づき、docs/architecture/components.mdのコメント例から不要な補足説明「（カンバンボード）」を削除

## アプローチ

既存のContainer/Componentパターンを踏襲し、KanbanBoardContainerがDnDContextとステート管理を担当、View系コンポーネント（KanbanBoardView、KanbanColumnView、KanbanCardView）は純粋な表示ロジックに集中する設計とした。ドラッグ&ドロップには@dnd-kit/coreを採用し、DraggableKanbanCardとDroppableKanbanColumnで機能を分離。useTodosフックにupdateTodoStatus関数を追加し、既存のtoggleComplete関数を置き換えた。LocalStorageへの永続化は変更せず、loadTodos関数内で旧形式から新形式への自動マイグレーションを実装。

## 重要な判断と理由

### ドラッグ&ドロップライブラリの選定

**決定**: @dnd-kit/coreを採用

**理由**: 軽量でモダンなAPIを持ち、React 18に完全対応。react-beautiful-dndはAtlassianがメンテナンス終了、react-dndは複雑なAPI。センサーベースのアーキテクチャでキーボード操作やアクセシビリティにも対応しやすい。

### ステータスの型定義

**決定**: Union型 'todo' | 'inProgress' | 'done'を採用

**理由**: TypeScriptのUnion型はenumより軽量で型推論が直感的。JSONシリアライズ時にそのまま文字列として保存できるためlocalStorageとの親和性が高い。

### カンバンボードのコンポーネント設計

**決定**: Container/View分離パターンを踏襲

**理由**: 既存のプロジェクト構造との一貫性を保ち、テスタビリティと保守性を確保するため。

### 既存データのマイグレーション方法

**決定**: storage.tsのloadTodos関数内で自動変換

**理由**: ユーザーの既存データを保護しつつ透過的にマイグレーションを行い、ユーザーは何も意識せずに新機能を使い始められる。

### 詳細画面でのステータス変更UI

**決定**: ドロップダウンセレクトボックスを採用

**理由**: ヘッダー内の限られたスペースにコンパクトに配置でき、削除ボタンや保存ボタンとのバランスを保てる。

### ドキュメント内のコメント例の表記

**決定**: HumanReviewの指摘を受け、コメント例から「（カンバンボード）」という補足を削除

**理由**: コメント例は汎用的であるべきで、特定機能への言及は不要と判断された。

## 注意点

- Todo型の破壊的変更: completedフィールド(boolean)がstatusフィールド('todo' | 'inProgress' | 'done')に置き換わった。この変更は型システム全体に影響するため、関連コンポーネントの修正が必要。
- useTodosフックのAPI変更: toggleComplete関数が削除され、updateTodoStatus関数に置き換わった。呼び出し元のコードは新しいAPIに合わせて更新が必要。
- @dnd-kit/sortableは将来のカラム内並び替え機能に備えて追加されているが、現時点では使用されていない。将来の拡張で活用予定。
- 既存データの自動マイグレーション: loadTodos関数が旧形式（completed）を検出すると自動で新形式（status）に変換して返す。saveTodos時には新形式で保存される。
- カラム内のタスク並び順は既存のtodos配列の順序を維持。将来的にカラム内での並び替えが必要になった場合はsortableContextの追加で対応可能。
- ドキュメント更新時は、コード例やコメント例に特定機能への言及を含めないよう注意する（HumanReviewで指摘された点）。

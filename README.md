# シヤチハタ 音響ペンライト ランディングページ

シヤチハタの音響ペンライト＆スマホペンライトのランディングページです。

## 技術スタック

- **Framework**: Next.js 16.0.10
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Lucide React

## セットアップ

### 必要な環境

- Node.js 20以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

本番用のビルドを作成する場合：

```bash
npm run build
```

ビルド後のサーバーを起動する場合：

```bash
npm start
```

## プロジェクト構造

```
├── app/              # Next.js App Router
│   ├── page.tsx      # メインページ
│   ├── layout.tsx    # レイアウト
│   ├── globals.css   # グローバルスタイル
│   └── thanks/       # サンクスページ
├── components/       # Reactコンポーネント
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ContactForm.tsx
│   └── ...
├── lib/             # ユーティリティ関数
└── ref/             # 参考資料
```

## 主な機能

- レスポンシブデザイン
- 動画コンテンツ表示
- お見積もり機能
- チェックリストビルダー
- お問い合わせフォーム
- Salesforce連携

## 開発コマンド

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルドを作成
- `npm run start` - 本番サーバーを起動
- `npm run lint` - ESLintでコードをチェック

## ライセンス

Private

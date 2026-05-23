# おおきなメモ (big-memo)

Shows large-text, large-button notes and today's to-dos that family members write for the user to read.

「おおきなメモ」は、家族が書いたメモと今日のやることを、大きな文字と大きなボタンで表示する Chrome 拡張です。日本語をデフォルトに、英語UIにも対応しています。

## Chrome Web Store 向けの範囲

- 単一用途: 家族が書いた大きな文字のメモと今日のやることを表示します。
- 完全オフライン: API通信、外部送信、ホスト権限はありません。
- 権限: `storage` のみです。
- 非医療: 診断、治療、医療助言、医療効果の表示は行いません。
- 発信、通話、メッセージ送信機能はありません。

## 使い方

1. 家族が「家族が書き込む」欄にメモや今日のやることを入力します。
2. 入力内容はこのブラウザの `chrome.storage.local` に保存されます。
3. 利用者は拡張アイコンを押して、大きな文字のメモと今日のやることを読みます。
4. 今日のやることは、大きな「できた」ボタンで完了状態にできます。

## 開発

```bash
npm install
npm run build
```

`npm run build` で `dist/` が生成され、`manifest.json`、`_locales/ja`、`_locales/en`、`icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png` が含まれます。

## 構成

- `src/core/`: Chrome API に依存しない純ロジック
- `src/storage/`: 保存アダプタ。現在は `chrome.storage.local` 実装
- `public/manifest.json`: Manifest V3 設定
- `public/_locales/`: Chrome 拡張のローカライズ文言
- `legal/`: Privacy Policy と Disclaimer

## Premium 枠組み

- Premium は買い切り `$3` の想定です。
- 初回起動日時から 7 日間をトライアルとして判定します。
- Stripe 本番リンクは `STRIPE_PAYMENT_LINK` 定数の placeholder のままです。
- Premium が無効でも、基本のメモと今日のやることは利用できます。

## Legal

- [Privacy Policy](legal/PRIVACY.md)
- [Disclaimer](legal/DISCLAIMER.md)

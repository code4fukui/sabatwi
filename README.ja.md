# さばつい (sabatwi)

Denoで構築されたシンプルで軽量な、Twitterライクなマイクロブログプラットフォームです。Webプッシュ通知によるリアルタイム更新機能と、Deno KVを使用したデータ永続化機能を備えています。

- **ライブデモ:** [sabatwi.com](https://sabatwi.com/)
- **Issue / フィードバック:** [GitHub Issues](../../issues)

## 機能

- 短いメッセージ（ツイート）の投稿と閲覧
- 投稿へのいいねと返信
- 新規アクティビティのリアルタイムWebプッシュ通知
- Deno KV (SQLiteバックエンド) を使用したデータの永続化
- 依存関係のないシンプルなフロントエンド
- NginxとLet's Encrypt SSLを使用したサーバーセットアップガイドを同梱

## はじめに

### 前提条件

- [Deno](https://deno.land/) 1.x

### ローカル開発

1. リポジトリをクローンします:
    ```sh
    git clone https://github.com/code4fukui/sabatwi.git
    cd sabatwi
    ```

2. サーバーを起動します:
    ```sh
    deno run -A --unstable --watch sabatwi.js 8080
    ```

3. ブラウザを開き、[http://localhost:8080](http://localhost:8080) にアクセスします。

### サーバーへのデプロイ

NginxやCertbotを使用した本番サーバーへのデプロイ方法、およびアプリケーションをサービスとして実行する手順については、[サーバーセットアップガイド](README-server.md)を参照してください。

## APIリファレンス

APIは、GETリクエストの場合は単一のURLエンコードされたJSONオブジェクトをクエリパラメータとして、POSTリクエストの場合はJSONボディを受け取ります。

### ツイート

- **ツイート一覧**
  - `GET /api/tweet/list`
  - すべてのツイートオブジェクトを含むJSON配列を返します。

- **ツイート、返信、いいねの追加**
  - `GET /api/tweet/add`
  - **クエリパラメータ:** URLエンコードされたJSONオブジェクト。
  - **ペイロード:**
    - `{ "user": "username", "tweet": "message" }` - 新しいツイートを投稿する場合。
    - `{ "user": "username", "tweet": "comment", "replyid": "tweet_id" }` - 返信する場合。
    - `{ "user": "username", "likeid": "tweet_id" }` - ツイートに「いいね」する場合。
  - **例:** `/api/tweet/add?{%22tweet%22:%22Hello%20world!%22,%22user%22:%22deno_fan%22}`

### Webプッシュ通知

- **購読**
  - `POST /api/subscribe`
  - **ボディ:** ブラウザのPush APIから取得した標準の `PushSubscription` JSONオブジェクト。
  - 購読を識別するための `{ "uuid": "..." }` を返します。

- **購読解除**
  - `POST /api/unsubscribe`
  - **ボディ:** `{ "uuid": "subscription_uuid" }`
  - 指定された購読を削除します。

### ヘルスチェック

- **ステータス確認**
  - `GET /api/health`
  - サーバーが正常に稼働している場合は `"ok"` を返します。

## クレジット

- **ソースコード:** [sabatwi on GitHub](https://github.com/code4fukui/sabatwi/)
- **ロゴ:** by [山田ちあり](https://www.instagram.com/charlie.marguerite/)
- **アイコン:** by [Google Material design icons](https://github.com/code4fukui/material-design-icons)

## ライセンス

このプロジェクトは MIT License のもとで公開されています。

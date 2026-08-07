# X連携の設定手順

この設定は運営者が最初に一度だけ行います。利用者は以後、Xの承認画面で許可するだけです。

## 1. Xでアプリを作る

1. [X Developer Portal](https://developer.x.com/) を開きます。
2. プロジェクトとアプリを作成します。
3. アプリの「User authentication settings（ユーザー認証設定）」で **OAuth 2.0** を有効にします。
4. アプリの種類は **Web App（ウェブアプリ）** を選びます。
5. 「Callback URI / Redirect URL（コールバックURL）」へ次を入力します。

   `https://enishi-zo.vercel.app/api/x/callback`

6. 「Website URL（ウェブサイトURL）」へ次を入力します。

   `https://enishi-zo.vercel.app`

7. 読み取り権限として、次だけを有効にします。
   - `users.read`（プロフィールを読む）
   - `tweet.read`（投稿を読む）
   - `follows.read`（フォロー関係を読む）

DMを読む権限、投稿する権限、フォローを操作する権限は不要です。

## 2. Xの鍵を控える

X Developer Portalの「Keys and tokens（キーとトークン）」から、次を控えます。

- Client ID
- Client Secret

この2つはパスワードと同じ扱いです。GitHubや画面上には公開しません。

## 3. Vercelへ鍵を登録する

1. [Vercel](https://vercel.com/) で `enishi-zo` プロジェクトを開きます。
2. 上部の **Settings（設定）** → 左側の **Environment Variables（環境変数）** を開きます。
3. 次の3つを、それぞれ **Add（追加）** します。

| 名前 | 入れる内容 |
| --- | --- |
| `X_CLIENT_ID` | Xで控えたClient ID |
| `X_CLIENT_SECRET` | Xで控えたClient Secret |
| `APP_URL` | `https://enishi-zo.vercel.app` |

4. **Deployments（デプロイ）** を開き、最新のデプロイのメニューから **Redeploy（再デプロイ）** を押します。

## 4. 動作確認

`https://enishi-zo.vercel.app` を開き、 **「Xでえにし像を結ぶ」** を押します。Xの承認画面が出れば成功です。

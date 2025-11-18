```dockerfile
# --- ステージ 1: ビルド環境 ---
# Node.js 20 の環境を使って Next.js アプリをビルドする
FROM node:20-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルを先にコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをすべてコピー
COPY . .

# Next.js アプリをビルド
RUN npm run build

# --- ステージ 2: 実行環境 ---
# Node.js 20 の軽量な実行環境
FROM node:20-alpine

WORKDIR /app

# タイムゾーンを日本に設定
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tokyo

# 必要なビルド成果物だけをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cloud Run が $PORT 環境変数を設定する
EXPOSE 3000

# アプリケーションを実行
CMD ["npm", "start"]
```
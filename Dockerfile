# --- ステージ 1: ビルド環境 ---
# Node.js 20 の環境を使ってビルドする
FROM node:20-alpine AS builder

WORKDIR /app

# package.json と package-lock.json (あれば) をコピー
COPY package*.json ./

# 依存関係（Next.js や React）をインストール
RUN npm install

# ソースコードをすべてコピー
COPY . .

# Next.js アプリをビルド
RUN npm run build

# --- ステージ 2: 実行環境 ---
FROM node:20-alpine AS runner

WORKDIR /app

# 必要なファイルだけをビルド環境からコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# タイムゾーンを日本に設定
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tokyo

# Cloud Run は環境変数 $PORT を自動で設定してくれる
EXPOSE 3000
ENV PORT 3000

# コンテナが起動したときに実行するコマンド
CMD ["node", "server.js"]
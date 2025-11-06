# ---------- builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY package*.json ./
RUN npm ci

# کل سورس
COPY . .

# فیکس مجوز اجرا و CRLF برای next
RUN chmod +x node_modules/.bin/next && sed -i 's/\r$//' node_modules/.bin/next || true

# بیلد استندالون
RUN npm run build

# ---------- runner ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# خروجی بیلد
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# باینری‌های Prisma برای ران‌تایم (لازم!)
RUN mkdir -p node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# اجرای سرور استندالون Next
CMD ["node", ".next/standalone/server.js"]

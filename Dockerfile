# Multi-stage build para Dokploy — no reutilizar imagen vieja
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_NOTIFY_EMAIL=proveedores@peninsulanvo.com
ARG VITE_FORMSUBMIT_ID=
ARG VITE_NOTIFY_EXTRA_EMAILS=recepcion@peninsulanvo.com
ARG CACHEBUST=2026-09-18-v2
ENV VITE_NOTIFY_EMAIL=$VITE_NOTIFY_EMAIL
ENV VITE_FORMSUBMIT_ID=$VITE_FORMSUBMIT_ID
ENV VITE_NOTIFY_EXTRA_EMAILS=$VITE_NOTIFY_EXTRA_EMAILS
ENV VITE_APP_BUILD=$CACHEBUST

RUN echo "BUILD $CACHEBUST" \
  && npm run build \
  && echo "$CACHEBUST" > dist/build-id.txt \
  && ls -la dist \
  && test -f dist/index.html

RUN npm prune --omit=dev

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
ENV APP_BUILD=2026-09-18-v2

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

# Marca de version en imagen (para /api/version)
RUN echo "2026-09-18-v2" > /app/BUILD_ID

VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "server/index.js"]

# Multi-stage build para Dokploy
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_NOTIFY_EMAIL
ARG VITE_FORMSUBMIT_ID
ARG CACHEBUST=1
ENV VITE_NOTIFY_EMAIL=$VITE_NOTIFY_EMAIL
ENV VITE_FORMSUBMIT_ID=$VITE_FORMSUBMIT_ID

# CACHEBUST invalida la capa cuando cambia (evita imagen vieja en Dokploy)
RUN echo "cachebust=$CACHEBUST" && npm run build && test -f dist/peninsula-hero-v2.png
RUN npm prune --omit=dev

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "server/index.js"]

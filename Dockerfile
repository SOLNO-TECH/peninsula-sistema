# Multi-stage build para Dokploy / Docker
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_NOTIFY_EMAIL
ARG VITE_FORMSUBMIT_ID
ENV VITE_NOTIFY_EMAIL=$VITE_NOTIFY_EMAIL
ENV VITE_FORMSUBMIT_ID=$VITE_FORMSUBMIT_ID

RUN npm run build
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

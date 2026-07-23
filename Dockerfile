# Multi-stage build para Dokploy / Docker
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables VITE_* deben pasarse en build (Dokploy → Build Arguments / Env)
ARG VITE_NOTIFY_EMAIL
ARG VITE_FORMSUBMIT_ID
ENV VITE_NOTIFY_EMAIL=$VITE_NOTIFY_EMAIL
ENV VITE_FORMSUBMIT_ID=$VITE_FORMSUBMIT_ID

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

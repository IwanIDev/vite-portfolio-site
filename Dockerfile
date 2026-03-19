# Build stage - runs on native platform for speed
FROM --platform=$BUILDPLATFORM oven/bun:latest AS build

WORKDIR /app

ARG VITE_DRUPAL_BASE_URL
ARG VITE_DRUPAL_API_PREFIX=/jsonapi
ARG VITE_DRUPAL_AUTH_TOKEN

ENV VITE_DRUPAL_BASE_URL=${VITE_DRUPAL_BASE_URL}
ENV VITE_DRUPAL_API_PREFIX=${VITE_DRUPAL_API_PREFIX}
ENV VITE_DRUPAL_AUTH_TOKEN=${VITE_DRUPAL_AUTH_TOKEN}

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
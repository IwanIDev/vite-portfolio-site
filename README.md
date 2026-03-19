# Vite Portfolio (Headless Drupal Frontend)

This project is configured to consume a headless Drupal backend (JSON:API) and deploy as a Docker image served by Nginx.

## Added Drupal libraries

- `axios` for HTTP requests
- `drupal-jsonapi-params` for building Drupal JSON:API query parameters

## Environment variables

Create a local env file from the template:

```bash
cp .env.example .env.local
```

Available variables:

- `VITE_DRUPAL_BASE_URL` (required) – base Drupal URL, for example `https://cms.example.com`
- `VITE_DRUPAL_API_PREFIX` (optional) – defaults to `/jsonapi`
- `VITE_DRUPAL_AUTH_TOKEN` (optional) – bearer token used by the HTTP client

## Client utilities

- Typed env config: `src/config/env.ts`
- Reusable Drupal client: `src/lib/drupalClient.ts`

Example usage:

```ts
import { createDrupalParams, fetchDrupalResource } from './lib/drupalClient'

type NodeCollection = {
  data: Array<{ id: string; attributes: Record<string, unknown> }>
}

const params = createDrupalParams().addPageLimit(5).addFields('node--article', ['title'])

const articles = await fetchDrupalResource<NodeCollection>('/node/article', { params })
```

## Local development

```bash
bun install
bun run dev
```

## Docker build and run

Pass Drupal variables at build time (Vite injects `VITE_*` during build):

```bash
docker build \
  --build-arg VITE_DRUPAL_BASE_URL=https://cms.example.com \
  --build-arg VITE_DRUPAL_API_PREFIX=/jsonapi \
  --build-arg VITE_DRUPAL_AUTH_TOKEN=your-token \
  -t vite-portfolio:latest .

docker run --rm -p 8080:80 vite-portfolio:latest
```

## CI/CD deployment (GitHub Actions + Docker Swarm)

The workflow in `.github/workflows/docker_build.yml` now forwards Drupal settings to Docker build args.

Set these in your GitHub repository before deploying:

- Repository variable: `VITE_DRUPAL_BASE_URL`
- Repository variable: `VITE_DRUPAL_API_PREFIX` (optional)
- Repository secret: `VITE_DRUPAL_AUTH_TOKEN` (optional)

Existing deploy flow:

1. Build and push image to GHCR on `main`
2. SSH to the remote host
3. `docker stack deploy -c docker-stack.yml vite-portfolio`

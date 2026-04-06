# Promo codes REST API (NestJS + Prisma + PostgreSQL)

## Quick start

1) Start PostgreSQL:

```bash
docker compose up -d
```

2) Configure env:

```bash
copy .env.example .env
```

Ensure `DATABASE_URL` points to your Postgres (default in `.env` works with `docker-compose.yml`).

3) Run migrations + generate Prisma client:

```bash
npm run prisma:migrate
```

4) Start API:

```bash
npm run dev
```

Server listens on `PORT` (default `3100`).

## Swagger

- **Enable**: set `SWAGGER=true`
- **Disable**: set `SWAGGER=false` (or omit)
- **UI**: `GET /docs`

## Environment variables

- **`DATABASE_URL`** (required): PostgreSQL connection string.
- **`PORT`** (optional, default `3000`): API port.
- **`SWAGGER`** (optional, default `false`): set to `true` to enable Swagger UI at `GET /docs`.

Startup will fail fast if required env vars are missing or invalid.

## Main behavior

- **Rate limiting**: enabled globally via `@nestjs/throttler`.
- **Request correlation**: responses include `x-request-id` (you can send one, otherwise it’s generated).
- **Validation**: strict DTO validation with whitelist + forbid unknown fields.

## Error format

All errors use a consistent JSON envelope:

```json
{
  "code": "HTTP_400",
  "message": "Validation failed",
  "errors": ["...optional list of validation errors..."],
  "requestId": "optional-correlation-id",
  "timestamp": "2026-04-06T11:46:38.000Z",
  "path": "/promocodes"
}
```

The API also returns `x-request-id` in responses (and accepts an incoming `x-request-id`).

## Rate limiting

Requests are rate-limited globally via `@nestjs/throttler` (see `src/common/consts/throttling.consts.ts`).

## API

### Promo codes

- `POST /promocodes` create
- `GET /promocodes` list (`skip`, `take`, `q`)
- `GET /promocodes/:id` get by id
- `GET /promocodes/by-code/:code` get by code
- `PATCH /promocodes/:id` update
- `DELETE /promocodes/:id` delete

Payload example (`POST /promocodes`):

```json
{
  "code": "WELCOME10",
  "discountPercent": 10,
  "activationLimit": 100,
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validTo": "2026-12-31T23:59:59.000Z"
}
```

### Activation

- `POST /activations` activate promo code by email

Payload:

```json
{
  "code": "WELCOME10",
  "email": "user@example.com"
}
```

## Quick test (curl)

Create a promo code:

```bash
curl -X POST "http://localhost:3100/promocodes" ^
  -H "content-type: application/json" ^
  -d "{\"code\":\"WELCOME10\",\"discountPercent\":10,\"activationLimit\":100}"
```

Activate it:

```bash
curl -X POST "http://localhost:3100/activations" ^
  -H "content-type: application/json" ^
  -d "{\"code\":\"WELCOME10\",\"email\":\"user@example.com\"}"
```

## Correctness guarantees

- Email can activate the same promo code only once: enforced by DB unique constraint `@@unique([promoCodeId, email])`.
- Activation limit is not exceeded under concurrency: activation uses a SERIALIZABLE transaction + retry on conflicts.
- Validity window (`validFrom`/`validTo`) is checked at activation time.


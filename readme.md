# Booking System API

A production-oriented booking backend built with **Node.js, TypeScript, Express, PostgreSQL, Redis, RabbitMQ, Docker, and AWS**.

The project demonstrates backend engineering concepts beyond basic CRUD, including booking concurrency protection, transactional workflows, caching, asynchronous messaging, payment processing, automated deployments, backups, monitoring, and production security.

## Architecture

```mermaid
flowchart TD
    Client[Client] -->|HTTPS| Caddy[Caddy Reverse Proxy]
    Caddy --> API[Express API]

    API --> PostgreSQL[(PostgreSQL)]
    API --> Redis[(Redis)]
    API --> RabbitMQ[RabbitMQ]

    RabbitMQ --> Worker[Background Worker]

    GitHub[GitHub Actions] -->|OIDC| AWS[AWS]
    AWS --> SSM[AWS Systems Manager]
    SSM --> EC2[EC2]

    EC2 --> Docker[Docker Compose]
    Docker --> Caddy
    Docker --> API
    Docker --> PostgreSQL
    Docker --> Redis
    Docker --> RabbitMQ
    Docker --> Worker

    PostgreSQL --> Backup[Automated Backup]
    Backup --> S3[(Amazon S3)]

    EC2 --> CloudWatch[CloudWatch]
    API --> Route53[Route 53 Health Check]

    CloudWatch --> SNS[SNS]
    Route53 --> SNS
    SNS --> Email[Email Alerts]
```

## Key Features

### Booking Management

- Create and manage rooms
- Create bookings with date validation
- Prevent overlapping bookings
- Calculate booking totals
- Track booking and payment status

### Concurrency Protection

Booking creation uses a **PostgreSQL transaction with row-level locking**.

The selected room is locked using `FOR UPDATE` while availability is checked and the booking is created.

This prevents concurrent requests from successfully booking the same room for overlapping dates.

The overlap condition is based on:

```text
existing.checkIn < new.checkOut
AND
existing.checkOut > new.checkIn
```

### Redis Caching

Redis is used to cache frequently accessed room data and reduce unnecessary database queries.

### Payment Workflow

The project includes a custom mock payment provider that models a real payment workflow without depending on an external payment gateway.

Flow:

```text
Booking Created
      ↓
Payment Intent Created
      ↓
Mock Payment Success
      ↓
Payment → PAID
      ↓
Booking → CONFIRMED
```

Payment and booking state changes are performed inside a database transaction.

### Event-Driven Processing

After a payment succeeds and the database transaction commits, the API publishes a:

```text
booking.confirmed
```

event to RabbitMQ.

A separate background worker consumes the event from:

```text
booking.confirmed.notifications
```

The worker uses manual acknowledgements and RabbitMQ prefetch controls for safer message processing.

## Tech Stack

| Area | Technology |
|---|---|
| Runtime | Node.js 24 |
| Language | TypeScript |
| API | Express 5 |
| Validation | Zod |
| Database | PostgreSQL 16 |
| ORM | Sequelize 6 |
| Cache | Redis 7 |
| Messaging | RabbitMQ 4 |
| Payments | Custom Mock Payment Provider |
| Containers | Docker / Docker Compose |
| Reverse Proxy | Caddy |
| CI/CD | GitHub Actions |
| AWS Deployment | EC2 + Systems Manager |
| Authentication to AWS | GitHub OIDC |
| Backups | Amazon S3 |
| Monitoring | CloudWatch + Route 53 |
| Alerts | Amazon SNS |

## Project Structure

```text
src/
├── config/
├── controllers/
├── errors/
├── middleware/
├── models/
├── repositories/
├── routes/
├── schemas/
├── services/
├── types/
├── messaging/
├── workers/
├── app.ts
└── server.ts

database/
├── migrations/
├── config.cjs
└── package.json

scripts/
├── backup-postgres.sh
└── deploy-production.sh
```

The application follows a layered structure:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

Business logic is kept outside controllers to keep the application easier to maintain and extend.

## API Endpoints

### Health

```http
GET /health
```

Returns the current application health status.

### Rooms

```http
GET    /rooms
GET    /rooms/:id
POST   /rooms
PUT    /rooms/:id
DELETE /rooms/:id
```

### Bookings

```http
POST /bookings
```

Creates a booking after validating dates and checking availability inside a database transaction.

### Payments

Create a payment intent:

```http
POST /payments/:bookingId/intent
```

Simulate a successful payment:

```http
POST /payments/mock/:paymentId/succeed
```

The mock payment endpoint requires the configured mock payment secret.

## Local Development

### Requirements

- Node.js 24+
- pnpm 11+
- Docker
- Docker Compose

Clone the repository:

```bash
git clone https://github.com/mpmabeyrathne/node-project-1.git
cd node-project-1
```

Install dependencies:

```bash
pnpm install
```

Create the environment file:

```bash
cp .env.example .env
```

Start infrastructure services:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d postgres redis rabbitmq
```

Run database migrations:

```bash
pnpm exec sequelize-cli db:migrate
```

Start the API:

```bash
pnpm dev
```

Start the RabbitMQ worker in another terminal:

```bash
pnpm worker
```

## Environment Variables

Example development configuration:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=3000

POSTGRES_USER=booking_user
POSTGRES_PASSWORD=booking_password
POSTGRES_DB=booking_db

DATABASE_URL=postgres://booking_user:booking_password@127.0.0.1:55432/booking_db

REDIS_URL=redis://127.0.0.1:6379

RABBITMQ_USER=booking_app
RABBITMQ_PASSWORD=booking_password
RABBITMQ_URL=amqp://booking_app:booking_password@127.0.0.1:5672

MOCK_PAYMENT_WEBHOOK_SECRET=change-me
```

Production secrets are stored outside the repository.

The real `.env` file is excluded from Git.

## Docker

The production stack runs with Docker Compose:

```text
Caddy
API
Worker
PostgreSQL
Redis
RabbitMQ
Migration Service
```

Only Caddy exposes public application ports.

Internal services communicate using Docker networking.

Production host exposure is restricted to:

```text
22   SSH
80   HTTP
443  HTTPS
```

PostgreSQL, Redis, RabbitMQ, RabbitMQ Management, and the Express API port are not publicly exposed.

## CI

Every push and pull request runs the GitHub Actions verification pipeline.

The pipeline performs:

```text
Install dependencies
        ↓
TypeScript type check
        ↓
Build
        ↓
Docker Compose validation
        ↓
Docker image build
```

A failed verification prevents production deployment.

## Production Deployment

Production runs on **AWS EC2**.

Deployments use:

```text
GitHub Actions
      ↓
GitHub OIDC
      ↓
AWS IAM Role
      ↓
AWS Systems Manager
      ↓
EC2
      ↓
Docker Compose
```

No long-lived AWS access keys are stored in GitHub.

### Deployment Reliability

The deployment workflow:

1. Saves the currently deployed Git commit.
2. Fetches the latest `main` branch.
3. Builds and starts the updated containers.
4. Waits for the production health endpoint.
5. Marks the deployment successful only when the API becomes healthy.

GitHub Actions waits for the actual AWS Systems Manager command result rather than considering the deployment successful immediately after sending the command.

### Automatic Rollback

If the new deployment does not become healthy, the deployment script automatically restores the previous working Git commit and rebuilds the previous version.

```text
Deploy new commit
      ↓
Health check
   ↙       ↘
Healthy   Failed
  ↓          ↓
Success    Rollback
              ↓
        Previous commit
              ↓
        Rebuild services
```

The rollback flow has been tested using an intentionally unhealthy deployment.

## HTTPS

Caddy acts as the public reverse proxy and provides automatic TLS certificate management.

Production API:

```text
https://api.pasindumadhuwantha.com
```

Health endpoint:

```text
https://api.pasindumadhuwantha.com/health
```

## Backups

PostgreSQL backups are created automatically using `pg_dump`.

The backup workflow:

```text
PostgreSQL
    ↓
Compressed dump
    ↓
SHA-256 checksum
    ↓
Local backup directory
    ↓
Amazon S3
```

Backups run using a systemd timer.

Local backups use short-term retention while S3 uses a lifecycle policy for longer retention.

A complete restore test has been performed to verify that the backups are usable.

## Monitoring

The production environment is monitored using CloudWatch and Route 53.

Infrastructure monitoring includes:

```text
CPU utilization
Memory utilization
Disk utilization
EC2 status checks
```

Application uptime is monitored independently using:

```text
Route 53
   ↓
HTTPS /health
   ↓
HealthCheckStatus
   ↓
CloudWatch Alarm
   ↓
SNS
   ↓
Email
```

This allows infrastructure failures and application-level failures to be detected separately.

## Security

Production hardening includes:

- HTTPS-only public API access
- Helmet security headers
- Express `X-Powered-By` disabled
- JSON request size limits
- Redis-backed rate limiting
- Zod request validation
- Restricted AWS Security Groups
- SSH restricted to an approved IP
- Database and infrastructure services not publicly exposed
- Production containers running as non-root users
- Protected `.env` file permissions
- Rotated production credentials
- AWS OIDC instead of long-lived deployment credentials
- Graceful application shutdown
- Docker resource limits
- Docker log rotation

## Graceful Shutdown

The API handles:

```text
SIGTERM
SIGINT
```

During shutdown it stops accepting new HTTP connections and closes:

```text
HTTP server
RabbitMQ
Redis
PostgreSQL
```

before terminating the process.

This prevents abrupt connection termination during deployments and container restarts.

## Production Resilience

The deployment includes:

- Container restart policies
- Docker health checks
- Resource limits
- Process ID limits
- Log rotation
- Graceful shutdown
- Automated database backups
- Off-site S3 backups
- Infrastructure monitoring
- Application uptime monitoring
- Deployment health verification
- Automatic rollback

## Verification

Useful local verification commands:

```bash
pnpm typecheck
pnpm build
pnpm audit --prod
docker compose config
```

Production health:

```bash
curl https://api.pasindumadhuwantha.com/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Status

The project is deployed and running in production.

It was built as a hands-on backend engineering project focused on applying production concepts such as concurrency control, caching, asynchronous messaging, CI/CD, cloud deployment, monitoring, backups, security, and deployment recovery.
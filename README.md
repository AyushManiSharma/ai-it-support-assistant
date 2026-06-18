# AI IT Support Assistant

A full-stack AI-powered chat application that provides instant Tier 1 and Tier 2 IT troubleshooting. Users authenticate via a login screen and chat with a GPT-powered assistant that delivers step-by-step technical guidance.

Live on AWS: deployed to ECS Fargate behind an Application Load Balancer.

---

## Features

- AI chat interface powered by OpenAI GPT-3.5-turbo
- JWT authentication with protected API routes
- Nginx reverse proxy serving the React frontend and tunneling API calls to the backend
- Multi-stage Docker builds — TypeScript compiled to JS, dev dependencies excluded from the production image
- Secrets injected at runtime via AWS Secrets Manager — no credentials baked into images
- ECS health check endpoint for zero-downtime deployments

---

## Architecture

```
Browser
   │
   ▼
Application Load Balancer (port 80)
   │
   ▼
ECS Fargate Task (awsvpc networking)
   ├── frontend container  (Nginx :80)
   │     ├── serves React app for /
   │     └── proxies /api/* → localhost:5000
   └── backend container  (Node.js :5000)
         ├── POST /api/login  → issues JWT
         ├── POST /api/chat   → calls OpenAI (JWT required)
         └── GET  /health     → ALB health check
```

Secrets (OpenAI key, JWT secret, credentials) live in AWS Secrets Manager and are injected as environment variables when the task starts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Nginx |
| Backend | Node.js, Express 5, TypeScript |
| AI | OpenAI API (gpt-3.5-turbo) |
| Auth | JSON Web Tokens (JWT) |
| Containers | Docker, Docker Compose |
| Registry | AWS ECR |
| Compute | AWS ECS Fargate |
| Networking | AWS ALB, VPC, awsvpc |
| Secrets | AWS Secrets Manager |
| Observability | AWS CloudWatch Logs |

---

## Local Development

### Prerequisites

- Docker Desktop running
- An OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/AyushManiSharma/ai-it-support-assistant.git
cd ai-it-support-assistant
```

### 2. Configure environment variables

Create `backend/.env`:

```
OPENAI_API_KEY=your_openai_key_here
JWT_SECRET=any_long_random_string
APP_USERNAME=admin
APP_PASSWORD=choose_a_password
CORS_ORIGIN=http://localhost
```

### 3. Start with Docker Compose

```bash
docker-compose up --build
```

The app is available at `http://localhost`. Log in with the credentials you set in `APP_USERNAME` and `APP_PASSWORD`.

---

## AWS Deployment

### Prerequisites

- AWS CLI configured (`aws configure`)
- Docker Desktop running
- IAM user with ECR, ECS, ALB, Secrets Manager, and CloudWatch permissions

### 1. Create ECR repositories

```bash
aws ecr create-repository --repository-name ai-support-backend --region us-east-1
aws ecr create-repository --repository-name ai-support-frontend --region us-east-1
```

### 2. Build and push images

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1

aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

docker build -t ai-support-backend ./backend
docker tag ai-support-backend:latest "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ai-support-backend:latest"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ai-support-backend:latest"

docker build -t ai-support-frontend ./frontend
docker tag ai-support-frontend:latest "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ai-support-frontend:latest"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ai-support-frontend:latest"
```

### 3. Store secrets

```bash
aws secretsmanager create-secret \
  --name ai-support/backend \
  --secret-string '{
    "OPENAI_API_KEY": "your_key",
    "JWT_SECRET": "your_secret",
    "APP_USERNAME": "admin",
    "APP_PASSWORD": "your_password",
    "CORS_ORIGIN": "http://your-alb-dns-name"
  }'
```

### 4. Register the ECS task definition

Create `task-definition.json` (see the deployment guide in the repo wiki or replace `ACCOUNT_ID` / `REGION` placeholders) and run:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 5. Create the ECS service with a load balancer

- Create an ECS cluster: `aws ecs create-cluster --cluster-name ai-support-cluster`
- Create an ALB, target group (health check path `/health`), and listener via the AWS Console or CLI
- Create the ECS service pointing to the task definition and ALB target group

After the service stabilises, your app is live at the ALB's DNS name.

---

## Project Structure

```
.
├── backend/
│   ├── server.ts          # Express app — login, chat, health routes
│   ├── Dockerfile         # Multi-stage build: compile TS → run JS
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── App.tsx        # Login + chat UI
│   ├── nginx.conf         # Serves React, proxies /api/* to localhost:5000
│   └── Dockerfile         # Build React → copy into Nginx image
├── docker-compose.yml     # Local development orchestration
└── .gitignore
```

---

## Roadmap

- [ ] Database integration — replace env-based credentials with Amazon RDS or DynamoDB
- [ ] Knowledge base grounding — let the AI answer from internal company documentation
- [ ] HTTPS — attach an ACM certificate to the ALB
- [ ] CI/CD pipeline — auto-build and push images on merge to main

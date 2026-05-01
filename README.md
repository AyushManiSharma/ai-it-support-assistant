🤖 AI-Powered IT Support Assistant

A full-stack, decoupled web application designed to automate Tier 1 and Tier 2 IT support troubleshooting. This project utilizes a React frontend, a Node.js/TypeScript backend, and is fully containerized using Docker for seamless deployment. 
🚀 Technical Highlights

    Intelligent Troubleshooting: Integrates with the OpenAI API (gpt-3.5-turbo) to provide real-time, context-aware IT support. 

    Secure Architecture: Implements JSON Web Tokens (JWT) for secure user authentication and custom backend middleware for route protection. 

    Full-Stack TypeScript: End-to-end type safety across the React frontend and Express backend. 

    Containerized Environment: Orchestrated with Docker Compose, ensuring identical behavior across development, testing, and production environments. 

    Professional DevOps Workflow: Developed using a feature-branching strategy and incremental commits to demonstrate team-ready version control habits. 

🛠️ Tech Stack

    Frontend: ReactJS, TypeScript, CSS (Pre-wrap formatting) 

    Backend: Node.js, Express, TypeScript 

    AI: OpenAI API 

    Security: JWT (JSON Web Tokens), Dotenv (Environment Variable Management) 

    Infrastructure: Docker, Docker Compose 

🏗️ Local Setup & Installation
Prerequisites

    Docker Desktop installed and running. 

    An OpenAI API Key. 

1. Clone the Repository
Bash

git clone https://github.com/YourUsername/ai-it-support-assistant.git
cd ai-it-support-assistant

2. Configure Environment Variables

Create a .env file inside the /backend directory: 
Plaintext

OPENAI_API_KEY=your_openai_key_here
JWT_SECRET=your_secure_random_string

3. Launch via Docker

Run the following command in the root directory to build and start both the frontend and backend services: 
Bash

docker-compose up --build

    Frontend: http://localhost:3000 

    Backend API: http://localhost:5000 

🔐 Credentials for Demo

To access the protected chat interface, use the following hardcoded credentials: 

    Username: admin

    Password: password123

📈 Future Roadmap

    [ ] Cloud Deployment: Deploying the Dockerized container to Google Cloud Platform (GCP). 

    [ ] Database Integration: Replacing hardcoded credentials with a persistent database (PostgreSQL or MongoDB). 

    [ ] Knowledge Base Context: Implementing "Grounding" to allow the AI to answer based on specific internal company documentation. 

🧠 Reflection & Learning

This project was built to master the transition from local development to containerized, cloud-ready architecture. Key challenges overcome include managing CORS in decoupled environments, implementing secure JWT middleware, and resolving isolated network namespaces within Docker.

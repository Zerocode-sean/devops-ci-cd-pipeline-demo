# CI/CD Demo

A minimal Express.js application to practice **Continuous Integration and Continuous Deployment** — from commit to VPS.

![CI/CD Pipeline](screenshots/pipeline.png)
![Deployment Demo](screenshots/deployment.png)

---

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 4
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment Target:** VPS (Ubuntu + Docker)

---

## Project Structure

```
.
├── app.js          # Express server (port 3000)
├── Dockerfile      # Multi-stage Docker build
├── package.json    # Dependencies
└── README.md
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start the server
node app.js
# -> http://localhost:3000
```

### Docker (local)

```bash
# Build & run
docker build -t ci-cd-demo .
docker run -d -p 3000:3000 --name ci-cd-demo ci-cd-demo
```

---

## CI/CD Pipeline (GitHub Actions → VPS)

1. **Push** to `main` triggers the workflow.
2. **Build** the Docker image.
3. **Push** the image to Docker Hub (or a private registry).
4. **SSH** into the VPS and:
   - Pull the latest image.
   - Stop & remove the old container.
   - Start a new container on port 3000.

### Required Secrets (GitHub → Settings → Secrets and variables → Actions)

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token (not your account password) |
| `VPS_HOST` | VPS IP address |
| `VPS_USER` | SSH username (e.g. `root`) |
| `VPS_SSH_KEY` | Private SSH key for VPS access |

### Setting up the VPS

```bash
# Install Docker on Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Verify
docker --version
```

### Sample GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build & push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/ci-cd-demo:latest .
          docker push ${{ secrets.DOCKER_USERNAME }}/ci-cd-demo:latest

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKER_USERNAME }}/ci-cd-demo:latest
            docker stop ci-cd-demo || true
            docker rm ci-cd-demo || true
            docker run -d -p 3000:3000 --name ci-cd-demo ${{ secrets.DOCKER_USERNAME }}/ci-cd-demo:latest
```

After a successful deploy, visit `http://<YOUR_VPS_IP>:3000` — you should see:

> **CI/CD Pipeline Working!**

---

## Screenshots

> Add screenshots here:
> 1. `screenshots/pipeline.png` — GitHub Actions workflow run (green checkmark).
> 2. `screenshots/deployment.png` — Browser showing "CI/CD Pipeline Working!" from your VPS IP.

---

## License

MIT

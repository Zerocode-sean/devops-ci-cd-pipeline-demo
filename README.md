# CI/CD Pipeline Demo

The CI/CD project gives the fastest return because you'll learn Git, Docker, Linux administration, GitHub Actions, deployment automation, and production workflows all in one project.

## Final Architecture

```
Developer
    ↓
Git Push
    ↓
GitHub Repository
    ↓
GitHub Actions
    ↓
SSH into VPS
    ↓
Docker Build
    ↓
Restart Container
    ↓
Application Live
```

Every time you push code to GitHub:

```
git push origin main
```

GitHub should automatically:

1. Connect to VPS
2. Pull latest code
3. Build Docker image
4. Stop old container
5. Start new container

No manual deployment.

---

## Phase 1 — Prepare VPS

SSH into your Contabo VPS.

Update system:

```bash
sudo apt update && sudo apt upgrade -y
```

Install Docker:

```bash
curl -fsSL https://get.docker.com | sh
```

Verify:

```bash
docker --version
```

Expected:

```
Docker version xx.x.x
```

---

## Phase 2 — Create Deployment User

Never deploy as root.

Create user:

```bash
sudo adduser deploy
```

Add to docker group:

```bash
sudo usermod -aG docker deploy
```

Switch:

```bash
su - deploy
```

Verify:

```bash
docker ps
```

Should work without sudo.

---

## Phase 3 — Generate SSH Keys

On your laptop/desktop:

```bash
ssh-keygen -t ed25519
```

Press Enter for defaults.

You get:

```
id_ed25519
id_ed25519.pub
```

Copy public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

---

## Phase 4 — Add Key to VPS

Login VPS:

```bash
su - deploy
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

Paste public key.

Set permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Test:

```bash
ssh deploy@YOUR_VPS_IP
```

No password should be required.

---

## Phase 5 — Create Sample Application

A tiny Node.js app.

**Structure:**

```
ci-cd-demo/
│
├── app.js
├── package.json
└── Dockerfile
```

**app.js**

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('CI/CD Pipeline Working!');
});

app.listen(3000);
```

**package.json**

```json
{
  "name": "cicd-demo",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**Dockerfile**

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
```

Test locally:

```bash
docker build -t cicd-demo .
docker run -p 3000:3000 cicd-demo
```

Visit:

```
http://SERVER_IP:3000
```

---

## Phase 6 — Push to GitHub

Create repository:

```
devops-cicd-pipeline-demo
```

Push code.

Your repo should contain:

```
app.js
package.json
Dockerfile
README.md
```

---

## Phase 7 — GitHub Secrets

In GitHub:

```
Settings
  ↓
Secrets and Variables
  ↓
Actions
```

Add:

| Secret | Description |
|---|---|
| `VPS_HOST` | VPS IP address |
| `VPS_USER` | SSH username (e.g. `deploy`) |
| `VPS_SSH_KEY` | Private SSH key for VPS access |

For SSH key:

```bash
cat ~/.ssh/id_ed25519
```

Paste entire private key.

---

## Phase 8 — GitHub Actions

Create `.github/workflows/deploy.yml` with the deploy workflow (see the existing file in this repo for the current configuration).

---

## Phase 9 — Prepare VPS Directory

On VPS:

```bash
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/YOUR_USERNAME/devops-cicd-pipeline-demo.git
```

---

## Phase 10 — Test

Change:

```
CI/CD Pipeline Working!
```

to

```
Version 2 Deployed!
```

Commit:

```bash
git add .
git commit -m "new version"
git push
```

Watch:

```
GitHub
 → Actions
 → Deploy
```

If successful, the server updates automatically — without SSHing into the VPS.

---

## Deliverables

By the end of the week, your repository should include:

- README.md
- Architecture Diagram
- Dockerfile
- GitHub Actions Workflow
- Deployment Instructions
- Screenshots

This becomes your first serious DevOps portfolio project. Once it's working, we'll improve it like a production engineer would:

- Nginx reverse proxy
- Domain name
- HTTPS with Let's Encrypt
- Multi-stage Docker builds
- Health checks
- Blue/Green deployments
- Monitoring with Prometheus and Grafana

Those upgrades turn a beginner CI/CD project into something that looks much closer to a real production platform.

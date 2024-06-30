
---

# Icketi Core Services


## Overview

This project is a Icketi APIs main APP using Nest JS, PostgreSQL, Docker, and a custom domain setup for development, testing, and production environments.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

## Setup

### Environment Files

Create environment files for different environments in the root directory:

- `.env.local`
- `.env.development`
- `.env.production`

#### Example `.env` Content

```dotenv
# PostgreSQL configuration
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=database

# App configuration
DATABASE_URL=postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
APP_PORT=3000
APP_URL=http://icketi.local
NODE_ENV=local
```

### Initial Setup

1. **Run the Initial Setup**:
   Use the following command to perform the initial setup:

   ```bash
   make init
   ```

   This command will:
   - Add `icketi.local` to your hosts file.

### Running the Application

2. **Start the Application**:

   ```bash
   make up
   ```

3. **Access the Application**:
   Open your browser and go to `http://icketi.local`.

### Additional Makefile Commands

| Command       | Description                                         |
|---------------|-----------------------------------------------------|
| `make init`   | Initial setup (adds domain to hosts file and configures Nginx). |
| `make up`     | Start the Docker containers.                        |
| `make down`   | Stop the Docker containers.                         |
| `make build`  | Build the Docker containers.                        |
| `make rebuild`| Rebuild the Docker containers without cache.        |
| `make logs`   | Show logs from the Docker containers.               |
| `make test`   | Run unit tests inside the app container.            |
| `make exec`   | Enter the app container's shell.                    |
| `make ps`     | List running containers.                            |

### Configuration

- **Hosts File**: The hosts file is modified to add `127.0.0.1 icketi.local`, allowing you to access the app using `http://icketi.local`.

### Notes

- Ensure your `.env` files are correctly set up and not committed to version control.
- The `make init` command requires `sudo` privileges to modify the hosts file.

---

### Additional Information

For more details on configuring Docker, Docker Compose, and Make, refer to their official documentation:

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Make Documentation](https://www.gnu.org/software/make/manual/make.html)

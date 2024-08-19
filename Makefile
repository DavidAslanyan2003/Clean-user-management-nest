# Variables
ENV ?= local
ENV_FILE=.env.$(ENV)
APP_CONTAINER=icketi-api
DOCKER_COMPOSE=docker-compose --env-file $(ENV_FILE)
DOMAIN=icketi.local
HOSTS_FILE=/etc/hosts

# Default target
.PHONY: help
help:
	@echo "Usage: make [target] [ENV=environment]"
	@echo "Targets:"
	@echo "  init           - Initial setup (adds domain to hosts file)"
	@echo "  up             - Start the Docker containers"
	@echo "  down           - Stop the Docker containers"
	@echo "  build          - Build the Docker containers"
	@echo "  rebuild        - Rebuild the Docker containers without cache"
	@echo "  logs           - Show logs from the Docker containers"
	@echo "  test           - Run unit tests"
	@echo "  exec           - Enter the app container"
	@echo "  ps             - List running containers"

# Initial setup
.PHONY: init
init: add-host

# Start the Docker containers
.PHONY: up
up:
	$(DOCKER_COMPOSE) up -d

# Stop the Docker containers
.PHONY: down
down:
	$(DOCKER_COMPOSE) down

# Build the Docker containers
.PHONY: build
build:
	$(DOCKER_COMPOSE) build

# Rebuild the Docker containers without cache
.PHONY: rebuild
rebuild:
	$(DOCKER_COMPOSE) build --no-cache

# Show logs from the Docker containers
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Run unit tests
.PHONY: test
test:
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run test

# Enter the app container
.PHONY: exec
exec:
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) sh

# List running containers
.PHONY: ps
ps:
	$(DOCKER_COMPOSE) ps

# Add domain to the hosts file
.PHONY: add-host
add-host:
	@echo "Adding $(DOMAIN) to $(HOSTS_FILE)..."
	@if ! grep -q $(DOMAIN) $(HOSTS_FILE); then \
		echo "127.0.0.1 $(DOMAIN)" | sudo tee -a $(HOSTS_FILE); \
		echo "$(DOMAIN) added to $(HOSTS_FILE)"; \
	else \
		echo "$(DOMAIN) is already present in $(HOSTS_FILE)"; \
	fi

default:

restore:
  npm i

[doc('run with docker compose (local postgres, nestjs dev)')]
run-dev-local:
  docker compose -f docker/development.local.compose.yaml up --watch

[doc('stop docker compose (local postgres, nestjs dev)')]
stop-dev-local:
  docker compose -f docker/development.local.compose.yaml down

[doc('run with docker compose (local postgres, nestjs prod)')]
run-prod-local:
  docker compose -f docker/development.local.compose.yaml up

[doc('stop docker compose (local postgres, nestjs prod)')]
stop-prod-local:
  docker compose -f docker/development.local.compose.yaml down

[doc('clean docker')]
docker-clean:
  docker system prune

set dotenv-required
set dotenv-path	:= '.env'

default: run-api-server-dev

alias c := type-check
alias db := run-docker-db
alias dbr := reset-database
alias tc := type-check

restore:
  npm i

[doc('run nestjs prod')]
run-api-server-prod:
  npm run start

[doc('run nestjs dev')]
run-api-server-dev:
  npm run start:dev

[doc('reset db')]
reset-database:
  npm run db:reset

[doc('run docker compose local postgres')]
run-docker-db:
  docker compose up

[doc('typescript type checking')]
type-check:
  tsc --noEmit

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

set dotenv-required

default: run-api-server-dev

alias b := bootstrap
alias c := type-check
alias d := run-docker-compose
alias dbr := reset-database
alias dbrd := reset-database
alias tc := type-check
alias rs := run-supabase
alias ss := stop-supabase

bootstrap:
  npm i

[doc('run nestjs prod')]
run-api-server-prod:
  JUST_ENV=.env.production npm run start

[doc('run nestjs dev')]
run-api-server-dev:
  JUST_ENV=.env npm run start:dev

[doc('run supabase')]
run-supabase:
  supabase start

[doc('stop supabase')]
stop-supabase:
  supabase stop

[doc('reset db')]
reset-database:
  JUST_ENV=.env supabase db reset --local
  JUST_ENV=.env npm run db:reset

[doc('reset db production')]
reset-database-prod:
  JUST_ENV=.env.production supabase db reset --linked
  JUST_ENV=.env.production npm run db:reset

[doc('run docker compose')]
run-docker-compose:
  docker compose up

[doc('typescript type checking')]
type-check:
  npm run tsc --noEmit

# [doc('run with docker compose (local postgres, nestjs dev)')]
# run-dev-local:
#   docker compose -f docker/development.local.compose.yaml up --watch
#
# [doc('stop docker compose (local postgres, nestjs dev)')]
# stop-dev-local:
#   docker compose -f docker/development.local.compose.yaml down
#
# [doc('run with docker compose (local postgres, nestjs prod)')]
# run-prod-local:
#   docker compose -f docker/development.local.compose.yaml up
#
# [doc('stop docker compose (local postgres, nestjs prod)')]
# stop-prod-local:
#   docker compose -f docker/development.local.compose.yaml down

[doc('clean docker')]
docker-clean:
  docker system prune

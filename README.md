<h1 align=center>
  COINHUB SERVER
</h1>

<div align=center>
  <a href="https://sonarcloud.io/summary/new_code?id=coinhub-uit_server">
    <img alt="SonarQube Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=coinhub-uit_server&metric=alert_status"/>
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=coinhub-uit_server">
    <img alt="SonarQube Quality Bug" src="https://sonarcloud.io/api/project_badges/measure?project=coinhub-uit_server&metric=bugs"/>
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=coinhub-uit_server">
    <img alt="SonarQube Quality Code Smells" src="https://sonarcloud.io/api/project_badges/measure?project=coinhub-uit_server&metric=code_smells"/>
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=coinhub-uit_server">
    <img alt="SonarQube Quality Maintainability Rating" src="https://sonarcloud.io/api/project_badges/measure?project=coinhub-uit_server&metric=sqale_rating"/>
  </a>
  <br />
  <a href="https://wakatime.com/badge/github/coinhub-uit/server">
    <img alt="Wakatime" src="https://wakatime.com/badge/github/coinhub-uit/server.svg"/>
  </a>
</div>

---

## DOCS

### API endpoint

- Use [OpenAPI schema](./web/swagger/swagger.json)
- View with [Github static host page](https://coinhub-uit.github.io/server/swagger/) or at endpoint `/api` of the server

> [!NOTE]
> Github static host page cannot sending request to the API because it's not designed to do so. Can only be tested with a real server.

---

## DEV

1. Setup dev env
   ```sh
   npm i # or "just restore"
   ```
2. Setup `.env` file
3. Run dev
   - Start postgres using docker (skip if you have already had postgres database)
   ```sh
   just run-docker-db
   ```
   - Run api server
   ```sh
   just run-api-server-dev
   ```

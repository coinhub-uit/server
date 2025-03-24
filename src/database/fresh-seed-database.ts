async function freshSeed() {
  await import('src/database/drop-database');
  await import('src/database/create-database');
  await import('src/database/seed-database');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
freshSeed();

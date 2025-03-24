async function freshSeed() {
  await import('./drop-database');
  await import('./create-database');
  await import('./seed-database');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
freshSeed();

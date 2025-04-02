async function freshSeed() {
  await import('./drop-database');
  await import('./create-database');
  await import('./seed-database');
}

void freshSeed();

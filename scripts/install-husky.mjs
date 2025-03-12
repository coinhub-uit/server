#!/usr/bin/env node

export default async function husky() {
  if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
    return;
  }

  const husky = (await import('husky')).default;
  console.log(husky());
}

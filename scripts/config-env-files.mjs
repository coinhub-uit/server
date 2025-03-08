#!/usr/bin/env node

import { copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export default async function configEnvFiles() {
  if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
    return;
  }

  const source = join(process.cwd(), '.env.example');
  const targets = ['.env'];

  for (const target of targets) {
    const targetPath = join(process.cwd(), target);
    if (existsSync(targetPath)) {
      continue;
    }
    try {
      await copyFile(source);
      console.log(`Successfully created ${target} from ${source}`);
    } catch (err) {
      console.error(`Error occured while creating ${target}: ${err}`);
    }
  }
}

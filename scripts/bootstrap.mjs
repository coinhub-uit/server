#!/usr/bin/env node

import HuskyInstall from './install-husky.mjs';
import ConfigEnvFiles from './config-env-files.mjs';

await HuskyInstall();
await ConfigEnvFiles();

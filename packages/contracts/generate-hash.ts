#!/usr/bin/env node
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate SHA-256 hash of the OpenAPI contract
 * This hash is used to verify frontend/backend sync
 */
function generateContractHash(): string {
  const contractPath = join(__dirname, 'openapi.yaml');
  const contractContent = readFileSync(contractPath, 'utf-8');
  return createHash('sha256').update(contractContent).digest('hex');
}

const hash = generateContractHash();
console.log(hash);

// Also write to a file for CI
const outputPath = join(__dirname, 'contract-hash.txt');
require('fs').writeFileSync(outputPath, hash);

export { generateContractHash };

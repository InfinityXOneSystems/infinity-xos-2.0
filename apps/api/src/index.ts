import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Compute contract hash from OpenAPI spec
function getContractHash(): string {
  try {
    const contractPath = join(__dirname, '../../../packages/contracts/openapi.yaml');
    const contractContent = readFileSync(contractPath, 'utf-8');
    return createHash('sha256').update(contractContent).digest('hex');
  } catch (error) {
    console.error('Failed to compute contract hash:', error);
    return 'unknown';
  }
}

// Get backend SHA from environment (set by CI)
const BACKEND_SHA = process.env.BACKEND_SHA || process.env.K_REVISION || 'dev';
const CONTRACT_HASH = getContractHash();

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness check endpoint
app.get('/readyz', (req, res) => {
  // Add actual readiness checks here (DB, external services, etc.)
  const ready = true; // Placeholder
  
  if (ready) {
    res.json({ status: 'ready', timestamp: new Date().toISOString() });
  } else {
    res.status(503).json({ status: 'not ready', timestamp: new Date().toISOString() });
  }
});

// Version endpoint with contract hash
app.get('/version', (req, res) => {
  res.json({
    version: '2.0.0',
    contract_hash: CONTRACT_HASH,
    backend_sha: BACKEND_SHA,
    deployed_at: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Infinity XOS API',
    version: '2.0.0',
    status: 'operational',
    docs: '/api/docs',
    health: '/healthz',
    ready: '/readyz',
    version_info: '/version'
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Infinity XOS API running on port ${PORT}`);
  console.log(`📋 Contract Hash: ${CONTRACT_HASH}`);
  console.log(`🔖 Backend SHA: ${BACKEND_SHA}`);
});

export default app;

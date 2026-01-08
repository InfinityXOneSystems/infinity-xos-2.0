import { useEffect, useState } from 'react';

interface VersionInfo {
  version: string;
  contract_hash: string;
  backend_sha: string;
  deployed_at: string;
  environment: string;
}

const FRONTEND_SHA = import.meta.env.VITE_FRONTEND_SHA || 'dev';
const FRONTEND_CONTRACT_HASH = import.meta.env.VITE_CONTRACT_HASH || 'unknown';

export function ContractPanel() {
  const [backendInfo, setBackendInfo] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        setBackendInfo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="contract-panel loading">Loading contract status...</div>;
  }

  if (error) {
    return (
      <div className="contract-panel error">
        <h3>❌ Backend Unreachable</h3>
        <p>{error}</p>
      </div>
    );
  }

  const contractMatch = backendInfo?.contract_hash === FRONTEND_CONTRACT_HASH;
  const mirrorBroken = !contractMatch;

  return (
    <div className={`contract-panel ${mirrorBroken ? 'broken' : 'synced'}`}>
      <h2>Contract Status</h2>
      
      {mirrorBroken && (
        <div className="alert alert-danger">
          <strong>🔴 MIRROR BROKEN</strong>
          <p>Frontend and backend contracts do not match. Privileged actions disabled.</p>
        </div>
      )}

      {contractMatch && (
        <div className="alert alert-success">
          <strong>✅ MIRROR SYNCED</strong>
          <p>Frontend and backend are in sync.</p>
        </div>
      )}

      <div className="info-grid">
        <div className="info-section">
          <h3>Frontend</h3>
          <dl>
            <dt>Contract Hash:</dt>
            <dd><code>{FRONTEND_CONTRACT_HASH}</code></dd>
            <dt>Frontend SHA:</dt>
            <dd><code>{FRONTEND_SHA}</code></dd>
          </dl>
        </div>

        <div className="info-section">
          <h3>Backend</h3>
          <dl>
            <dt>Contract Hash:</dt>
            <dd><code>{backendInfo?.contract_hash}</code></dd>
            <dt>Backend SHA:</dt>
            <dd><code>{backendInfo?.backend_sha}</code></dd>
            <dt>Version:</dt>
            <dd><code>{backendInfo?.version}</code></dd>
            <dt>Environment:</dt>
            <dd><code>{backendInfo?.environment}</code></dd>
            <dt>Deployed:</dt>
            <dd>{backendInfo?.deployed_at ? new Date(backendInfo.deployed_at).toLocaleString() : 'N/A'}</dd>
          </dl>
        </div>
      </div>

      <style>{`
        .contract-panel {
          padding: 2rem;
          border-radius: 8px;
          background: #f5f5f5;
        }
        .contract-panel.broken {
          border: 3px solid #dc3545;
        }
        .contract-panel.synced {
          border: 3px solid #28a745;
        }
        .alert {
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
        }
        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .info-section h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        .info-section dl {
          margin: 0;
        }
        .info-section dt {
          font-weight: bold;
          margin-top: 0.5rem;
        }
        .info-section dd {
          margin: 0 0 0.5rem 0;
        }
        .info-section code {
          background: #e9ecef;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

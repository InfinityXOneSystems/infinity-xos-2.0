import { ContractPanel } from './ContractPanel';

export function AdminPage() {
  return (
    <div className="admin-page">
      <header>
        <h1>Infinity XOS Control Plane</h1>
        <p>infinityxai.com/admin — Mirror Reality</p>
      </header>

      <nav className="admin-nav">
        <button className="nav-item active">Contract</button>
        <button className="nav-item">Services</button>
        <button className="nav-item">GitHub</button>
        <button className="nav-item">Autopilot</button>
        <button className="nav-item">Vision Cortex</button>
      </nav>

      <main>
        <ContractPanel />
      </main>

      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #1a1a1a;
          color: #fff;
          padding: 2rem;
        }
        .admin-page header {
          margin-bottom: 2rem;
        }
        .admin-page h1 {
          margin: 0 0 0.5rem 0;
          color: #39FF14;
        }
        .admin-page header p {
          margin: 0;
          color: #888;
        }
        .admin-nav {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #333;
          padding-bottom: 1rem;
        }
        .nav-item {
          background: none;
          border: none;
          color: #888;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
        }
        .nav-item:hover {
          color: #fff;
        }
        .nav-item.active {
          color: #39FF14;
          border-bottom: 2px solid #39FF14;
        }
        main {
          max-width: 1200px;
        }
      `}</style>
    </div>
  );
}

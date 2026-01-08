import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AdminPage } from './pages/Admin';

function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Infinity XOS 2.0</h1>
      <p>Intelligence Redefined</p>
      <nav style={{ marginTop: '2rem' }}>
        <Link to="/admin" style={{ color: '#39FF14', fontSize: '1.2rem' }}>
          → Admin Control Plane
        </Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

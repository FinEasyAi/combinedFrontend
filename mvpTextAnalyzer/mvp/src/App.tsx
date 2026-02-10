import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const AppLayout = () => (
    <div className="app-container fade-in">
      {/* Background Visuals */}
      <div className="bg-visuals">
        <div className="blur-shape shape-1"></div>
        <div className="blur-shape shape-2"></div>
      </div>

      <Sidebar />
      <MainContent />
    </div>
  );

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>
    </Routes>
  );
}

export default App;

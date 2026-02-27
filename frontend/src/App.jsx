import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
// Import pages (we will create these next)
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="documents" element={<Documents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

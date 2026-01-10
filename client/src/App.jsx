import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ParsePage from './pages/ParsePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ParsePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

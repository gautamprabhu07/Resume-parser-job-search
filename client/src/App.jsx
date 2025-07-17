// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Parse from './components/Parse';
import Jobs from './components/Jobs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Parse />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </Router>
  );
}

export default App;

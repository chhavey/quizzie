import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Access from './pages/Access/Access';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import QuesAnalysis from './pages/QuesAnalysis/QuesAnalysis';
import TakeQuiz from './pages/TakeQuiz/TakeQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/:quizId" element={<QuesAnalysis />} />
        <Route path="/quiz/:quizId" element={<TakeQuiz />} />
        <Route path="/" element={<Access />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

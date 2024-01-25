import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Access from './pages/Access';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Access />} />
        <Route path="/" element={<Access />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Airbnbs from './components/Airbnbs';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/airbnbs" element={<Airbnbs />} />
      </Routes>
    </Router>
  );
}

export default App;

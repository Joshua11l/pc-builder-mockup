import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

import HomeScreen from './screens/HomeScreen';
import BuildScreen from './screens/BuildScreen';
import SavedBuildsScreen from './screens/SavedBuildsScreen';
import Auth from './screens/Auth';


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"      element={<HomeScreen />} />
        <Route path="/build" element={<BuildScreen />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/saved" element={<SavedBuildsScreen />} />
      </Routes>
    </Router>
  );
}

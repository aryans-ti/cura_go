import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TestScreen from './components/TestScreen';

// This is a simplified app component with minimal dependencies
const SimplifiedApp = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// Simple Home component
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-blue-500 text-white font-bold rounded-lg border shadow-lg p-10 m-10">
        <h1 className="text-3xl mb-4">CuraGo Home</h1>
        <p className="mb-4">Welcome to CuraGo - Healthcare at your fingertips</p>
        <a href="/test" className="px-4 py-2 bg-white text-blue-500 rounded font-bold inline-block mt-2">
          Go to Test Page
        </a>
      </div>
    </div>
  );
};

// Simple NotFound component
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-red-500 text-white font-bold rounded-lg border shadow-lg p-10 m-10">
        <h1 className="text-3xl mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <a href="/" className="px-4 py-2 bg-white text-red-500 rounded font-bold inline-block mt-2">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default SimplifiedApp; 
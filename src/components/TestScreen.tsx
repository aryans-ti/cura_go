import React from 'react';

const TestScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="bg-blue-500 text-white font-bold rounded-lg border shadow-lg p-10 m-10">
        <h1 className="text-3xl mb-4">Test Screen</h1>
        <p className="mb-4">If you can see this, the React app is working correctly!</p>
        <p>The issue might be with other components or routes.</p>
      </div>
    </div>
  );
};

export default TestScreen; 
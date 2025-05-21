import React, { useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

// Define the libraries type correctly
const libraries: ["places", "geometry"] = ["places", "geometry"];

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that loads the Google Maps API securely
 * Wraps the application to provide Google Maps functionality
 */
const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Try to get API key from environment
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!key) {
      console.warn('Google Maps API key is not defined. Map functionality will be limited.');
      setError('Google Maps API key is missing. Maps functionality will not work properly.');
    } else {
      console.log('Google Maps API key found and loaded successfully.');
      setApiKey(key);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading maps configuration...</div>;
  }

  if (error) {
    console.error(error);
    // Still render children, but Maps won't work
    return (
      <div className="relative">
        {children}
        {/* This warning will be shown only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 z-50 max-w-md">
            <p className="font-bold">Maps API Warning</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      loadingElement={<div className="h-full w-full flex items-center justify-center">Loading Maps...</div>}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider; 
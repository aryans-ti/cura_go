import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  location: Location;
  name?: string;
  address?: string;
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const LocationMap: React.FC<LocationMapProps> = ({
  location,
  name = '',
  address = '',
  zoom = 15,
  height = '400px',
  width = '100%',
  className = ''
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  const toggleInfoWindow = () => {
    setIsInfoWindowOpen(!isInfoWindowOpen);
  };
  
  return (
    <div 
      className={`overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`} 
      style={{ height, width }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={location}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker
          position={location}
          onClick={toggleInfoWindow}
        >
          {isInfoWindowOpen && (
            <InfoWindow
              position={location}
              onCloseClick={toggleInfoWindow}
            >
              <div className="p-2">
                {name && <h3 className="font-semibold text-sm mb-1">{name}</h3>}
                {address && <p className="text-xs text-gray-600">{address}</p>}
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  );
};

export default LocationMap; 
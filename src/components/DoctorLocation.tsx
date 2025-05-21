import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Clock } from 'lucide-react';

interface DoctorLocationProps {
  doctorName: string;
  clinicName?: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  website?: string;
  hours?: string;
  className?: string;
}

const DoctorLocation: React.FC<DoctorLocationProps> = ({
  doctorName,
  clinicName,
  address,
  phone,
  website,
  hours,
  className = ''
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Static map placeholder */}
        <div 
          className="w-full h-[220px] bg-muted flex items-center justify-center border-b border-border"
        >
          <div className="text-center p-6">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Map data unavailable</p>
            <p className="text-xs text-muted-foreground mt-1">{address}</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <h4 className="font-medium text-sm">{clinicName || `${doctorName}'s Clinic`}</h4>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
          
          {phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${phone}`} className="text-sm hover:text-primary transition-colors">
                {phone}
              </a>
            </div>
          )}
          
          {website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:text-primary transition-colors"
              >
                {website}
              </a>
            </div>
          )}
          
          {hours && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <h4 className="font-medium text-sm">Working Hours</h4>
                <p className="text-sm text-muted-foreground">{hours}</p>
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-border">
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorLocation; 
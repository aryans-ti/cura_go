import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Doctor } from '../data/mockData';
import { Star, Calendar, Video, Phone, MessageSquare, Stethoscope, CheckCircle2 } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
  className?: string;
  isCompact?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  onSelect, 
  className = '',
  isCompact = false
}) => {
  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Compact version for chat interface
  if (isCompact) {
    return (
      <div 
        className={`flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${className}`}
        onClick={() => onSelect(doctor)}
      >
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={doctor.image || `https://avatar.vercel.sh/${doctor.name}`} alt={doctor.name} />
          <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium text-foreground">{doctor.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Stethoscope className="h-3 w-3 text-primary" />
            {doctor.specialty} • {doctor.experience} yrs
            <span className="ml-1 flex">{renderStars(doctor.rating)}</span>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="default" 
          className="h-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doctor);
          }}
        >
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Book
        </Button>
      </div>
    );
  }

  // Full card version
  return (
    <Card 
      className={`overflow-hidden border border-border hover:shadow-md transition-all ${className}`}
      onClick={() => onSelect(doctor)}
    >
      <div className="relative">
        {doctor.matchDetails?.isPrimaryRecommendation && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white border-green-600">
            Best Match
          </Badge>
        )}
        <div className="p-4 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 ring-2 ring-primary/10 shadow-sm">
            <AvatarImage src={doctor.image || `https://avatar.vercel.sh/${doctor.name}`} alt={doctor.name} />
            <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{doctor.name}</h3>
            <div className="flex items-center text-sm text-primary font-medium">
              <Stethoscope className="h-4 w-4 mr-1" />
              {doctor.specialty}
            </div>
            <div className="flex items-center mt-1">
              {renderStars(doctor.rating)}
              <span className="ml-2 text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mb-3">
          {doctor.specializations && doctor.specializations.slice(0, 3).map((spec, i) => (
            <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {spec}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-primary" />
            {doctor.experience} years exp.
          </div>
          {doctor.languages && (
            <div>
              Speaks: {doctor.languages.join(', ')}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-1">
            {doctor.availableModes?.includes('video') && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/20">
                <Video className="h-3 w-3 mr-1" /> Video
              </Badge>
            )}
            {doctor.availableModes?.includes('phone') && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/20">
                <Phone className="h-3 w-3 mr-1" /> Phone
              </Badge>
            )}
            {doctor.availableModes?.includes('chat') && (
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/20">
                <MessageSquare className="h-3 w-3 mr-1" /> Chat
              </Badge>
            )}
          </div>
          <div className="text-sm font-medium text-green-600">
            ${doctor.consultationFee || doctor.fee}
          </div>
        </div>
        <Button 
          className="w-full mt-3" 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doctor);
          }}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Select Doctor
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard; 
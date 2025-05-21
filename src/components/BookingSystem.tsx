import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Phone, Video, MessageCircle, User, Clock, MapPin, GraduationCap, Globe, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { consultationModes, Doctor, timeSlots } from '../data/mockData';
import { AppointmentIllustration } from '../data/illustrations';

interface BookingSystemProps {
  selectedDoctor: Doctor;
  onBookingComplete: () => void;
  inDialogMode?: boolean;
}

const BookingSystem: React.FC<BookingSystemProps> = ({ 
  selectedDoctor, 
  onBookingComplete,
  inDialogMode = false
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Reset time slot when date changes
    setSelectedTimeSlot(null);
  };
  
  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
  };
  
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTimeSlot || !selectedMode) {
      // Show a simple alert if toast is not working
      alert("Please select date, time and consultation mode");
      return;
    }
    
    // Use alert if toast is not working
    alert(`Consultation booked successfully with ${selectedDoctor.name} on ${format(date, "PPP")} at ${selectedTimeSlot} via ${selectedMode}`);
    
    // Reset form and notify parent component
    setDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedMode(null);
    onBookingComplete();
  };
  
  // Get available modes for the doctor
  const availableModes = selectedDoctor.availableModes ? 
    consultationModes.filter(mode => 
    selectedDoctor.availableModes.includes(mode.id)
    ) : [];
  
  // Icon mapping for consultation modes
  const getModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'video':
        return <Video className="h-6 w-6 text-blue-500" />;
      case 'audio':
        return <Phone className="h-6 w-6 text-green-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-emerald-500" />;
      case 'in-person':
        return <User className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const isFormValid = () => {
    return date && selectedTimeSlot && selectedMode ? true : false;
  };
  
  // Add any necessary style adjustments for dialog mode
  const containerClassName = inDialogMode 
    ? "max-h-[70vh] overflow-y-auto py-2" 
    : "animate-fade-in";
  
  return (
    <div className={containerClassName}>
      {!inDialogMode && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Book Your Appointment</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            Secure Booking
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Doctor Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-card rounded-xl shadow-sm p-6 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10 z-0 pointer-events-none">
              <AppointmentIllustration className="w-40 h-40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-4">Selected Doctor</h2>
            <div className="flex items-start mb-6">
              <div className="mr-4">
              <img 
                  src={selectedDoctor.image || "https://via.placeholder.com/100"} 
                alt={selectedDoctor.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://via.placeholder.com/100";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedDoctor.name}</h3>
                <p className="text-primary text-sm">{selectedDoctor.specialty}</p>
                <div className="flex mt-1">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(selectedDoctor.rating) ? 'text-yellow-400' : 'text-muted-foreground/30'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">{selectedDoctor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-muted-foreground mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-foreground font-medium">About:</p>
                  <p className="text-muted-foreground">{selectedDoctor.about}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-muted-foreground mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <p className="text-foreground font-medium">Education:</p>
                  <p className="text-muted-foreground">{selectedDoctor.education}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-muted-foreground mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <div>
                  <p className="text-foreground font-medium">Languages:</p>
                  <p className="text-muted-foreground">{selectedDoctor.languages.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-primary">
                <span className="font-medium">Consultation Fee:</span> ${selectedDoctor.consultationFee}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column: Booking Form */}
        <div className="w-full md:w-2/3">
          <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Book Your Consultation</h2>
            
            {/* Booking complete message */}
            {/* This part is kept empty as the original code didn't include a booking complete message */}
        
        {/* Booking form */}
            <div>
        <div className="space-y-6">
                {/* Consultation Mode */}
                <div>
                  <Label className="text-foreground mb-2 block">Select Consultation Mode</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableModes.map((mode) => (
                      <div 
                        key={mode.id}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-all
                          flex items-start
                          ${selectedMode === mode.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/30 hover:bg-primary/5'
                          }
                        `}
                        onClick={(e) => {
                          e.preventDefault();
                          handleModeSelect(mode.id);
                        }}
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                              mode.id === 'video' ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" :
                              mode.id === 'audio' ? "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" :
                              mode.id === 'whatsapp' ? "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" :
                              "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            } />
                          </svg>
                        </div>
          <div>
                          <div className="font-medium text-foreground">{mode.name}</div>
                          <div className="text-sm text-muted-foreground">{mode.description}</div>
                          {selectedMode === mode.id && (
                            <div className="mt-2 text-xs text-primary font-medium">Selected</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {!selectedMode && (
                    <p className="text-red-500 text-xs mt-1">Please select a consultation mode</p>
                  )}
                </div>
                
                {/* Date Selection */}
                <div>
                  <Label className="text-foreground mb-2 block">Select Date</Label>
                  <div className="border rounded-lg overflow-hidden bg-card">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                      className="border-0"
                      disabled={(date) => 
                        date < new Date() || 
                        date > new Date(new Date().setDate(new Date().getDate() + 30)) ||
                        date.getDay() === 0
                      }
                    />
                  </div>
                  {!date && (
                    <p className="text-red-500 text-xs mt-1">Please select a date</p>
                  )}
          </div>
          
                {/* Time Selection */}
          {date && (
            <div>
                    <Label className="text-foreground mb-2 block">Select Time</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.map(time => (
                        <div
                          key={time}
                          className={`
                            py-2 px-3 border rounded-md text-center cursor-pointer text-sm
                            ${selectedTimeSlot === time 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'border-border hover:border-primary/30 hover:bg-primary/5 text-foreground'
                            }
                          `}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTimeSlot(time);
                          }}
                  >
                          {time}
                        </div>
                ))}
              </div>
                    {!selectedTimeSlot && (
                      <p className="text-red-500 text-xs mt-1">Please select a time</p>
                    )}
            </div>
          )}
          
                {/* Booking summary */}
                {date && selectedTimeSlot && selectedMode && (
                  <Card className="border-primary/20 shadow-md bg-primary/5">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-primary mb-3 flex items-center">
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        Booking Summary
                      </h3>
                      <div className="space-y-2 text-sm text-foreground">
                        <p><span className="font-medium">Doctor:</span> {selectedDoctor.name}</p>
                        <p><span className="font-medium">Date:</span> {format(date, "PPP")}</p>
                        <p><span className="font-medium">Time:</span> {selectedTimeSlot}</p>
                        <p><span className="font-medium">Mode:</span> {
                          consultationModes.find(m => m.id === selectedMode)?.name || selectedMode
                        }</p>
                        <p><span className="font-medium">Fee:</span> ${selectedDoctor.consultationFee}</p>
                  </div>
                    </CardContent>
                  </Card>
          )}
          
          {/* Submit button */}
            <Button 
                  className="w-full py-6"
              disabled={!date || !selectedTimeSlot || !selectedMode}
              onClick={handleBooking}
            >
                  {isFormValid() ? 'Confirm Booking' : 'Please Fill All Required Fields'}
            </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;

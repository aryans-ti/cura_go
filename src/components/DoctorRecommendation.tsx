import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { symptomToSpecialty, specialties } from '../data/mockData';
import { CalendarDays, Clock, CheckCircle2, User, Video, Phone, MessageCircle, Tag, Zap, AlertTriangle } from 'lucide-react';
import { DoctorAvatar, SpecialtyIcon } from '../data/illustrations';
import { analyzeSymptoms, Doctor } from '../services/chatService';

interface DoctorRecommendationProps {
  symptoms: string[];
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorRecommendation: React.FC<DoctorRecommendationProps> = ({ symptoms, onSelectDoctor }) => {
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [hoveredDoctor, setHoveredDoctor] = useState<string | null>(null);
  const [relevantSpecialties, setRelevantSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<any>(null);

  // Load doctors based on symptoms
  useEffect(() => {
    const fetchDoctorRecommendations = async () => {
      if (symptoms.length === 0) {
        // If no symptoms provided, use local mock data
        const defaultSpecialties = ['General Physician'];
        setRelevantSpecialties(defaultSpecialties);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch recommendations from backend
        const response = await analyzeSymptoms(symptoms);
        
        // Store the response
        setAnalysisResponse(response);
        
        // Set relevant specialties
        setRelevantSpecialties(response.relevantSpecialties || []);
        
        // Set recommended doctors
        setRecommendedDoctors(response.recommendedDoctors || []);
        setFilteredDoctors(response.recommendedDoctors || []);
      } catch (err) {
        console.error("Error fetching doctor recommendations:", err);
        setError("Failed to load doctor recommendations. Please try again.");
        
        // Fallback to local data
    const specialtiesSet = new Set<string>();
    symptoms.forEach(symptom => {
      const matchedSpecialties = symptomToSpecialty[symptom.toLowerCase()] || [];
      matchedSpecialties.forEach(specialty => specialtiesSet.add(specialty));
    });
    if (specialtiesSet.size === 0) {
      specialtiesSet.add('General Physician');
    }
        setRelevantSpecialties(Array.from(specialtiesSet));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorRecommendations();
  }, [symptoms]);

  // Filter doctors by specialty
  const filterBySpecialty = (specialty: string | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedSpecialty(specialty);
    
    if (specialty === null) {
      // Show all recommended doctors
      setFilteredDoctors(recommendedDoctors);
    } else {
      // Filter by selected specialty
      const filtered = recommendedDoctors.filter(doctor => doctor.specialty === specialty);
      setFilteredDoctors(filtered);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array(5).fill(0).map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-muted-foreground/30'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get icon for consultation mode
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video':
        return <Video className="w-3 h-3 mr-1" />;
      case 'audio':
        return <Phone className="w-3 h-3 mr-1" />;
      case 'whatsapp':
        return <MessageCircle className="w-3 h-3 mr-1" />;
      case 'in-person':
        return <User className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  // Get urgency label from AI analysis
  const getUrgencyLabel = () => {
    if (!analysisResponse?.aiAnalysis?.urgencyLevel) return null;
    
    const urgencyLevel = analysisResponse.aiAnalysis.urgencyLevel;
    
    switch (urgencyLevel) {
      case 'urgent':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2 text-sm flex items-start dark:bg-red-900/30 dark:border-red-800/30 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
            <span>These symptoms may require prompt medical attention. Please consult with a healthcare professional soon.</span>
          </div>
        );
      case 'moderate':
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 text-sm flex items-start dark:bg-amber-900/30 dark:border-amber-800/30 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
            <span>It's advisable to consult with a healthcare professional for these symptoms.</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Display possible conditions from AI analysis
  const getPossibleConditions = () => {
    if (!analysisResponse?.aiAnalysis?.possibleConditions || analysisResponse.aiAnalysis.possibleConditions.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-2 text-sm">
        <p className="font-medium mb-1 text-foreground">Possible conditions to discuss with your doctor:</p>
        <div className="flex flex-wrap gap-1">
          {analysisResponse.aiAnalysis.possibleConditions.map((condition: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-card">
              {condition}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground italic">Note: This is not a diagnosis. Only a qualified healthcare professional can provide an accurate diagnosis.</p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recommended Doctors</h2>
        <div className="flex items-center bg-muted px-3 py-1 rounded-full border border-border">
          <CheckCircle2 className="w-4 h-4 text-primary mr-1" />
          <p className="text-sm font-medium text-primary">
            {isLoading ? "Finding doctors..." : `${filteredDoctors.length} doctors available`}
          </p>
        </div>
      </div>
      
      {symptoms.length > 0 ? (
        <div className="mb-6 bg-primary/5 p-4 rounded-xl border border-primary/20">
          <h3 className="text-sm font-medium mb-3 text-primary flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Based on your symptoms:
          </h3>
          <div className="flex flex-wrap">
            {symptoms.map((symptom, index) => (
              <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20 mr-2 mb-2 shadow-sm">
                {symptom}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-primary/10 text-xs text-muted-foreground">
            {relevantSpecialties.length > 0 ? (
              <p>Recommended specialties: <span className="font-medium text-primary">{relevantSpecialties.join(', ')}</span></p>
            ) : (
              <p>General consultation recommended</p>
            )}
          </div>
          
          {getUrgencyLabel()}
          {getPossibleConditions()}
          
          {analysisResponse?.aiAnalysis?.additionalSymptomsToWatch && analysisResponse.aiAnalysis.additionalSymptomsToWatch.length > 0 && (
            <div className="mt-3 text-xs">
              <p className="font-medium text-foreground">Watch for these additional symptoms:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResponse.aiAnalysis.additionalSymptomsToWatch.map((symptom: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-[10px] bg-muted/50">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-5 bg-muted rounded-xl border border-border">
          <p className="text-foreground">
            You haven't entered any symptoms yet. You can <a href="#" onClick={(e) => {e.preventDefault(); document.querySelector('[value="symptoms"]')?.dispatchEvent(new MouseEvent('click'))}} className="font-semibold text-primary underline hover:text-primary/80 transition-colors">go back to enter symptoms</a> for more personalized recommendations, or browse all available doctors below.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900/30">
          <p className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </p>
        </div>
      )}
      
      <div className="border-b border-border mb-6 pb-1">
        <p className="text-sm text-primary font-medium mb-2">
          Select a doctor to continue to the booking page →
        </p>
      </div>
      
      {/* Specialty filters */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3 text-foreground">Filter by specialty:</h3>
        <div className="flex flex-wrap gap-2 mb-4 bg-muted p-4 rounded-lg border border-border">
          <Button
            size="sm"
            variant={selectedSpecialty === null ? "default" : "outline"}
            onClick={filterBySpecialty(null)}
            className="rounded-full"
          >
            All
          </Button>
          {relevantSpecialties.map(specialty => (
            <Button
              key={specialty}
              size="sm"
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              onClick={filterBySpecialty(specialty)}
              className="rounded-full flex items-center"
            >
              <span className="w-4 h-4 mr-1">
                <SpecialtyIcon specialty={specialty} className="w-full h-full" />
              </span>
              {specialty}
            </Button>
          ))}
          {symptoms.length === 0 && specialties.filter(s => !relevantSpecialties.includes(s)).map(specialty => (
            <Button
              key={specialty}
              size="sm"
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              onClick={filterBySpecialty(specialty)}
              className="rounded-full flex items-center"
            >
              <span className="w-4 h-4 mr-1">
                <SpecialtyIcon specialty={specialty} className="w-full h-full" />
              </span>
              {specialty}
            </Button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-foreground">Finding the best doctors for your symptoms...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <Card 
              key={doctor.id} 
              className={`overflow-hidden transition-all duration-300 ${
                hoveredDoctor === doctor.id 
                  ? 'shadow-xl border-primary/30 transform scale-[1.02]' 
                  : 'border-border hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredDoctor(doctor.id)}
              onMouseLeave={() => setHoveredDoctor(null)}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/20 h-2"></div>
              <CardHeader className="pb-3">
                <div className="flex items-start">
                  <div className="mr-4 relative">
                    {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-card shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          if (target instanceof HTMLElement) {
                            target.setAttribute('style', 'display: none;');
                            const sibling = target.nextElementSibling;
                            if (sibling instanceof HTMLElement) {
                              sibling.setAttribute('style', 'display: block;');
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div className={`${doctor.image ? 'hidden' : ''}`}>
                      <DoctorAvatar className="w-16 h-16 rounded-full shadow-md" seed={doctor.id} />
                    </div>
                    {doctor.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-card">
                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{doctor.name}</CardTitle>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-1">
                        <SpecialtyIcon specialty={doctor.specialty} className="w-full h-full" />
                      </span>
                      <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(doctor.rating)}
                      <span className="ml-2 text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Match indicator for specialty */}
                {doctor.matchDetails?.isPrimaryRecommendation && (
                  <div className="flex mt-2 p-1.5 bg-green-50 text-green-700 rounded-md border border-green-200 text-xs items-center dark:bg-green-900/30 dark:text-green-300 dark:border-green-900/50">
                    <Zap className="h-3 w-3 mr-1" />
                    Best match for your symptoms
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-foreground font-medium">Experience:</span>
                    <span className="ml-1 text-muted-foreground">{doctor.experience} years</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-muted-foreground mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-foreground font-medium">Consultation Fee:</span>
                    <span className="ml-1 text-muted-foreground">${doctor.fee}</span>
                </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-foreground font-medium text-sm">Available via:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doctor.availableModes && doctor.availableModes.map(mode => (
                      <Badge key={mode} variant="outline" className="capitalize bg-card text-foreground border-border flex items-center">
                        {getModeIcon(mode)} {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {hoveredDoctor === doctor.id && (
                  <div className="mt-4 text-xs text-foreground bg-muted p-2 rounded-md border border-border">
                    <p>{doctor.shortBio || doctor.specializations?.join(', ') || `Specialist in ${doctor.specialty}`}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className={`w-full rounded-md transition-all font-medium ${
                    hoveredDoctor === doctor.id 
                      ? 'bg-primary shadow-md text-primary-foreground py-6' 
                      : 'py-5 hover:shadow-md'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectDoctor(doctor);
                  }}
                >
                  <CalendarDays className={`w-4 h-4 mr-2 ${hoveredDoctor === doctor.id ? 'animate-pulse' : ''}`} />
                  Book Consultation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-card rounded-xl border border-border">
          <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-foreground mb-4">No doctors found for the selected criteria.</p>
          <Button variant="outline" className="mt-1" onClick={() => filterBySpecialty(null)}>
            Show All Doctors
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorRecommendation;

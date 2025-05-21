import React, { useState, useEffect } from 'react';
import { AlertTriangle, Ambulance, X, Stethoscope, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyDetectionBadgeProps {
  isEmergency: boolean;
  urgencyLevel: 'non-urgent' | 'moderate' | 'urgent';
  symptoms: string[];
}

const EmergencyDetectionBadge: React.FC<EmergencyDetectionBadgeProps> = ({ 
  isEmergency, 
  urgencyLevel,
  symptoms 
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  
  // Only show the emergency alert if it's actually an emergency or urgency is high
  const shouldShow = (isEmergency || urgencyLevel === 'urgent') && !dismissed;
  
  // Add slight delay before showing the alert for better UX
  useEffect(() => {
    if (isEmergency || urgencyLevel === 'urgent') {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isEmergency, urgencyLevel]);
  
  // Get critical symptom if any
  const getCriticalSymptom = () => {
    const criticalKeywords = [
      'chest pain', 'difficulty breathing', 'shortness of breath', 
      'severe bleeding', 'unconscious', 'stroke', 'heart attack',
      'seizure', 'paralysis', 'unable to move', 'severe abdominal pain',
      'sudden vision loss', 'sudden severe headache', 'suicidal thoughts',
      'drug overdose', 'poisoning', 'severe allergic reaction', 
      'anaphylaxis', 'high fever', 'coughing blood'
    ];
    
    for (const symptom of symptoms) {
      for (const keyword of criticalKeywords) {
        if (symptom.toLowerCase().includes(keyword)) {
          return keyword;
        }
      }
    }
    
    return null;
  };
  
  const criticalSymptom = getCriticalSymptom();
  const isLifeThreatening = criticalSymptom !== null;
  
  // If not an emergency or already dismissed, don't render anything
  if (!shouldShow) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <Alert 
            variant="destructive"
            className="border-red-500 bg-red-50 dark:bg-red-900/80 dark:border-red-700 backdrop-blur-sm shadow-lg"
          >
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-red-200 text-red-600"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 animate-pulse" />
              <div>
                <AlertTitle className="text-red-700 dark:text-red-300 font-bold text-lg flex items-center">
                  Potential Medical Emergency Detected
                </AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-300 mt-1">
                  {criticalSymptom 
                    ? `Your symptom "${criticalSymptom}" may require immediate medical attention.` 
                    : `Your symptoms may require immediate medical attention.`
                  }
                  <div className="mt-3 space-y-2">
                    {isLifeThreatening ? (
                      <Button 
                        className="w-full emergency-button" 
                        onClick={() => window.open('tel:911')}
                      >
                        <Ambulance className="h-4 w-4 mr-2" />
                        Call Emergency Services (911)
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          className="w-full emergency-button" 
                          onClick={() => window.open('tel:911')}
                        >
                          <Ambulance className="h-4 w-4 mr-1" />
                          Call 911
                        </Button>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                          onClick={() => window.open('tel:+18005551234')}
                        >
                          <Stethoscope className="h-4 w-4 mr-1" />
                          Call Doctor Now
                        </Button>
                      </div>
                    )}
                    <div className="text-xs text-red-500 dark:text-red-400 italic text-center mt-2">
                      *This is an AI-generated recommendation. Use your judgment.
                    </div>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyDetectionBadge; 
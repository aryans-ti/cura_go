import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, SendIcon, Bot, User, AlertCircle, Heart, Stethoscope, RotateCcw, Pill, Clock, HelpCircle, ThumbsUp, AlertTriangle, ArrowUp, CheckCircle2, ChevronDown, PlusCircle, Send, Brain, X, Users } from 'lucide-react';
import { sendMessage, ChatMessage, checkServerHealth, analyzeSymptomWithAI, startSymptomAssessment, detectSymptoms } from '../services/chatService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import '../styles/markdown.css';
import type { Components } from 'react-markdown';
import { Doctor } from '../data/mockData';
import DoctorCard from './DoctorCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingSystem from './BookingSystem';

interface AIDiagnosisChatProps {
  className?: string;
  onDetectSymptoms?: (symptoms: string[]) => void;
  onSelectDoctor?: (doctor: Doctor) => void;
  onViewAllDoctors?: () => void;
}

// Animation variants for messages
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Typing indicator animation
const typingVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { repeat: Infinity, duration: 1.5 }
  }
};

type HealthStatus = 'checking' | 'online' | 'offline';

// Medical specialty categories for more specific assistance
const medicalSpecialties = [
  { name: "Cardiology", symptoms: ["chest pain", "heart palpitations", "shortness of breath"] },
  { name: "Neurology", symptoms: ["headache", "dizziness", "numbness", "tingling", "memory issues"] },
  { name: "Gastroenterology", symptoms: ["stomach pain", "nausea", "vomiting", "diarrhea", "constipation"] },
  { name: "Dermatology", symptoms: ["rash", "itching", "skin changes", "mole changes"] },
  { name: "Orthopedics", symptoms: ["joint pain", "back pain", "muscle pain", "fracture", "sprain"] },
  { name: "Respiratory", symptoms: ["cough", "wheezing", "shortness of breath", "congestion"] },
  { name: "General", symptoms: ["fever", "fatigue", "weight loss", "weight gain"] }
];

// Medical content templates for better health conversation
const healthPromptTemplates = [
  { id: "symptoms", text: "I've been experiencing [symptom] for [duration]. What could it be?" },
  { id: "medication", text: "What are common side effects of [medication]?" },
  { id: "specialist", text: "When should I see a specialist for [condition]?" },
  { id: "prevention", text: "How can I prevent [condition]?" },
  { id: "treatment", text: "What are home treatments for [condition]?" },
  { id: "emergency", text: "Is [symptom] a medical emergency? When should I seek help?" }
];

// Medical glossary for explaining medical terms
const medicalGlossary = {
  "hypertension": "High blood pressure",
  "tachycardia": "Rapid heart rate",
  "bradycardia": "Slow heart rate",
  "myocardial infarction": "Heart attack",
  "cerebrovascular accident": "Stroke",
  "dyspnea": "Difficulty breathing",
  "syncope": "Fainting",
  "edema": "Swelling",
  "pyrexia": "Fever",
  "dysphagia": "Difficulty swallowing",
  "vertigo": "Sensation of spinning or dizziness",
  "pruritis": "Itching",
  "anemia": "Low red blood cell count",
  "arthralgia": "Joint pain",
  "myalgia": "Muscle pain",
  "nausea": "Feeling of sickness with an urge to vomit",
  "emesis": "Vomiting"
};

// Additional types for guided assessment
type AssessmentStage = 'initial' | 'primary-symptoms' | 'secondary-symptoms' | 'history' | 'complete';

interface AssessmentState {
  active: boolean;
  stage: AssessmentStage;
  primarySymptoms: string[];
  secondarySymptoms: string[];
  urgencyLevel: 'non-urgent' | 'moderate' | 'urgent' | null;
  ageGroup?: string;
  hasExistingConditions?: boolean;
  painLevel?: number;
}

const AIDiagnosisChat: React.FC<AIDiagnosisChatProps> = ({ 
  className,
  onDetectSymptoms,
  onSelectDoctor,
  onViewAllDoctors
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: "Hello! I'm your health assistant. Please describe your symptoms or ask any health-related questions. Remember, I can provide information but not medical diagnoses." }]
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
  const [userAvatarLoaded, setUserAvatarLoaded] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<HealthStatus>('checking');
  const [hasSymptomsToAnalyze, setHasSymptomsToAnalyze] = useState<boolean>(false);
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [emergencyDetected, setEmergencyDetected] = useState<boolean>(false);
  const [treatmentSuggestions, setTreatmentSuggestions] = useState<string[]>([]);
  const [showTreatmentPanel, setShowTreatmentPanel] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [identifiedMedicalTerms, setIdentifiedMedicalTerms] = useState<string[]>([]);
  const [showMedicalGlossary, setShowMedicalGlossary] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<AssessmentState>({
    active: false,
    stage: 'initial',
    primarySymptoms: [],
    secondarySymptoms: [],
    urgencyLevel: null
  });
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [showDoctorRecommendations, setShowDoctorRecommendations] = useState<boolean>(false);
  const [showBookingDialog, setShowBookingDialog] = useState<boolean>(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update last activity time
  useEffect(() => {
    setLastActivity(new Date());
  }, [messages]);
  
  // Format time since last message
  const getTimeSinceLastActivity = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  };
  
  // Check server health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await checkServerHealth();
        setServerStatus(result.status === 'ok' ? 'online' : 'offline');
        
        // Add initial welcome message if server is online
        if (result.status === 'ok') {
          setMessages([{
            role: 'model',
            parts: [{ text: "Hello! I'm your AI health assistant. Please describe your symptoms or health concerns, and I'll do my best to provide information and guidance.\n\n**Remember** that I can:\n\n* Analyze your symptoms\n* Suggest possible causes\n* Recommend when to see a doctor\n* Provide self-care tips\n\n_I'm not a substitute for professional medical advice._" }]
          }]);
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setServerStatus('offline');
        setError('Unable to connect to the AI service. Please try again later.');
      }
    };
    
    checkHealth();
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Cleanup any timers when component unmounts
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearInterval(retryTimeout);
      }
    };
  }, [retryTimeout]);
  
  // Handle countdown for rate limit retry
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setInterval(() => {
        setRetryCountdown(prev => {
          if (prev <= 1) {
            setError(null);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setRetryTimeout(timer);
      return () => clearInterval(timer);
    }
  }, [retryCountdown]);

  // Add medical glossary useEffect
  useEffect(() => {
    if (messages.length > 0) {
      const userMessages = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.parts[0].text);
        
      // Check medical terms in the latest message
      if (userMessages.length > 0) {
        const latestMessage = userMessages[userMessages.length - 1].toLowerCase();
        
        // Check for medical terms in the message
        const medTerms = Object.keys(medicalGlossary).filter(term => 
          latestMessage.includes(term.toLowerCase())
        );
        
        if (medTerms.length > 0) {
          setIdentifiedMedicalTerms(medTerms);
          setShowMedicalGlossary(true);
        } else {
          setShowMedicalGlossary(false);
        }
      }
    }
  }, [messages]);

  // Start guided assessment flow
  const startAssessment = async () => {
    if (assessment.active) return;
    
    // Clear existing messages except for the welcome message
    setMessages([
      messages[0]
    ]);
    
    // Show loading state immediately 
    setIsLoading(true);
    
    // Update assessment state
    setAssessment(prev => ({
      ...prev,
      active: true,
      stage: 'primary-symptoms',
      primarySymptoms: [],
      secondarySymptoms: [],
      urgencyLevel: null
    }));
    
    try {
      // Get initial assessment question from API
      const response = await startSymptomAssessment();
      
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          parts: [{ 
            text: response.initialQuestion || "Let's start a health assessment. What's your main symptom today? Please describe it in detail, including when it started and how severe it is." 
          }]
        }
      ]);
      
      // Scroll to the new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Failed to start assessment:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          parts: [{ 
            text: "Let's start a health assessment. What's your main symptom today? Please describe it in detail, including when it started and how severe it is."
          }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Process assessment response based on current stage
  const processAssessmentResponse = async (userMessage: string) => {
    try {
      // Use the backend API to detect symptoms
      let extractedSymptoms: string[] = [];
      let hasCriticalSymptoms = false;
      
      // Use the backend API to detect symptoms accurately
      try {
        const symptomCheck = await detectSymptoms(userMessage);
        if (symptomCheck.containsSymptoms) {
          console.log("Backend detected symptoms:", symptomCheck.detectedSymptoms);
          extractedSymptoms = symptomCheck.detectedSymptoms;
          
          // Check for emergency symptoms
          hasCriticalSymptoms = extractedSymptoms.some(symptom => 
            criticalSymptoms.some(critical => symptom.includes(critical))
          );
          
          if (hasCriticalSymptoms) {
            console.log("Emergency detected:", extractedSymptoms.filter(symptom => 
              criticalSymptoms.some(critical => symptom.includes(critical))
            ));
            setEmergencyDetected(true);
          }
        }
      } catch (error) {
        console.error("Error checking for symptoms:", error);
      }
      
      // Simply send the user's message to the AI and get a direct response
      // No more complex multi-stage assessment flow
      setIsLoading(true);
      
      try {
        // Use the API to get a personalized response based on symptoms
        const response = await sendMessage(userMessage, messages.slice(1));
        
        // Add the response to the chat
        setMessages(prev => [
          ...prev,
          { role: 'model', parts: [{ text: response.response }] }
        ]);
        
        // If emergency was detected in the API response, show the emergency UI
        if (response.emergencyDetected) {
          setEmergencyDetected(true);
        }
        
        // After any message, analyze the symptoms for treatment suggestions
        if (extractedSymptoms.length > 0) {
          analyzeForTreatmentSuggestions(userMessage);
        }
        
      } catch (error) {
        console.error('Failed to process message:', error);
        setMessages(prev => [
          ...prev,
          { 
            role: 'model', 
            parts: [{ 
              text: "I'm sorry, I had trouble processing your message. Could you please tell me more about your symptoms?" 
            }] 
          }
        ]);
      } finally {
        setIsLoading(false);
        
        // Mark the assessment as complete after the first exchange
        setAssessment(prev => ({
          ...prev,
          stage: 'complete'
        }));
      }
    } catch (error) {
      console.error("Error in processAssessmentResponse:", error);
    }
  };

  const handleSymptomDetection = (detectedSymptoms: string[]) => {
    // Store symptoms but don't trigger navigation to doctors page
    if (detectedSymptoms.length > 0) {
      setDetectedSymptoms(detectedSymptoms);
      // Don't call onDetectSymptoms yet - wait for user to finish
    }
  };
  
  const handleDoctorSelect = (doctor: Doctor) => {
    // Set the selected doctor for booking
    setSelectedDoctorForBooking(doctor);
    
    // Immediately open the booking dialog
    setShowBookingDialog(true);
    
    // Add a confirmation message for better UX
    setMessages(prev => [
      ...prev,
      {
        role: 'model',
        parts: [{ text: `You've selected Dr. ${doctor.name}, a ${doctor.specialty}. Opening booking system now.` }]
      }
    ]);
    
    // Call the parent handler if provided
    if (onSelectDoctor) {
      onSelectDoctor(doctor);
    }
  };
  
  const analyzeForTreatmentSuggestions = async (message: string) => {
    if (detectedSymptoms.length === 0) return;
    
    try {
      const analysis = await analyzeSymptomWithAI(detectedSymptoms);
      
      if (analysis.aiAnalysis?.treatmentSuggestions && analysis.aiAnalysis.treatmentSuggestions.length > 0) {
        setTreatmentSuggestions(analysis.aiAnalysis.treatmentSuggestions);
        setShowTreatmentPanel(true);
      }
      
      // Update emergency status if needed
      if (analysis.aiAnalysis?.emergencyDetection) {
        setEmergencyDetected(true);
      }
      
      // Store recommended doctors from the analysis but don't show them automatically
      if (analysis.recommendedDoctors && analysis.recommendedDoctors.length > 0) {
        // Just store the recommendations for later use
        setRecommendedDoctors(mapApiDoctorsToUiDoctors(analysis.recommendedDoctors));
        
        // Only store the symptoms, don't trigger showing doctors
        handleSymptomDetection(detectedSymptoms);
      }
    } catch (error) {
      console.error('Error analyzing for treatments:', error);
    }
  };

  // Function to generate health-specific conversation suggestions
  const generateHealthSuggestions = () => {
    // If symptoms have been detected, suggest relevant follow-ups
    if (detectedSymptoms.length > 0) {
      // Find related specialty
      const matchingSpecialty = medicalSpecialties.find(specialty => 
        specialty.symptoms.some(symptom => 
          detectedSymptoms.some(detected => detected.includes(symptom))
        )
      );
      
      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty.name);
        return [
          { text: `What does a ${matchingSpecialty.name} specialist treat?`, icon: <Stethoscope size={14} /> },
          { text: `How can I manage these symptoms at home?`, icon: <Pill size={14} /> },
          { text: `When should I see a doctor about these symptoms?`, icon: <AlertCircle size={14} /> }
        ];
      }
    }
    
    // Default health conversation starters
    return [
      { text: "I have a headache", icon: <Pill size={14} /> },
      { text: "What causes fever?", icon: <HelpCircle size={14} /> },
      { text: "Should I see a doctor?", icon: <Stethoscope size={14} /> }
    ];
  };
  
  // Improved render suggestion chips for health context
  const renderSuggestionChips = () => {
    const suggestions = generateHealthSuggestions();
    
    return (
      <div className="flex flex-wrap gap-2 mt-2 px-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors flex items-center gap-1.5"
            onClick={(e) => {
              e.preventDefault();
              setInput(suggestion.text);
              inputRef.current?.focus();
            }}
          >
            {suggestion.icon}
            <span>{suggestion.text}</span>
          </Button>
        ))}
      </div>
    );
  };
  
  // Render medical specialty buttons
  const renderSpecialtyOptions = () => {
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {medicalSpecialties.map((specialty, index) => (
          <Badge 
            key={index}
            variant="outline"
            className={`cursor-pointer transition-colors ${selectedSpecialty === specialty.name 
              ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700' 
              : 'bg-slate-100 hover:bg-blue-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
            onClick={() => {
              setSelectedSpecialty(specialty.name);
              setInput(`I have symptoms related to ${specialty.name.toLowerCase()}: ${specialty.symptoms.slice(0, 2).join(', ')}`);
              inputRef.current?.focus();
            }}
          >
            {specialty.name}
          </Badge>
        ))}
      </div>
    );
  };
  
  // Render medical glossary
  const renderMedicalGlossary = () => {
    if (!showMedicalGlossary || identifiedMedicalTerms.length === 0) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Medical Terms Explained</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full text-slate-500"
            onClick={() => setShowMedicalGlossary(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-1">
          {identifiedMedicalTerms.map((term, index) => (
            <div key={index} className="text-xs flex">
              <span className="font-medium text-blue-700 dark:text-blue-400">{term}:</span>
              <span className="ml-1 text-slate-700 dark:text-slate-300">{medicalGlossary[term as keyof typeof medicalGlossary]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };
  
  // Render doctor recommendations
  const renderDoctorRecommendations = () => {
    if (!showDoctorRecommendations || recommendedDoctors.length === 0) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center text-lg">
            <Stethoscope className="h-5 w-5 mr-2" />
            Available Specialists
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full text-blue-600"
            onClick={() => setShowDoctorRecommendations(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-3">
          {recommendedDoctors.slice(0, 3).map((doctor, index) => (
            <DoctorCard
              key={index}
              doctor={doctor}
              onSelect={handleDoctorSelect}
              isCompact={true}
            />
          ))}
          
          {recommendedDoctors.length > 3 && (
            <Button 
              variant="outline" 
              className="w-full text-primary border-primary/20 mt-2"
              onClick={() => {
                if (onViewAllDoctors) {
                  onViewAllDoctors();
                }
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              View All {recommendedDoctors.length} Specialists
            </Button>
          )}
        </div>
      </motion.div>
    );
  };
  
  // Medical themed gradient background
  const backgroundGradient = "bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950";
  
  // Get medical icon based on message content
  const getMedicalIcon = (text: string) => {
    const lowercaseText = text.toLowerCase();
    if (lowercaseText.includes('heart') || lowercaseText.includes('chest pain')) return <Heart className="text-red-500" />;
    if (lowercaseText.includes('doctor') || lowercaseText.includes('consult')) return <Stethoscope className="text-blue-500" />;
    if (lowercaseText.includes('medicine') || lowercaseText.includes('pill')) return <Pill className="text-purple-500" />;
    return <Bot className="text-primary" />;
  };

  // Critical symptom keywords that might indicate an emergency
  const criticalSymptoms = [
    'chest pain', 'difficulty breathing', 'shortness of breath',
    'severe bleeding', 'unconscious', 'stroke', 'heart attack',
    'seizure', 'paralysis', 'unable to move', 'severe abdominal pain',
    'sudden vision loss', 'sudden severe headache', 'suicidal thoughts',
    'drug overdose', 'poisoning', 'severe allergic reaction', 
    'anaphylaxis', 'high fever', 'coughing blood'
  ];

  // Render the assessment prompt button
  const renderAssessmentPrompt = () => {
    if (assessment.active) return null;
    
    return (
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
              Guided Symptom Assessment
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
              Let me ask you a few specific questions to better understand your health concerns.
            </p>
            <Button 
              onClick={startAssessment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Update the analyzeAndRecommendDoctors function to include better doctor framing
  const analyzeAndRecommendDoctors = async () => {
    if (detectedSymptoms.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Create a summary message about the detected symptoms
      const symptomsText = detectedSymptoms.join(', ');
      
      // Add a message summarizing the symptoms
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'model', 
          parts: [{ 
            text: `Based on our conversation, I've noted these symptoms: **${symptomsText}**. Let me find specialists from our platform that you can book right away.` 
          }] 
        }
      ]);
      
      // Get AI analysis for the symptoms
      const analysis = await analyzeSymptomWithAI(detectedSymptoms);
      
      // Add analysis message
      let analysisText = "Here's my analysis:\n\n";
      
      if (analysis.aiAnalysis?.possibleConditions && analysis.aiAnalysis.possibleConditions.length > 0) {
        analysisText += "**These symptoms could be related to:**\n";
        analysis.aiAnalysis.possibleConditions.forEach(condition => {
          analysisText += `- ${condition}\n`;
        });
        analysisText += "\n";
      }
      
      if (analysis.aiAnalysis?.urgencyLevel) {
        let urgencyText = "";
        switch(analysis.aiAnalysis.urgencyLevel) {
          case "urgent":
            urgencyText = "**Urgent:** Please seek medical attention as soon as possible.";
            break;
          case "moderate":
            urgencyText = "**Moderate urgency:** You should consult with a doctor within the next few days.";
            break;
          case "non-urgent":
            urgencyText = "**Non-urgent:** This can be addressed at a routine doctor visit.";
            break;
          default:
            urgencyText = `**Urgency level:** ${analysis.aiAnalysis.urgencyLevel}`;
        }
        analysisText += `${urgencyText}\n\n`;
      }
      
      if (analysis.aiAnalysis?.generalAdvice) {
        analysisText += `**General advice:**\n${analysis.aiAnalysis.generalAdvice}\n\n`;
      }
      
      if (analysis.aiAnalysis?.treatmentSuggestions && analysis.aiAnalysis.treatmentSuggestions.length > 0) {
        analysisText += "**Self-care suggestions:**\n";
        analysis.aiAnalysis.treatmentSuggestions.forEach(suggestion => {
          analysisText += `- ${suggestion}\n`;
        });
        analysisText += "\n";
      }
      
      analysisText += "_Remember: This is not a medical diagnosis. Always consult with a healthcare professional._";
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'model', 
          parts: [{ text: analysisText }] 
        }
      ]);
      
      // Set recommended doctors and show them
      if (analysis.recommendedDoctors && analysis.recommendedDoctors.length > 0) {
        const doctorsForUI = mapApiDoctorsToUiDoctors(analysis.recommendedDoctors);
        setRecommendedDoctors(doctorsForUI);
        
        // IMPORTANT: Explicitly show the recommendations
        setShowDoctorRecommendations(true);
        
        console.log("Setting recommended doctors:", doctorsForUI);
        
        // Add a message about doctor recommendations
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            parts: [{ 
              text: `Here are specialists from our platform who can help with your symptoms. You can book an appointment with any of them right now.` 
            }]
          }
        ]);
        
        // NOW send detected symptoms to parent component
        // after we've completed the analysis and shown recommendations in-chat
        if (onDetectSymptoms) {
          onDetectSymptoms(detectedSymptoms);
        }
      }
    } catch (error) {
      console.error('Error analyzing symptoms and recommending doctors:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'model', 
          parts: [{ 
            text: "I had trouble analyzing your symptoms in detail. However, based on what you've shared, I recommend speaking with a healthcare provider." 
          }] 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleSendMessage function to better handle symptom flow
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || retryCountdown > 0 || !isServerConnected) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, parts: [{ text: userMessage }] }
    ];
    
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert messages for API (skip the first welcome message)
      const apiMessages = messages.slice(1);
      
      // Send message to API with current symptom state
      const response = await sendMessage(
        userMessage, 
        apiMessages, 
        false,  // Let the server decide about doctor recommendations
        detectedSymptoms
      );
      
      // Update our symptom list if the server detected any new ones
      if (response.detectedSymptoms && response.detectedSymptoms.length > 0) {
        setDetectedSymptoms(response.detectedSymptoms);
        
        // If symptoms were found, set this flag for later use
        setHasSymptomsToAnalyze(true);
      }
      
      // Set collecting symptoms state based on server response
      if (response.collectingSymptoms !== undefined) {
        setAssessment(prev => ({
          ...prev,
          active: response.collectingSymptoms
        }));
      }
      
      // Show doctor recommendations if server indicates it's time
      if (response.showDoctorRecommendations && response.recommendedDoctors && response.recommendedDoctors.length > 0) {
        console.log("Server requested to show doctor recommendations");
        setRecommendedDoctors(mapApiDoctorsToUiDoctors(response.recommendedDoctors));
        setShowDoctorRecommendations(true);
        
        // Notify parent component about detected symptoms
        if (onDetectSymptoms && response.detectedSymptoms) {
          onDetectSymptoms(response.detectedSymptoms);
        }
      }
      
      // If the server sent a medical report, display it
      if (response.medicalReport) {
        console.log("Received medical report from server");
        setShowTreatmentPanel(true);
      }
      
      // Update the chat history with the response
      if (response && response.chatHistory) {
        // Keep the initial greeting and append the new history
        setMessages([
          messages[0],
          ...response.chatHistory
        ]);
      } else {
        // Fallback if the response format is unexpected
        setMessages([
          ...updatedMessages,
          { 
            role: 'model', 
            parts: [{ 
              text: response.response || "I'm sorry, I couldn't process your request properly." 
            }] 
          }
        ]);
      }
      
      // Reset server connection status if it was previously down
      if (!isServerConnected) {
        setIsServerConnected(true);
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      
      // Special handling for connection errors
      if (err.message?.includes('Network Error') || !err.response) {
        setIsServerConnected(false);
        setError('Unable to connect to the health assistant server. Please try again later.');
      } 
      // Special handling for rate limit errors
      else if (err.response?.status === 503 || err.response?.status === 429) {
        const retrySeconds = err.response.data?.retryAfter ? parseInt(err.response.data.retryAfter) : 30;
        setRetryCountdown(retrySeconds);
        setError(`The AI service is currently busy. Please wait ${retrySeconds} seconds before trying again.`);
      } else if (err.response?.data?.error) {
        // Use server-provided error message if available
        setError(err.response.data.error);
      } else {
        // Fallback generic error
        setError('Sorry, there was an error processing your request. Please try again in a moment.');
      }
      
      // Add error message from AI
      setMessages([
        ...updatedMessages,
        { 
          role: 'model', 
          parts: [{ 
            text: "I'm sorry, I encountered an error while processing your request. Please try again in a moment." 
          }] 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a type for recommended doctors that ensures compatibility
  const mapApiDoctorsToUiDoctors = (apiDoctors: any[]): Doctor[] => {
    return apiDoctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      specialty: doc.specialty,
      experience: doc.experience,
      rating: doc.rating,
      image: doc.image || `https://avatar.vercel.sh/${doc.name}`,
      availableModes: doc.availableModes || ['video', 'audio'],
      fee: doc.fee,
      consultationFee: doc.consultationFee,
      education: doc.education,
      languages: doc.languages,
      isVerified: doc.isVerified,
      reviews: doc.reviews,
      specializations: doc.specializations,
      shortBio: doc.shortBio || `${doc.name} is a ${doc.specialty} with ${doc.experience} years of experience.`,
      about: doc.about || doc.shortBio || `${doc.name} is a ${doc.specialty} with ${doc.experience} years of experience.`,
      matchDetails: doc.matchDetails
    }));
  };

  return (
    <Card className={cn(
      "flex flex-col rounded-xl shadow-lg backdrop-blur-sm overflow-hidden",
      "bg-white/95 dark:bg-slate-950/95",
      "border-blue-100 dark:border-blue-900/30",
      className
    )}>
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Symptom Chat
          </CardTitle>
          <div className="flex items-center">
            {serverStatus === 'checking' && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Connecting...
              </Badge>
            )}
            {serverStatus === 'online' && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Online
              </Badge>
            )}
            {serverStatus === 'offline' && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          Describe your symptoms in detail for the most accurate assistance
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 mr-3 overflow-hidden">
              <img 
                src="/images/robot-avatar.svg" 
                alt="Robot Avatar" 
                className={cn(
                  "h-8 w-8 transition-opacity duration-300",
                  avatarLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setAvatarLoaded(true)}
              />
              {!avatarLoaded && <Loader2 className="h-5 w-5 animate-spin absolute" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg">CuraGo Health Assistant</h3>
              <p className="text-xs text-blue-100">Powered by Gemini AI</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`relative flex items-center justify-center h-7 w-7 rounded-full ${isServerConnected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isServerConnected ? (
                  <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 text-red-500 animate-spin" />
                )}
                <span className={`absolute top-0 right-0 h-2 w-2 rounded-full ${isServerConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <span className="text-xs font-medium">{isServerConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mx-3 my-2 rounded-lg border-red-300 bg-red-50 dark:bg-red-950/50 dark:border-red-800/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">
              {retryCountdown > 0 ? `Service Busy (Retry in ${retryCountdown}s)` : 'Error'}
            </AlertTitle>
            <AlertDescription className="text-sm text-red-800 dark:text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Chat Messages */}
        <ScrollArea className={`flex-1 p-5 ${backgroundGradient}`}>
          <div className="space-y-5 max-w-4xl mx-auto">
            {/* Assessment prompt - show at beginning of conversation */}
            {messages.length <= 2 && !isLoading && renderAssessmentPrompt()}
            
            {/* Medical glossary component */}
            {renderMedicalGlossary()}
            
            {/* Emergency Alert component */}
            {emergencyDetected && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-500 dark:border-red-900/50 rounded-lg shadow-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="font-medium text-red-700 dark:text-red-300">
                      Potential Emergency Detected
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Your symptoms may require immediate medical attention. Please consider:
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button 
                        className="w-full emergency-button" 
                        onClick={() => window.open('tel:911')}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
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
                    <p className="text-xs text-red-500 dark:text-red-400 italic text-center mt-2">
                      *This is an AI-generated recommendation. Use your judgment.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Treatment Suggestions Panel */}
            {showTreatmentPanel && treatmentSuggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                    <Pill className="h-4 w-4 mr-1" />
                    Treatment Suggestions
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 rounded-full text-blue-600"
                    onClick={() => setShowTreatmentPanel(false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-1">
                  {treatmentSuggestions.map((treatment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>{treatment}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-500 dark:text-blue-400 italic mt-2">
                  These are general suggestions. Always consult a healthcare professional for medical advice.
                </p>
              </motion.div>
            )}
            
            {/* Chat messages (unchanged) */}
            {messages.map((message, index) => (
              <motion.div 
                key={index}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                custom={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md overflow-hidden">
                    <AvatarImage src="/images/robot-avatar.svg" alt="Robot Assistant" className="p-0" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col max-w-[80%]">
                  <div 
                    className={cn(
                      "py-3 px-4 rounded-2xl shadow-sm",
                      message.role === 'user' 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 rounded-tl-none"
                    )}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.parts[0].text}</p>
                    ) : (
                      <div className="markdown-content text-[15px] whitespace-pre-wrap leading-relaxed">
                        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                          {message.parts[0].text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-1 ml-1">
                    <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {index === messages.length - 1 ? 'Just now' : 'Earlier'}
                    </span>
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 ring-2 ring-purple-200 dark:ring-purple-800 shadow-md overflow-hidden">
                    <AvatarImage 
                      src="/images/user-avatar.svg" 
                      alt="User Avatar" 
                      className={cn(
                        "p-0 transition-opacity duration-300",
                        userAvatarLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setUserAvatarLoaded(true)}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600">
                      <User className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {/* Typing indicator (unchanged) */}
            {isLoading && (
              <motion.div 
                className="flex items-start gap-3"
                initial="hidden"
                animate="visible"
                variants={messageVariants}
              >
                <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md overflow-hidden">
                  <AvatarImage src="/images/robot-avatar.svg" alt="Robot Assistant" className="p-0" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600">
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="py-3 px-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 shadow-sm">
                  <motion.div 
                    className="flex space-x-1"
                    variants={typingVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />

            {/* Move Doctor Recommendations here - below the chat messages */}
            {showDoctorRecommendations && recommendedDoctors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center text-lg">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Available Specialists
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full text-blue-600"
                    onClick={() => setShowDoctorRecommendations(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {recommendedDoctors.slice(0, 3).map((doctor, index) => (
                    <DoctorCard
                      key={index}
                      doctor={doctor}
                      onSelect={handleDoctorSelect}
                      isCompact={true}
                    />
                  ))}
                  
                  {recommendedDoctors.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-primary border-primary/20 mt-2"
                      onClick={() => {
                        if (onViewAllDoctors) {
                          onViewAllDoctors();
                        }
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All {recommendedDoctors.length} Specialists
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        
        {/* Medical specialty options for more targeted discussions */}
        {!isLoading && messages.length < 3 && (
          <div className="px-4 py-2 border-t border-blue-100 dark:border-blue-900/30">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Choose a health category to discuss:</p>
            {renderSpecialtyOptions()}
          </div>
        )}
        
        {/* Standard suggested queries */}
        {!isLoading && messages.length < 3 && renderSuggestionChips()}
        
        {/* Input area (unchanged) */}
        <div className="p-3 border-t border-blue-100 dark:border-blue-900/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={!isServerConnected ? "Server disconnected..." : retryCountdown > 0 ? `Please wait ${retryCountdown}s...` : "Type your health question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || retryCountdown > 0 || !isServerConnected}
              className="pl-4 pr-12 py-6 rounded-full border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 focus-visible:ring-blue-500"
            />
            <Button 
              type="submit" 
              size="icon"
              className={cn(
                "absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full w-9 h-9 bg-gradient-to-r",
                isLoading || !input.trim() || retryCountdown > 0 || !isServerConnected 
                  ? "from-slate-300 to-slate-400 opacity-70 cursor-not-allowed"
                  : "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md"
              )}
              disabled={isLoading || !input.trim() || retryCountdown > 0 || !isServerConnected}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </Button>
          </form>
        </div>
        
        {/* Disclaimer (unchanged) */}
        <div className="px-4 py-2.5 text-xs text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-t border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span className="font-medium">Medical Disclaimer</span>
            <Heart className="h-3 w-3 text-red-500" />
          </div>
          This AI assistant provides general health information only. Always consult a healthcare professional for medical advice.
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDiagnosisChat; 
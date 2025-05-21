import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { commonSymptoms } from '../data/mockData';
import { ChatIllustration } from '../data/illustrations';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, PlusCircle, ArrowRight, Info, Lock, ActivitySquare, Thermometer, Brain, Eye, Pill, Heart, Stethoscope, Loader2 } from "lucide-react";
import { analyzeSymptomWithAI } from "../services/chatService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SymptomChatProps {
  onSubmitSymptoms: (symptoms: string[]) => void;
}

// Symptom categories for better organization
const symptomCategories = {
  "General": ["fever", "fatigue", "weakness", "weight loss", "loss of appetite"],
  "Head & Neurological": ["headache", "dizziness", "blurred vision", "anxiety", "depression", "insomnia"],
  "Respiratory": ["cough", "shortness of breath", "runny nose", "sore throat"],
  "Digestive": ["nausea", "vomiting", "diarrhea", "abdominal pain"],
  "Musculoskeletal": ["back pain", "joint pain", "swelling", "numbness", "tingling"],
  "Skin": ["rash", "itching"],
  "Cardiovascular": ["chest pain"],
  "ENT": ["ear pain", "tooth ache"]
};

// Map symptoms to their categories
const getSymptomCategory = (symptom: string): string => {
  for (const [category, symptoms] of Object.entries(symptomCategories)) {
    if (symptoms.includes(symptom)) {
      return category;
    }
  }
  return "Other";
};

const SymptomChat: React.FC<SymptomChatProps> = ({ onSubmitSymptoms }) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your medical assistant. Please select your symptoms so I can help you find the right doctor.", isUser: false }
  ]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(Object.keys(symptomCategories));
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) return;
    
    // Reset any previous errors
    setAnalysisError(null);
    
    // Add user message showing selected symptoms
    const userMessage = { 
      text: `My symptoms: ${selectedSymptoms.join(', ')}`, 
      isUser: true 
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsAnalyzing(true);
    
    try {
      // Use AI-powered symptom analysis
      const analysisResult = await analyzeSymptomWithAI(selectedSymptoms);
      
      // Create a response message based on the analysis
      let responseText = "Thank you for sharing your symptoms. ";
      
      if (analysisResult.aiAnalysis) {
        const { possibleConditions, urgencyLevel, additionalSymptomsToWatch } = analysisResult.aiAnalysis;
        
        // Add possible conditions if available
        if (possibleConditions && possibleConditions.length > 0) {
          responseText += `Based on your symptoms, you might be experiencing ${possibleConditions.join(', ')}. `;
        }
        
        // Add urgency level if available
        if (urgencyLevel) {
          if (urgencyLevel === 'urgent') {
            responseText += "These symptoms suggest you should seek medical attention promptly. ";
          } else if (urgencyLevel === 'moderate') {
            responseText += "It would be advisable to consult with a healthcare professional soon. ";
          } else {
            responseText += "This appears to be a non-urgent condition, but professional advice is still recommended. ";
          }
        }
        
        // Add relevant specialties
        if (analysisResult.relevantSpecialties.length > 0) {
          responseText += `I'll connect you with specialists in ${analysisResult.relevantSpecialties.join(', ')}. `;
        }
        
        // Add watch-for symptoms if available
        if (additionalSymptomsToWatch && additionalSymptomsToWatch.length > 0) {
          responseText += `Please watch for these additional symptoms: ${additionalSymptomsToWatch.join(', ')}.`;
        }
      } else {
        // Fallback message if AI analysis is not available
        responseText += `I'll now recommend suitable doctors for you. Based on your symptoms, you might want to consult with specialists in ${analysisResult.relevantSpecialties.join(', ')}.`;
      }
      
      const botResponse = {
        text: responseText,
        isUser: false
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Call the parent component with selected symptoms and analytics
      onSubmitSymptoms(selectedSymptoms);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      
      // Show error message
      setAnalysisError("Sorry, there was an error analyzing your symptoms. Please try again.");
      
      // Add basic response
      const fallbackResponse = {
        text: "I'm having trouble analyzing your symptoms right now. Let's proceed with finding a doctor based on your selections.",
        isUser: false
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      
      // Still call the parent component with selected symptoms
      onSubmitSymptoms(selectedSymptoms);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Get icon for symptom category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "General": return <Thermometer className="h-4 w-4" />;
      case "Head & Neurological": return <Brain className="h-4 w-4" />;
      case "Respiratory": return <ActivitySquare className="h-4 w-4" />;
      case "Digestive": return <Pill className="h-4 w-4" />;
      case "Musculoskeletal": return <ActivitySquare className="h-4 w-4" />;
      case "Skin": return <PlusCircle className="h-4 w-4" />;
      case "Cardiovascular": return <Heart className="h-4 w-4" />;
      case "ENT": return <Eye className="h-4 w-4" />;
      default: return <Stethoscope className="h-4 w-4" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Describe Your Symptoms</h2>
        <div className="text-sm text-muted-foreground flex items-center">
          <Lock className="w-3 h-3 mr-1" />
          Private & Secure
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="col-span-1 md:col-span-3">
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-6">
            <div className="mb-6">
              <Label htmlFor="symptoms" className="text-foreground mb-2 block font-semibold flex items-center">
                <PlusCircle className="h-4 w-4 mr-2 text-primary" />
                Selected Symptoms
              </Label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-4 bg-primary/5 rounded-lg min-h-[80px] border border-primary/20">
                  {selectedSymptoms.length > 0 ? (
                    selectedSymptoms.map((symptom, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 flex items-center gap-1.5 rounded-full transition-all duration-200 shadow-sm"
                      >
                        {symptom}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-primary/80" 
                          onClick={() => removeSymptom(symptom)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
                      <span className="text-muted-foreground text-sm mb-2">No symptoms selected yet</span>
                      <span className="text-xs text-muted-foreground">Select from common symptoms below</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Show error alert if applicable */}
            {analysisError && (
              <Alert className="mb-4 bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900/30">
                <AlertDescription>
                  {analysisError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mb-8">
              <Label className="text-foreground mb-4 block font-semibold flex items-center">
                <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                Select Your Symptoms
              </Label>
              
              <div className="space-y-4">
                {Object.entries(symptomCategories).map(([category, symptoms]) => (
                  <div key={category} className="border border-border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/80 transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          {getCategoryIcon(category)}
                        </div>
                        <span className="font-medium text-foreground">{category}</span>
                      </div>
                      <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                        {symptoms.length}
                      </span>
                    </button>
                    
                    {expandedCategories.includes(category) && (
                      <div className="p-3 bg-card border-t border-border">
                        <div className="flex flex-wrap gap-2">
                          {symptoms.map((symptom, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`cursor-pointer px-3 py-1.5 rounded-full transition-all duration-200 ${
                                selectedSymptoms.includes(symptom) 
                                  ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm scale-105' 
                                  : 'bg-background hover:bg-primary/10 text-foreground hover:border-primary/30'
                              }`}
                              onClick={() => toggleSymptom(symptom)}
                            >
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center">
                <Info className="w-4 h-4 mr-1" />
                {selectedSymptoms.length === 0 
                  ? "Select relevant symptoms for better doctor matches" 
                  : `${selectedSymptoms.length} symptom${selectedSymptoms.length !== 1 ? 's' : ''} selected`}
              </div>
              <Button 
                variant="default" 
                size="lg"
                className={`px-8 ${selectedSymptoms.length > 0 && !isAnalyzing ? 'animate-pulse' : ''}`}
                onClick={handleSubmit}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block md:col-span-2">
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 h-full">
            <ChatIllustration className="w-full h-48 mb-6" />
            <h3 className="text-lg font-semibold text-foreground mb-3">How It Works</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-card rounded-full w-6 h-6 flex items-center justify-center mr-3 border border-primary/20 text-primary font-medium text-sm">
                  1
                </div>
                <p className="text-foreground">Select your symptoms from our organized categories.</p>
              </li>
              <li className="flex items-start">
                <div className="bg-card rounded-full w-6 h-6 flex items-center justify-center mr-3 border border-primary/20 text-primary font-medium text-sm">
                  2
                </div>
                <p className="text-foreground">Our system will match you with the most appropriate specialists.</p>
              </li>
              <li className="flex items-start">
                <div className="bg-card rounded-full w-6 h-6 flex items-center justify-center mr-3 border border-primary/20 text-primary font-medium text-sm">
                  3
                </div>
                <p className="text-foreground">Choose a doctor from the recommendations and schedule your consultation.</p>
              </li>
            </ul>
            <div className="mt-6 bg-card p-4 rounded-lg border border-primary/10">
              <p className="text-sm text-primary font-medium mb-1">Note:</p>
              <p className="text-sm text-foreground">This is not a medical diagnosis. For emergencies, please call your local emergency services immediately.</p>
            </div>
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default SymptomChat;

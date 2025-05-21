import axios from 'axios';

// API base URL - Use port 4001 to match our symptom-server.js
const API_URL = 'http://localhost:4001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatResponse {
  response: string;
  chatHistory: ChatMessage[];
  emergencyDetected?: boolean;
  detectedSymptoms?: string[];
  recommendedDoctors?: Doctor[];
  relevantSpecialties?: string[];
  containsSymptoms?: boolean;
  shouldAskAboutOtherSymptoms?: boolean;
  collectingSymptoms?: boolean;
  showDoctorRecommendations?: boolean;
  medicalReport?: string;
}

export interface SymptomAnalysisResult {
  possibleConditions: Array<{
    name: string;
    description: string;
    urgencyLevel: 'non-urgent' | 'moderate' | 'urgent';
  }>;
  recommendedSpecialties: string[];
  generalAdvice: string;
  rawResponse?: string;
  error?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  availableModes: string[];
  fee: number;
  consultationFee: number;
  education: string;
  languages: string[];
  isVerified: boolean;
  reviews: number;
  specializations: string[];
  shortBio?: string;
  avatar?: string;
  about?: string;
  matchScore?: number;
  matchDetails?: {
    relevantSpecialty?: string;
    specialtyPriority?: number;
    isPrimaryRecommendation?: boolean;
    specialtyMatch?: boolean;
    experienceWeight?: number;
    symptomMatchScore?: number;
  };
}

export interface SymptomAnalysisResponse {
  symptoms: string[];
  relevantSpecialties: string[];
  recommendedDoctors: Doctor[];
  aiAnalysis?: {
    recommendedSpecialties: string[];
    possibleConditions: string[];
    urgencyLevel: string;
    additionalSymptomsToWatch: string[];
    emergencyDetection?: boolean;
    emergencyRecommendation?: string;
    treatmentSuggestions?: string[];
    preventionTips?: string[];
    generalAdvice?: string;
  };
}

export interface MedicalReportData {
  symptoms: string[];
  possibleConditions: string[];
  urgencyLevel: 'non-urgent' | 'moderate' | 'urgent';
  recommendedSpecialties: string[];
  additionalSymptomsToWatch: string[];
  generalAdvice?: string;
  emergencyDetected: boolean;
  emergencyRecommendation?: string;
  treatmentSuggestions?: string[];
  preventionTips?: string[];
  reportId: string;
  createdAt: Date;
}

export interface AssessmentResponse {
  initialQuestion: string;
  assessmentId?: string;
  status: 'started' | 'error';
}

// Health chat service
export const sendMessage = async (
  message: string, 
  chatHistory: ChatMessage[] = [], 
  recommendDoctors: boolean = false,
  detectedSymptoms: string[] = []
): Promise<ChatResponse> => {
  try {
    console.log('Sending message to:', API_URL + '/chat');
    
    // Send the message directly to the backend API which handles the AI interaction
    const response = await apiClient.post('/chat', {
      message,
      chatHistory,
      recommendDoctors, // Flag to request doctor recommendations from the server
      detectedSymptoms  // Pass current detected symptoms for better tracking
    });
    
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Rethrow the error to be handled by the component
    throw error;
  }
};

// Check server health
export const checkServerHealth = async (): Promise<{status: string}> => {
  try {
    console.log('Checking server health at:', API_URL + '/health');
    const response = await apiClient.get('/health');
    console.log('Health response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Server health check failed:', error);
    throw error;
  }
};

// Basic symptom analysis service (using new backend endpoint)
export const analyzeSymptoms = async (symptoms: string[]): Promise<SymptomAnalysisResponse> => {
  try {
    console.log('Analyzing symptoms with backend:', symptoms);
    const response = await apiClient.post('/api/symptom-analysis', { symptoms });
    console.log('Symptom analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    
    // Create a fallback response in case of error
    const fallbackResponse: SymptomAnalysisResponse = {
      symptoms,
      relevantSpecialties: ["General Physician"],
      recommendedDoctors: []
    };
    
    // If we can extract error details, include them
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to analyze symptoms');
    }
    
    throw error;
  }
};

// AI-assisted symptom analysis (with more detailed information)
export const analyzeSymptomWithAI = async (symptoms: string[]): Promise<SymptomAnalysisResponse> => {
  try {
    console.log('Analyzing symptoms with AI:', symptoms);
    const response = await apiClient.post('/api/ai-symptom-analysis', { symptoms });
    console.log('AI symptom analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error analyzing symptoms with AI:', error);
    
    // Fallback to basic symptom analysis if AI fails
    try {
      return await analyzeSymptoms(symptoms);
    } catch (fallbackError) {
      console.error('Fallback symptom analysis also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

// Generate comprehensive medical report with emergency detection
export const generateMedicalReport = async (symptoms: string[]): Promise<MedicalReportData> => {
  try {
    console.log('Generating medical report for symptoms:', symptoms);
    
    // First, use the existing AI symptom analysis
    const analysis = await analyzeSymptomWithAI(symptoms);
    
    // Generate a unique report ID
    const reportId = `MR-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    
    // Assess if this is an emergency based on urgency level and specific conditions
    const urgencyLevel = (analysis.aiAnalysis?.urgencyLevel || 'non-urgent') as 'non-urgent' | 'moderate' | 'urgent';
    
    // Enhanced emergency detection with more critical symptoms
    const criticalSymptoms = [
      'chest pain', 'difficulty breathing', 'shortness of breath',
      'severe bleeding', 'unconscious', 'stroke', 'heart attack',
      'seizure', 'paralysis', 'unable to move', 'severe abdominal pain',
      'sudden vision loss', 'sudden severe headache', 'suicidal thoughts',
      'drug overdose', 'poisoning', 'severe allergic reaction', 
      'anaphylaxis', 'high fever', 'coughing blood'
    ];
    
    const isEmergency = urgencyLevel === 'urgent' || 
      symptoms.some(s => 
        criticalSymptoms.some(critical => s.toLowerCase().includes(critical))
      );
    
    // Get more detailed treatment suggestions via a separate AI call
    let treatmentSuggestions: string[] = [];
    let preventionTips: string[] = [];
    let emergencyRecommendation: string | undefined;
    
    // Enhanced treatment suggestions for various common symptoms
    const symptomTreatmentMap: { [key: string]: string[] } = {
      'headache': [
        "Rest in a quiet, dark room",
        "Apply cold or warm compress to your head",
        "Consider over-the-counter pain relievers like acetaminophen (follow dosage instructions)",
        "Stay hydrated",
        "Avoid potential triggers like alcohol, caffeine, or bright screens",
        "Try gentle massage of temples and neck"
      ],
      'fever': [
        "Rest and stay hydrated",
        "Take over-the-counter fever reducers like acetaminophen (follow dosage instructions)",
        "Use a lightweight blanket if you have chills",
        "Take a lukewarm bath to reduce body temperature",
        "Wear lightweight clothing and keep room temperature comfortable",
        "Monitor temperature regularly"
      ],
      'cough': [
        "Stay hydrated with warm fluids",
        "Use over-the-counter cough medications (follow dosage instructions)",
        "Try honey and warm water or tea (not for children under 1 year)",
        "Use a humidifier or take a steamy shower",
        "Avoid irritants like smoke or strong scents",
        "Keep head elevated when sleeping"
      ],
      'sore throat': [
        "Gargle with warm salt water",
        "Stay hydrated with warm liquids",
        "Use throat lozenges or sprays",
        "Consider over-the-counter pain relievers",
        "Use a humidifier to add moisture to the air",
        "Rest your voice and avoid irritants"
      ],
      'nausea': [
        "Stay hydrated with small sips of clear fluids",
        "Eat bland foods like crackers or toast when able",
        "Avoid strong odors, greasy or spicy foods",
        "Try ginger tea or ginger candies",
        "Rest and avoid sudden movements",
        "Consider over-the-counter anti-nausea medications"
      ],
      'diarrhea': [
        "Stay hydrated with water, clear broths, and electrolyte solutions",
        "Eat bland, easy-to-digest foods (BRAT diet: bananas, rice, applesauce, toast)",
        "Avoid dairy, fatty, spicy or high-fiber foods",
        "Avoid caffeine and alcohol",
        "Consider over-the-counter anti-diarrheal medications",
        "Wash hands frequently to prevent spread"
      ],
      'fatigue': [
        "Ensure adequate sleep (7-9 hours for adults)",
        "Stay hydrated and maintain balanced nutrition",
        "Engage in light physical activity like walking",
        "Manage stress through relaxation techniques",
        "Establish a consistent sleep schedule",
        "Consider a medical check-up if persistent"
      ],
      'pain': [
        "Apply hot or cold compress to affected area",
        "Consider over-the-counter pain relievers like acetaminophen or ibuprofen (follow dosage instructions)",
        "Gentle stretching or yoga for muscle pain",
        "Rest the affected area",
        "Practice relaxation techniques",
        "Elevate injured limbs to reduce swelling"
      ]
    };
    
    // Check if any of the reported symptoms match our treatment map
    for (const symptom of symptoms) {
      const lowerSymptom = symptom.toLowerCase();
      for (const [key, treatments] of Object.entries(symptomTreatmentMap)) {
        if (lowerSymptom.includes(key)) {
          treatmentSuggestions = [...treatmentSuggestions, ...treatments];
          break; // Move to next symptom after finding a match
        }
      }
    }
    
    // Remove duplicates from treatment suggestions
    treatmentSuggestions = [...new Set(treatmentSuggestions)];
    
    // If we still don't have treatment suggestions, add some generic ones
    if (treatmentSuggestions.length === 0) {
      treatmentSuggestions = [
        "Rest and get adequate sleep",
        "Stay hydrated with water and clear fluids",
        "Monitor your symptoms and seek medical help if they worsen",
        "Consider over-the-counter medications appropriate for your symptoms",
        "Maintain good nutrition with easily digestible foods"
      ];
    }
    
    // If this is possibly an emergency, add emergency recommendations
    if (isEmergency) {
      if (urgencyLevel === 'urgent') {
        emergencyRecommendation = "Please seek immediate medical attention. Your symptoms suggest a potentially serious condition that requires prompt evaluation by healthcare professionals.";
      } else {
        emergencyRecommendation = "Your symptoms may indicate a serious condition. Consider contacting a doctor immediately or seeking emergency care if symptoms worsen.";
      }
      
      // For true emergencies, replace treatment suggestions with emergency care instructions
      if (urgencyLevel === 'urgent' && criticalSymptoms.some(c => symptoms.some(s => s.toLowerCase().includes(c)))) {
        treatmentSuggestions = [
          "Call emergency services (911) immediately",
          "Remain calm and follow emergency dispatcher instructions",
          "If safe to do so, lie down and elevate legs slightly",
          "Do not eat or drink anything unless instructed by medical professionals",
          "If possible, have someone stay with you until help arrives"
        ];
      }
    }
    
    // Add some prevention tips based on symptoms
    if (symptoms.some(s => s.toLowerCase().includes('fever') || s.toLowerCase().includes('cough') || 
        s.toLowerCase().includes('cold') || s.toLowerCase().includes('flu'))) {
      preventionTips = [
        "Wash hands frequently with soap and water for at least 20 seconds",
        "Avoid close contact with sick individuals",
        "Cover coughs and sneezes with a tissue or elbow",
        "Clean and disinfect frequently touched surfaces",
        "Consider wearing a mask in crowded places during flu season",
        "Stay up to date on recommended vaccinations"
      ];
    } else if (symptoms.some(s => s.toLowerCase().includes('pain') || s.toLowerCase().includes('injury') || 
              s.toLowerCase().includes('sprain'))) {
      preventionTips = [
        "Practice proper form during physical activities",
        "Warm up before exercise and cool down afterward",
        "Use protective equipment during sports or risky activities",
        "Maintain strength and flexibility through regular exercise",
        "Take breaks and avoid overexertion",
        "Ensure proper ergonomics at work and home"
      ];
    } else {
      preventionTips = [
        "Maintain a balanced diet rich in fruits and vegetables",
        "Exercise regularly (aim for 150 minutes of moderate activity per week)",
        "Get adequate sleep (7-9 hours for adults)",
        "Stay hydrated throughout the day",
        "Manage stress through mindfulness, meditation, or other relaxation techniques",
        "Avoid smoking and limit alcohol consumption"
      ];
    }
    
    // Create the complete medical report data
    const reportData: MedicalReportData = {
      symptoms,
      possibleConditions: analysis.aiAnalysis?.possibleConditions || [],
      urgencyLevel,
      recommendedSpecialties: analysis.aiAnalysis?.recommendedSpecialties || analysis.relevantSpecialties,
      additionalSymptomsToWatch: analysis.aiAnalysis?.additionalSymptomsToWatch || [],
      emergencyDetected: isEmergency,
      emergencyRecommendation,
      treatmentSuggestions,
      preventionTips,
      reportId,
      createdAt: new Date()
    };
    
    return reportData;
  } catch (error) {
    console.error('Error generating medical report:', error);
    throw error;
  }
};

// Start a guided symptom assessment with AI
export const startSymptomAssessment = async (): Promise<AssessmentResponse> => {
  try {
    console.log('Starting guided symptom assessment');
    
    // Call to backend with instruction to start assessment
    const response = await apiClient.post('/api/start-assessment', {
      startGuidedAssessment: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error starting symptom assessment:', error);
    
    // Fallback response
    return {
      initialQuestion: "Let's start a health assessment. What's your main symptom today?",
      status: 'error'
    };
  }
};

// Detect symptoms with Gemini AI
export const detectSymptoms = async (message: string): Promise<{containsSymptoms: boolean, detectedSymptoms: string[]}> => {
  try {
    // Call the dedicated symptom detection endpoint which uses Gemini AI
    const response = await apiClient.post('/api/detect-symptoms', { message });
    return response.data;
  } catch (error) {
    console.error('Error detecting symptoms:', error);
    // Return a default response if the API call fails
    return {
      containsSymptoms: false,
      detectedSymptoms: []
    };
  }
}; 
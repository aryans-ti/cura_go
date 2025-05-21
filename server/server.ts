// Import dependencies
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file found in server directory');
  dotenv.config({ path: envPath });
} else {
  // Try root directory as fallback
  const rootEnvPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(rootEnvPath)) {
    console.log('.env file found in root directory');
    dotenv.config({ path: rootEnvPath });
  } else {
    console.warn('No .env file found! Using environment variables if available.');
    dotenv.config(); // Try to load from process.env anyway
  }
}

// Configure Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;

if (API_KEY) {
  console.log('API Key found! Initializing Gemini API...');
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined. Chat will use fallback responses.');
}

// Initialize Express app
const app = express();
const PORT = parseInt(process.env.PORT || '4001', 10);

// Configure middleware
app.use(cors());
app.use(express.json());

// For rate limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Response cache
const responseCache = new Map<string, string>();

// Fallback responses when AI is unavailable
const fallbackResponses = {
  default: "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later or contact our support team if the issue persists."
};

// Define TypeScript interfaces for doctor data
interface Doctor {
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
}

// Extended doctor interface with match score and details
interface DoctorWithScore extends Doctor {
  matchScore: number;
  matchDetails: {
    relevantSpecialty: string;
    specialtyPriority: number;
    isPrimaryRecommendation: boolean;
  };
}

// Chat request schema
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty")
});

// Function to generate content with retry logic
async function generateWithRetry(prompt: string, retryCount = 3): Promise<string | null> {
  // Use a less resource-intensive model to avoid rate limits
  const modelOptions = [
    "gemini-1.0-pro",  // Try this first (lower quota usage)
    "gemini-1.5-flash", // Try this second
    "gemini-1.5-pro"   // Last resort (highest quota usage)
  ];
  
  for (const modelName of modelOptions) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error.message || error);
      
      // Check if it's a rate limit error (429)
      if (error.status === 429) {
        console.log('Rate limit hit, waiting before retry...');
        
        // Extract retry delay if available, or use default
        let retryDelay = 5000; // Default 5 seconds
        try {
          if (error.errorDetails) {
            const retryInfo = error.errorDetails.find((detail) => 
              detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
            );
            if (retryInfo && retryInfo.retryDelay) {
              // Parse the retry delay (format is like "21s")
              const delayStr = retryInfo.retryDelay;
              const seconds = parseInt(delayStr.replace('s', ''));
              if (!isNaN(seconds)) {
                retryDelay = seconds * 1000;
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing retry delay:', parseError);
        }
        
        // Wait before trying the next model
        await sleep(retryDelay);
      }
    }
  }
  
  // If we've tried all models and still have errors, return null
  return null;
}

// Define symptom to specialty mapping for accurate matching
const symptomToSpecialty = {
  "fever": ["General Physician", "Infectious Disease Specialist"],
  "cough": ["Pulmonologist", "General Physician", "ENT Specialist"],
  "headache": ["Neurologist", "General Physician"],
  "rash": ["Dermatologist", "Allergist"],
  "joint pain": ["Orthopedic", "Rheumatologist"],
  "chest pain": ["Cardiologist", "General Physician", "Pulmonologist"],
  "abdominal pain": ["Gastroenterologist", "General Physician"],
  "sore throat": ["ENT Specialist", "General Physician"],
  "eye pain": ["Ophthalmologist"],
  "depression": ["Psychiatrist", "Psychologist"],
  "anxiety": ["Psychiatrist", "Psychologist"],
  "nausea": ["Gastroenterologist", "General Physician"],
  "vomiting": ["Gastroenterologist", "General Physician"],
  "diarrhea": ["Gastroenterologist", "General Physician"],
  "fatigue": ["General Physician", "Endocrinologist"],
  "weakness": ["Neurologist", "General Physician"],
  "dizziness": ["Neurologist", "ENT Specialist", "Cardiologist"],
  "shortness of breath": ["Pulmonologist", "Cardiologist"],
  "back pain": ["Orthopedic", "Neurologist", "Pain Specialist"],
  "insomnia": ["Psychiatrist", "Neurologist", "Sleep Specialist"]
};

// Sample doctors data (in a real app, this would come from a database)
const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    experience: 12,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    availableModes: ["video", "audio", "whatsapp", "in-person"],
    fee: 500,
    consultationFee: 500,
    education: "MBBS, MD - Internal Medicine",
    languages: ["English", "Spanish"],
    isVerified: true,
    reviews: 124,
    specializations: ["General Medicine", "Family Medicine", "Preventive Care"]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    experience: 15,
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    availableModes: ["video", "in-person"],
    fee: 1200,
    consultationFee: 1200,
    education: "MBBS, MD - Cardiology, DM - Cardiology",
    languages: ["English", "Mandarin"],
    isVerified: true,
    reviews: 98,
    specializations: ["Interventional Cardiology", "Heart Failure", "Cardiac Imaging"]
  },
  {
    id: "3",
    name: "Dr. Priya Patel",
    specialty: "Dermatologist",
    experience: 8,
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    availableModes: ["video", "audio", "whatsapp"],
    fee: 800,
    consultationFee: 800,
    education: "MBBS, MD - Dermatology",
    languages: ["English", "Hindi", "Gujarati"],
    isVerified: true,
    reviews: 156,
    specializations: ["Medical Dermatology", "Cosmetic Dermatology", "Pediatric Dermatology"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedic",
    experience: 20,
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    availableModes: ["video", "in-person"],
    fee: 1500,
    consultationFee: 1500,
    education: "MBBS, MS - Orthopedics",
    languages: ["English"],
    isVerified: true,
    reviews: 87,
    specializations: ["Joint Replacement", "Sports Medicine", "Trauma"]
  },
  {
    id: "5",
    name: "Dr. Aisha Mohammed",
    specialty: "Pediatrician",
    experience: 10,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    availableModes: ["video", "audio", "whatsapp", "in-person"],
    fee: 700,
    consultationFee: 700,
    education: "MBBS, MD - Pediatrics",
    languages: ["English", "Arabic"],
    isVerified: true,
    reviews: 112,
    specializations: ["Child Development", "Preventive Care", "Newborn Care"]
  },
  {
    id: "6",
    name: "Dr. Robert Garcia",
    specialty: "Neurologist",
    experience: 18,
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    availableModes: ["video", "in-person"],
    fee: 1300,
    consultationFee: 1300,
    education: "MBBS, MD - Neurology, DM - Neurology",
    languages: ["English", "Spanish"],
    isVerified: true,
    reviews: 76,
    specializations: ["Stroke Management", "Movement Disorders", "Headache"]
  },
  {
    id: "7", 
    name: "Dr. Emily Thompson",
    specialty: "Gastroenterologist",
    experience: 14,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    availableModes: ["video", "in-person"],
    fee: 1100,
    consultationFee: 1100,
    education: "MBBS, MD - Internal Medicine, DM - Gastroenterology",
    languages: ["English"],
    isVerified: true,
    reviews: 93,
    specializations: ["Digestive Disorders", "Liver Disease", "Inflammatory Bowel Disease"]
  },
  {
    id: "8",
    name: "Dr. Ahmed Khan",
    specialty: "Pulmonologist",
    experience: 16,
    rating: 4.6,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    availableModes: ["video", "in-person"],
    fee: 1000,
    consultationFee: 1000,
    education: "MBBS, MD - Pulmonary Medicine",
    languages: ["English", "Urdu"],
    isVerified: true,
    reviews: 67,
    specializations: ["Respiratory Disorders", "Sleep Apnea", "COPD"]
  },
  {
    id: "9",
    name: "Dr. Lisa Wong",
    specialty: "ENT Specialist",
    experience: 12,
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/79.jpg",
    availableModes: ["video", "audio", "in-person"],
    fee: 900,
    consultationFee: 900,
    education: "MBBS, MS - ENT",
    languages: ["English", "Cantonese"],
    isVerified: true, 
    reviews: 104,
    specializations: ["Ear Disorders", "Throat Conditions", "Sinus Problems"]
  },
  {
    id: "10",
    name: "Dr. Mark Johnson",
    specialty: "Infectious Disease Specialist",
    experience: 15,
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    availableModes: ["video", "in-person"],
    fee: 1200,
    consultationFee: 1200,
    education: "MBBS, MD - Internal Medicine, DM - Infectious Diseases",
    languages: ["English"],
    isVerified: true,
    reviews: 89,
    specializations: ["Viral Infections", "Bacterial Infections", "Tropical Diseases"]
  }
];

// Define symptom analysis request schema using Zod
const symptomAnalysisSchema = z.object({
  symptoms: z.array(z.string()).min(1, "At least one symptom must be provided")
});

// REST API Endpoints

// Doctor recommendation endpoint based on symptoms
app.post('/api/symptom-analysis', function(req, res) {
  console.log('Symptom analysis endpoint requested');
  
  try {
    // Validate request
    const validationResult = symptomAnalysisSchema.safeParse(req.body);
      
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid request",
        details: validationResult.error.format()
      });
    }
    
    const { symptoms } = validationResult.data;
    console.log('Received symptoms:', symptoms);
    
    // Find relevant specialties
    const specialtiesSet = new Set();
    symptoms.forEach(symptom => {
      const matchedSpecialties = symptomToSpecialty[symptom.toLowerCase()] || [];
      matchedSpecialties.forEach(specialty => specialtiesSet.add(specialty));
    });
    
    // Default to General Physician if no matches
    if (specialtiesSet.size === 0) {
      specialtiesSet.add('General Physician');
    }
    
    const relevantSpecialties = Array.from(specialtiesSet);
    console.log('Relevant specialties:', relevantSpecialties);
    
    // Find doctors with the relevant specialties
    let recommendedDoctors = doctors.filter(doctor => 
      relevantSpecialties.includes(doctor.specialty)
    );
    
    // If no matches, return all doctors
    if (recommendedDoctors.length === 0) {
      recommendedDoctors = doctors;
    }
    
    // Calculate match score for each doctor (higher is better)
    let recommendedDoctorsWithScore: DoctorWithScore[] = recommendedDoctors.map(doctor => {
      // Base score is position in the relevant specialties list (higher priority specialties first)
      const specialtyIndex = relevantSpecialties.indexOf(doctor.specialty);
      const specialtyScore = specialtiesSet.size - specialtyIndex;
      
      // Consider experience and rating in the score
      const experienceScore = doctor.experience / 5; // Normalize experience
      const ratingScore = doctor.rating;
      
      // Combine factors into a match score (weighted sum)
      const matchScore = (specialtyScore * 3) + experienceScore + ratingScore;
      
      return {
        ...doctor,
        matchScore,
        matchDetails: {
          relevantSpecialty: doctor.specialty,
          specialtyPriority: specialtyIndex + 1,
          isPrimaryRecommendation: specialtyIndex === 0
        }
      };
    });
    
    // Sort by match score (descending)
    recommendedDoctorsWithScore.sort((a, b) => b.matchScore - a.matchScore);
    
    // Prepare response
    const response = {
      symptoms,
      relevantSpecialties,
      recommendedDoctors: recommendedDoctorsWithScore.map(({ matchScore, matchDetails, ...doctor }) => ({
        ...doctor,
        matchDetails: matchDetails // Keep only the match details in the response
      }))
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error processing symptom analysis:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred while analyzing symptoms."
    });
  }
});

// AI-assisted symptom analysis endpoint
app.post('/api/ai-symptom-analysis', function(req, res) {
  console.log('AI Symptom analysis endpoint requested');
  (async function() {
    try {
      // Validate request
      const validationResult = symptomAnalysisSchema.safeParse(req.body);
        
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request",
          details: validationResult.error.format()
        });
      }
      
      const { symptoms } = validationResult.data;
      console.log('Received symptoms for AI analysis:', symptoms);
      
      // First get basic specialty mapping
      const specialtiesSet = new Set();
      symptoms.forEach(symptom => {
        const matchedSpecialties = symptomToSpecialty[symptom.toLowerCase()] || [];
        matchedSpecialties.forEach(specialty => specialtiesSet.add(specialty));
      });
      
      // Default to General Physician if no matches
      if (specialtiesSet.size === 0) {
        specialtiesSet.add('General Physician');
      }
      
      // Use AI for more advanced analysis if API is available
      let aiAnalysis = null;
      if (genAI) {
        try {
          const prompt = `
            I need a medical analysis of the following symptoms: ${symptoms.join(', ')}.
            
            Please provide the following information in a structured format:
            1. Which medical specialists would be most appropriate to consult for these symptoms? List them in order of relevance.
            2. What are the possible underlying conditions that might cause these symptoms? List 3-5 possibilities.
            3. Are there any red flags or concerning combinations in these symptoms that would require urgent attention?
            4. What additional symptoms should the patient watch for?
            
            Format your response in JSON with the following structure:
            {
              "recommendedSpecialties": ["specialty1", "specialty2", ...],
              "possibleConditions": ["condition1", "condition2", ...],
              "urgencyLevel": "non-urgent | moderate | urgent",
              "additionalSymptomsToWatch": ["symptom1", "symptom2", ...]
            }
          `;
          
          const result = await generateWithRetry(prompt);
          if (result) {
            try {
              // Extract the JSON part from the response
              const jsonMatch = result.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                aiAnalysis = JSON.parse(jsonMatch[0]);
              }
            } catch (parseError) {
              console.error('Error parsing AI response:', parseError);
              // Continue with basic analysis if AI parsing fails
            }
          }
        } catch (aiError) {
          console.error('Error getting AI analysis:', aiError);
          // Continue with basic analysis if AI fails
        }
      }
      
      // Find doctors with the relevant specialties
      const relevantSpecialties = aiAnalysis?.recommendedSpecialties || Array.from(specialtiesSet);
      console.log('Relevant specialties:', relevantSpecialties);
      
      let recommendedDoctors = doctors.filter(doctor => 
        relevantSpecialties.includes(doctor.specialty)
      );
      
      // If no matches, return all doctors
      if (recommendedDoctors.length === 0) {
        recommendedDoctors = doctors;
      }
      
      // Calculate match score for each doctor
      recommendedDoctors = recommendedDoctors.map(doctor => {
        // Base score is position in the relevant specialties list
        const specialtyIndex = relevantSpecialties.indexOf(doctor.specialty);
        const specialtyScore = specialtyIndex >= 0 ? relevantSpecialties.length - specialtyIndex : 0;
        
        // Consider experience and rating in the score
        const experienceScore = doctor.experience / 5;
        const ratingScore = doctor.rating;
        
        // Combine factors into a match score
        const matchScore = (specialtyScore * 3) + experienceScore + ratingScore;
        
        return {
          ...doctor,
          matchScore,
          matchDetails: {
            relevantSpecialty: doctor.specialty,
            specialtyPriority: specialtyIndex + 1,
            isPrimaryRecommendation: specialtyIndex === 0
          }
        };
      });
      
      // Sort by match score (descending)
      recommendedDoctors.sort((a, b) => b.matchScore - a.matchScore);
      
      // Prepare response
      const response = {
        symptoms,
        relevantSpecialties,
        recommendedDoctors: recommendedDoctors.map(({ matchScore, matchDetails, ...doctor }) => ({
          ...doctor,
          matchDetails: matchDetails
        })),
        aiAnalysis: aiAnalysis || {
          recommendedSpecialties: Array.from(specialtiesSet),
          possibleConditions: ["Please consult with a doctor for diagnosis"],
          urgencyLevel: "unknown",
          additionalSymptomsToWatch: []
        }
      };
      
      return res.json(response);
    } catch (error) {
      console.error('Error processing AI symptom analysis:', error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "An unexpected error occurred while analyzing symptoms."
      });
    }
  })();
});

// Health check endpoint
app.get('/health', function(req, res) {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    apiKeyConfigured: !!API_KEY
  });
});

// Simple route to test the server
app.get('/', function(req, res) {
  console.log('Root endpoint requested');
  res.json({
    message: 'API Server is running',
    endpoints: {
      '/api/symptom-analysis': 'POST - Analyze symptoms and recommend doctors',
      '/api/ai-symptom-analysis': 'POST - AI-assisted symptom analysis and doctor recommendation',
      '/chat': 'POST - Send a message to the AI',
      '/health': 'GET - Check server status'
    }
  });
});

// Chat endpoint
app.post('/chat', function(req, res) {
  console.log('Chat endpoint requested');
  (async function() {
    try {
      // Validate request
      const validationResult = chatRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request",
          details: validationResult.error.format()
        });
      }
      
      const { message } = validationResult.data;
      console.log('Received message:', message);
      
      // Check cache first
      const cacheKey = message.toLowerCase().trim();
      if (responseCache.has(cacheKey)) {
        console.log('Using cached response');
        return res.json({
          message: responseCache.get(cacheKey),
          source: "cache"
        });
      }
      
      // Generate a response
      const aiResponse = await generateWithRetry(message);
      
      if (aiResponse) {
        // Cache the response
        responseCache.set(cacheKey, aiResponse);
        
        return res.json({
          message: aiResponse,
          source: "ai"
        });
      } else {
        // Use fallback response
        return res.status(503).json({
          message: fallbackResponses.default,
          source: "fallback",
          error: "AI service unavailable"
        });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request."
      });
    }
  })();
});

// Test route with a simpler response
app.get('/test', function(req, res) {
  console.log('Test endpoint requested');
  res.send('Server is working!');
});

// Start the server
const server = app.listen(PORT, function() {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`To test the API, try: curl -X POST http://localhost:${PORT}/api/symptom-analysis -H "Content-Type: application/json" -d '{"symptoms":["fever","nausea"]}'`);
});

module.exports = app; 
// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables securely
const loadEnvironmentVariables = () => {
  // First try server directory
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from server/.env');
    dotenv.config({ path: envPath });
  } else {
    // Try root directory as fallback
    const rootEnvPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(rootEnvPath)) {
      console.log('Loading environment variables from root/.env');
      dotenv.config({ path: rootEnvPath });
    } else {
      console.warn('No .env file found! Using environment variables from deployment settings.');
      dotenv.config(); // Try to load from process.env anyway
    }
  }
};

// Initialize environment
loadEnvironmentVariables();

// Secure API key handling
const initializeGeminiAPI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Check for API key without revealing it in logs
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set!');
    console.warn('AI features will use fallback responses only.');
    return null;
  }
  
  // Log only that the key was found, never the actual key
  console.log('Gemini API Key found and configured securely');
  
  try {
    // Initialize the API with the key from environment
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error.message);
    return null;
  }
};

// Initialize Gemini API client securely
const genAI = initializeGeminiAPI();

// For handling rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Define response cache to avoid repeated API calls
const responseCache = new Map();

// Function to generate content with retry logic and better error handling
async function generateWithRetry(prompt, retryCount = 3) {
  // If API not initialized, use fallback
  if (!genAI) {
    console.log('Using fallback response (Gemini API not available)');
    return generateFallbackResponse(prompt);
  }
  
  // Get model options from environment or use defaults
  const defaultModel = process.env.GEMINI_DEFAULT_MODEL || "gemini-1.5-flash";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-pro";
  const timeout = parseInt(process.env.GEMINI_API_TIMEOUT || "30000");
  
  const modelOptions = [defaultModel, fallbackModel];
  
  for (const modelName of modelOptions) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Set a timeout for the API request
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API request timed out')), timeout)
      );
      
      // Make the actual API request
      const resultPromise = model.generateContent(prompt);
      
      // Race the API request against the timeout
      const result = await Promise.race([resultPromise, timeoutPromise]);
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
  
  // If we've tried all models and still have errors, return a fallback response
  console.log('All Gemini API models failed, using fallback response');
  return generateFallbackResponse(prompt);
}

// Function to generate fallback responses when API fails
function generateFallbackResponse(message) {
  const lowerCaseMessage = message.toLowerCase();
  
  // Simple pattern matching for common health inquiries
  if (lowerCaseMessage.includes('fever')) {
    return "Fever can be a symptom of many conditions including infections, inflammation, or reactions to medications. It's often defined as a temperature above 100.4°F (38°C). If you're experiencing fever, please consider the following recommendations: stay hydrated, rest, and take over-the-counter medications like acetaminophen if needed. Consult with a doctor if your fever is high or persistent.";
  }
  
  if (lowerCaseMessage.includes('headache')) {
    return "Headaches can be caused by stress, dehydration, eye strain, or underlying medical conditions. For mild headaches, consider rest, hydration, and over-the-counter pain relievers. If your headache is severe, sudden, or accompanied by other symptoms, please consult a healthcare provider.";
  }
  
  if (lowerCaseMessage.includes('cough')) {
    return "Coughs can be caused by various factors including allergies, infections, or irritants. For a dry cough, staying hydrated and using cough drops may help. For a productive cough, steam inhalation might provide relief. If your cough persists for more than a week or is accompanied by other symptoms, please consult a healthcare provider.";
  }
  
  if (lowerCaseMessage.includes('pain')) {
    return "Pain can be a symptom of many conditions. The appropriate treatment depends on the cause and location of the pain. For mild pain, rest and over-the-counter pain relievers may help. If your pain is severe, persistent, or affects your daily activities, please consult with a healthcare provider.";
  }
  
  if (lowerCaseMessage.includes('aids') || lowerCaseMessage.includes('hiv')) {
    return "HIV (Human Immunodeficiency Virus) is a virus that attacks the body's immune system. AIDS (Acquired Immunodeficiency Syndrome) is the most advanced stage of HIV infection. Modern treatments can control HIV and prevent progression to AIDS, allowing people to live long, healthy lives. If you have concerns about HIV/AIDS, please consult a healthcare provider for testing, treatment options, and support resources.";
  }
  
  // Default response for other inquiries
  return "I'm here to provide general health information. Please note that my responses are not a substitute for professional medical advice. If you're experiencing specific symptoms, I can provide general information, but for accurate diagnosis and treatment, please consult with a healthcare provider.";
}

// Sample doctors data (in a real app, this would come from a database)
const doctors = [
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
    specializations: ["General Medicine", "Family Medicine", "Preventive Care"],
    shortBio: "Dedicated general physician with 12+ years of experience"
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
    specializations: ["Interventional Cardiology", "Heart Failure", "Cardiac Imaging"],
    shortBio: "Renowned cardiologist specialized in heart conditions"
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
    specializations: ["Medical Dermatology", "Cosmetic Dermatology", "Pediatric Dermatology"],
    shortBio: "Expert dermatologist for skin conditions and cosmetic procedures"
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
    specializations: ["Joint Replacement", "Sports Medicine", "Trauma"],
    shortBio: "Experienced orthopedic surgeon for joint issues and sports injuries"
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
    specializations: ["Child Development", "Preventive Care", "Newborn Care"],
    shortBio: "Compassionate pediatrician focused on child development"
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
    specializations: ["Stroke Management", "Movement Disorders", "Headache"],
    shortBio: "Expert neurologist for stroke management and movement disorders"
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
    specializations: ["Digestive Disorders", "Liver Disease", "Inflammatory Bowel Disease"],
    shortBio: "Expert in digestive disorders and gastrointestinal health"
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
    specializations: ["Respiratory Disorders", "Sleep Apnea", "COPD"],
    shortBio: "Specialist in respiratory and pulmonary conditions"
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
    specializations: ["Ear Disorders", "Throat Conditions", "Sinus Problems"],
    shortBio: "Dedicated ENT specialist for ear, nose and throat conditions"
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
    specializations: ["Viral Infections", "Bacterial Infections", "Tropical Diseases"],
    shortBio: "Specialized in diagnosing and treating infectious diseases"
  }
];

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4001;

// Configure middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// API Routes

// Doctor recommendation endpoint based on symptoms - Now using Gemini API
app.post('/api/symptom-analysis', async function(req, res) {
  console.log('Symptom analysis endpoint requested');
  
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ 
        error: "Invalid request",
        details: "Symptoms array is required"
      });
    }
    
    console.log('Received symptoms:', symptoms);
    
    // Find relevant specialties using Gemini API - same as AI endpoint
    const specialtiesSet = new Set();
    
    // Process symptoms in parallel for faster response
    const specialtyPromises = symptoms.map(symptom => getSpecialtiesFromGemini(symptom));
    
    // Wait for all specialty recommendations to complete
    const specialtyResults = await Promise.all(specialtyPromises);
    
    // Combine all recommendations
    specialtyResults.forEach(specialties => {
      specialties.forEach(specialty => specialtiesSet.add(specialty));
    });
    
    // Default to General Physician if no matches
    if (specialtiesSet.size === 0) {
      specialtiesSet.add('General Physician');
    }
    
    const relevantSpecialties = Array.from(specialtiesSet);
    console.log('Gemini-powered relevant specialties:', relevantSpecialties);
    
    // Find doctors with the relevant specialties
    let recommendedDoctors = doctors.filter(doctor => 
      relevantSpecialties.includes(doctor.specialty)
    );
    
    // If no matches, return all doctors
    if (recommendedDoctors.length === 0) {
      recommendedDoctors = doctors;
    }
    
    // Calculate match score for each doctor (higher is better)
    const doctorsWithScores = recommendedDoctors.map(doctor => {
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
          isPrimaryRecommendation: specialtyIndex === 0,
          specialtyMatch: true,
          experienceWeight: experienceScore,
          symptomMatchScore: specialtyScore
        }
      };
    });
    
    // Sort by match score (descending)
    doctorsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    // Get additional analysis for symptoms using Gemini
    let aiAnalysis = null;
    try {
      // Try to get AI analysis for the symptoms
      const analysisPrompt = `
        Analyze these symptoms: ${symptoms.join(', ')}
        Provide a short medical analysis as JSON with these fields:
        - possibleConditions: array of possible conditions (max 5)
        - urgencyLevel: string (non-urgent, moderate, urgent)
        - additionalSymptomsToWatch: array of related symptoms to watch for
        
        Format the response as valid JSON only.
      `;
      
      const analysisResult = await generateWithRetry(analysisPrompt);
      
      try {
        // Try to parse the JSON response
        let parsedAnalysis;
        
        // First try direct parsing
        try {
          parsedAnalysis = JSON.parse(analysisResult.trim());
        } catch (e) {
          // Try to extract JSON from markdown code block
          const jsonMatch = analysisResult.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            parsedAnalysis = JSON.parse(jsonMatch[1].trim());
          } else {
            throw new Error('Could not extract JSON from analysis response');
          }
        }
        
        aiAnalysis = {
          possibleConditions: parsedAnalysis.possibleConditions || [],
          urgencyLevel: parsedAnalysis.urgencyLevel || 'non-urgent',
          additionalSymptomsToWatch: parsedAnalysis.additionalSymptomsToWatch || [],
          recommendedSpecialties: relevantSpecialties
        };
      } catch (parseError) {
        console.error('Error parsing AI analysis:', parseError, 'Raw response:', analysisResult);
        // Fall back to the existing functions
        aiAnalysis = {
          possibleConditions: getPossibleConditionsForSymptoms(symptoms),
          urgencyLevel: getUrgencyLevelForSymptoms(symptoms),
          additionalSymptomsToWatch: getAdditionalSymptomsToWatch(symptoms),
          recommendedSpecialties: relevantSpecialties
        };
      }
    } catch (analysisError) {
      console.error('Error generating AI analysis:', analysisError);
      // Fall back to the existing functions
      aiAnalysis = {
        possibleConditions: getPossibleConditionsForSymptoms(symptoms),
        urgencyLevel: getUrgencyLevelForSymptoms(symptoms),
        additionalSymptomsToWatch: getAdditionalSymptomsToWatch(symptoms),
        recommendedSpecialties: relevantSpecialties
      };
    }
    
    // Prepare response
    const response = {
      symptoms,
      relevantSpecialties,
      recommendedDoctors: doctorsWithScores.map(doctor => {
        // Remove the internal matchScore but keep matchDetails for the frontend
        const { matchScore, ...docWithoutScore } = doctor;
        return docWithoutScore;
      }),
      aiAnalysis: aiAnalysis
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

// Function to get specialty recommendations from Gemini API
async function getSpecialtiesFromGemini(symptom) {
  // Check cache first to avoid redundant API calls
  const cacheKey = `specialty_${symptom.toLowerCase().trim()}`;
  if (responseCache.has(cacheKey)) {
    console.log(`Using cached Gemini specialty mapping for: ${symptom}`);
    return responseCache.get(cacheKey);
  }
  
  console.log(`Querying Gemini AI for specialty mapping: ${symptom}`);
  
  try {
    // Create a prompt that asks Gemini to recommend medical specialties for the symptom
    const prompt = `
      As a medical AI assistant, determine the most appropriate medical specialties for a patient with the following symptom: "${symptom}".
      Return your answer as a valid JSON array of strings containing only the specialty names.
      Only include the most relevant medical specialties (maximum 3).
      Choose from these common specialties: General Physician, Cardiologist, Dermatologist, Orthopedic, Pediatrician, Gynecologist, 
      Neurologist, Psychiatrist, Ophthalmologist, ENT Specialist, Pulmonologist, Gastroenterologist, Endocrinologist, Rheumatologist, 
      Infectious Disease Specialist, Urologist, Nephrologist, Hematologist, Oncologist.
      Example format: ["Cardiologist", "Pulmonologist", "General Physician"]
    `;
    
    // Call Gemini API using the existing generateWithRetry function
    const result = await generateWithRetry(prompt);
    let specialties = [];
    
    try {
      // Extract JSON from the response
      // First try to parse the response directly
      try {
        specialties = JSON.parse(result.trim());
      } catch (e) {
        // If direct parsing fails, try to extract JSON from markdown code block
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          specialties = JSON.parse(jsonMatch[1].trim());
        } else {
          // Look for array pattern in plain text
          const arrayMatch = result.match(/\[(.*?)\]/);
          if (arrayMatch && arrayMatch[1]) {
            specialties = JSON.parse(`[${arrayMatch[1]}]`);
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }
      }
      
      // Validate response format
      if (!Array.isArray(specialties)) {
        console.error('Invalid response format from Gemini:', result);
        throw new Error('Invalid response format');
      }
      
      // Store in cache
      responseCache.set(cacheKey, specialties);
      console.log(`Cached new Gemini specialty mapping for: ${symptom} -> ${specialties.join(', ')}`);
      
      return specialties;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError, 'Raw response:', result);
      // Fall back to keyword extraction from the text response
      const extractedSpecialties = extractSpecialtiesFromText(result);
      responseCache.set(cacheKey, extractedSpecialties);
      console.log(`Cached extracted specialties for: ${symptom} -> ${extractedSpecialties.join(', ')}`);
      return extractedSpecialties;
    }
  } catch (error) {
    console.error(`Error getting specialties from Gemini for symptom "${symptom}":`, error);
    // Use a general fallback since dictionary is removed
    const fallbackSpecialties = ["General Physician"];
    console.log(`Using fallback mapping for: ${symptom} -> ${fallbackSpecialties.join(', ')}`);
    return fallbackSpecialties;
  }
}

// Helper function to extract specialties from text if JSON parsing fails
function extractSpecialtiesFromText(text) {
  const commonSpecialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Orthopedic",
    "Pediatrician", "Gynecologist", "Neurologist", "Psychiatrist",
    "Ophthalmologist", "ENT Specialist", "Pulmonologist", "Gastroenterologist",
    "Endocrinologist", "Rheumatologist", "Urologist", "Nephrologist",
    "Infectious Disease Specialist"
  ];
  
  const found = commonSpecialties.filter(specialty => 
    text.toLowerCase().includes(specialty.toLowerCase())
  );
  
  return found.length > 0 ? found : ["General Physician"];
}

// AI-assisted symptom analysis - Enhanced to use Gemini API
app.post('/api/ai-symptom-analysis', async function(req, res) {
  console.log('AI Symptom analysis endpoint requested');
  
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ 
        error: "Invalid request",
        details: "Symptoms array is required"
      });
    }
    
    console.log('Received symptoms for AI analysis:', symptoms);
    
    // Find relevant specialties using Gemini API
    const specialtiesSet = new Set();
    
    // Process symptoms in parallel for faster response
    const specialtyPromises = symptoms.map(symptom => getSpecialtiesFromGemini(symptom));
    
    // Wait for all specialty recommendations to complete
    const specialtyResults = await Promise.all(specialtyPromises);
    
    // Combine all recommendations
    specialtyResults.forEach(specialties => {
      specialties.forEach(specialty => specialtiesSet.add(specialty));
    });
    
    // Default to General Physician if no matches
    if (specialtiesSet.size === 0) {
      specialtiesSet.add('General Physician');
    }
    
    const relevantSpecialties = Array.from(specialtiesSet);
    console.log('AI-enhanced relevant specialties:', relevantSpecialties);
    
    // Find doctors with the relevant specialties
    let recommendedDoctors = doctors.filter(doctor => 
      relevantSpecialties.includes(doctor.specialty)
    );
    
    // If no matches, return all doctors
    if (recommendedDoctors.length === 0) {
      recommendedDoctors = doctors;
    }
    
    // Calculate match score for each doctor (higher is better)
    const doctorsWithScores = recommendedDoctors.map(doctor => {
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
          isPrimaryRecommendation: specialtyIndex === 0,
          specialtyMatch: true,
          experienceWeight: experienceScore,
          symptomMatchScore: specialtyScore
        }
      };
    });
    
    // Sort by match score (descending)
    doctorsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    // Get additional analysis for symptoms using Gemini
    let aiAnalysis = null;
    try {
      // Try to get AI analysis for the symptoms
      const analysisPrompt = `
        Analyze these symptoms: ${symptoms.join(', ')}
        Provide a short medical analysis as JSON with these fields:
        - possibleConditions: array of possible conditions (max 5)
        - urgencyLevel: string (non-urgent, moderate, urgent)
        - additionalSymptomsToWatch: array of related symptoms to watch for
        
        Format the response as valid JSON only.
      `;
      
      const analysisResult = await generateWithRetry(analysisPrompt);
      
      try {
        // Try to parse the JSON response
        let parsedAnalysis;
        
        // First try direct parsing
        try {
          parsedAnalysis = JSON.parse(analysisResult.trim());
        } catch (e) {
          // Try to extract JSON from markdown code block
          const jsonMatch = analysisResult.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            parsedAnalysis = JSON.parse(jsonMatch[1].trim());
          } else {
            throw new Error('Could not extract JSON from analysis response');
          }
        }
        
        aiAnalysis = {
          possibleConditions: parsedAnalysis.possibleConditions || [],
          urgencyLevel: parsedAnalysis.urgencyLevel || 'non-urgent',
          additionalSymptomsToWatch: parsedAnalysis.additionalSymptomsToWatch || [],
          recommendedSpecialties: relevantSpecialties
        };
      } catch (parseError) {
        console.error('Error parsing AI analysis:', parseError, 'Raw response:', analysisResult);
        // Fall back to the existing functions
        aiAnalysis = {
          possibleConditions: getPossibleConditionsForSymptoms(symptoms),
          urgencyLevel: getUrgencyLevelForSymptoms(symptoms),
          additionalSymptomsToWatch: getAdditionalSymptomsToWatch(symptoms),
          recommendedSpecialties: relevantSpecialties
        };
      }
    } catch (analysisError) {
      console.error('Error generating AI analysis:', analysisError);
      // Fall back to the existing functions
      aiAnalysis = {
        possibleConditions: getPossibleConditionsForSymptoms(symptoms),
        urgencyLevel: getUrgencyLevelForSymptoms(symptoms),
        additionalSymptomsToWatch: getAdditionalSymptomsToWatch(symptoms),
        recommendedSpecialties: relevantSpecialties
      };
    }
    
    // Prepare response
    const response = {
      symptoms,
      relevantSpecialties,
      recommendedDoctors: doctorsWithScores.map(doctor => {
        // Remove the internal matchScore but keep matchDetails for the frontend
        const { matchScore, ...docWithoutScore } = doctor;
        return docWithoutScore;
      }),
      aiAnalysis: aiAnalysis
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error processing AI symptom analysis:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred while analyzing symptoms with AI."
    });
  }
});

// Chat endpoint with Gemini API integration
app.post('/chat', function(req, res) {
  console.log('Chat endpoint requested');
  (async function() {
    try {
      const { message, chatHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: "Invalid request",
          details: "Message is required"
        });
      }
      
      console.log('Received message:', message);
      
      // Check cache first
      const cacheKey = message.toLowerCase().trim();
      if (responseCache.has(cacheKey)) {
        console.log('Using cached response');
        const cachedResponse = responseCache.get(cacheKey);
        
        return res.json({
          response: cachedResponse,
          chatHistory: [
            ...(chatHistory || []),
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: cachedResponse }] }
          ]
        });
      }
      
      // Generate a response using Gemini API
      const aiResponse = await generateWithRetry(message);
      
      if (aiResponse) {
        // Cache the response
        responseCache.set(cacheKey, aiResponse);
        
        return res.json({
          response: aiResponse,
          chatHistory: [
            ...(chatHistory || []),
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: aiResponse }] }
          ]
        });
      } else {
        // Use fallback response
        const fallbackResponse = "I'm sorry, but I'm currently experiencing technical difficulties. Please try again in a moment.";
        
        return res.status(503).json({
          response: fallbackResponse,
          chatHistory: [
            ...(chatHistory || []),
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: fallbackResponse }] }
          ],
          source: "fallback",
          error: "AI service unavailable"
        });
      }
    } catch (error) {
      console.error('Error processing chat message:', error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request."
      });
    }
  })();
});

// Helper function to get possible conditions based on symptoms
function getPossibleConditionsForSymptoms(symptoms) {
  // This is a simplified version - in a real app, this would be much more robust
  // and would likely use a medical database or AI
  const conditionMap = {
    "fever": ["Common cold", "Influenza", "COVID-19", "Infection"],
    "cough": ["Common cold", "Bronchitis", "Asthma", "COVID-19"],
    "headache": ["Tension headache", "Migraine", "Dehydration", "Stress"],
    "nausea": ["Food poisoning", "Viral gastroenteritis", "Motion sickness", "Pregnancy"],
    "vomiting": ["Food poisoning", "Viral gastroenteritis", "Migraine", "Appendicitis"],
    "diarrhea": ["Food poisoning", "Viral gastroenteritis", "IBS", "Food intolerance"],
    "joint pain": ["Arthritis", "Injury", "Inflammation", "Gout"],
    "chest pain": ["Angina", "Heart attack", "GERD", "Muscle strain"]
  };
  
  const possibleConditions = new Set();
  
  symptoms.forEach(symptom => {
    const conditions = conditionMap[symptom.toLowerCase()] || [];
    conditions.forEach(condition => possibleConditions.add(condition));
  });
  
  return Array.from(possibleConditions);
}

// Helper function to determine urgency level
function getUrgencyLevelForSymptoms(symptoms) {
  const lowercaseSymptoms = symptoms.map(s => s.toLowerCase());
  
  // High urgency symptoms
  const urgentSymptoms = ["chest pain", "shortness of breath", "difficulty breathing", "severe pain"];
  // Medium urgency symptoms
  const moderateSymptoms = ["fever", "vomiting", "diarrhea", "abdominal pain"];
  
  // Check for urgent symptoms
  for (const symptom of urgentSymptoms) {
    if (lowercaseSymptoms.includes(symptom)) {
      return "urgent";
    }
  }
  
  // Check for moderate symptoms
  for (const symptom of moderateSymptoms) {
    if (lowercaseSymptoms.includes(symptom)) {
      return "moderate";
    }
  }
  
  // Default to non-urgent
  return "non-urgent";
}

// Helper function to suggest additional symptoms to watch for
function getAdditionalSymptomsToWatch(symptoms) {
  const symptomsMap = {
    "fever": ["chills", "fatigue", "headache", "body aches"],
    "nausea": ["vomiting", "diarrhea", "abdominal pain", "loss of appetite"],
    "headache": ["dizziness", "vision changes", "neck stiffness", "light sensitivity"],
    "cough": ["shortness of breath", "chest pain", "wheezing", "throat pain"],
    "joint pain": ["swelling", "redness", "warmth", "limited movement"],
    "chest pain": ["shortness of breath", "sweating", "nausea", "jaw or arm pain"]
  };
  
  const additionalSymptoms = new Set();
  const reportedSymptoms = new Set(symptoms.map(s => s.toLowerCase()));
  
  symptoms.forEach(symptom => {
    const related = symptomsMap[symptom.toLowerCase()] || [];
    related.forEach(s => {
      // Only add if not already reported by the user
      if (!reportedSymptoms.has(s.toLowerCase())) {
        additionalSymptoms.add(s);
      }
    });
  });
  
  return Array.from(additionalSymptoms);
}

// Health check endpoint
app.get('/health', function(req, res) {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', function(req, res) {
  console.log('Root endpoint requested');
  res.json({
    message: 'Symptom Analysis API is running',
    endpoints: {
      '/api/symptom-analysis': 'POST - Analyze symptoms and recommend doctors',
      '/api/ai-symptom-analysis': 'POST - AI-assisted symptom analysis and doctor recommendation',
      '/chat': 'POST - Send a message to the chat service',
      '/health': 'GET - Check server status'
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`To test the API, try: curl -X POST http://localhost:${PORT}/api/symptom-analysis -H "Content-Type: application/json" -d '{"symptoms":["fever","nausea"]}'`);
});

module.exports = app; 
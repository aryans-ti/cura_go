// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

// Define preferred models for generating content
const preferredModels = [
  "gemini-1.5-flash", // Try this first
  "gemini-1.5-pro"    // Try this second if flash fails
];

if (API_KEY) {
  console.log('API Key found! Initializing Gemini API...');
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined. Chat will use fallback responses.');
}

// Critical symptoms that might indicate an emergency
const criticalSymptoms = [
  'chest pain', 'difficulty breathing', 'shortness of breath',
  'severe bleeding', 'unconscious', 'stroke', 'heart attack',
  'seizure', 'paralysis', 'unable to move', 'severe abdominal pain',
  'sudden vision loss', 'sudden severe headache', 'suicidal thoughts',
  'drug overdose', 'poisoning', 'severe allergic reaction', 
  'anaphylaxis', 'high fever', 'coughing blood'
];

// For handling rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add the missing HarmCategory and HarmBlockThreshold constants
const HarmCategory = {
  HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT"
};

const HarmBlockThreshold = {
  BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE"
};

// Define response cache to avoid repeated API calls
const responseCache = new Map();

// Add a cache for Gemini AI specialty mappings
const geminiSpecialtyMappingCache = new Map();

// Function to generate content with retry logic
async function generateWithRetry(prompt, retryCount = 3) {
  if (!genAI) {
    return generateFallbackResponse(prompt);
  }
  
  // Use a less resource-intensive model to avoid rate limits
  const modelOptions = [
    "gemini-1.5-flash", // Try this first
    "gemini-1.5-pro"   // Try this second (higher quota usage)
  ];
  
  for (const modelName of modelOptions) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Create a properly formatted request for Gemini
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
      
      // If we get a format error, try a simplified approach
      if (error.status === 400 && error.message.includes('Invalid JSON payload')) {
        console.log('Trying simplified generation due to error:', error.message);
        try {
          // Try a simple text prompt instead of a structured chat message
          const simpleModel = genAI.getGenerativeModel({ model: modelName });
          const simplePrompt = `You are a medical assistant. ${prompt}`;
          const simpleResult = await simpleModel.generateContent(simplePrompt);
          return simpleResult.response.text();
        } catch (simpleError) {
          console.error(`Error with simplified approach for ${modelName}:`, simpleError);
        }
      }
    }
  }
  
  // If we've tried all models and still have errors, return a fallback response
  console.log('Using fallback response after all models failed');
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
  
  // Default response for other inquiries
  return "I'm here to provide general health information. Please note that my responses are not a substitute for professional medical advice. If you're experiencing specific symptoms, I can provide general information, but for accurate diagnosis and treatment, please consult with a healthcare provider.";
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
  "insomnia": ["Psychiatrist", "Neurologist", "Sleep Specialist"],
  "runny nose": ["ENT Specialist", "Allergist", "General Physician"],
  "breathing problems": ["Pulmonologist", "Allergist", "Cardiologist"],
  "difficulty swallowing": ["ENT Specialist", "Gastroenterologist"],
  "stomach pain": ["Gastroenterologist", "General Physician"],
  "ear pain": ["ENT Specialist", "General Physician"],
  "tooth pain": ["Dentist"],
  "knee pain": ["Orthopedic", "Sports Medicine Specialist"],
  "high blood pressure": ["Cardiologist", "Nephrologist"],
  "high glucose": ["Endocrinologist", "General Physician"],
  "vision problems": ["Ophthalmologist", "Neurologist"],
  "itching": ["Dermatologist", "Allergist"],
  "swelling": ["Allergist", "Rheumatologist", "General Physician"]
};

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

// Helper function for specialty mapping - simplified to work with symptoms directly
async function getSpecialtiesFromGemini(symptom) {
  const cacheKey = symptom.toLowerCase();
  
  // Check cache first
  if (geminiSpecialtyMappingCache.has(cacheKey)) {
    console.log(`Using cached Gemini specialty mapping for: ${symptom}`);
    return geminiSpecialtyMappingCache.get(cacheKey);
  }
  
  console.log(`Querying Gemini AI for specialty mapping: ${symptom}`);
  
  try {
    const prompt = `For the symptom "${symptom}", list the 2-3 most appropriate medical specialties a patient should consult, in order of relevance. Only include the specialty names separated by commas, with no additional text or explanations. For example: "Neurologist, General Physician, Ophthalmologist"`;
    
    const response = await generateWithRetry(prompt);
    
    // Extract just the specialty names (clean up any unexpected formatting)
    const specialtiesText = response.trim();
    
    // Split by commas and clean up each specialty
    const specialties = specialtiesText
      .split(/,\s*/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.match(/^\d+$/)); // Filter out anything that's empty or just a number
    
    // Make sure we have at least one specialty
    if (specialties.length === 0) {
      // Default to General Physician if we couldn't extract any
      console.log(`Couldn't extract specialties for: ${symptom}, using default`);
      geminiSpecialtyMappingCache.set(cacheKey, ['General Physician']);
      return ['General Physician'];
    }
    
    // Store in cache for future use
    console.log(`Cached new Gemini specialty mapping for: ${symptom} -> ${specialties.join(', ')}`);
    geminiSpecialtyMappingCache.set(cacheKey, specialties);
    
    return specialties;
  } catch (error) {
    console.error(`Error getting Gemini specialty mapping for ${symptom}:`, error);
    
    // Default to general physician on error
    geminiSpecialtyMappingCache.set(cacheKey, ['General Physician']);
    return ['General Physician'];
  }
}

// Helper function to check if user message contains symptoms
async function checkForSymptoms(message) {
  try {
    console.log('Symptom detection endpoint requested');
    console.log('Checking text for symptoms:', message);
    
    if (!message) {
      return { containsSymptoms: false, detectedSymptoms: [] };
    }
    
    // First do a quick check if the message contains any obvious symptom words
    const lowerMessage = message.toLowerCase();
    const quickCheck = /fever|cough|pain|ache|headache|nausea|dizziness|fatigue|sore|rash|infection|sick|throat|stomach|chest|breathing|itching|joint|back|symptom/i.test(lowerMessage);
    
    console.log('Quick symptom check result:', quickCheck ? 'YES' : 'NO');
    
    if (!quickCheck) {
      return { containsSymptoms: false, detectedSymptoms: [] };
    }
    
    // Use Gemini for more accurate symptom detection
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // First do a simple yes/no check to avoid unnecessary processing
        const symptomCheckPrompt = `
          You are a medical AI. Examine this message: "${message}"
          
          Does it contain any explicit mentions of health symptoms (like pain, fever, cough, headache, etc.)? 
          Answer with ONLY "YES" or "NO" - nothing else.
        `;
        
        // Make the API call with proper format
        try {
          const symptomCheckResult = await model.generateContent(symptomCheckPrompt);
          const symptomCheckResponse = symptomCheckResult.response.text().trim().toUpperCase();
          
          // If YES, extract the specific symptoms
          if (symptomCheckResponse === "YES") {
            const extractionPrompt = `
              Extract all health symptoms mentioned in this message: "${message}"
              
              Return ONLY a valid JSON array of symptoms, for example:
              ["headache", "fever", "sore throat"]
              
              If no specific symptoms are found, return an empty array.
            `;
            
            try {
              const extractionResult = await model.generateContent(extractionPrompt);
              const extractionResponse = extractionResult.response.text();
              
              // Extract JSON array from response
              const jsonMatch = extractionResponse.match(/\[.*\]/s);
              if (jsonMatch) {
                const extractedArray = JSON.parse(jsonMatch[0]);
                if (Array.isArray(extractedArray) && extractedArray.length > 0) {
                  console.log('Extracted symptoms:', extractedArray);
                  return { 
                    containsSymptoms: true, 
                    detectedSymptoms: extractedArray 
                  };
                }
              }
            } catch (error) {
              console.error('Error extracting symptoms:', error);
            }
          }
        } catch (error) {
          console.error('Error checking if message contains symptoms:', error);
        }
      } catch (error) {
        console.error('Error using AI for symptom detection:', error);
      }
    }
    
    // Fallback to simple keyword detection
    const commonSymptoms = [
      'headache', 'pain', 'fever', 'cough', 'sore throat', 'nausea', 'vomiting',
      'diarrhea', 'rash', 'fatigue', 'dizziness', 'shortness of breath', 'chest pain',
      'abdominal pain', 'joint pain', 'back pain', 'weakness', 'runny nose', 'congestion'
    ];
    
    const detectedSymptoms = commonSymptoms.filter(symptom => lowerMessage.includes(symptom));
    
    console.log('AI-based symptom detection results:', { 
      containsSymptoms: detectedSymptoms.length > 0,
      detectedSymptoms: detectedSymptoms
    });
    
    return {
      containsSymptoms: detectedSymptoms.length > 0,
      detectedSymptoms: detectedSymptoms
    };
  } catch (error) {
    console.error('Error detecting symptoms:', error);
    return { containsSymptoms: false, detectedSymptoms: [] };
  }
}

// Additional helper functions for report generation
function getAdditionalSymptomsToWatch(symptoms) {
  // Basic logic to suggest related symptoms to watch for
  const additionalSymptoms = new Set();
  
  if (symptoms.includes('fever')) {
    additionalSymptoms.add('chills');
    additionalSymptoms.add('sweating');
    additionalSymptoms.add('weakness');
  }
  
  if (symptoms.includes('headache')) {
    additionalSymptoms.add('sensitivity to light');
    additionalSymptoms.add('nausea');
    additionalSymptoms.add('dizziness');
  }
  
  if (symptoms.includes('cough')) {
    additionalSymptoms.add('shortness of breath');
    additionalSymptoms.add('chest pain');
    additionalSymptoms.add('sputum production');
  }
  
  if (symptoms.includes('sore throat')) {
    additionalSymptoms.add('difficulty swallowing');
    additionalSymptoms.add('swollen lymph nodes');
    additionalSymptoms.add('voice changes');
  }
  
  if (symptoms.includes('nausea') || symptoms.includes('vomiting')) {
    additionalSymptoms.add('abdominal pain');
    additionalSymptoms.add('diarrhea');
    additionalSymptoms.add('decreased appetite');
  }
  
  // Remove symptoms already reported
  symptoms.forEach(s => additionalSymptoms.delete(s));
  
  return Array.from(additionalSymptoms);
}

function getUrgencyLevelForSymptoms(symptoms) {
  // Check for critical symptoms that might indicate an emergency
  for (const symptom of symptoms) {
    if (criticalSymptoms.some(critical => symptom.toLowerCase().includes(critical.toLowerCase()))) {
      return 'urgent';
    }
  }
  
  // Check for moderate urgency symptoms
  const moderateSymptoms = [
    'high fever', 'persistent fever', 'severe pain', 'severe headache', 
    'difficulty breathing', 'dehydration', 'severe vomiting',
    'severe diarrhea', 'unusual rash', 'sudden weakness'
  ];
  
  for (const symptom of symptoms) {
    if (moderateSymptoms.some(moderate => symptom.toLowerCase().includes(moderate.toLowerCase()))) {
      return 'moderate';
    }
  }
  
  // Default to non-urgent
  return 'non-urgent';
}

function getPossibleConditionsForSymptoms(symptoms) {
  const conditions = [];
  
  // Basic pattern matching for common symptom combinations
  if (symptoms.includes('fever')) {
    conditions.push('Common cold');
    conditions.push('Influenza');
    
    if (symptoms.includes('cough')) {
      conditions.push('Upper respiratory infection');
      
      if (symptoms.includes('shortness of breath')) {
        conditions.push('Pneumonia');
        conditions.push('Bronchitis');
      }
    }
  }
  
  if (symptoms.includes('headache')) {
    conditions.push('Tension headache');
    conditions.push('Migraine');
    
    if (symptoms.includes('fever')) {
      conditions.push('Viral infection');
    }
    
    if (symptoms.includes('nausea') || symptoms.includes('vomiting')) {
      conditions.push('Migraine with aura');
    }
  }
  
  if (symptoms.includes('abdominal pain')) {
    conditions.push('Gastritis');
    conditions.push('Indigestion');
    
    if (symptoms.includes('nausea') || symptoms.includes('vomiting')) {
      conditions.push('Food poisoning');
      conditions.push('Gastroenteritis');
    }
  }
  
  if (symptoms.includes('sore throat')) {
    conditions.push('Pharyngitis');
    
    if (symptoms.includes('fever')) {
      conditions.push('Strep throat');
    }
    
    if (symptoms.includes('cough') || symptoms.includes('runny nose')) {
      conditions.push('Common cold');
    }
  }
  
  // If no conditions matched, provide a generic response
  if (conditions.length === 0) {
    conditions.push('General malaise');
  }
  
  // Remove duplicates
  return [...new Set(conditions)];
}

// Helper function to get doctor recommendations based on symptoms
function getDoctorRecommendations(symptoms) {
  if (!symptoms || symptoms.length === 0) {
    return {
      doctors: [],
      specialties: []
    };
  }
  
  // Get relevant specialties for the symptoms
  const specialtiesSet = new Set();
  
  // Map symptoms to specialties
  for (const symptom of symptoms) {
    const lowerSymptom = symptom.toLowerCase();
    
    // Check for exact matches first
    if (symptomToSpecialty[lowerSymptom]) {
      symptomToSpecialty[lowerSymptom].forEach(specialty => specialtiesSet.add(specialty));
      continue;
    }
    
    // Check for partial matches
    for (const [key, specialties] of Object.entries(symptomToSpecialty)) {
      if (lowerSymptom.includes(key) || key.includes(lowerSymptom)) {
        specialties.forEach(specialty => specialtiesSet.add(specialty));
      }
    }
  }
  
  // Default to General Physician if no matches
  if (specialtiesSet.size === 0) {
    specialtiesSet.add('General Physician');
  }
  
  const relevantSpecialties = Array.from(specialtiesSet);
  console.log('Relevant specialties for recommendations:', relevantSpecialties);
  
  // Find doctors with the relevant specialties
  let recommendedDoctors = doctors.filter(doctor => 
    relevantSpecialties.includes(doctor.specialty)
  );
  
  // If no matches, return all doctors
  if (recommendedDoctors.length === 0) {
    recommendedDoctors = doctors;
  }
  
  // Calculate match score for ranking
  recommendedDoctors = recommendedDoctors.map(doctor => {
    // Base score from specialty relevance
    const specialtyIndex = relevantSpecialties.indexOf(doctor.specialty);
    const specialtyScore = specialtyIndex >= 0 ? relevantSpecialties.length - specialtyIndex : 0;
    
    // Consider experience and rating
    const experienceScore = doctor.experience / 5;
    const ratingScore = doctor.rating;
    
    // Combined score
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
  
  // Limit to top 5 recommendations
  recommendedDoctors = recommendedDoctors.slice(0, 5);
  
  return {
    doctors: recommendedDoctors,
    specialties: relevantSpecialties
  };
}

// Generate a medical report based on symptoms
function generateMedicalReport(symptoms) {
  if (!symptoms || symptoms.length === 0) {
    return "No symptoms reported.";
  }
  
  const possibleConditions = getPossibleConditionsForSymptoms(symptoms);
  const urgencyLevel = getUrgencyLevelForSymptoms(symptoms);
  const additionalSymptomsToWatch = getAdditionalSymptomsToWatch(symptoms);
  
  // Format the report
  let report = `
Medical Report Summary
----------------------
Reported Symptoms: ${symptoms.join(', ')}
Possible Conditions: ${possibleConditions.join(', ')}
Urgency Level: ${urgencyLevel}
Additional Symptoms to Watch: ${additionalSymptomsToWatch.join(', ')}
`;

  if (urgencyLevel === "urgent") {
    report += "\nIMPORTANT: Your symptoms may require immediate medical attention. Please consult a healthcare provider as soon as possible.";
  } else if (urgencyLevel === "moderate") {
    report += "\nRecommendation: Consider scheduling an appointment with a healthcare provider in the next few days.";
  } else {
    report += "\nRecommendation: Monitor your symptoms. If they persist or worsen, consider consulting with a healthcare provider.";
  }

  return report;
}

// Convert our chat format to Gemini format
function formatMessagesForGemini(messages) {
  // Gemini expects messages in this format:
  // https://ai.google.dev/api/gemini-api/rest/v1beta/Content
  return messages.map(msg => {
    // Convert role from 'user'/'model' to 'user'/'model'
    const role = msg.role === 'model' ? 'model' : 'user';
    
    // Extract the text content from parts
    const text = msg.parts[0].text;
    
    // Return in Gemini's expected format
    return {
      role: role,
      parts: [{ text: text }]
    };
  });
}

// Chat endpoint
app.post('/chat', async function(req, res) {
  console.log('Chat endpoint requested');
  
  try {
    const { 
      message, 
      chatHistory = [], 
      detectedSymptoms = [], 
      collectingSymptoms = false, 
      recommendDoctors = false 
    } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    console.log('Received message:', message);
    
    // Track symptoms through the conversation
    let allDetectedSymptoms = [...detectedSymptoms];
    let nowCollectingSymptoms = collectingSymptoms;
    let shouldRecommendDoctors = recommendDoctors;
    let showDoctorRecommendations = false;
    let medicalReport = "";
    
    // Format chat history for response
    let formattedChatHistory = [];
    
    // Add intro message if this is a new conversation
    if (!chatHistory || chatHistory.length === 0) {
      formattedChatHistory.push({
        role: 'model',
        parts: [{ text: `I'm CuraGo's medical assistant trained on medical literature and best practices. I can provide health information, analyze symptoms, and help you find appropriate specialists.` }]
      });
    } else {
      formattedChatHistory = [...chatHistory];
    }
    
    // Add the latest user message
    formattedChatHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });
    
    // Check if the message is declining to share more symptoms
    const noMoreSymptoms = /no( more)?( other)?( additional)? symptoms?|that'?s all|nothing else|that is it|no|that's it|done|I'?m done|finished|complete/i.test(message) && nowCollectingSymptoms;
    
    // Check for symptoms in the message
    let symptomCheckResult = await checkForSymptoms(message);
    
    // If we found symptoms, add them to our running list
    if (symptomCheckResult.containsSymptoms && !noMoreSymptoms) {
      const newSymptoms = symptomCheckResult.detectedSymptoms.filter(
        symptom => !allDetectedSymptoms.includes(symptom)
      );
      
      if (newSymptoms.length > 0) {
        allDetectedSymptoms = [...allDetectedSymptoms, ...newSymptoms];
        console.log('Updated symptom list:', allDetectedSymptoms);
        nowCollectingSymptoms = true;
      }
    }
    
    // GENERATE RESPONSE
    let aiResponse = "";
    let responseGenerated = false;
    
    // If user says "no more symptoms" and we have collected symptoms
    if (noMoreSymptoms && allDetectedSymptoms.length > 0) {
      // Stop collecting symptoms and provide medical report
      nowCollectingSymptoms = false;
      shouldRecommendDoctors = true;
      showDoctorRecommendations = true;
      
      // Generate medical report
      medicalReport = generateMedicalReport(allDetectedSymptoms);
      
      // Get doctor recommendations
      const { doctors: recommendedDoctors, specialties: relevantSpecialties } = getDoctorRecommendations(allDetectedSymptoms);
      
      // Create the response with report and recommendations
      aiResponse = `Thank you for sharing your symptoms. Here's a summary of your condition:\n\n${medicalReport}\n\nBased on your symptoms (${allDetectedSymptoms.join(', ')}), I recommend consulting with a ${relevantSpecialties.join(', ')}. I'm displaying available specialists that you can book an appointment with right away.`;
      
      responseGenerated = true;
    }
    // If we're collecting symptoms and they mentioned more
    else if (nowCollectingSymptoms && symptomCheckResult.containsSymptoms) {
      // Thank them for sharing symptoms and ask if there are others
      aiResponse = `I've noted these additional symptoms: ${symptomCheckResult.detectedSymptoms.join(', ')}. Do you have any other symptoms you'd like to tell me about?`;
      responseGenerated = true;
    }
    // If we detected symptoms for the first time
    else if (symptomCheckResult.containsSymptoms && !nowCollectingSymptoms) {
      // Start collecting symptoms
      nowCollectingSymptoms = true;
      
      aiResponse = `I notice you mentioned ${symptomCheckResult.detectedSymptoms.join(', ')}. Thanks for sharing that. Do you have any other symptoms you'd like to tell me about?`;
      responseGenerated = true;
    }
    
    // Check for doctor recommendation requests and respond appropriately
    const explicitDoctorRequest = /doctors|specialists|physician|recommend|who should I see/i.test(message);
    
    if (explicitDoctorRequest && allDetectedSymptoms.length > 0 && !responseGenerated) {
      // Show doctor recommendations based on collected symptoms
      shouldRecommendDoctors = true;
      showDoctorRecommendations = true;
      
      const { doctors: recommendedDoctors, specialties: relevantSpecialties } = getDoctorRecommendations(allDetectedSymptoms);
      console.log('Relevant specialties for recommendations:', relevantSpecialties);
      
      aiResponse = `Based on your symptoms (${allDetectedSymptoms.join(', ')}), I recommend consulting with a ${relevantSpecialties.join(' or ')}. Here are some specialists available for booking.`;
      responseGenerated = true;
    }
    
    // If we haven't generated a custom response yet, use a simplified approach
    if (!responseGenerated) {
      console.log('Processing symptoms or doctor request');
      
      try {
        // Create a simplified prompt for the Gemini API
        const userQuestion = message;
        const prompt = `
          You are a helpful medical assistant called CuraGo. 
          You provide helpful health information but remind users you can't diagnose.
          
          User question: ${userQuestion}
          
          Respond with a helpful, accurate answer in a conversational tone.
          Keep your response under 150 words.
        `;
        
        aiResponse = await generateWithRetry(prompt);
      } catch (error) {
        console.error('Error generating response:', error);
        aiResponse = generateFallbackResponse(message);
      }
    }
    
    // Add AI response to chat history
    formattedChatHistory.push({
      role: 'model',
      parts: [{ text: aiResponse }]
    });
    
    // If we're showing doctor recommendations, include them in the response
    let recommendedDoctors = [];
    let relevantSpecialties = [];
    
    if (showDoctorRecommendations && allDetectedSymptoms.length > 0) {
      const recommendations = getDoctorRecommendations(allDetectedSymptoms);
      recommendedDoctors = recommendations.doctors;
      relevantSpecialties = recommendations.specialties;
    }
    
    // Create response object
    const responseObj = {
      response: aiResponse,
      chatHistory: formattedChatHistory,
      detectedSymptoms: allDetectedSymptoms,
      collectingSymptoms: nowCollectingSymptoms,
      recommendDoctors: shouldRecommendDoctors,
      recommendedDoctors: recommendedDoctors.map(({ matchScore, ...doctor }) => doctor),
      relevantSpecialties: relevantSpecialties,
      showDoctorRecommendations: showDoctorRecommendations,
      medicalReport: medicalReport
    };
    
    // Return the response
    return res.json(responseObj);
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message
    });
  }
});

// Detect symptoms with Gemini AI
app.post('/api/detect-symptoms', async function(req, res) {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }
    
    const result = await checkForSymptoms(message);
    return res.json(result);
  } catch (error) {
    console.error('Error detecting symptoms:', error);
    return res.status(500).json({
      error: "Error detecting symptoms",
      details: error.message
    });
  }
});

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
      '/chat': 'POST - Send a message to the chat service',
      '/api/detect-symptoms': 'POST - Detect symptoms in a message',
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
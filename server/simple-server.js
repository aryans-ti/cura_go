// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
const PORT = process.env.PORT || 4000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes

// Doctor recommendation endpoint based on symptoms
app.post('/api/symptom-analysis', function(req, res) {
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
          isPrimaryRecommendation: specialtyIndex === 0
        }
      };
    });
    
    // Sort by match score (descending)
    doctorsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    // Prepare response
    const response = {
      symptoms,
      relevantSpecialties,
      recommendedDoctors: doctorsWithScores.map(doctor => {
        // Remove the internal matchScore but keep matchDetails for the frontend
        const { matchScore, ...docWithoutScore } = doctor;
        return docWithoutScore;
      }),
      possibleConditions: getPossibleConditionsForSymptoms(symptoms),
      urgencyLevel: getUrgencyLevelForSymptoms(symptoms)
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
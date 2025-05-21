// Mock data for the Rapid Digital Consultation Application

// Doctor specialties
export const specialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Neurologist",
  "Psychiatrist",
  "Ophthalmologist",
  "ENT Specialist"
];

// Doctors
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  avatar?: string;
  availableModes: string[];
  fee: number;
  consultationFee: number;
  about: string;
  shortBio: string;
  education: string;
  languages: string[];
  isVerified: boolean;
  reviews: number;
  specializations: string[];
  matchScore?: number;
  matchDetails?: {
    isPrimaryRecommendation?: boolean;
    specialtyMatch?: boolean;
    experienceWeight?: number;
    symptomMatchScore?: number;
    relevantSpecialty?: string;
    specialtyPriority?: number;
  };
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    experience: 12,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    availableModes: ["video", "audio", "whatsapp", "in-person"],
    fee: 500,
    consultationFee: 500,
    about: "Dr. Johnson is a dedicated general physician with over 12 years of experience in treating a wide range of medical conditions.",
    shortBio: "Dedicated general physician with 12+ years of experience",
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
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    availableModes: ["video", "in-person"],
    fee: 1200,
    consultationFee: 1200,
    about: "Dr. Chen is a renowned cardiologist specializing in interventional cardiology and heart failure management.",
    shortBio: "Renowned cardiologist specialized in heart conditions",
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
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    availableModes: ["video", "audio", "whatsapp"],
    fee: 800,
    consultationFee: 800,
    about: "Dr. Patel is a skilled dermatologist with expertise in treating skin conditions, cosmetic procedures, and dermatological surgeries.",
    shortBio: "Expert dermatologist for skin conditions and cosmetic procedures",
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
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    availableModes: ["video", "in-person"],
    fee: 1500,
    consultationFee: 1500,
    about: "Dr. Wilson is an experienced orthopedic surgeon specializing in joint replacements and sports injuries.",
    shortBio: "Experienced orthopedic surgeon for joint issues and sports injuries",
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
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    availableModes: ["video", "audio", "whatsapp", "in-person"],
    fee: 700,
    consultationFee: 700,
    about: "Dr. Mohammed is a compassionate pediatrician with a focus on child development and preventive healthcare.",
    shortBio: "Compassionate pediatrician focused on child development",
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
    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    availableModes: ["video", "in-person"],
    fee: 1300,
    consultationFee: 1300,
    about: "Dr. Garcia is an expert neurologist specializing in stroke management and movement disorders.",
    shortBio: "Expert neurologist for stroke management and movement disorders",
    education: "MBBS, MD - Neurology, DM - Neurology",
    languages: ["English", "Spanish"],
    isVerified: true,
    reviews: 76,
    specializations: ["Stroke Management", "Movement Disorders", "Headache"]
  }
];

// Time slots
export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
];

// Consultation modes
export interface ConsultationMode {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const consultationModes: ConsultationMode[] = [
  {
    id: "video",
    name: "Video Call",
    icon: "video",
    description: "Face-to-face consultation via video call"
  },
  {
    id: "audio",
    name: "Audio Call",
    icon: "phone",
    description: "Voice-only consultation"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "message-circle",
    description: "Chat consultation via WhatsApp"
  },
  {
    id: "in-person",
    name: "In-Person",
    icon: "user",
    description: "Visit the doctor at their clinic"
  }
];

// Symptom to specialty mapping
export const symptomToSpecialty: Record<string, string[]> = {
  "fever": ["General Physician", "Pediatrician"],
  "cough": ["General Physician", "Pulmonologist"],
  "headache": ["General Physician", "Neurologist"],
  "rash": ["Dermatologist"],
  "joint pain": ["Orthopedic", "Rheumatologist"],
  "chest pain": ["Cardiologist", "General Physician"],
  "abdominal pain": ["Gastroenterologist", "General Physician"],
  "sore throat": ["ENT Specialist", "General Physician"],
  "eye pain": ["Ophthalmologist"],
  "depression": ["Psychiatrist", "Psychologist"],
  "anxiety": ["Psychiatrist", "Psychologist"]
};

// Past consultations
export interface Consultation {
  id: number;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  mode: string;
  symptoms: string[];
  diagnosis: string;
  prescription?: Prescription;
  followUp?: string;
}

export interface Prescription {
  id: number;
  medications: Medication[];
  instructions: string;
  date: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export const pastConsultations: Consultation[] = [
  {
    id: 101,
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "General Physician",
    doctorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "2025-05-10",
    time: "10:30 AM",
    mode: "video",
    symptoms: ["fever", "cough", "sore throat"],
    diagnosis: "Upper Respiratory Tract Infection",
    prescription: {
      id: 1001,
      medications: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "3 times a day",
          duration: "5 days"
        },
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "once daily at night",
          duration: "3 days"
        }
      ],
      instructions: "Drink plenty of fluids and take rest. Avoid cold beverages.",
      date: "2025-05-10"
    },
    followUp: "2025-05-17"
  },
  {
    id: 102,
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Cardiologist",
    doctorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-04-22",
    time: "03:00 PM",
    mode: "in-person",
    symptoms: ["chest pain", "shortness of breath"],
    diagnosis: "Mild Hypertension",
    prescription: {
      id: 1002,
      medications: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "once daily",
          duration: "30 days"
        }
      ],
      instructions: "Reduce salt intake. Exercise regularly for 30 minutes each day.",
      date: "2025-04-22"
    },
    followUp: "2025-05-22"
  },
  {
    id: 103,
    doctorName: "Dr. Priya Patel",
    doctorSpecialty: "Dermatologist",
    doctorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2025-05-05",
    time: "11:00 AM",
    mode: "video",
    symptoms: ["rash", "itching"],
    diagnosis: "Contact Dermatitis",
    prescription: {
      id: 1003,
      medications: [
        {
          name: "Hydrocortisone Cream",
          dosage: "Apply a thin layer",
          frequency: "twice daily",
          duration: "7 days"
        },
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "once daily",
          duration: "7 days"
        }
      ],
      instructions: "Avoid contact with irritants. Use mild soap for bathing.",
      date: "2025-05-05"
    }
  }
];

// Common symptoms for autocomplete
export const commonSymptoms = [
  "fever", "cough", "headache", "sore throat", "runny nose",
  "body ache", "fatigue", "nausea", "vomiting", "diarrhea",
  "chest pain", "abdominal pain", "back pain", "joint pain",
  "rash", "itching", "shortness of breath", "dizziness",
  "blurred vision", "ear pain", "tooth ache", "eye pain",
  "swelling", "numbness", "tingling", "loss of appetite",
  "weight loss", "anxiety", "depression", "insomnia"
];

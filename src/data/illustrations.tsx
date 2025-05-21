import React from 'react';

// Medical-themed SVG illustrations as React components

export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient1)" />
    <circle cx="400" cy="300" r="200" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" />
    <path d="M300,300 L500,300 M400,200 L400,400" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
    <circle cx="400" cy="300" r="220" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="10 5" />
  </svg>
);

export const DoctorIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="doctorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#doctorGrad)" />
    <circle cx="400" cy="150" r="80" fill="#93c5fd" />
    <circle cx="400" cy="150" r="70" fill="#bfdbfe" />
    <rect x="320" y="230" width="160" height="240" rx="20" fill="#3b82f6" />
    <rect x="340" y="230" width="120" height="40" rx="10" fill="#dbeafe" />
    <circle cx="360" cy="310" r="15" fill="#dbeafe" />
    <circle cx="440" cy="310" r="15" fill="#dbeafe" />
    <rect x="360" y="350" width="80" height="10" rx="5" fill="#dbeafe" />
    <rect x="340" y="380" width="120" height="10" rx="5" fill="#dbeafe" />
    <rect x="360" y="410" width="80" height="10" rx="5" fill="#dbeafe" />
  </svg>
);

export const AppointmentIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="apptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#cffafe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#apptGrad)" />
    <rect x="250" y="150" width="300" height="300" rx="10" fill="white" stroke="#0ea5e9" strokeWidth="2" />
    <rect x="280" y="180" width="240" height="40" rx="5" fill="#e0f2fe" />
    <rect x="280" y="240" width="240" height="30" rx="5" fill="#e0f2fe" />
    <rect x="280" y="290" width="240" height="30" rx="5" fill="#e0f2fe" />
    <rect x="280" y="340" width="240" height="30" rx="5" fill="#e0f2fe" />
    <rect x="380" y="390" width="70" height="30" rx="15" fill="#0ea5e9" />
    <rect x="290" y="395" width="70" height="20" rx="5" fill="#e0f2fe" />
  </svg>
);

export const TestimonialIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="testGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#faf5ff" />
        <stop offset="100%" stopColor="#f0f9ff" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#testGrad)" />
    <circle cx="250" cy="150" r="50" fill="#bfdbfe" />
    <rect x="200" y="220" width="250" height="100" rx="10" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <rect x="220" y="240" width="210" height="10" rx="5" fill="#e0f2fe" />
    <rect x="220" y="260" width="180" height="10" rx="5" fill="#e0f2fe" />
    <rect x="220" y="280" width="200" height="10" rx="5" fill="#e0f2fe" />
    <circle cx="550" cy="320" r="50" fill="#bfdbfe" />
    <rect x="350" y="350" width="250" height="100" rx="10" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <rect x="370" y="370" width="210" height="10" rx="5" fill="#e0f2fe" />
    <rect x="370" y="390" width="180" height="10" rx="5" fill="#e0f2fe" />
    <rect x="370" y="410" width="200" height="10" rx="5" fill="#e0f2fe" />
  </svg>
);

export const ChatIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0fdfa" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#chatGrad)" />
    <rect x="250" y="150" width="300" height="300" rx="10" fill="white" stroke="#0ea5e9" strokeWidth="2" />
    <rect x="270" y="180" width="120" height="40" rx="20" fill="#e0f2fe" />
    <rect x="410" y="240" width="120" height="40" rx="20" fill="#bfdbfe" />
    <rect x="270" y="300" width="140" height="40" rx="20" fill="#e0f2fe" />
    <rect x="410" y="360" width="100" height="40" rx="20" fill="#bfdbfe" />
    <circle cx="300" cy="450" r="10" fill="#0ea5e9" />
    <circle cx="340" cy="450" r="10" fill="#0ea5e9" opacity="0.7" />
    <circle cx="380" cy="450" r="10" fill="#0ea5e9" opacity="0.4" />
  </svg>
);

export const StatisticsIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="statsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#statsGrad)" />
    <rect x="200" y="350" width="80" height="150" rx="5" fill="#93c5fd" />
    <rect x="300" y="300" width="80" height="200" rx="5" fill="#60a5fa" />
    <rect x="400" y="250" width="80" height="250" rx="5" fill="#3b82f6" />
    <rect x="500" y="200" width="80" height="300" rx="5" fill="#2563eb" />
    <path d="M200,250 Q300,180 400,220 T600,170" fill="none" stroke="#0ea5e9" strokeWidth="3" />
    <circle cx="200" cy="250" r="8" fill="#0ea5e9" />
    <circle cx="300" cy="180" r="8" fill="#0ea5e9" />
    <circle cx="400" cy="220" r="8" fill="#0ea5e9" />
    <circle cx="500" cy="200" r="8" fill="#0ea5e9" />
    <circle cx="600" cy="170" r="8" fill="#0ea5e9" />
  </svg>
);

export const ContactIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#contactGrad)" />
    <rect x="250" y="150" width="300" height="200" rx="10" fill="white" stroke="#0ea5e9" strokeWidth="2" />
    <path d="M250,150 L400,250 L550,150" fill="none" stroke="#0ea5e9" strokeWidth="2" />
    <rect x="300" y="180" width="200" height="20" rx="5" fill="#e0f2fe" />
    <rect x="300" y="220" width="200" height="20" rx="5" fill="#e0f2fe" />
    <rect x="300" y="260" width="200" height="20" rx="5" fill="#e0f2fe" />
    <rect x="300" y="300" width="200" height="30" rx="5" fill="#0ea5e9" />
    <circle cx="400" cy="400" r="50" fill="#bfdbfe" />
    <rect x="380" y="380" width="40" height="40" rx="5" fill="white" />
    <path d="M390,390 L410,410 M410,390 L390,410" stroke="#0ea5e9" strokeWidth="2" />
  </svg>
);

export const NotFoundIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="notFoundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#notFoundGrad)" />
    <text x="250" y="300" fontFamily="Arial" fontSize="120" fontWeight="bold" fill="#0ea5e9">404</text>
    <text x="280" y="350" fontFamily="Arial" fontSize="30" fill="#64748b">Page Not Found</text>
    <circle cx="400" cy="150" r="50" fill="#bfdbfe" />
    <path d="M380,140 Q400,170 420,140" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
    <circle cx="380" cy="130" r="5" fill="#0ea5e9" />
    <circle cx="420" cy="130" r="5" fill="#0ea5e9" />
  </svg>
);

export const DoctorAvatar: React.FC<{ className?: string, seed?: string }> = ({ className, seed = 'default' }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id={`avatarGrad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill={`url(#avatarGrad-${seed})`} />
    <circle cx="50" cy="36" r="18" fill="#e0f2fe" />
    <rect x="32" y="60" width="36" height="30" rx="10" fill="#e0f2fe" />
    <rect x="38" y="55" width="24" height="10" rx="5" fill="#bfdbfe" />
  </svg>
);

// Medical specialty icons
export const SpecialtyIcon: React.FC<{ specialty: string, className?: string }> = ({ specialty, className }) => {
  
  // Render different icons based on specialty
  switch (specialty.toLowerCase()) {
    case 'general physician':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#bfdbfe" />
          <path d="M8,12 L16,12 M12,8 L12,16" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'cardiologist':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12,21 L4,12 C2,10 2,7 4,5 C6,3 9,3 11,5 L12,6 L13,5 C15,3 18,3 20,5 C22,7 22,10 20,12 L12,21" fill="#bfdbfe" stroke="#0ea5e9" strokeWidth="1" />
        </svg>
      );
    case 'dermatologist':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#bfdbfe" />
          <circle cx="8" cy="10" r="2" fill="#0ea5e9" />
          <circle cx="15" cy="9" r="2" fill="#0ea5e9" />
          <circle cx="10" cy="15" r="2" fill="#0ea5e9" />
          <circle cx="16" cy="14" r="2" fill="#0ea5e9" />
        </svg>
      );
    case 'orthopedic':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect x="10" y="4" width="4" height="16" rx="2" fill="#bfdbfe" />
          <rect x="4" y="10" width="16" height="4" rx="2" fill="#bfdbfe" />
          <circle cx="12" cy="12" r="3" fill="#0ea5e9" />
        </svg>
      );
    case 'pediatrician':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="8" r="6" fill="#bfdbfe" />
          <path d="M6,21 C6,16 18,16 18,21" fill="#bfdbfe" />
          <circle cx="9" cy="7" r="1" fill="#0ea5e9" />
          <circle cx="15" cy="7" r="1" fill="#0ea5e9" />
          <path d="M9,11 Q12,13 15,11" fill="none" stroke="#0ea5e9" strokeWidth="1" />
        </svg>
      );
    case 'neurologist':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="8" fill="#bfdbfe" />
          <path d="M12,4 Q18,9 12,20" fill="none" stroke="#0ea5e9" strokeWidth="1" />
          <path d="M12,4 Q6,9 12,20" fill="none" stroke="#0ea5e9" strokeWidth="1" />
          <path d="M4,12 L20,12" fill="none" stroke="#0ea5e9" strokeWidth="1" />
        </svg>
      );
    case 'psychiatrist':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="8" fill="#bfdbfe" />
          <path d="M8,11 C8,8 16,8 16,11" fill="none" stroke="#0ea5e9" strokeWidth="1" />
          <circle cx="9" cy="10" r="1" fill="#0ea5e9" />
          <circle cx="15" cy="10" r="1" fill="#0ea5e9" />
          <path d="M8,15 Q12,18 16,15" fill="none" stroke="#0ea5e9" strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#bfdbfe" />
          <path d="M8,12 L16,12 M12,8 L12,16" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}; 
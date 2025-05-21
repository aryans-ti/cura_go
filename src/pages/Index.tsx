import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIDiagnosisChat from '../components/AIDiagnosisChat';
import DoctorRecommendation from '../components/DoctorRecommendation';
import BookingSystem from '../components/BookingSystem';
import ConsultationHistory from '../components/ConsultationHistory';
import { Doctor, doctors } from '../data/mockData';
import { HeroIllustration } from '../data/illustrations';
import { Brain, Sparkles, Zap, Activity, MessageSquare, Users, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeStep, setActiveStep] = useState<'chat' | 'doctors' | 'history'>('chat');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Handle symptoms submission from chat
  const handleSymptomsSubmit = (submittedSymptoms: string[]) => {
    setSymptoms(submittedSymptoms);
    // Don't automatically switch to the doctors tab anymore
    // setActiveStep('doctors');
    
    // We'll keep this functionality for when the user explicitly wants to see all doctors
    // by clicking on "View All Doctors" in the chat
  };
  
  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    console.log("Doctor selected:", doctor);
    setSelectedDoctor(doctor);
    
    // Show the booking component in a modal or new view
    // This will now be handled directly from the chat interface
  };
  
  // Handle booking completion
  const handleBookingComplete = () => {
    setActiveStep('history');
  };
  
  // Handle manual tab navigation
  const handleTabChange = (value: string) => {
    setActiveStep(value as typeof activeStep);
  };

  // Add a new function to handle explicit tab changes from the chat
  const handleViewAllDoctors = () => {
    setActiveStep('doctors');
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1, 
      name: "Sarah M.",
      role: "Patient",
      quote: "The symptom analysis was spot on. I got connected to the right specialist in minutes and had my concerns addressed without leaving home.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "James L.",
      role: "Parent",
      quote: "When my child was sick at night, this platform was a lifesaver. Quick doctor consultation and clear instructions on what to do next.",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      id: 3,
      name: "Dr. Patel",
      role: "Cardiologist",
      quote: "As a doctor, I appreciate how the platform effectively matches patients with the right specialists. The booking system is seamless.",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section with Enhanced Design */}
          <div className="text-center mb-10 md:mb-16 relative">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute w-40 h-40 bg-blue-400/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
              <div className="absolute w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl top-10 right-1/4 animate-pulse delay-700"></div>
              <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl bottom-0 left-1/3 animate-pulse delay-1000"></div>
              <div className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl -bottom-10 right-1/3 animate-pulse delay-300"></div>
              <HeroIllustration className="w-full h-full opacity-40" />
            </div>

            {/* Enhanced Heading with 3D Effect */}
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 drop-shadow-sm flex items-center justify-center">
              CuraGo 
              <svg className="ml-2 w-10 h-10 md:w-12 md:h-12 drop-shadow-md filter" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stethoscope with enhanced colors */}
                <circle cx="6" cy="18" r="3" fill="url(#grad1)"/>
                <circle cx="6" cy="18" r="1.5" fill="#1E40AF"/>
                
                {/* Main tube with gradient */}
                <path d="M6 15V10C6 7 9 3 14 3C19 3 19 7 19 9V12" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Earpiece connector with animation */}
                <path d="M19 12C20.6569 12 22 13.3431 22 15C22 16.6569 20.6569 18 19 18C17.3431 18 16 16.6569 16 15C16 13.3431 17.3431 12 19 12Z" stroke="url(#grad2)" strokeWidth="2" className="animate-pulse"/>
                
                {/* Y-split with animation */}
                <path d="M16 15H10" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 15V17.5C10 17.7761 9.77614 18 9.5 18H6" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Define gradients */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse inline-block">
                <Sparkles className="w-5 h-5 inline-block mr-1 text-yellow-400" />
              </span>
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto relative">
              <span className="relative inline-block">
                Care that moves at your speed
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></span>
              </span>
            </p>
          </div>
          
          {/* Main Consultation Panel with Enhanced Styling */}
          <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 mb-12 border border-primary/10 relative overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl pointer-events-none"></div>
            
            <Tabs 
              value={activeStep} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8 p-1 bg-muted rounded-lg shadow-inner">
                <TabsTrigger 
                  value="chat"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md py-3 transition-all duration-200 hover:bg-muted/80 font-medium flex items-center justify-center gap-1"
                >
                  <MessageSquare className="h-4 w-4 text-primary/80" />
                  <span>AI Health Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="doctors"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md py-3 transition-all duration-200 hover:bg-muted/80 font-medium flex items-center justify-center gap-1"
                >
                  <Users className="h-4 w-4 text-primary/80" />
                  <span>Doctors</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md py-3 transition-all duration-200 hover:bg-muted/80 font-medium flex items-center justify-center gap-1"
                >
                  <History className="h-4 w-4 text-primary/80" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-0">
                <AIDiagnosisChat 
                  onDetectSymptoms={handleSymptomsSubmit} 
                  onSelectDoctor={handleDoctorSelect}
                  onViewAllDoctors={handleViewAllDoctors}
                />
              </TabsContent>
              
              <TabsContent value="doctors" className="mt-0">
                <DoctorRecommendation 
                  symptoms={symptoms} 
                  onSelectDoctor={handleDoctorSelect} 
                />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <ConsultationHistory />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Statistics Section with Enhanced Design */}
          <div className="my-16 px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Why Choose CuraGo?
              </h2>
              <p className="text-muted-foreground">Healthcare at your fingertips, anytime, anywhere</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/10 transform hover:-translate-y-1 duration-200">
                <p className="text-3xl font-bold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">2,500+</p>
                <p className="text-muted-foreground text-sm">Consultations Monthly</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/10 transform hover:-translate-y-1 duration-200">
                <p className="text-3xl font-bold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">200+</p>
                <p className="text-muted-foreground text-sm">Verified Specialists</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/10 transform hover:-translate-y-1 duration-200">
                <p className="text-3xl font-bold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">4.8</p>
                <p className="text-muted-foreground text-sm">Average Rating</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/10 transform hover:-translate-y-1 duration-200">
                <p className="text-3xl font-bold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">15+</p>
                <p className="text-muted-foreground text-sm">Medical Specialties</p>
              </div>
            </div>
            <div className="mt-8 hidden md:block">
              <div className="rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 h-64 flex items-center justify-center relative">
                {/* Background blobs */}
                <div className="absolute w-40 h-40 bg-white/10 rounded-full top-10 left-10 animate-pulse"></div>
                <div className="absolute w-32 h-32 bg-white/10 rounded-full bottom-5 right-20 animate-pulse delay-500"></div>
                
                <div className="text-center p-6 relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mx-auto mb-4 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-white text-xl font-bold mb-2 drop-shadow-md">Patient Satisfaction</h3>
                  <p className="text-blue-100">We're committed to providing the best care possible</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features section with Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-primary/10 hover:-translate-y-1">
              <div className="rounded-full bg-gradient-to-br from-primary/10 to-blue-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Quick & Easy</h3>
              <p className="text-muted-foreground">Describe your symptoms and get matched with the right specialists in minutes.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-primary/10 hover:-translate-y-1">
              <div className="rounded-full bg-gradient-to-br from-primary/10 to-blue-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Expert Doctors</h3>
              <p className="text-muted-foreground">Connect with verified specialists across multiple medical disciplines.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-primary/10 hover:-translate-y-1">
              <div className="rounded-full bg-gradient-to-br from-primary/10 to-blue-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Booking</h3>
              <p className="text-muted-foreground">Schedule consultations via video, audio, chat, or in-person at your convenience.</p>
            </div>
          </div>
          
          {/* Testimonials Section with Enhanced Design */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                What Our Users Say
              </h2>
              <p className="text-muted-foreground">Real experiences from patients and doctors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-primary/10 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary/30 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <svg className="w-6 h-6 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground italic">{testimonial.quote}</p>
                  <div className="mt-4 flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg 
                        key={star} 
                        className="w-5 h-5 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          {/* Animated Healthcare Icons with Enhanced Design */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-4 gap-8 max-w-2xl">
              <div className="text-center transform transition-transform hover:scale-110 duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground font-medium">Care</span>
              </div>
              
              <div className="text-center transform transition-transform hover:scale-110 duration-300">
                <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground font-medium">Safety</span>
              </div>
              
              <div className="text-center transform transition-transform hover:scale-110 duration-300">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground font-medium">Speed</span>
              </div>
              
              <div className="text-center transform transition-transform hover:scale-110 duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm text-foreground font-medium">Records</span>
              </div>
            </div>
          </div>

          {/* CTA Section with Enhanced Design */}
          <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16 shadow-md relative overflow-hidden">
            {/* Animated gradient accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay blur-3xl animate-pulse delay-700"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-sm">Experience CuraGo Today</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              No registration required. Simply describe your symptoms, get matched with specialists, and book a consultation in minutes.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // Focus on the chat tab
                  const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                  if (chatTab) {
                    chatTab.click();
                  }
                }}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center justify-center"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get Started Now
              </button>
              <Link 
                to="/health-assistant"
                className="bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
              >
                <Brain className="h-5 w-5 mr-2" />
                Try AI Health Assistant
              </Link>
              <Link 
                to="/contact"
                className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

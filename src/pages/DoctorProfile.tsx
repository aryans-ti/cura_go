import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { doctors } from '@/data/mockData';
import { Calendar, MessageSquare, Star, ArrowLeft, Award, GraduationCap, Languages, Stethoscope, Clock, MapPin, Phone, Video, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

const DoctorProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('about');

  // Find doctor by ID - convert to string for comparison if needed
  const doctor = doctors.find(doc => doc.id.toString() === id);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <img 
              src="https://img.freepik.com/premium-vector/doctor-character-background_23-2148325547.jpg?w=1480" 
              alt="Doctor not found" 
              className="w-40 h-40 mx-auto mb-6 rounded-full shadow-md object-cover" 
            />
            <h2 className="text-2xl font-bold mb-4 text-foreground">Doctor Not Found</h2>
            <p className="mb-6 text-muted-foreground">The doctor you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/doctors">Browse All Doctors</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookAppointment = () => {
    // In a real app, this would navigate to booking page with doctor pre-selected
    toast({
      title: "Redirecting to booking",
      description: `You're being redirected to book an appointment with Dr. ${doctor.name}`,
    });
    // Navigate to booking page
    window.location.href = `/?doctor=${doctor.id}`;
  };

  const renderModeIcon = (mode: string) => {
    switch (mode) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'audio':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'in-person':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero background with gradient overlay */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Medical background" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 -mt-24 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-xl shadow-md overflow-hidden mb-8 relative z-10 text-card-foreground">
            <div className="md:flex">
              <div className="md:flex-shrink-0 relative">
                <div className="overflow-hidden rounded-lg border-4 border-card shadow-lg">
                  <img 
                    className="h-80 w-full object-cover md:w-80 md:h-auto" 
                    src={doctor.avatar || doctor.image || [
                      "https://img.freepik.com/free-photo/medium-shot-doctor-with-crossed-arms_23-2148485505.jpg?w=2000&t=st=1693883720~exp=1693884320~hmac=f6093766b985b1c11b62d7372b98b8b786421c1f5aa89a8a1f86697e8f95e3b8",
                      "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg?w=2000&t=st=1693883889~exp=1693884489~hmac=8e760c833397603ec29f8fe9347ba7ca12baa34e61c4f8fae89e0246dee8d5bb", 
                      "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=2000&t=st=1693883939~exp=1693884539~hmac=71bf7dda47ded71295baa2f7c351d5c47e4787cb636c0077ef25d5e7b12c40ba",
                      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?w=2000&t=st=1693883951~exp=1693884551~hmac=99c59d2a01f0fb35f4e6ec8f88c10afadd6462b9c7cc5eb5dcca785ca1392cbe"
                    ][parseInt(doctor.id) % 4]}
                  alt={doctor.name} 
                    loading="eager"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      // Premium stock images as fallbacks
                      if (doctor.name.includes('Dr. Sarah') || doctor.name.includes('Dr. Emma') || doctor.name.includes('Dr. Lisa')) {
                        target.src = "https://img.freepik.com/free-photo/portrait-doctor_144627-39409.jpg?w=2000&t=st=1693883975~exp=1693884575~hmac=e9d3a14db9900636b3cb47d86f5b8488e39daec3f0b14b8fbf571eb7acb1b409";
                      } else {
                        target.src = "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=2000&t=st=1693883988~exp=1693884588~hmac=8dd3b5e8af9fd2e61e0bbf60ebe8cbcd85fda64a6de78be9a64cd8069aee1848";
                      }
                    }}
                  />
                </div>
                {doctor.isVerified && (
                  <div className="absolute bottom-4 right-4 bg-background p-2 rounded-full shadow-lg">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="p-8">
                <Link to="/doctors" className="inline-flex items-center text-primary mb-4 hover:underline text-sm">
                  <ArrowLeft size={14} className="mr-1" />
                  Back to Doctors
                </Link>
                
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                  {doctor.isVerified && (
                    <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                    <span className="ml-1 text-foreground">{doctor.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground/40">|</span>
                  <span className="text-muted-foreground">{doctor.reviews} Reviews</span>
                </div>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{doctor.experience} years exp.</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{doctor.education?.split(',')[0] || 'MBBS'}</span>
                  </div>
                  <div className="flex items-center">
                    <Languages className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{doctor.languages?.join(', ') || 'English'}</span>
                  </div>
                </div>
                
                <p className="mt-4 text-muted-foreground">{doctor.shortBio}</p>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button onClick={handleBookAppointment} className="bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg transition-shadow">
                    <Calendar size={18} className="mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline">
                    <MessageSquare size={18} className="mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-6 bg-card p-4 rounded-lg shadow-sm text-card-foreground border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-lg font-bold text-foreground">{doctor.experience} years</p>
            </div>
            <div className="h-10 border-r border-border mx-4"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Patients</p>
              <p className="text-lg font-bold text-foreground">1,200+</p>
            </div>
            <div className="h-10 border-r border-border mx-4"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-lg font-bold text-foreground">{doctor.rating} / 5</p>
            </div>
            <div className="h-10 border-r border-border mx-4"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="text-lg font-bold text-foreground">{doctor.reviews}</p>
            </div>
            <div className="h-10 border-r border-border mx-4"></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Available via</p>
              <div className="flex gap-2">
                {doctor.availableModes?.map((mode) => (
                  <div key={mode} className="flex items-center bg-muted px-2 py-1 rounded text-xs text-foreground">
                    {renderModeIcon(mode)}
                    <span className="ml-1 capitalize">{mode}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0">
              <div className="bg-card rounded-lg p-6 shadow-sm text-card-foreground border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  About Dr. {doctor.name}
                </h2>
                <p className="mb-4 text-foreground">{doctor.about || doctor.shortBio}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                      <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                      Specializations
                    </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations?.map((spec, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20">
                      {spec}
                        </Badge>
                      )) || <Badge variant="outline">{doctor.specialty}</Badge>}
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center text-foreground">
                      <Languages className="mr-2 h-5 w-5 text-primary" />
                      Languages
                    </h3>
                    <p className="text-muted-foreground">{doctor.languages?.join(', ') || 'English'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      Location
                    </h3>
                    <div className="rounded-lg overflow-hidden shadow-md h-40 mb-3 border border-border">
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-center p-4">
                          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground text-sm">Map view unavailable</p>
                          <p className="text-xs text-muted-foreground mt-1">123 Medical Plaza, New York, NY 10001</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">123 Medical Plaza, New York, NY 10001</p>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center text-foreground">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      Working Hours
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
                    <Calendar className="mr-2 h-5 w-5" />
                    Consultation Fee
                  </h3>
                <p className="text-xl font-bold text-primary">${doctor.consultationFee}</p>
                  <Button onClick={handleBookAppointment} className="mt-4 w-full md:w-auto">Book Now</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="mt-0">
              <div className="bg-card rounded-lg p-6 shadow-sm text-card-foreground border border-border">
                <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
                  <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                  Experience & Education
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Professional Experience</h3>
                  <div className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">Senior Specialist</p>
                        <p className="text-muted-foreground">City General Hospital</p>
                        <p className="text-muted-foreground text-sm">2018 - Present</p>
                      </div>
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">Consultant</p>
                        <p className="text-muted-foreground">Medical Center</p>
                        <p className="text-muted-foreground text-sm">2012 - 2018</p>
                      </div>
                      <div className="border-l-2 border-border pl-4 relative">
                        <div className="absolute w-3 h-3 bg-border rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">Resident Doctor</p>
                        <p className="text-muted-foreground">University Hospital</p>
                        <p className="text-muted-foreground text-sm">2008 - 2012</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Education & Certifications</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">Specialist Certification</p>
                        <p className="text-muted-foreground">American Board of Medical Specialties</p>
                        <p className="text-muted-foreground text-sm">2014</p>
                      </div>
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">{doctor.education || 'MD Medicine'}</p>
                        <p className="text-muted-foreground">University Medical School</p>
                        <p className="text-muted-foreground text-sm">2008 - 2012</p>
                      </div>
                      <div className="border-l-2 border-border pl-4 relative">
                        <div className="absolute w-3 h-3 bg-border rounded-full -left-[6.5px] top-1"></div>
                        <p className="font-medium text-foreground">MBBS</p>
                        <p className="text-muted-foreground">Medical College</p>
                        <p className="text-muted-foreground text-sm">2002 - 2008</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <img 
                      src="https://img.freepik.com/premium-vector/medical-license-certificate-template-with-flat-outline-style_599062-1333.jpg" 
                      alt="Certificate" 
                      className="w-16 h-16 mx-auto mb-2 object-cover rounded-md"
                    />
                    <p className="font-medium text-foreground">Medical License</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <img 
                      src="https://img.freepik.com/premium-vector/medical-award-gold-medal-with-red-ribbon_601298-1261.jpg" 
                      alt="Award" 
                      className="w-16 h-16 mx-auto mb-2 object-cover rounded-md"
                    />
                    <p className="font-medium text-foreground">Best Doctor Award</p>
                    </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <img 
                      src="https://img.freepik.com/premium-vector/medical-research-report-with-medical-chart-health-check-up-clinical-research-scientific-report_349999-627.jpg" 
                      alt="Research" 
                      className="w-16 h-16 mx-auto mb-2 object-cover rounded-md"
                    />
                    <p className="font-medium text-foreground">10+ Research Papers</p>
                    </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <img 
                      src="https://img.freepik.com/premium-vector/hand-drawn-laboratory-study-medical-doctor-healthcare-medical-experienc_169798-2006.jpg" 
                      alt="Experience" 
                      className="w-16 h-16 mx-auto mb-2 object-cover rounded-md"
                    />
                    <p className="font-medium text-foreground">{doctor.experience}+ Years Experience</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="bg-card rounded-lg p-6 shadow-sm text-card-foreground border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Patient Reviews</h2>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="ml-2 text-2xl font-bold text-foreground">{doctor.rating}</span>
                    <span className="ml-2 text-muted-foreground">({doctor.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 mb-8">
                  <div className="col-span-2">
                    <div className="flex items-center mb-2">
                      <span className="w-20 text-sm text-muted-foreground">5 stars</span>
                      <div className="flex-1 h-2.5 mx-2 bg-muted rounded-full">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-20 text-sm text-muted-foreground">4 stars</span>
                      <div className="flex-1 h-2.5 mx-2 bg-muted rounded-full">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-20 text-sm text-muted-foreground">3 stars</span>
                      <div className="flex-1 h-2.5 mx-2 bg-muted rounded-full">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-20 text-sm text-muted-foreground">2 stars</span>
                      <div className="flex-1 h-2.5 mx-2 bg-muted rounded-full">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-sm text-muted-foreground">1 star</span>
                      <div className="flex-1 h-2.5 mx-2 bg-muted rounded-full">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground mb-2">{doctor.rating}</div>
                      <div className="flex mb-2 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={24} 
                            className={i < Math.floor(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"} 
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">Based on {doctor.reviews} reviews</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <img 
                            src={[
                              "https://img.freepik.com/free-photo/cheerful-positive-young-pretty-brunette-woman_295783-157.jpg?w=1800&t=st=1693884094~exp=1693884694~hmac=34bcc2c6cae111d1ff2e3e1e9ca5c51952e7a37f29a9b4c1cf66fa30db9f6b5a",
                              "https://img.freepik.com/free-photo/portrait-smiling-young-man-with-crossed-arms_171337-17388.jpg?w=1800&t=st=1693884107~exp=1693884707~hmac=dbeee51986e213599a9eed1a3e0e9ba31af6aef69c239e0d9c76e18d86ef21eb",
                              "https://img.freepik.com/free-photo/confident-attractive-caucasian-woman-beige-blouse-posing-with-broad-smile-isolated_176532-11428.jpg?w=1800&t=st=1693884129~exp=1693884729~hmac=a2e8d854f9cc26e3b6d11e6e35c4cc872b8b6c02d002d3ca84229237c0df1fb6"
                            ][index]}
                            alt={["John D.", "Maria K.", "Sam K."][index]} 
                            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-background shadow-md"
                          />
                          <div>
                            <p className="font-medium text-foreground">{["John D.", "Maria K.", "Sam K."][index]}</p>
                            <p className="text-muted-foreground text-sm">{["May 12, 2025", "Apr 28, 2025", "Mar 15, 2025"][index]}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < [5, 4, 5][index] ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {[
                          "Dr. Smith was incredibly thorough and took the time to listen to all my concerns. Very professional and knowledgeable.",
                          "Great doctor with excellent bedside manner. Explained everything clearly and made sure I understood my treatment options.",
                          "Highly recommend! The consultation was efficient yet comprehensive. Dr. Smith provided great advice and follow-up care."
                        ][index]}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">Load More Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorProfile;

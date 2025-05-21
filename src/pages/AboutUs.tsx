import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500/20 to-blue-600/30 dark:from-blue-950 dark:to-blue-900 py-12 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Medical background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Healthcare Made Simple</h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                CuraGo connects patients with qualified healthcare professionals 
                for quick and convenient digital consultations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/">Find a Doctor</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                At CuraGo, we believe healthcare should be accessible, convenient, and 
                patient-centered. Our mission is to break down barriers to quality healthcare 
                by connecting patients with the right medical professionals through seamless 
                digital consultations.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Making quality healthcare available to everyone, anywhere.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Convenience</h3>
                  <p className="text-muted-foreground">
                    Consult with doctors from the comfort of your home.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Quality</h3>
                  <p className="text-muted-foreground">
                    Connecting patients with verified and experienced professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">How It Works</h2>
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                    <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl">1</div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Describe Your Symptoms</h3>
                    <p className="text-muted-foreground">
                      Share your symptoms and health concerns through our simple chat interface.
                      No account required to get started.
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                        alt="Symptom chat interface" 
                        className="w-full h-auto rounded-lg mb-4 dark:opacity-90"
                      />
                      <div className="chat-bubble bot-bubble bg-primary/10 p-3 rounded-lg text-foreground mb-2">
                        What symptoms are you experiencing today?
                      </div>
                      <div className="chat-bubble user-bubble bg-primary/20 p-3 rounded-lg text-foreground ml-auto max-w-[80%]">
                        I have a persistent headache and slight fever for the past two days.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row-reverse items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                    <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl">2</div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Get Doctor Recommendations</h3>
                    <p className="text-muted-foreground">
                      Based on your symptoms, we'll recommend the most suitable doctors 
                      specialized in treating your condition.
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <div className="doctor-card bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                      <div className="p-4">
                        <div className="flex items-center mb-4">
                          <img 
                            src="https://randomuser.me/api/portraits/women/68.jpg" 
                            alt="Dr. Sarah Johnson" 
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-bold text-foreground">Dr. Sarah Johnson</h4>
                            <p className="text-primary">Neurologist</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <span className="ml-1 text-foreground">4.9</span>
                          <span className="ml-2 text-muted-foreground">(120 reviews)</span>
                        </div>
                        <Button className="w-full mt-4">Book Consultation</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                    <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl">3</div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Book Your Consultation</h3>
                    <p className="text-muted-foreground">
                      Select your preferred doctor, choose a convenient time slot, and your 
                      preferred consultation mode (video, audio, chat, or in-person).
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                      <img 
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                        alt="Calendar booking interface" 
                        className="w-full h-auto rounded-lg mb-4 shadow-sm dark:opacity-90"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="consultation-mode selected p-4 rounded-lg flex flex-col items-center bg-primary/10 border border-primary">
                          <svg className="w-8 h-8 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          <span className="font-medium text-foreground">Video Call</span>
                        </div>
                        <div className="consultation-mode p-4 rounded-lg flex flex-col items-center border border-border">
                          <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span className="font-medium text-foreground">Audio Call</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">What Our Users Say</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "CuraGo saved me so much time. I got expert medical advice within 
                    minutes, without having to leave my house."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/women/82.jpg" 
                      alt="Sarah M." 
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                    <span className="font-bold text-foreground">Sarah M.</span>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "As a busy parent, being able to consult with a pediatrician via video call 
                    was incredible. My son got the help he needed without the stress of a clinic visit."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/75.jpg" 
                      alt="Michael T." 
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                    <span className="font-bold text-foreground">Michael T.</span>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The doctor recommendations were spot on. I found a specialist who understood 
                    my chronic condition and provided excellent care."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/women/32.jpg" 
                      alt="Jennifer L." 
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                    <span className="font-bold text-foreground">Jennifer L.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Medical background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Ready to Get Started?</h2>
              <p className="text-white text-lg mb-8">
                Consult with qualified healthcare professionals within minutes.
                No registration required.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link to="/">
                Find a Doctor Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;

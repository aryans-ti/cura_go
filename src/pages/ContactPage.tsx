import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Phone, MapPin, Mail, Clock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Contact Hero */}
        <section className="bg-gradient-to-r from-blue-500/20 to-blue-600/30 dark:from-blue-950 dark:to-blue-900 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Contact us background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Contact Us</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Have questions or need assistance? We're here to help you get the healthcare you need.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                    <Mail className="mr-2 h-6 w-6 text-primary" />
                    Get in Touch
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Please provide details about your inquiry..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                  
                  <div className="mt-8 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                      alt="Medical support team" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                    <Phone className="mr-2 h-6 w-6 text-primary" />
                    Contact Information
                  </h2>
                  <div className="bg-card p-6 rounded-lg shadow-sm mb-6 border border-border">
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-3 rounded-full mr-4 shrink-0">
                          <MapPin className="text-primary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Our Location</h3>
                          <p className="text-muted-foreground">
                            123 Healthcare Avenue<br />
                            Medical Plaza, Suite 200<br />
                            New York, NY 10001
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-3 rounded-full mr-4 shrink-0">
                          <Phone className="text-primary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Phone</h3>
                          <p className="text-muted-foreground">
                            Customer Support: +1 (555) 123-4567<br />
                            Appointments: +1 (555) 765-4321<br />
                            Hours: Mon-Fri, 8am - 8pm EST
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-3 rounded-full mr-4 shrink-0">
                          <MessageSquare className="text-primary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Email</h3>
                          <p className="text-muted-foreground">
                            General Inquiries: info@curago.com<br />
                            Support: support@curago.com<br />
                            Partnerships: partners@curago.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card overflow-hidden rounded-lg shadow-sm mb-6 border border-border">
                    <div className="w-full h-48 relative bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="bg-background p-2 rounded-full shadow-lg mb-2">
                          <MapPin className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground text-sm">Map view unavailable</p>
                        <p className="text-xs text-muted-foreground">123 Healthcare Avenue, New York, NY 10001</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-3 flex items-center text-foreground">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        Business Hours
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="font-medium text-foreground">8:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="font-medium text-foreground">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium text-foreground">Closed</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-muted-foreground text-sm">
                          <strong className="text-foreground">Note:</strong> Our medical consultants are available 24/7 for 
                          urgent digital consultations through our platform.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-8">
                    <Button asChild variant="outline" className="group">
                      <Link to="/">
                        Find a Doctor
                        <div className="ml-2 transform group-hover:translate-x-1 transition-transform">→</div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center text-foreground">
                <HelpCircle className="mr-2 h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-border">
                  <h3 className="font-bold text-lg mb-2 text-foreground">How do digital consultations work?</h3>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        Digital consultations allow you to meet with a doctor through video call, 
                        audio call, or chat. You'll discuss your symptoms, receive a diagnosis, 
                        and get a treatment plan, all without leaving your home.
                      </p>
                    </div>
                    <div className="ml-4 w-16 h-16 flex-shrink-0">
                      <img src="https://cdn-icons-png.flaticon.com/512/3063/3063176.png" alt="Video consultation" className="w-full h-full object-contain dark:opacity-80" />
                    </div>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-border">
                  <h3 className="font-bold text-lg mb-2 text-foreground">Is my personal information secure?</h3>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        Yes, we take your privacy seriously. All communications and medical 
                        records are encrypted and protected according to HIPAA standards.
                      </p>
                    </div>
                    <div className="ml-4 w-16 h-16 flex-shrink-0">
                      <img src="https://cdn-icons-png.flaticon.com/512/2214/2214465.png" alt="Security" className="w-full h-full object-contain dark:opacity-80" />
                    </div>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-border">
                  <h3 className="font-bold text-lg mb-2 text-foreground">How do I pay for consultations?</h3>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        We accept all major credit cards, health savings accounts (HSA), 
                        and flexible spending accounts (FSA). In many cases, consultations 
                        may be covered by your health insurance.
                      </p>
                    </div>
                    <div className="ml-4 w-16 h-16 flex-shrink-0">
                      <img src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png" alt="Payment" className="w-full h-full object-contain dark:opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;

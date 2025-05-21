import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ContactIllustration } from '../data/illustrations';

const FAQPage = () => {
  const faqs = {
    general: [
      {
        question: "What is CuraGo?",
        answer: "CuraGo is a digital platform that connects patients with healthcare professionals based on their symptoms. Our system helps you find the right specialist, book consultations, and maintain a record of your medical history."
      },
      {
        question: "Do I need to create an account to use CuraGo?",
        answer: "No, you don't need to create an account to use our basic services. You can enter your symptoms, get doctor recommendations, and book consultations without registration. However, creating an account allows you to access additional features like saving your medical history."
      },
      {
        question: "Is CuraGo available internationally?",
        answer: "Currently, CuraGo is available in select regions. We're actively expanding our network of healthcare providers to more locations. Please check our coverage area to see if our services are available in your region."
      },
      {
        question: "Is my medical information secure?",
        answer: "Yes, we take your privacy seriously. All your medical information is encrypted and secured according to industry standards. We comply with healthcare privacy regulations and never share your data with third parties without your explicit consent."
      }
    ],
    consultations: [
      {
        question: "How does the symptom matching system work?",
        answer: "Our symptom matching system uses a specialized algorithm that maps your reported symptoms to the most appropriate medical specialties. The system then recommends qualified doctors within those specialties who are available for consultation."
      },
      {
        question: "What types of consultation modes are available?",
        answer: "We offer multiple consultation modes including video calls, audio calls, chat consultations via WhatsApp, and in-person visits. The available modes depend on each doctor's preferences and availability."
      },
      {
        question: "How long do consultations typically last?",
        answer: "The duration of consultations varies depending on the complexity of your case and the doctor's schedule. Typically, online consultations last between 15-30 minutes, while in-person consultations may be scheduled for 30-60 minutes."
      },
      {
        question: "Can I cancel or reschedule my consultation?",
        answer: "Yes, you can cancel or reschedule your consultation up to 6 hours before the appointed time without any penalty. For changes made less than 6 hours before the appointment, a cancellation fee may apply depending on the doctor's policy."
      }
    ],
    doctors: [
      {
        question: "How are doctors verified on CuraGo?",
        answer: "All doctors on our platform undergo a thorough verification process. We verify their medical licenses, credentials, professional experience, and practice history. Only after passing our verification process can doctors offer consultations through our platform."
      },
      {
        question: "Can I choose any doctor from the recommendations?",
        answer: "Yes, you have complete freedom to choose any doctor from our recommendations. You can review their profiles, specialties, experience, patient ratings, and consultation fees before making your decision."
      },
      {
        question: "What if I'm not satisfied with my consultation?",
        answer: "Your satisfaction is important to us. If you're not satisfied with your consultation, please contact our support team within 24 hours after the consultation. We'll review your case and may offer a follow-up consultation or a refund based on the circumstances."
      },
      {
        question: "Can I request a specific doctor for my consultation?",
        answer: "Yes, if you know the name of a doctor in our network, you can search for them directly. If you've consulted with a doctor before and wish to have a follow-up, you can book directly with them without going through the symptom matching process again."
      }
    ],
    payments: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept various payment methods including credit/debit cards, digital wallets, and bank transfers. The available payment options will be displayed at checkout."
      },
      {
        question: "How much do consultations cost?",
        answer: "Consultation fees vary depending on the doctor's specialty, experience, and the mode of consultation. The fee is clearly displayed on each doctor's profile before you book an appointment."
      },
      {
        question: "Do you accept health insurance?",
        answer: "We're working on integrating with various health insurance providers. Currently, the availability of insurance coverage depends on your insurance plan and the doctor you choose. You can check if your insurance is accepted during the booking process."
      },
      {
        question: "What is your refund policy?",
        answer: "If you cancel more than 6 hours before your scheduled consultation, you'll receive a full refund. For cancellations made less than 6 hours before the appointment, a cancellation fee may apply. If a doctor cancels or doesn't show up for the consultation, you'll receive a full refund."
      }
    ],
    technical: [
      {
        question: "What devices and browsers are supported?",
        answer: "CuraGo works on most modern devices including smartphones, tablets, and computers. We support the latest versions of Chrome, Firefox, Safari, and Edge browsers. For video consultations, a device with a camera and microphone is required."
      },
      {
        question: "What should I do if I experience technical issues during a consultation?",
        answer: "If you experience technical issues during a consultation, try refreshing your browser or restarting the app. If problems persist, you can contact our technical support team via the help button in the consultation interface, or switch to an alternative consultation mode if the doctor offers it."
      },
      {
        question: "Is a high-speed internet connection required for video consultations?",
        answer: "A stable internet connection is recommended for video consultations. We recommend a minimum speed of 1 Mbps for a smooth experience. If your connection is unstable, the system will automatically adjust the video quality or suggest switching to an audio consultation."
      },
      {
        question: "Can I use CuraGo on mobile devices?",
        answer: "Yes, CuraGo is fully optimized for mobile devices. You can access all features through your mobile browser or download our mobile app from the App Store or Google Play Store for an enhanced experience."
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 relative">
            <div className="absolute right-0 top-0 -mt-16 -mr-16 opacity-10 hidden md:block">
              <ContactIllustration className="w-64 h-64" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about CuraGo's services, consultations, and more.
            </p>
          </div>
          
          <div className="bg-card rounded-xl shadow-md overflow-hidden mb-12 border border-border">
            <Tabs defaultValue="general" className="w-full">
              <div className="bg-muted p-4 border-b border-border">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <TabsTrigger value="general" className="data-[state=active]:bg-background">
                    General
                  </TabsTrigger>
                  <TabsTrigger value="consultations" className="data-[state=active]:bg-background">
                    Consultations
                  </TabsTrigger>
                  <TabsTrigger value="doctors" className="data-[state=active]:bg-background">
                    Doctors
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="data-[state=active]:bg-background">
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:bg-background">
                    Technical
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="general">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">General Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.general.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="consultations">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Consultation Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.consultations.map((faq, index) => (
                      <AccordionItem key={index} value={`consultations-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="doctors">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Doctor Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.doctors.map((faq, index) => (
                      <AccordionItem key={index} value={`doctors-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="payments">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Payment Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.payments.map((faq, index) => (
                      <AccordionItem key={index} value={`payments-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="technical">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Technical Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.technical.map((faq, index) => (
                      <AccordionItem key={index} value={`technical-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you with any other questions you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center bg-card hover:bg-muted text-primary font-medium py-3 px-6 rounded-lg border border-border transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </a>
                <a href="/about" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage; 
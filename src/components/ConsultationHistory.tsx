import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pastConsultations, Consultation, Medication } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageCircle, 
  User, 
  Download, 
  FileText, 
  Activity, 
  Pill, 
  RotateCcw,
  XCircle,
  PlusCircle,
  CalendarDays,
  ChevronDown,
  Printer,
  FileX,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { Link } from 'react-router-dom';

const ConsultationHistory = () => {
  // Ensuring we have valid data by providing default empty array if pastConsultations is undefined
  const [consultations, setConsultations] = useState<Consultation[]>(pastConsultations || []);
  
  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Mock adding a new consultation for testing
  const mockNewConsultation = () => {
    if (pastConsultations && pastConsultations.length > 0) {
      const randomIndex = Math.floor(Math.random() * pastConsultations.length);
      const newConsultation = {
        ...pastConsultations[randomIndex],
        id: Date.now(),
        date: format(new Date(), "yyyy-MM-dd")
      };
      setConsultations(prev => [newConsultation, ...prev]);
    }
  };
  
  // Icon mapping for consultation modes
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'audio':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-emerald-500" />;
      case 'in-person':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const renderMedicationTable = (medications: Medication[]) => {
    if (!medications || medications.length === 0) return null;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Medication</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dosage</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Frequency</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {medications.map((med, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/50'}>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-foreground">{med.name}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground">{med.dosage}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground">{med.frequency}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground">{med.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Filter for upcoming consultations - assuming future dates
  const upcomingConsultations = consultations.filter(c => {
    const consultationDate = new Date(c.date);
    return consultationDate > new Date();
  });
  
  // Filter for consultations with prescriptions
  const prescriptionsConsultations = consultations.filter(c => c.prescription);
  
  return (
    <div className="animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-foreground">Consultation History</h2>
      </div>
      
      <div className="absolute bottom-6 right-6 z-20">
        <div 
          className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-2 cursor-pointer shadow-sm flex items-center text-xs transition-colors"
          onClick={mockNewConsultation}
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> 
          Mock Consultation
        </div>
      </div>
      
      <Tabs defaultValue="all" className="bg-card rounded-xl shadow-sm p-1 mb-6">
        <TabsList className="mb-6 w-full grid grid-cols-3 p-1 bg-muted rounded-lg">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-2.5"
          >
            All Consultations
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-2.5"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="prescriptions" 
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md py-2.5"
          >
            Prescriptions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {consultations.length > 0 ? (
            <div className="space-y-8">
              {consultations.map((consultation) => (
                <div 
                  key={consultation.id}
                  className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
                >
                  <div className="border-b border-border">
                    <div className="flex items-start p-6">
                      <div className="mr-4">
                        <img
                          src={consultation.doctorImage || "https://via.placeholder.com/100"}
                          alt={consultation.doctorName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{consultation.doctorName}</h3>
                          <div className="flex items-center mt-1 sm:mt-0">
                            <CalendarDays className="w-4 h-4 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">{formatDate(consultation.date)}</span>
                            <span className="mx-2 text-muted-foreground/30">|</span>
                            <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">{consultation.time}</span>
                          </div>
                        </div>
                        <p className="text-primary text-sm mb-2">{consultation.doctorSpecialty}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium inline-flex items-center">
                            <Video className="w-3 h-3 mr-1" /> 
                            {consultation.mode}
                          </div>
                          {consultation.followUp && (
                            <div className="bg-green-500/10 text-green-600 dark:text-green-400 rounded-full px-3 py-1 text-xs font-medium inline-flex items-center">
                              <RefreshCw className="w-3 h-3 mr-1" /> 
                              Follow-up: {formatDate(consultation.followUp)}
                            </div>
                          )}
                        </div>
                        <div className="mb-2">
                          <span className="text-sm text-muted-foreground font-medium">Symptoms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {consultation.symptoms.map((symptom, index) => (
                              <span key={index} className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground font-medium">Diagnosis:</span>
                          <p className="text-foreground">{consultation.diagnosis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prescription Panel */}
                  {consultation.prescription && (
                    <div className="p-6 bg-primary/5">
                      <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
                        <AccordionItem value="prescription" className="border-none">
                          <AccordionTrigger className="py-3 px-4 text-sm font-medium hover:bg-muted/50 data-[state=open]:bg-muted/50">
                            <div className="flex items-center text-primary">
                              <Pill className="h-4 w-4 mr-2" />
                              View Prescription
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            {renderMedicationTable(consultation.prescription.medications)}
                            
                            {consultation.prescription.instructions && (
                              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <h5 className="text-sm font-medium mb-1 text-amber-600 dark:text-amber-400">Instructions:</h5>
                                <p className="text-sm text-foreground">{consultation.prescription.instructions}</p>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-bold mb-2 text-foreground">No Consultations Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't had any consultations yet. Start by describing your symptoms.</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = "#symptoms";
                  }}>
                  Start New Consultation
                </Button>
                
                <Button size="sm" onClick={mockNewConsultation}>
                  Generate Sample History (Demo)
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {upcomingConsultations.length > 0 ? (
            <div className="space-y-4">
              {upcomingConsultations.map(consultation => (
                <Card key={consultation.id} className="overflow-hidden border-primary/20 bg-primary/5 hover:shadow-md transition-shadow">
                  <div className="bg-primary h-1.5"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start">
                      <img
                        src={consultation.doctorImage || "https://via.placeholder.com/100"}
                        alt={consultation.doctorName}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-background shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <div>
                        <CardTitle className="text-lg text-foreground">{consultation.doctorName}</CardTitle>
                        <CardDescription className="text-primary font-medium">{consultation.doctorSpecialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-3 text-sm bg-card p-3 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                        <span className="text-foreground font-medium">{consultation.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-primary" />
                        <span className="text-foreground font-medium">{consultation.time}</span>
                      </div>
                      <div className="flex items-center">
                        {getModeIcon(consultation.mode)}
                        <span className="ml-1.5 capitalize text-foreground font-medium">{consultation.mode}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs border-primary/20 text-primary hover:bg-primary/10 gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reschedule
                    </Button>
                    <Button variant="destructive" size="sm" className="text-xs gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-xl border border-border">
              <div className="w-16 h-16 bg-muted/70 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-2">No upcoming consultations.</p>
              <p className="text-sm text-muted-foreground mb-6">Book a consultation to see it here.</p>
              <Button variant="outline" size="sm" onClick={() => document.querySelector('[value="symptoms"]')?.dispatchEvent(new MouseEvent('click'))}>
                Book New Consultation
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="prescriptions">
          {prescriptionsConsultations.length > 0 ? (
            <div className="space-y-4">
              {prescriptionsConsultations
                .map(consultation => (
                  <Card key={consultation.id} className="overflow-hidden border-green-500/20 hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5"></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-foreground flex items-center">
                            <Pill className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                            Prescription #{consultation.prescription?.id}
                          </CardTitle>
                          <CardDescription>
                            {consultation.doctorName} - {consultation.prescription?.date}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/10">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {renderMedicationTable(consultation.prescription!.medications)}
                      
                      {consultation.prescription?.instructions && (
                        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <h5 className="text-sm font-medium mb-1 text-green-600 dark:text-green-400">Instructions:</h5>
                          <p className="text-sm text-foreground">{consultation.prescription!.instructions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg border border-border">
              <div className="w-16 h-16 bg-muted/70 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-2">No prescriptions found.</p>
              <p className="text-sm text-muted-foreground mb-6">Complete a consultation to receive prescriptions.</p>
              <Button variant="outline" size="sm" onClick={() => document.querySelector('[value="symptoms"]')?.dispatchEvent(new MouseEvent('click'))}>
                Start New Consultation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Bottom CTA */}
      {consultations.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="sm" onClick={(e) => {
            e.preventDefault();
            window.location.hash = "#symptoms";
          }}>
            Start New Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory;

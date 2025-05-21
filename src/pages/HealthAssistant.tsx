import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIDiagnosisChat from '../components/AIDiagnosisChat';
import MedicalReportGenerator from '../components/MedicalReportGenerator';
import EmergencyDetectionBadge from '../components/EmergencyDetectionBadge';
import { ArrowLeft, Brain, Stethoscope, AlertCircle, PencilRuler, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalReportData } from '../services/chatService';
import { Button } from '@/components/ui/button';

const HealthAssistant = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [generatedReport, setGeneratedReport] = useState<MedicalReportData | null>(null);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [emergencySymptoms, setEmergencySymptoms] = useState<string[]>([]);
  
  const handleReportGenerated = (reportData: MedicalReportData) => {
    setGeneratedReport(reportData);
    
    // Check for emergency situation
    const emergency = reportData.emergencyDetected || reportData.urgencyLevel === 'urgent';
    if (emergency) {
      setIsEmergency(true);
      setEmergencySymptoms(reportData.symptoms);
    }
    
    // If we generate a report from the report tab, stay there
    // If we're on chat, switch to the report tab
    if (activeTab === 'chat') {
      setActiveTab('report');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Emergency Detection Badge */}
      {generatedReport && (
        <EmergencyDetectionBadge 
          isEmergency={isEmergency}
          urgencyLevel={generatedReport.urgencyLevel}
          symptoms={emergencySymptoms}
        />
      )}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-primary hover:text-primary/90 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              AI Health Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered insights about your symptoms and generate detailed medical reports.
              <span className="block text-sm mt-1 text-red-500 dark:text-red-400">Remember, this is not a substitute for professional medical diagnosis.</span>
            </p>
          </div>
          
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-center mb-6">
              <TabsList className="grid grid-cols-2 p-1 w-96 bg-muted rounded-lg">
                <TabsTrigger 
                  value="chat" 
                  className="flex items-center justify-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md"
                >
                  <Activity className="h-4 w-4" />
                  <span>AI Chat Consultation</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="report" 
                  className="flex items-center justify-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md"
                >
                  <FileText className="h-4 w-4" />
                  <span>Medical Report</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="mt-0">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <AIDiagnosisChat className="h-[600px]" />
                  
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => setActiveTab('report')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Medical Report
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                      <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                      How It Works
                    </h2>
                    <ol className="space-y-3 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="bg-primary/10 h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-primary font-semibold">1</span>
                        <p>Describe your symptoms in detail</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary/10 h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-primary font-semibold">2</span>
                        <p>Get insights about potential conditions</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary/10 h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-primary font-semibold">3</span>
                        <p>Generate a detailed medical report</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary/10 h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-primary font-semibold">4</span>
                        <p>Find appropriate specialists for your symptoms</p>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                      Important Notice
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      This AI assistant provides general information only. It is not a replacement for 
                      professional medical diagnosis, advice, or treatment. Always consult with a 
                      qualified healthcare provider for any medical concerns.
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                      <PencilRuler className="h-5 w-5 mr-2 text-primary" />
                      Tips for Better Results
                    </h2>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>Be specific about your symptoms</li>
                      <li>Include when symptoms started</li>
                      <li>Mention any related medical history</li>
                      <li>Describe severity (mild, moderate, severe)</li>
                      <li>Note anything that makes symptoms better or worse</li>
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Link 
                      to="/doctors" 
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Find a Doctor
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="mt-0">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <MedicalReportGenerator 
                    onComplete={handleReportGenerated} 
                    className="h-full"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      About Medical Reports
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="text-sm">
                        Our AI-powered medical reports provide a comprehensive analysis of your 
                        symptoms, including:
                      </p>
                      <ul className="space-y-2 text-sm list-disc pl-5">
                        <li>Possible underlying conditions</li>
                        <li>Recommended medical specialists</li>
                        <li>Urgency assessment</li>
                        <li>Additional symptoms to watch for</li>
                        <li>Emergency detection for critical symptoms</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-800 dark:text-blue-200">
                      <Stethoscope className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Next Steps
                    </h2>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      After generating your report, you can:
                    </p>
                    <ul className="space-y-2 mt-2 text-blue-700 dark:text-blue-300 text-sm list-disc pl-5">
                      <li>Download or print the report</li>
                      <li>Share it with your healthcare provider</li>
                      <li>Use our platform to find specialists</li>
                      <li>Book a consultation with recommended doctors</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-5">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                      Medical Disclaimer
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      This report is generated using artificial intelligence and is not a 
                      substitute for professional medical advice, diagnosis, or treatment.
                      Always consult with a qualified healthcare provider.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Link 
                      to="/doctors" 
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Find a Doctor
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthAssistant; 
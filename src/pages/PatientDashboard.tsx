import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Star, MessageSquare, Bell } from 'lucide-react';
import ConsultationHistory from '../components/ConsultationHistory';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('appointments');
  
  // Mock data - in a real app, these would come from API calls
  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Cardiologist',
      date: '2025-05-22',
      time: '10:30 AM',
      mode: 'Video Call',
      status: 'confirmed'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Brown',
      doctorSpecialty: 'Dermatologist',
      date: '2025-05-28',
      time: '2:15 PM',
      mode: 'In Person',
      status: 'pending'
    }
  ];
  
  const notifications = [
    {
      id: '1',
      message: 'Your appointment with Dr. Sarah Johnson is scheduled for tomorrow at 10:30 AM',
      date: '2025-05-21',
      isRead: false
    },
    {
      id: '2',
      message: 'Dr. Brown has shared your prescription details',
      date: '2025-05-15',
      isRead: true
    },
    {
      id: '3',
      message: 'Please complete the pre-consultation questionnaire for your upcoming appointment',
      date: '2025-05-14',
      isRead: false
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-primary">JD</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Welcome back, John!</h1>
                  <p className="text-muted-foreground">How are you feeling today?</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Calendar className="mr-2" size={18} />
                  New Consultation
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2" size={18} />
                  Message Doctor
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="mt-0">
              <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-foreground">Upcoming Appointments</h2>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2" size={16} />
                    Schedule New
                  </Button>
                </div>
                
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <h3 className="font-bold text-foreground">{appointment.doctorName}</h3>
                            <span 
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              }`}
                            >
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{appointment.doctorSpecialty}</p>
                          <div className="mt-2">
                            <p className="text-sm text-foreground">
                              {formatDate(appointment.date)} at {appointment.time}
                            </p>
                            <p className="text-sm text-foreground">Mode: {appointment.mode}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {appointment.mode === 'Video Call' && (
                            <Button>Join Call</Button>
                          )}
                          <Button variant="outline">Reschedule</Button>
                          <Button variant="outline" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-muted-foreground/40" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground mb-4">You don't have any scheduled appointments.</p>
                    <Button>Schedule a Consultation</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <ConsultationHistory />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <h2 className="text-xl font-bold mb-6 text-foreground">Notifications</h2>
                
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`border-l-4 ${notification.isRead ? 'border-muted' : 'border-primary'} bg-muted/30 pl-4 py-3 rounded-r-md`}
                      >
                        <div className="flex justify-between">
                          <p className={`${notification.isRead ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-primary ml-2"></span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{formatDate(notification.date)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="mx-auto text-muted-foreground/40" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Notifications</h3>
                    <p className="text-muted-foreground">You're all caught up!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold mb-4 text-foreground">Your Health Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Blood Pressure</span>
                  <span className="font-medium text-foreground">120/80 mmHg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Heart Rate</span>
                  <span className="font-medium text-foreground">72 bpm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Weight</span>
                  <span className="font-medium text-foreground">165 lbs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">BMI</span>
                  <span className="font-medium text-foreground">24.2 (Normal)</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Complete Health Record</Button>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold mb-4 text-foreground">Favorite Doctors</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted mr-3 flex items-center justify-center text-muted-foreground">
                      <span className="text-xs font-medium">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Dr. Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Cardiologist</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400 dark:text-yellow-300 dark:fill-yellow-300" size={16} />
                    <span className="ml-1 text-foreground">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted mr-3 flex items-center justify-center text-muted-foreground">
                      <span className="text-xs font-medium">RC</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Dr. Robert Chen</p>
                      <p className="text-sm text-muted-foreground">Neurologist</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400 dark:text-yellow-300 dark:fill-yellow-300" size={16} />
                    <span className="ml-1 text-foreground">4.7</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View All</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientDashboard;

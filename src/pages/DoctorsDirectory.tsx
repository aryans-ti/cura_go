import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { doctors } from '@/data/mockData';

const DoctorsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract unique specialties from doctors
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">Find the Right Doctor</h1>
          <p className="text-muted-foreground text-center mb-8">Browse our network of qualified healthcare professionals</p>
          
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input 
                  type="text" 
                  placeholder="Search by name, specialty, or condition..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2 text-foreground">
              <Filter size={18} />
              Filter by Specialty
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedSpecialty === null ? "default" : "outline"} 
                onClick={() => setSelectedSpecialty(null)}
                className="text-sm"
              >
                All
              </Button>
              {specialties.map(specialty => (
                <Button 
                  key={specialty} 
                  variant={selectedSpecialty === specialty ? "default" : "outline"}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className="text-sm"
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-border rounded-xl p-4 bg-card">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>
              ))
            ) : (
              filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="doctor-card border border-border rounded-xl p-4 bg-card text-card-foreground hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name} 
                        className="w-16 h-16 rounded-full object-cover mr-4 border border-border"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{doctor.name}</h3>
                        <p className="text-primary">{doctor.specialty}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{doctor.shortBio}</p>
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Experience: {doctor.experience} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">${doctor.consultationFee}</span>
                      <Button asChild>
                        <a href={`/doctor/${doctor.id}`}>View Profile</a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No doctors found matching your criteria</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSpecialty(null);
                    }}
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorsDirectory;

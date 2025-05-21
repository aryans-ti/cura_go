import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Brain, Activity, Zap, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle home navigation with explicit scroll to top
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate("/");
  };

  // Handle AI Health Assistant navigation with explicit scroll to top
  const handleAIAssistantClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate("/health-assistant");
  };

  // Handle other page navigations
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a 
            href="/"
            className="text-primary font-bold text-2xl flex items-center"
            onClick={handleHomeClick}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">CuraGo</span>
            <svg className="ml-1 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="headerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="headerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <circle cx="6" cy="18" r="3" fill="url(#headerGrad1)"/>
              <circle cx="6" cy="18" r="1.5" fill="#1E40AF" className="dark:fill-blue-300"/>
              <path d="M6 15V10C6 7 9 3 14 3C19 3 19 7 19 9V12" stroke="url(#headerGrad2)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 12C20.6569 12 22 13.3431 22 15C22 16.6569 20.6569 18 19 18C17.3431 18 16 16.6569 16 15C16 13.3431 17.3431 12 19 12Z" stroke="url(#headerGrad2)" strokeWidth="2"/>
              <path d="M16 15H10" stroke="url(#headerGrad2)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 15V17.5C10 17.7761 9.77614 18 9.5 18H6" stroke="url(#headerGrad2)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" 
             className="text-foreground hover:text-primary transition-colors duration-200" 
             onClick={handleHomeClick}>
            Home
          </a>
          <a href="/" 
             className="text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1" 
             onClick={handleHomeClick}>
            <Activity className="h-4 w-4 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary transition-colors">AI Symp-to-Doc</span>
          </a>
          <a href="/health-assistant" 
             className="text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center" 
             onClick={handleAIAssistantClick}>
            <Brain className="h-4 w-4 mr-1 text-primary" />
            AI Health Assistant
          </a>
          <a href="/doctors" 
             className="text-foreground hover:text-primary transition-colors duration-200" 
             onClick={(e) => handleNavigation(e, "/doctors")}>
            Doctors
          </a>
          <a href="/about" 
             className="text-foreground hover:text-primary transition-colors duration-200" 
             onClick={(e) => handleNavigation(e, "/about")}>
            About
          </a>
          <a href="/contact" 
             className="text-foreground hover:text-primary transition-colors duration-200" 
             onClick={(e) => handleNavigation(e, "/contact")}>
            Contact
          </a>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" onClick={(e) => handleNavigation(e, "/dashboard")} className="transition-all duration-200 hover:border-primary">
            <User size={18} className="mr-2" />
            Dashboard
          </Button>
          <Button onClick={handleHomeClick} className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary transition-all duration-300">
            <Zap size={16} className="mr-2" />
            Get Care Now
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button 
            className="text-foreground hover:text-primary transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border absolute top-full left-0 right-0 z-20 animate-fade-in shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <a 
              href="/" 
              className="py-2 text-foreground hover:text-primary border-b border-border"
              onClick={handleHomeClick}
            >
              Home
            </a>
            <a 
              href="/" 
              className="py-2 font-medium border-b border-border flex items-center gap-1"
              onClick={handleHomeClick}
            >
              <Activity className="h-4 w-4 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">AI Symp-to-Doc</span>
            </a>
            <a 
              href="/health-assistant" 
              className="py-2 text-foreground hover:text-primary border-b border-border flex items-center"
              onClick={handleAIAssistantClick}
            >
              <Brain className="h-4 w-4 mr-1 text-primary" />
              AI Health Assistant
            </a>
            <a 
              href="/doctors" 
              className="py-2 text-foreground hover:text-primary border-b border-border"
              onClick={(e) => handleNavigation(e, "/doctors")}
            >
              Doctors
            </a>
            <a 
              href="/about" 
              className="py-2 text-foreground hover:text-primary border-b border-border"
              onClick={(e) => handleNavigation(e, "/about")}
            >
              About
            </a>
            <a 
              href="/contact" 
              className="py-2 text-foreground hover:text-primary border-b border-border"
              onClick={(e) => handleNavigation(e, "/contact")}
            >
              Contact
            </a>
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" className="w-full transition-all duration-200 hover:border-primary" onClick={(e) => handleNavigation(e, "/dashboard")}>
                <User size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary transition-all duration-300" onClick={handleHomeClick}>
                <Zap size={16} className="mr-2" />
                Get Care Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">CuraGo</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized medical advice from qualified doctors based on your symptoms.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 5.16c-.7.31-1.44.52-2.23.62.8-.48 1.42-1.24 1.7-2.15-.75.44-1.59.77-2.47.94a3.87 3.87 0 00-6.6 3.53A11 11 0 015 4.26a3.87 3.87 0 001.2 5.16c-.63-.02-1.23-.19-1.74-.47v.05a3.87 3.87 0 003.1 3.79 3.88 3.88 0 01-1.75.07 3.87 3.87 0 003.6 2.7 7.76 7.76 0 01-4.8 1.65c-.32 0-.62-.02-.93-.05A10.97 10.97 0 0018 20c7.16 0 11.08-5.93 11.08-11.08 0-.17 0-.34-.01-.5.75-.55 1.41-1.23 1.93-2.01z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8.5 17.5h-3v-9h3v9zM7 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 10.5h-3v-4.39c0-1.12-.02-2.56-1.55-2.56-1.55 0-1.79 1.22-1.79 2.48v4.47h-3v-9h2.88v1.32h.04c.4-.76 1.37-1.55 2.82-1.55 3.01 0 3.57 1.98 3.57 4.56v4.67z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/doctors" className="text-muted-foreground hover:text-primary transition-colors">Find Doctors</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Patient Dashboard</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Download Our App</h3>
            <p className="text-muted-foreground mb-4">
              Get our mobile app for a better experience on the go.
            </p>
            <div className="space-y-2">
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
              </a>
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" className="h-10 rounded" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CuraGo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors text-sm">Privacy Policy</Link>
            <a href="#" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary dark:text-blue-100 dark:hover:text-blue-300 transition-colors text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

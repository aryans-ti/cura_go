import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-8 border border-border">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>
          
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last Updated: June 15, 2023
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to CuraGo. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, regardless of where you visit it from, and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="text-muted-foreground">
                This privacy policy applies to all personal data collected through our website, mobile applications, and any related services, sales, marketing or events.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect several different types of information for various purposes to provide and improve our service to you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>
                  <strong className="text-foreground">Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Address</li>
                    <li>Date of birth</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-foreground">Health Information:</strong> To provide our service, we collect information about your symptoms, health conditions, and medical history that you choose to share.
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong> We may also collect information on how the service is accessed and used. This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
                </li>
                <li>
                  <strong className="text-foreground">Cookies and Tracking Data:</strong> We use cookies and similar tracking technologies to track the activity on our service and hold certain information.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our service</li>
                <li>To match you with appropriate healthcare providers</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
              </p>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to maintain a level of security appropriate to the risk, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Encryption of sensitive data</li>
                <li>Pseudonymization where appropriate</li>
                <li>Regular security assessments</li>
                <li>Regular staff training on data protection</li>
                <li>Access controls to personal data</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Data Sharing and Third Parties</h2>
              <p className="text-muted-foreground mb-4">
                We may share your personal information in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">With Healthcare Providers:</strong> We share your information with the healthcare providers you choose to consult with through our platform.
                </li>
                <li>
                  <strong className="text-foreground">With Service Providers:</strong> We may share your information with third-party service providers to perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service and marketing assistance.
                </li>
                <li>
                  <strong className="text-foreground">For Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </li>
                <li>
                  <strong className="text-foreground">With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.
                </li>
                <li>
                  <strong className="text-foreground">Legal Requirements:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Your Data Protection Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have certain data protection rights. Depending on your location, these might include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>The right to access, update or delete the information we have on you</li>
                <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
                <li>The right to object - the right to object to our processing of your personal data</li>
                <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
                <li>The right to data portability - the right to receive a copy of your personal data in a structured, machine-readable format</li>
                <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>By email: <a href="mailto:privacy@curago.com" className="text-primary hover:underline">privacy@curago.com</a></li>
                <li>By phone: +1 (555) 123-4567</li>
                <li>By mail: 123 Medical Plaza, Healthcare City, 12345</li>
              </ul>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground text-center">
              By using our service, you acknowledge that you have read and understand this Privacy Policy.
            </p>
            <div className="flex justify-center mt-6">
              <Link to="/" className="text-primary hover:underline">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 
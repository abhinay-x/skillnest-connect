import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">SkillNest</h3>
            <p className="text-gray-400 text-sm leading-snug">
              Connecting customers with trusted professionals.
            </p>
          </div>
          
          {/* Services Section */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Services</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Plumbing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Electrical</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Painting</Link></li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Company</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:r.abhinaychary@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>r.abhinaychary@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+917013931906" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+91-7013931906</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>#</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-4 md:mt-6 pt-4 text-center text-gray-400 text-xs md:text-sm">
          <p>&copy; 2024 SkillNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

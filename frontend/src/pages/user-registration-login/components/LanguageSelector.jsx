import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'mr', label: 'मराठी' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'bn', label: 'বাংলা' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('skillnest_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('skillnest_language', language);
    // In a real app, this would trigger a language change across the entire application
  };

  return (
    <div className="flex items-center space-x-2">
      <Icon name="Globe" size={16} className="text-text-secondary" />
      <Select
        options={languageOptions}
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="w-32"
      />
    </div>
  );
};

export default LanguageSelector;
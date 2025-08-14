import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const VoiceSearchInput = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search for services, professionals, or tools..." 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Mock search suggestions
  const mockSuggestions = [
    'Plumbing repair near me',
    'Electrical installation',
    'House cleaning services',
    'Carpentry work',
    'AC repair and maintenance',
    'Painting services',
    'Appliance repair',
    'Home security installation'
  ];

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        onChange(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onChange]);

  const handleInputChange = (e) => {
    const inputValue = e?.target?.value;
    onChange(inputValue);
    
    if (inputValue?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(inputValue?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef?.current && !isListening) {
      recognitionRef?.current?.start();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      onSearch(value);
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (value?.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-text-secondary" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-4 text-lg border-2 border-border rounded-xl bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth shadow-elevation-1"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
          <button
            onClick={handleVoiceSearch}
            disabled={!recognitionRef?.current}
            className={`p-2 rounded-lg transition-smooth ${
              isListening 
                ? 'bg-error text-error-foreground animate-pulse' 
                : 'text-text-secondary hover:text-primary hover:bg-primary/10'
            } ${!recognitionRef?.current ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isListening ? 'Listening...' : 'Voice search'}
          >
            <Icon name={isListening ? "MicOff" : "Mic"} size={20} />
          </button>
          
          <button
            onClick={() => onSearch(value)}
            disabled={!value?.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="Search" size={20} />
          </button>
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-elevation-3 z-50 animate-fade-in">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl"
            >
              <Icon name="Search" size={16} className="text-text-secondary" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
      {/* Voice Search Status */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-error/10 border border-error/20 rounded-xl p-4 text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-error">
            <Icon name="Mic" size={20} className="animate-pulse" />
            <span className="font-medium">Listening... Speak now</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSearchInput;
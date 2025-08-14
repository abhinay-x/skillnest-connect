import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import WorkerHero from './components/WorkerHero';
import WorkerTabs from './components/WorkerTabs';
import OverviewTab from './components/OverviewTab';
import ExperienceTab from './components/ExperienceTab';
import SkillsTab from './components/SkillsTab';
import PortfolioTab from './components/PortfolioTab';
import ReviewsTab from './components/ReviewsTab';
import PricingTab from './components/PricingTab';
import AvailabilityCalendar from './components/AvailabilityCalendar';

const WorkerProfilePortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const { workerId } = useParams();

  // Mock worker data
  const worker = {
    id: "worker_001",
    name: "Rajesh Kumar",
    specialization: "Electrical & Plumbing Expert",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 127,
    trustScore: 95,
    location: "Koramangala, Bangalore",
    responseTime: "15 mins",
    isOnline: true,
    isPremium: true,
    completedJobs: 245,
    experience: 8,
    completionRate: 98,
    phone: "9876543210",
    email: "rajesh.kumar@skillnest.com",
    address: "HSR Layout, Bangalore, Karnataka 560102",
    nextAvailable: "Today 2:00 PM",
    emergencyServices: true,
    bio: `Experienced electrical and plumbing professional with over 8 years of expertise in residential and commercial projects. Specialized in smart home installations, water heater repairs, and electrical troubleshooting. Committed to delivering quality work with transparent pricing and excellent customer service.

I take pride in my work and ensure every project meets the highest standards. My goal is to build long-term relationships with clients through reliable service and honest communication.`,
    serviceAreas: [
      "Koramangala", "HSR Layout", "BTM Layout", "Jayanagar", 
      "JP Nagar", "Electronic City", "Whitefield", "Indiranagar"
    ],
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    workingHours: [
      { day: "Monday", hours: "8:00 AM - 8:00 PM" },
      { day: "Tuesday", hours: "8:00 AM - 8:00 PM" },
      { day: "Wednesday", hours: "8:00 AM - 8:00 PM" },
      { day: "Thursday", hours: "8:00 AM - 8:00 PM" },
      { day: "Friday", hours: "8:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Emergency Only" }
    ],
    verifications: {
      aadhaar: true,
      pan: true,
      background: true,
      phone: true
    },
    experience_timeline: [
      {
        position: "Senior Electrical Technician",
        company: "PowerTech Solutions",
        startDate: "2020-01-01",
        endDate: null,
        description: "Leading electrical installations and maintenance for residential and commercial properties. Specializing in smart home automation and energy-efficient solutions.",
        achievements: [
          "Completed 150+ smart home installations",
          "Achieved 99% customer satisfaction rating",
          "Trained 5 junior technicians"
        ],
        skills: ["Smart Home Automation", "Solar Panel Installation", "Electrical Troubleshooting"]
      },
      {
        position: "Plumbing & Electrical Contractor",
        company: "HomeServe India",
        startDate: "2018-03-01",
        endDate: "2019-12-31",
        description: "Handled diverse plumbing and electrical projects including bathroom renovations, kitchen installations, and emergency repairs.",
        achievements: [
          "Managed 200+ service calls annually",
          "Reduced average repair time by 30%",
          "Implemented quality control processes"
        ],
        skills: ["Bathroom Renovation", "Kitchen Plumbing", "Emergency Repairs"]
      },
      {
        position: "Electrical Apprentice",
        company: "Bangalore Electrical Works",
        startDate: "2016-06-01",
        endDate: "2018-02-28",
        description: "Started career as apprentice, learning fundamental electrical and plumbing skills under experienced professionals.",
        achievements: [
          "Completed 500+ hours of training",
          "Earned electrical safety certification",
          "Assisted in major commercial projects"
        ],
        skills: ["Basic Electrical", "Safety Protocols", "Tool Maintenance"]
      }
    ],
    projectsCompleted: 245,
    clientsServed: 180,
    specializations: [
      "Smart Home Installation",
      "Water Heater Repair",
      "Electrical Troubleshooting",
      "Bathroom Plumbing",
      "Kitchen Electrical Work"
    ],
    education: [
      {
        degree: "Diploma in Electrical Engineering",
        institution: "Government Polytechnic, Bangalore",
        year: "2016"
      }
    ],
    licenses: [
      {
        name: "Electrical Contractor License",
        issuer: "Karnataka Electrical Board",
        expiryDate: "2025-12-31"
      },
      {
        name: "Plumbing Certification",
        issuer: "Indian Plumbing Association",
        expiryDate: "2024-06-30"
      }
    ],
    skills: {
      technical: [
        { name: "Electrical Wiring", level: "Expert", yearsOfExperience: 8 },
        { name: "Plumbing Installation", level: "Expert", yearsOfExperience: 7 },
        { name: "Smart Home Automation", level: "Advanced", yearsOfExperience: 4 },
        { name: "Solar Panel Installation", level: "Advanced", yearsOfExperience: 3 },
        { name: "HVAC Systems", level: "Intermediate", yearsOfExperience: 2 },
        { name: "Water Heater Repair", level: "Expert", yearsOfExperience: 6 }
      ],
      tools: [
        { name: "Multimeter", proficiency: "Expert" },
        { name: "Pipe Wrench Set", proficiency: "Expert" },
        { name: "Drill Machine", proficiency: "Advanced" },
        { name: "Wire Strippers", proficiency: "Expert" },
        { name: "Soldering Iron", proficiency: "Advanced" },
        { name: "Pipe Cutter", proficiency: "Expert" }
      ],
      soft: [
        "Problem Solving", "Time Management", "Customer Communication",
        "Team Leadership", "Quality Focus", "Safety Conscious"
      ]
    },
    certifications: [
      {
        name: "Smart Home Installation Certification",
        issuer: "Home Automation Institute",
        issueDate: "2023-03-15",
        verificationUrl: "https://example.com/verify/123"
      },
      {
        name: "Electrical Safety Certification",
        issuer: "National Safety Council",
        issueDate: "2022-11-20",
        verificationUrl: "https://example.com/verify/456"
      }
    ],
    verifiedSkills: [
      "Electrical Wiring", "Plumbing Installation", "Smart Home Setup", "Emergency Repairs"
    ],
    trainingPrograms: [
      {
        name: "Advanced Solar Panel Installation",
        completedDate: "2023-08-15"
      },
      {
        name: "Customer Service Excellence",
        completedDate: "2023-06-10"
      }
    ],
    portfolio: [
      {
        title: "Smart Home Automation - Villa Project",
        description: "Complete smart home setup including lighting automation, security systems, and climate control for a 3BHK villa in Whitefield.",
        category: "residential",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
        ],
        completedDate: "2023-11-15",
        duration: "5 days",
        rating: 5,
        challenges: "Integrating multiple smart devices with existing electrical infrastructure while maintaining aesthetic appeal.",
        testimonial: {
          clientName: "Priya Sharma",
          comment: "Excellent work! The smart home setup exceeded our expectations. Very professional and knowledgeable."
        }
      },
      {
        title: "Commercial Kitchen Plumbing",
        description: "Complete plumbing installation for a restaurant kitchen including dishwasher connections, grease trap installation, and water filtration system.",
        category: "commercial",
        images: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
        ],
        completedDate: "2023-10-22",
        duration: "3 days",
        rating: 5,
        testimonial: {
          clientName: "Restaurant Owner",
          comment: "Professional service with attention to health code requirements. Highly recommended!"
        }
      },
      {
        title: "Bathroom Renovation - Complete Electrical & Plumbing",
        description: "Full bathroom renovation including new electrical wiring, plumbing fixtures, water heater installation, and exhaust fan setup.",
        category: "renovation",
        images: [
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop"
        ],
        completedDate: "2023-09-18",
        duration: "4 days",
        rating: 5,
        testimonial: {
          clientName: "Amit Patel",
          comment: "Transformed our old bathroom completely. Great attention to detail and clean work."
        }
      }
    ],
    videoShowcases: [
      {
        title: "Smart Home Installation Process",
        description: "Step-by-step process of installing a complete smart home automation system",
        duration: "3:45"
      },
      {
        title: "Emergency Electrical Repair",
        description: "Quick troubleshooting and repair of electrical issues in residential property",
        duration: "2:30"
      }
    ],
    reviews: [
      {
        reviewerName: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2023-11-20",
        serviceType: "Smart Home Installation",
        comment: "Rajesh did an amazing job with our smart home setup. He was punctual, professional, and explained everything clearly. The work quality is excellent and he even provided tips for maintenance. Highly recommend!",
        categories: {
          quality: 5,
          punctuality: 5,
          communication: 5,
          cleanliness: 4
        },
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop"
        ],
        helpfulCount: 12,
        workerResponse: "Thank you Priya! It was a pleasure working on your smart home project. I'm glad you're happy with the results. Please don't hesitate to reach out if you need any assistance."
      },
      {
        reviewerName: "Amit Patel",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2023-11-15",
        serviceType: "Bathroom Renovation",
        comment: "Excellent service! Rajesh completed our bathroom renovation on time and within budget. His attention to detail is impressive and he kept the work area clean throughout the project.",
        categories: {
          quality: 5,
          punctuality: 5,
          communication: 4,
          cleanliness: 5
        },
        helpfulCount: 8
      },
      {
        reviewerName: "Sunita Reddy",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        date: "2023-11-10",
        serviceType: "Water Heater Repair",
        comment: "Good service and fair pricing. Rajesh quickly identified the issue with our water heater and fixed it efficiently. Would call him again for future electrical work.",
        categories: {
          quality: 4,
          punctuality: 4,
          communication: 4,
          cleanliness: 4
        },
        helpfulCount: 5
      }
    ],
    services: [
      {
        name: "Electrical Installation",
        description: "Complete electrical wiring and fixture installation",
        minPrice: 800,
        maxPrice: 1500,
        unit: "hour",
        duration: "2-8 hours",
        includes: [
          "Material cost estimation",
          "Professional installation",
          "Safety testing",
          "1 year warranty"
        ],
        additionalCharges: [
          { name: "Premium fixtures", price: 500 },
          { name: "Emergency service", price: 300 }
        ]
      },
      {
        name: "Plumbing Repair",
        description: "Pipe repair, leak fixing, and fixture replacement",
        minPrice: 600,
        maxPrice: 1200,
        unit: "hour",
        duration: "1-4 hours",
        includes: [
          "Problem diagnosis",
          "Repair work",
          "Quality testing",
          "6 months warranty"
        ]
      },
      {
        name: "Smart Home Setup",
        description: "Complete smart home automation installation",
        minPrice: 2000,
        maxPrice: 5000,
        unit: "project",
        duration: "1-3 days",
        includes: [
          "Device configuration",
          "App setup",
          "User training",
          "2 years warranty"
        ]
      }
    ],
    packages: [
      {
        name: "Home Maintenance Package",
        description: "Monthly electrical and plumbing maintenance",
        price: 2500,
        originalPrice: 3000,
        savings: 500,
        popular: true,
        services: [
          "Monthly electrical checkup",
          "Plumbing inspection",
          "Minor repairs included",
          "Priority booking",
          "24/7 emergency support"
        ]
      },
      {
        name: "Smart Home Starter",
        description: "Basic smart home automation setup",
        price: 15000,
        services: [
          "Smart lighting (5 points)",
          "Smart switches (3 units)",
          "Mobile app setup",
          "Basic automation rules"
        ]
      }
    ],
    paymentMethods: [
      "Cash on Completion",
      "UPI/Digital Payments",
      "Credit/Debit Cards",
      "Net Banking",
      "SkillNest Wallet"
    ],
    advancePayment: 20,
    cancellationPolicy: "Free cancellation up to 2 hours before",
    minimumBooking: "2 hours",
    freeServiceRadius: "10 km",
    warrantyPeriod: "1 year",
    availability: [
      {
        date: "2024-08-14",
        slots: [
          { startTime: "09:00", duration: "2 hrs", status: "available" },
          { startTime: "11:00", duration: "2 hrs", status: "booked" },
          { startTime: "14:00", duration: "3 hrs", status: "available" },
          { startTime: "17:00", duration: "2 hrs", status: "available" }
        ]
      },
      {
        date: "2024-08-15",
        slots: [
          { startTime: "08:00", duration: "4 hrs", status: "available" },
          { startTime: "13:00", duration: "2 hrs", status: "busy" },
          { startTime: "16:00", duration: "3 hrs", status: "available" }
        ]
      },
      {
        date: "2024-08-16",
        slots: [
          { startTime: "10:00", duration: "2 hrs", status: "available" },
          { startTime: "14:00", duration: "4 hrs", status: "available" },
          { startTime: "18:00", duration: "2 hrs", status: "available" }
        ]
      }
    ]
  };

  const handleBookNow = (service = null) => {
    navigate('/booking-scheduling', { 
      state: { 
        workerId: worker?.id, 
        workerName: worker?.name,
        service: service 
      } 
    });
  };

  const handleRequestQuote = (service = null) => {
    navigate('/booking-scheduling', { 
      state: { 
        workerId: worker?.id, 
        workerName: worker?.name,
        service: service,
        requestQuote: true
      } 
    });
  };

  const handleMessage = () => {
    // In a real app, this would open a chat interface
    alert('Chat feature would open here');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleTimeSlotSelect = (selectedSlot) => {
    console.log('Selected time slot:', selectedSlot);
  };

  const shareUrl = window.location?.href;
  const shareText = `Check out ${worker?.name} on SkillNest - ${worker?.specialization}`;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab worker={worker} />;
      case 'experience':
        return <ExperienceTab worker={worker} />;
      case 'skills':
        return <SkillsTab worker={worker} />;
      case 'portfolio':
        return <PortfolioTab worker={worker} />;
      case 'reviews':
        return <ReviewsTab worker={worker} />;
      case 'pricing':
        return <PricingTab 
          worker={worker} 
          onBookNow={handleBookNow}
          onRequestQuote={handleRequestQuote}
        />;
      default:
        return <OverviewTab worker={worker} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb />
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
              iconPosition="left"
            >
              {isBookmarked ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
      {/* Worker Hero Section */}
      <WorkerHero
        worker={worker}
        onBookNow={handleBookNow}
        onRequestQuote={handleRequestQuote}
        onMessage={handleMessage}
      />
      {/* Navigation Tabs */}
      <WorkerTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        worker={worker}
      />
      {/* Tab Content */}
      <div className="min-h-screen">
        {renderTabContent()}
      </div>
      {/* Availability Calendar - Show on overview and pricing tabs */}
      {(activeTab === 'overview' || activeTab === 'pricing') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <AvailabilityCalendar
            worker={worker}
            onTimeSlotSelect={handleTimeSlotSelect}
            onBookNow={handleBookNow}
          />
        </div>
      )}
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Share Profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{worker?.name}</h4>
                  <p className="text-sm text-text-secondary">{worker?.specialization}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigator.share({ title: shareText, url: shareUrl })}
                  className="flex items-center justify-center space-x-2 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
                >
                  <Icon name="Share" size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  className="flex items-center justify-center space-x-2 p-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-smooth"
                >
                  <Icon name="Copy" size={16} />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="lg"
          onClick={handleBookNow}
          iconName="Calendar"
          iconPosition="left"
          className="shadow-elevation-3"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default WorkerProfilePortfolio;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, Users, ArrowRight, CheckCircle, Menu, X, Sparkles, Zap, Award, TrendingUp, Play, ChevronRight } from 'lucide-react';
import Footer from '../components/ui/Footer';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    { name: 'Plumbing', icon: '🔧', count: '150+ workers' },
    { name: 'Electrical', icon: '⚡', count: '120+ workers' },
    { name: 'Cleaning', icon: '🧹', count: '200+ workers' },
    { name: 'Painting', icon: '🎨', count: '80+ workers' },
    { name: 'Carpentry', icon: '🔨', count: '90+ workers' },
    { name: 'AC Repair', icon: '❄️', count: '60+ workers' }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Verified Professionals',
      description: 'All workers are background checked and verified for your safety'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: 'Top Rated Service',
      description: 'Highly rated professionals with proven track records'
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: 'Quick Response',
      description: 'Get connected with nearby professionals within minutes'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Trusted Community',
      description: 'Join thousands of satisfied customers and skilled workers'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Found an excellent plumber within 10 minutes. Great service!',
      service: 'Plumbing'
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'The electrician was professional and fixed my issue quickly.',
      service: 'Electrical'
    },
    {
      name: 'Anita Singh',
      rating: 5,
      comment: 'Amazing cleaning service. My house looks brand new!',
      service: 'Cleaning'
    }
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Hero Background Effects - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-5 md:top-20 md:left-10 w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-20 right-5 md:top-40 md:right-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-10 left-1/4 md:bottom-20 md:left-1/3 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-indigo-400/25 to-blue-500/25 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Floating Badge - Responsive */}
            <div className="inline-flex items-center backdrop-blur-lg bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-500 mr-2 group-hover:animate-spin" />
              <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Trusted by 50,000+ customers
              </span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-blue-500 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent animate-gradient">
                Find Trusted
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-reverse">
                Professionals
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Near You
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Connect with <span className="font-semibold text-blue-600 dark:text-blue-400">verified skilled workers</span> for all your home service needs. 
              From plumbing to painting, get quality work done by <span className="font-semibold text-purple-600 dark:text-purple-400">trusted professionals</span>.
            </p>
            
            {/* Enhanced Search Bar - Responsive */}
            <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mb-8 md:mb-12 px-4">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-2 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-2 md:gap-3">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-blue-500 group-hover:text-purple-500 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      className="w-full pl-10 md:pl-12 pr-3 py-3 md:py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-base md:text-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <span className="relative z-10 flex items-center justify-center">
                      <Search className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-pulse" />
                      Search
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:animate-spin" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
              
              {/* Popular Search Tags - Responsive */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-6">
                {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'AC Repair'].map((tag, index) => (
                  <button
                    key={index}
                    className="backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:scale-105 transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 md:px-10 md:py-5 rounded-2xl text-base md:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center w-full sm:w-auto min-w-[240px] sm:min-w-[280px]"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:animate-bounce" />
                  Find Services
                  <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/signup?type=worker"
                className="group relative overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-white px-6 py-4 md:px-10 md:py-5 rounded-2xl text-base md:text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center w-full sm:w-auto min-w-[240px] sm:min-w-[280px]"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Award className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:animate-pulse text-purple-600 dark:text-purple-400" />
                  Join as Professional
                  <TrendingUp className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-2 transition-transform duration-300 text-blue-600 dark:text-blue-400" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            
            {/* Stats Section - Responsive */}
            <div className="grid grid-cols-2 gap-4 mt-12 md:mt-16 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
              {[
                { number: '50K+', label: 'Happy Customers', icon: Users },
                { number: '10K+', label: 'Skilled Workers', icon: Award },
                { number: '99%', label: 'Success Rate', icon: TrendingUp },
                { number: '24/7', label: 'Support', icon: Clock }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
                        {stat.number}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Effects - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-5 right-5 md:top-10 md:right-10 lg:right-20 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 lg:left-20 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            {/* Section Badge - Responsive */}
            <div className="inline-flex items-center backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 shadow-xl">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 mr-2 animate-pulse" />
              <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Most Popular
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Popular Services
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
              Discover our most requested services from <span className="font-semibold text-blue-600 dark:text-blue-400">trusted professionals</span>
            </p>
          </div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={`/services/${service.name.toLowerCase()}`}
                className="group relative overflow-hidden text-center p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 md:hover:-translate-y-3"
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Icon Container - Responsive */}
                <div className="relative z-10 mb-4 md:mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <div className="text-2xl sm:text-3xl md:text-4xl group-hover:animate-bounce">
                      {service.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text mb-2 md:mb-3 transition-all duration-300">
                  {service.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3 md:mb-4">
                  {service.count}
                </p>
                
                {/* Explore Button - Responsive */}
                <div className="relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <div className="inline-flex items-center backdrop-blur-sm bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* View All Button - Responsive */}
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/services"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Why Choose SkillNest?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
              We make finding trusted professionals simple and safe
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600/50 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="transform transition-transform duration-300 hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
              Get your work done in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl lg:max-w-6xl mx-auto">
            {[
              { number: '1', title: 'Tell us what you need', description: 'Describe your project and get matched with skilled professionals' },
              { number: '2', title: 'Choose your professional', description: 'Review profiles, ratings, and quotes to find the perfect match' },
              { number: '3', title: 'Get it done', description: 'Schedule the work and pay securely through our platform' }
            ].map((step, index) => (
              <div key={index} className="text-center bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
              Join thousands of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-700/80 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mr-2 md:mr-3 shadow-md">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm md:text-base">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.service}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
            Join SkillNest today and connect with trusted professionals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm md:text-base lg:text-lg font-medium hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Find Services
            </Link>
            <Link
              to="/signup?type=worker"
              className="bg-blue-800/80 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm md:text-base lg:text-lg font-medium hover:bg-blue-900 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-blue-400/50 shadow-md"
            >
              Become a Professional
            </Link>
          </div>
        </div>
      </section>
      
    </div>
   
    </>
  );
};

export default Home;

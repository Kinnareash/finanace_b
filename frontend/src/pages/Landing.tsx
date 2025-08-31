import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  PieChart, 
  Receipt, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Landing: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'benefits', 'testimonials'];
      const scrollPosition = window.scrollY + 100; // Offset for fixed nav

      for (const section of sections) {
        const element = section === 'home' 
          ? document.querySelector('.hero-section')
          : document.getElementById(section);
        
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinanceTracker</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#home" 
                className={`${activeSection === 'home' ? 'text-white' : 'text-white/80'} hover:text-white transition-all duration-300 hover:scale-105 relative group`}
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${activeSection === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
              <a 
                href="#features" 
                className={`${activeSection === 'features' ? 'text-white' : 'text-white/80'} hover:text-white transition-all duration-300 hover:scale-105 relative group`}
              >
                Features
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
              <a 
                href="#benefits" 
                className={`${activeSection === 'benefits' ? 'text-white' : 'text-white/80'} hover:text-white transition-all duration-300 hover:scale-105 relative group`}
              >
                Benefits
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${activeSection === 'benefits' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
              <a 
                href="#testimonials" 
                className={`${activeSection === 'testimonials' ? 'text-white' : 'text-white/80'} hover:text-white transition-all duration-300 hover:scale-105 relative group`}
              >
                Reviews
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${activeSection === 'testimonials' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            </div>
            
            <Link 
              to="/auth" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-white/90">Budget smarter, save easier</span>
              {/* <div className="ml-2 px-2 py-1 bg-blue-600 text-xs font-bold text-white rounded-full">NEW</div> */}
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Take Control of Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Financial Future
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your personal finances with intelligent tracking, automated categorization, 
              and powerful analytics. Make informed decisions with real-time insights.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/auth" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
              >
                <span className="font-semibold">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth?mode=signup" 
                className="px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to manage your finances effectively in one comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: Receipt,
                title: "Smart Receipt Scanning",
                description: "Upload receipts and let AI automatically extract and categorize transaction data"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Visualize spending patterns with interactive charts and detailed reports"
              },
              {
                icon: PieChart,
                title: "Category Insights",
                description: "Understand where your money goes with intelligent spending categorization"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your financial data is protected with enterprise-grade encryption"
              },
              {
                icon: TrendingUp,
                title: "Goal Tracking",
                description: "Set and monitor financial goals with progress tracking and insights"
              },
              {
                icon: Users,
                title: "Multi-Account Support",
                description: "Manage multiple accounts and get a unified view of your finances"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-800/30 to-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose FinanceTracker?
              </h2>
              <div className="space-y-6">
                {[
                  "Save 10+ hours per month on financial management",
                  "Reduce unnecessary spending by up to 30%",
                  "Never miss a bill or payment deadline",
                  "Make data-driven financial decisions",
                  "Achieve your savings goals faster"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-2xl border border-blue-500/30">
                  <div className="bg-slate-900/50 p-6 rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/70">Monthly Savings</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">₹2,847</div>
                  <div className="text-green-500 text-sm">+23% from last month</div>
                </div>                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl">
                    <div className="text-white/70 text-sm mb-1">Expenses</div>
                    <div className="text-xl font-semibold text-white">₹4,231</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl">
                    <div className="text-white/70 text-sm mb-1">Income</div>
                    <div className="text-xl font-semibold text-white">₹7,078</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by Thousands</h2>
            <p className="text-xl text-white/70">See what our users have to say about their experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                content: "FinanceTracker has completely transformed how I manage my business expenses. The receipt scanning feature alone saves me hours each week.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content: "The analytics dashboard gives me insights I never had before. I've already saved over ₹500 this month by identifying unnecessary subscriptions.",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Financial Advisor",
                content: "I recommend FinanceTracker to all my clients. It's intuitive, secure, and provides the detailed tracking they need for financial success.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/70 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of users who have already taken control of their financial future
          </p>
          <Link 
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg space-x-2 font-semibold"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinanceTracker</span>
            </div>
            
            <div className="text-white/70 text-sm">
              © 2025 FinanceTracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

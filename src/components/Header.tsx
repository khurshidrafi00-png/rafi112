import React from 'react';
import { Phone, MapPin, Globe, Menu, X, Calendar, Activity } from 'lucide-react';

interface HeaderProps {
  lang: 'BD' | 'EN';
  setLang: (lang: 'BD' | 'EN') => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  scrollToSection: (id: string) => void;
  onOpenBooking: () => void;
}

export default function Header({
  lang,
  setLang,
  activeSection,
  setActiveSection,
  scrollToSection,
  onOpenBooking
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { id: 'home', labelBD: 'মূল পাতা', labelEN: 'Home' },
    { id: 'doctors', labelBD: 'বিশেষজ্ঞ ডাক্তার', labelEN: 'Find Doctors' },
    { id: 'diagnostics', labelBD: 'ল্যাব ও প্যাথলজি টেস্ট', labelEN: 'Pathology & USG' },
    { id: 'ot-services', labelBD: 'অপারেশন সুবিধা', labelEN: 'Surgical Services' },
    { id: 'payments', labelBD: 'পেমেন্ট পোর্টাল', labelEN: 'Pay Online' },
    { id: 'contact', labelBD: 'ঠিকানা ও যোগাযোগ', labelEN: 'Location & Info' },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'BD' ? 'EN' : 'BD');
  };

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full z-50 sticky top-0 bg-white border-b border-gray-100 shadow-xs">
      {/* Premium Top Info Utilities */}
      <div className="bg-[#0b2447] text-white py-2 px-4 transition-all text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-200">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#1ac0c6]" />
              {lang === 'BD' 
                ? 'খোর্দ্দ সাপটানা, বিডিআর রোড, লালমনিরহাট' 
                : 'Khordda Sapatana, BDR Road, Lalmonirhat'
              }
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
              <Phone className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              {lang === 'BD' ? 'জরুরি সিরিয়াল:' : 'For Appointment:'} +8801797-975461, 01705-485643
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'BD' ? 'English' : 'বাংলা'}
            </button>
            <span className="hidden sm:inline-block text-[11px] bg-red-600 px-2 py-0.5 rounded text-white font-bold uppercase animate-pulse">
              {lang === 'BD' ? '১২টি বিভাগ খোলা' : '12+ Departments Open'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Responsive Header */}
      <nav id="nav-container" className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Hospital Branding */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center border border-gray-100 p-0.5 group-hover:scale-105 transition-all">
            <img 
              src="/src/assets/images/regenerated_image_1779392885116.jpg" 
              alt="Niramoy Clinic Logo" 
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-[360deg]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#0b2447] flex items-center gap-1">
              {lang === 'BD' ? 'নিরাময়' : 'Niramoy'} 
              <span className="text-[#198a96] font-medium text-lg md:text-xl">
                {lang === 'BD' ? 'ক্লিনিক' : 'Clinic'}
              </span>
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide leading-none">
              {lang === 'BD' 
                ? 'এন্ড ডায়াগনোসিস সেন্টার, লালমনিরহাট সদর' 
                : '& Diagnosis Center, Lalmonirhat Sadar'
              }
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Evercare style) */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-2 px-1 cursor-pointer transition-colors hover:text-[#0b2447] text-[15px] ${
                      isActive ? 'text-[#198a96] font-bold' : 'text-gray-600'
                    }`}
                  >
                    {lang === 'BD' ? item.labelBD : item.labelEN}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#198a96] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <button 
            onClick={onOpenBooking}
            className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-[#198a96] to-[#126b75] hover:from-[#126b75] hover:to-[#0a464d] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-[#198a96]/15"
          >
            <Calendar className="w-4 h-4" />
            {lang === 'BD' ? 'সিরিয়াল ও অ্যাপয়েন্টমেন্ট' : 'Book Appointment'}
          </button>
        </div>

        {/* Mobile Command Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenBooking}
            className="flex items-center justify-center p-2.5 bg-[#198a96] text-white rounded-lg cursor-pointer"
            aria-label="Book Appointment"
          >
            <Calendar className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0b2447] focus:outline-hidden cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Slide Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top duration-250">
          <ul className="flex flex-col gap-3 font-semibold pb-4 text-gray-700">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left py-2.5 px-4 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50/75 text-[#198a96] font-bold pl-6 border-l-4 border-[#198a96]' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {lang === 'BD' ? item.labelBD : item.labelEN}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2.5">
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs leading-relaxed">
              <span className="font-bold block">🚨 {lang === 'BD' ? 'ফোন কল হেল্পলাইন' : 'Helpline Support'}</span>
              {lang === 'BD' 
                ? 'ডাক্তার দেখানোর সময় পরিবর্তন হতে পারে। অগ্রিম নিশ্চিত হয়ে নিন।' 
                : 'Doctor schedules are subject to shifts. Confirm prior to visit.'
              }
              <div className="font-extrabold mt-1 text-[13px] text-yellow-900">+8801797-975461</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

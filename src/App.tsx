import React from 'react';
import Header from './components/Header';
import DoctorCard from './components/DoctorCard';
import DiagnosticSelector from './components/DiagnosticSelector';
import AppointmentWizard from './components/AppointmentWizard';
import PaymentSystem from './components/PaymentSystem';
import AIChatBot from './components/AIChatBot';
import { DOCTORS_DATA, OT_SERVICES_BD, OT_SERVICES_EN, OFFICE_ADDRESS } from './data';
import { Doctor } from './types';
import { 
  Phone, MapPin, Calendar, Clock, ShieldAlert, Award, 
  Settings, CheckCircle2, Heart, Shield, Activity, Search
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = React.useState<'BD' | 'EN'>('BD');
  const [activeSection, setActiveSection] = React.useState('home');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [doctorSearchName, setDoctorSearchName] = React.useState<string>('');
  const [daySearchFilter, setDaySearchFilter] = React.useState<string>('all');
  const [bookingDoctor, setBookingDoctor] = React.useState<Doctor | null>(null);
  const [diagnosticsTotal, setDiagnosticsTotal] = React.useState<number>(0);

  // Smooth scroll logic
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Preselect doctor for appointment booking wizard
  const handleSelectDoctorForBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    scrollToSection('booking-system');
  };

  const handleClearPreselected = () => {
    setBookingDoctor(null);
  };

  // Filter the doctors list dynamically based on search terms, category filters, and active day
  const filteredDoctors = React.useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      const matchSearch = 
        doc.nameBD.toLowerCase().includes(doctorSearchName.toLowerCase()) ||
        doc.nameEN.toLowerCase().includes(doctorSearchName.toLowerCase()) ||
        doc.titleBD.toLowerCase().includes(doctorSearchName.toLowerCase()) ||
        doc.titleEN.toLowerCase().includes(doctorSearchName.toLowerCase());

      const matchCategory = selectedCategory === 'all' || doc.categories.includes(selectedCategory);

      const matchDay = daySearchFilter === 'all' || 
        doc.daysEN.includes(daySearchFilter) || 
        doc.daysBD.some(d => d.includes(daySearchFilter));

      return matchSearch && matchCategory && matchDay;
    });
  }, [doctorSearchName, selectedCategory, daySearchFilter]);

  const surgeryList = lang === 'BD' ? OT_SERVICES_BD : OT_SERVICES_EN;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-[#1ac0c6] selection:text-white">
      {/* Top bar & Premium bilingual header */}
      <Header 
        lang={lang} 
        setLang={setLang} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        scrollToSection={scrollToSection}
        onOpenBooking={() => scrollToSection('booking-system')}
      />

      {/* Hero Presentation Banner Segment (Evercare hospital layout inspired) */}
      <section id="home" className="relative bg-gradient-to-tr from-[#06172e] via-[#0b2447] to-[#123e75] text-white py-20 px-4 overflow-hidden">
        {/* Subtle radial backdrop accent */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1ac0c6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {lang === 'BD' ? 'নিরাময় হেলথকেয়ার নেটওয়ার্ক - লালমনিরহাট' : 'NCD Premium Clinic - Lalmonirhat'}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'BD' ? 'আপনার সুস্বাস্থ্যই' : 'Your Complete Health'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1ac0c6] to-emerald-300">
                {lang === 'BD' ? 'আমাদের একমাত্র ব্রত' : 'Our Sole Commitment'}
              </span>
            </h2>

            <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
              {lang === 'BD' 
                ? 'লালমনিরহাটের প্রাণকেন্দ্রে অবস্থিত সর্বাধুনিক রোগ নির্ণয় কেন্দ্র ও প্যাথলজি ল্যাব। বিশ্বস্ত বিশেষজ্ঞ চিকিৎসকদের নিয়মিত চেম্বার শিডিউল এবং দ্রুত ল্যাব রিপোর্ট সেবা।'
                : 'Lalmonirhat\'s standard diagnostic pathology lab, state-of-the-art operation theaters, and resident expert consultants for premium patient care.'
              }
            </p>

            {/* Quick access bullet points */}
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#1ac0c6] flex-shrink-0" />
                <span>{lang === 'BD' ? '১৫+ অভিজ্ঞ বিশেষজ্ঞ ডাক্তার' : '15+ Top Specialist Doctors'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#1ac0c6] flex-shrink-0" />
                <span>{lang === 'BD' ? '৩০% প্যাথলজি টেস্ট ছাড়' : 'Up to 30% Diagnostic Rebate'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#1ac0c6] flex-shrink-0" />
                <span>{lang === 'BD' ? 'ডিজিটাল এক্স-রে ও ইউএসজি' : 'USG & Digital X-Ray'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#1ac0c6] flex-shrink-0" />
                <span>{lang === 'BD' ? '২৪/৭ জরুরি ও ইনডোর সাহায্য' : 'Indoor Facility'}</span>
              </div>
            </div>

            {/* CTA anchors */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => scrollToSection('doctors')} 
                className="px-6 py-3 bg-[#198a96] hover:bg-[#126b75] text-white font-bold rounded-xl text-sm transition-all text-center cursor-pointer shadow-lg shadow-[#198a96]/20"
              >
                {lang === 'BD' ? 'বিশেষজ্ঞ ডাক্তার খুঁজুন' : 'Consult a Specialist'}
              </button>
              <button 
                onClick={() => scrollToSection('diagnostics')} 
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-sm border border-white/10 transition-all text-center cursor-pointer"
              >
                {lang === 'BD' ? 'প্যাথলজি টেস্ট লিস্ট ও মূল্য' : 'Diagnostic Price Book'}
              </button>
            </div>
          </div>

          {/* Quick interactive search/hot info panel */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-5">
            {/* Visual presentation of Clinic building */}
            <div className="relative rounded-2xl overflow-hidden h-40 shadow-md border border-white/10 group mb-2">
              <img 
                src="/src/assets/images/regenerated_image_1779392836014.jpg" 
                alt="Niramoy Clinic Facility" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2447]/90 via-[#0b2447]/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[9px] bg-[#198a96] text-white px-2 py-0.5 rounded-md font-extrabold uppercase tracking-widest">{lang === 'BD' ? 'আমাদের ক্লিনিক' : 'Our Clinic Facility'}</span>
                <p className="text-xs font-bold mt-1 text-teal-500">{lang === 'BD' ? 'নিরাময় ক্লিনিক এন্ড ডায়াগনোসিস ভবন' : 'Niramoy Clinic & Diagnosis Campus'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Activity className="w-5 h-5 text-[#1ac0c6] animate-pulse" />
              <h3 className="font-bold text-base text-white">
                {lang === 'BD' ? 'জরুরি যোগাযোগ ও সাহায্য' : 'Emergency Assistance & Hours'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{lang === 'BD' ? 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল ডেস্ক' : 'Direct Booking Hotline'}</span>
                  <p className="text-lg font-extrabold text-yellow-400 leading-tight">01797-975461</p>
                  <p className="text-sm font-semibold text-yellow-400 leading-tight">01705-485643</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                <Clock className="w-5 h-5 text-[#1ac0c6] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{lang === 'BD' ? 'খোলা থাকার সময়' : 'Working Hours'}</span>
                  <p className="text-sm font-semibold text-white leading-normal">
                    {lang === 'BD' ? 'সকাল ০৭:০০টা – রাত ১০:০০টা (প্রতিদিন)' : '07:00 AM – 10:00 PM (Daily)'}
                  </p>
                  <span className="text-[10px] bg-red-600 inline-block px-1.5 py-0.5 rounded font-bold uppercase mt-1">
                    {lang === 'BD' ? 'জরুরি ইনডোর ২৪ ঘণ্টা' : '24-Hour Emergency Bed'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                <MapPin className="w-5 h-5 text-[#1ac0c6] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{lang === 'BD' ? 'চেম্বার ও ল্যাব ঠিকানা' : 'Clinic Location'}</span>
                  <p className="text-xs text-gray-200 leading-normal">
                    {lang === 'BD' ? OFFICE_ADDRESS.BD : OFFICE_ADDRESS.EN}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Medical Caution notice regarding operations */}
      <section className="bg-amber-50 border-y border-amber-100 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-amber-900 text-xs md:text-sm leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 animate-bounce" />
          <span>
            <strong>{lang === 'BD' ? 'সতর্কতা ও জনস্বার্থে নোটিশ: ' : 'Patient Advisory Notice: '}</strong>
            {lang === 'BD' 
              ? 'ডাক্তারদের ভিজিটিং সময়সূচী পরিবর্তন বা চেম্বার ছুটি হওয়া স্বাভাবিক। অনুগ্রহ করে ক্লিনিকে সরাসরি আসার পূর্বে ফোনে সিরিয়াল ও সময় নিশ্চিত করে নিন।' 
              : 'Our panel specialists\' visiting schedules can change due to emergency shifts. Always verify your slot via a quick helpline phone call.'
            }
          </span>
        </div>
      </section>

      {/* Specialist Doctors Directory Segment */}
      <section id="doctors" className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#198a96] uppercase tracking-widest block bg-blue-50/50 w-fit mx-auto px-3 py-1 rounded-full border border-blue-100">
            {lang === 'BD' ? 'ভেরিফাইড মেডিকেল প্যানেল' : 'Our Specialized Department'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight">
            {lang === 'BD' ? 'বিশেষজ্ঞ ডাক্তারদের সময়সূচী ও চেম্বার' : 'Consult Our Panel Doctors'}
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            {lang === 'BD' 
              ? 'রংপুর মেডিকেল কলেজ হাসপাতাল এবং শহীদ সোহরাওয়ার্দী হাসপাতালের স্বনামধন্য ও সম্মানিত সহকারী ও সহযোগী অধ্যাপকগণ নিয়মিত এখানে রোগী দেখছেন।' 
              : 'Our clinic hosts top clinical consultants, surgeons, and department chairs from premier medical colleges ready to treat you.'
            }
          </p>
        </div>

        {/* Doctor search tools and tabs */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input search by name */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={doctorSearchName}
                onChange={(e) => setDoctorSearchName(e.target.value)}
                placeholder={lang === 'BD' ? "ডাক্তার বা রোগের নাম দিয়ে খুঁজুন..." : "Filter by specialist name or disease..."}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-[#1ac0c6]"
              />
            </div>

            {/* Select Day Filter */}
            <select
              value={daySearchFilter}
              onChange={(e) => setDaySearchFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden text-gray-600"
            >
              <option value="all">{lang === 'BD' ? 'সকল বার (সমস্ত দিন)' : 'All Visiting Days'}</option>
              <option value="Friday">{lang === 'BD' ? 'শুক্রবার (Friday)' : 'Friday'}</option>
              <option value="Saturday">{lang === 'BD' ? 'শনিবার (Saturday)' : 'Saturday'}</option>
              <option value="Sunday">{lang === 'BD' ? 'রবিবার (Sunday)' : 'Sunday'}</option>
              <option value="Monday">{lang === 'BD' ? 'সোমবার (Monday)' : 'Monday'}</option>
              <option value="Tuesday">{lang === 'BD' ? 'মঙ্গলবার (Tuesday)' : 'Tuesday'}</option>
              <option value="Wednesday">{lang === 'BD' ? 'বুধবার (Wednesday)' : 'Wednesday'}</option>
              <option value="Thursday">{lang === 'BD' ? 'বৃহস্পতিবার (Thursday)' : 'Thursday'}</option>
            </select>

            {/* Stats count indicator */}
            <div className="flex items-center justify-end text-xs text-slate-500 font-bold pr-2 bg-slate-50 rounded-xl p-2.5">
              <span>
                {lang === 'BD' ? 'সার্জেন্ট ও বিশেষজ্ঞ প্রাপ্ত:' : 'Matched Specialists:'} {filteredDoctors.length} {lang === 'BD' ? 'জন' : 'Doctors'}
              </span>
            </div>
          </div>

          {/* Quick Department Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {[
              { key: 'all', labelBD: 'সব বিভাগ', labelEN: 'All Specialties' },
              { key: 'medicine', labelBD: 'মেডিসিন ও হৃদরোগ', labelEN: 'Medicine' },
              { key: 'gynecology', labelBD: 'গাইনী ও ধাত্রীবিদ্যা (অবস)', labelEN: 'Gynecology & Obs' },
              { key: 'surgery', labelBD: 'জেনারেল সার্জারী', labelEN: 'General Surgery' },
              { key: 'orthopedics', labelBD: 'অর্থোপেডিকস (হাড়-জোড়)', labelEN: 'Orthopedics' },
              { key: 'ent', labelBD: ' নাক, কান, গলা রোগ', labelEN: 'ENT / Head-Neck' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer border transition-all ${
                  selectedCategory === tab.key
                    ? 'bg-[#198a96] text-white border-[#198a96]'
                    : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                }`}
              >
                {lang === 'BD' ? tab.labelBD : tab.labelEN}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid Display */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <DoctorCard 
                key={doc.id} 
                doctor={doc} 
                lang={lang} 
                onBook={handleSelectDoctorForBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-medium">
              {lang === 'BD' ? 'অনুসন্ধানকৃত ফিল্টারে কোনো বিশেষজ্ঞ ডাক্তার মেলেনি। ভিন্ন দিন বা ভিন্ন ফিল্টার ট্রাই করুন।' : 'No matching doctor found for your criteria.'}
            </p>
          </div>
        )}
      </section>

      {/* Lab Diagnostic, Ultrasound, Digital X-Ray & Biochemistry Test Catalog */}
      <section id="diagnostics" className="bg-[#f0f9fa]/50 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#198a96] uppercase tracking-widest block bg-teal-50/70 w-fit mx-auto px-3 py-1 rounded-full border border-teal-100">
              {lang === 'BD' ? 'আশাব্যঞ্জক নির্ভুল ডায়াগনস্টিক রিপোর্ট' : 'Premium Laboratory Services'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight">
              {lang === 'BD' ? 'প্যাথলজিক্যাল ও আল্ট্রাসনোগ্রাফি টেস্ট সমূহ' : 'High-Quality Pathology & Imaging'}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {lang === 'BD' 
                ? 'আধুনিক রি-এজেন্ট সম্পন্ন ল্যাবরেটরি থেকে রক্ত পরীক্ষা, হরমোন প্রোফাইল, লিভার এবং কিডনির নির্ভুল ডায়াগনস্টিক টেস্ট প্রাক্কলন।' 
                : 'Accurately calibrated instruments to yield standard pathology blood testing, full pelvic examinations, and high-efficiency USG scans.'
              }
            </p>
          </div>

          {/* Render centralized Interactive Diagnostic price calculator */}
          <DiagnosticSelector lang={lang} onTotalChange={setDiagnosticsTotal} />

          {/* Highlighting Corporate referalls/Insurance discounts */}
          <div className="bg-white border border-gray-100/50 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-bold text-lg md:text-xl text-[#0b2447]">
                {lang === 'BD' ? 'প্যাথলজিক্যাল টেস্টে ৩০% পর্যন্ত ছাড় উপভোগ করুন' : 'Diagnostic Welfare Copay & Reductions'}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                {lang === 'BD' 
                  ? 'নিরাময় ক্লিনিক এন্ড ডায়াগনোসিস লালমনিরহাটের যেকোনো প্যাথলজির মূল টেস্ট বিলে নির্দিষ্ট কর্পোরেট অংশীদারিত্ব কার্ড, ব্যাংক মেম্বারশিপ বা সরকারি রেফারেল কার্ডের ভিত্তিতে ৩০% পর্যন্ত ছাড় পেতে পারেন। বিস্তারিত তথ্য জানতে রিসেপশন কাউন্টারে কথা বলুন।' 
                  : 'Receive up to 30% discount on biochemical and microbiological testing by validating your enterprise partnership credentials.'
                }
              </p>
            </div>
            <div className="flex justify-end p-2 bg-[#198a96]/5 border border-[#1ac0c6]/20 rounded-2xl md:ml-6 text-center">
              <div className="w-full py-4 px-2">
                <span className="text-[10px] uppercase font-extrabold text-[#198a96] tracking-widest block mb-1">
                  {lang === 'BD' ? 'প্যাথলজি টেস্ট ডিসকাউন্ট' : 'Diagnostic reduction'}
                </span>
                <span className="text-3xl md:text-4.5xl font-black text-[#0b2447]">
                  {lang === 'BD' ? '৩০% ছাড়' : '30% OFF'}
                </span>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                  {lang === 'BD' ? '*শুধুমাত্র ল্যাব টেস্টের ক্ষেত্রে প্রযোজ্য' : '*Applies to pathological tests'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced fully sterilized OT, surgical services and pediatric ward section */}
      <section id="ot-services" className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#198a96] uppercase tracking-widest block bg-blue-50/50 w-fit mx-auto px-3 py-1 rounded-full border border-blue-100">
            {lang === 'BD' ? 'উন্নত ইনডোর ও সার্জিক্যাল সেবা' : 'Indoor Ward & Sterile OT'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight">
            {lang === 'BD' ? 'অপারেশন থিয়েটার ও সিজারিয়ান সুবিধা' : 'Surgical Departments & OT Care'}
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            {lang === 'BD' 
              ? 'সার্বক্ষণিক ডাক্তারদের উপস্থিতিতে ছোট-বড় সার্জারী ও নিরাপদ সন্তান প্রসবের আধুনিক সিজার কক্ষ।' 
              : 'Our sterilized operation theaters host experienced surgeons for hernia repair, appendectomy, orthopedic procedures, and deliveries.'
            }
          </p>
        </div>

        {/* Surgery grid of panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {surgeryList.map((service, idx) => {
            const serviceImages = [
              "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600"
            ];
            return (
              <div key={idx} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs relative group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  {/* Aspect-ratio image banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={serviceImages[idx]} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 font-sans"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-extrabold text-base md:text-lg text-[#0b2447] leading-snug group-hover:text-[#198a96] transition-colors border-l-4 border-[#198a96] pl-2">
                      {service.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed mt-3 font-sans">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">
                      {lang === 'BD' ? 'অংশগ্রহনকারী সার্জন:' : 'Lead Surgeons on Panel:'}
                    </span>
                    <span className="font-bold text-xs text-[#0b2447]">
                      {service.surgeon}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2019 Advisory alert box / Transparency and Patient First model */}
        <div className="bg-red-50 border border-red-100 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 text-xs md:text-sm text-red-950 font-sans leading-relaxed">
          <Shield className="w-8 h-8 md:w-10 md:h-10 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-red-800 block mb-1">
              🔒 {lang === 'BD' ? 'নিরাপত্তা, পেশাদারিত্ব ও স্বচ্ছতা নিশ্চয়তা' : 'Trust and Quality Integrity Protocol'}
            </span>
            {lang === 'BD' 
              ? 'নিরাময় ক্লিনিক রোগীদের সর্বোচ্চ সুরক্ষায় প্রতিশ্রুতিবদ্ধ। ২০১৯ সালের একটি ওটি অভিযোগ ওঠার পর আমরা আমাদের সেবা বিধি আরো কঠোর করেছি। এখন প্রত্যেকটি মেজর ও মাইনর অপারেশনের পূর্বে সিনিয়র কনসালটেন্ট ও দক্ষ মেডিকেল অডিটর প্যানেল দ্বারা ৩-স্তরের স্ক্রিনিং সম্পন্ন করা হয়।' 
              : 'At NCD, we prioritize flawless clinical audit logs. Following historical feedback, we instituted a triple-stage clinical safety protocol for every major laparoscopic and orthopedics operation.'
            }
          </div>
        </div>
      </section>

      {/* Interactive Digital Mobile Payments (bKash, Nagad, Rocket) Portal */}
      <section id="payments" className="py-20 px-4 bg-slate-50 border-t border-gray-100/55 scroll-mt-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#198a96] uppercase tracking-widest block bg-blue-50/50 w-fit mx-auto px-3 py-1 rounded-full border border-blue-100">
              {lang === 'BD' ? 'ইনস্ট্যান্ট মোবাইল পে' : 'Secure Electronic Billing'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight">
              {lang === 'BD' ? 'বিকাশ, রকেট ও নগদ পেমেন্ট গেটওয়ে' : 'Pay via bKash, Nagad or Rocket'}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {lang === 'BD' 
                ? 'আপনার মোবাইল অ্যাকাউন্ট ব্যবহার করে সরাসরি ডাক্তারদের ভিজিট ফি, প্যাথলজি টেস্ট চার্জ অথবা যেকোনো ইনডোর ক্লিনিক্যাল ও বেড বিল পরিশোধ করুন।' 
                : 'Process clinical deposits, doctor consultation fees, and custom ward charges directly using your mobile finance wallet.'
              }
            </p>
          </div>

          <PaymentSystem lang={lang} selectedDiagnosticsTotal={diagnosticsTotal} />
        </div>
      </section>

      {/* Interactive Appointment Scheduler wizard block */}
      <section className="bg-gradient-to-b from-white to-[#f0f9fa]/45 py-20 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#198a96] uppercase tracking-widest block bg-teal-50/70 w-fit mx-auto px-3 py-1 rounded-full border border-teal-100">
              {lang === 'BD' ? 'অনলাইন অ্যাপয়েন্টমেন্ট ডেস্ক' : 'Online Scheduling Desk'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight">
              {lang === 'BD' ? 'সহজে চেম্বার সিরিয়াল বুকিং দিন' : 'Book An Appointment Slot'}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {lang === 'BD' 
                ? 'নিচের ইন্টারেক্টিভ উইজার্ডটি ব্যবহার করে আপনার কাঙ্ক্ষিত ডাক্তার বেছে নিন এবং আজই চেম্বার স্পট নিশ্চিত করুন।' 
                : 'Select your preferred clinical consultant, pick any available schedule weekday, and register your tentative ticket instantly.'
              }
            </p>
          </div>

          {/* Interactive booking wizard panel */}
          <AppointmentWizard 
            lang={lang} 
            preselectedDoctor={bookingDoctor}
            onClearPreselected={handleClearPreselected}
          />
        </div>
      </section>

      {/* Patient Reviews Grid & Trust Elements */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0b2447] tracking-tight">
            {lang === 'BD' ? 'রোগীদের অভিজ্ঞতা ও মতামতসমূহ' : 'Our Patient Testimonials'}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            {lang === 'BD' ? 'লালমনিরহাট সদরের স্থানীয় সাধারণ মানুষের বিশ্বস্ত সেবা প্রদানের কিছু অভিজ্ঞতা।' : 'Real feedback from local residents who trusted our diagnostic lab and specialists.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              nameBD: "মোঃ আশরাফুল আলম",
              nameEN: "Md. Ashraful Alam",
              roleBD: "লালমনিরহাট সদর",
              roleEN: "Lalmonirhat Sadar",
              textBD: "প্রফেসর ড. মোঃ নূর-ইসলাম সাহেবকে দেখানোর জন্য আমি প্রতি শুক্রবার রংপুর মেডিকেল কলেজে যেতাম। কিন্তু এখন লালমনিরহাটের নিরাময় ক্লিনিকেই উনাকে দেখাতে পারি। এলাকার মানুষের জন্য এটা দারুন উপকারে আসছে।",
              textEN: "I used to travel far to Rangpur on Fridays for Dr. Nur-Islam. It is amazing having him right here at BDR Road, Lalmonirhat now. Very helpful service."
            },
            {
              nameBD: "সাফিয়া বেগম",
              nameEN: "Safia Begum",
              roleBD: "খোর্দ্দ সাপটানা কলোনি",
              roleEN: "Khordda Sapatana resident",
              textBD: "এখানে গাইনী ডাক্তার ড. লোপা আপার চিকিৎসায় আমি খুবই সন্তুষ্ট। ওনাদের ল্যাব রিপোর্টের রেজাল্টও অন্যান্য ক্লিনিক থেকে অনেক নিখুঁত ও ট্রাস্টেড লেগেছে। ডিসকাউন্টও পেয়েছি।",
              textEN: "Dr. Lopa\'s consultations regarding maternity counseling and infant health are wonderful. The lab report delivery is swift and very precise."
            },
            {
              nameBD: "আজাহার আলী",
              nameEN: "Azahar Ali",
              roleBD: "বিডিআর রোড ব্যবসায়ী",
              roleEN: "BDR Road Local Merchant",
              textBD: "আমার ছেলের অ্যাপেন্ডিসাইটিস অপারেশনের কাজ ডা: শরীফুল ইসলাম ননতু স্যার খুব ভালোভাবে সম্পন্ন করেছেন। নিরাময় ক্লিনিকের নার্স ও সহকারী কর্মীদের ব্যবহার প্রশংসনীয় ছিল।",
              textEN: "Dr. Shariful Islam Nontu operated on my son\'s acute appendix issues successfully. Highly professional post-surgery care."
            }
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-150 relative">
              <span className="text-6xl text-[#198a96]/15 absolute top-2 left-4 font-serif">“</span>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed relative z-10 pt-4 font-sans italic">
                {lang === 'BD' ? review.textBD : review.textEN}
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#198a96] text-xs">
                  {review.nameEN.split(' ').pop()?.substring(0, 1)}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#0b2447]">{lang === 'BD' ? review.nameBD : review.nameEN}</h5>
                  <p className="text-[10px] text-gray-400 font-semibold">{lang === 'BD' ? review.roleBD : review.roleEN}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hospital Location maps & Address block (`id="contact"`) */}
      <section id="contact" className="bg-[#0b2447] text-white py-16 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5">
                <img 
                  src="/input_file_8.png" 
                  alt="NCD Logo Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-extrabold text-lg md:text-xl text-white">
                {lang === 'BD' ? 'নিরাময় ক্লিনিক' : 'Niramoy Clinic'}
              </h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {lang === 'BD' 
                ? 'লালমনিরহাট সদর সাপটানা পৌরসভা এলাকায় অবস্থিত একটি স্থায়ী এবং বিশ্বস্ত প্রাইভেট ক্লিনিক ও আধুনিক হাসপাতাল।' 
                : 'Lalmonirhat\'s premier high-end health clinic and modern diagnosis platform with expert visiting specialist chambers and advanced imaging labs.'
              }
            </p>

            <div className="pt-4 space-y-3 text-xs md:text-sm font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#198a96] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'BD' ? 'ঠিকানা:' : 'Location Address:'}</strong><br />
                  {lang === 'BD' ? OFFICE_ADDRESS.BD : OFFICE_ADDRESS.EN}
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#198a96] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'BD' ? 'সিরিয়াল হেল্পলাইন:' : 'Serial Line Help:'}</strong><br />
                  +8801797-975461, +8801705-485643
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-bold text-sm md:text-base uppercase tracking-wider text-[#1ac0c6]">
              {lang === 'BD' ? 'বিশেষজ্ঞ বিভাগসমূহ' : 'Department Panels'}
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <button onClick={() => { setSelectedCategory('medicine'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'মেডিসিন ও হৃদরোগ' : 'Medicine'}</button>
              <button onClick={() => { setSelectedCategory('gynecology'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'গাইনী ও ধাত্রীবিদ্যা' : 'Obstetrics / Pregnancy'}</button>
              <button onClick={() => { setSelectedCategory('surgery'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'জেনারেল সার্জারী' : 'General Surgery'}</button>
              <button onClick={() => { setSelectedCategory('orthopedics'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'অর্থোপেডিকস (হাড়-জোড়)' : 'Orthopedics'}</button>
              <button onClick={() => { setSelectedCategory('ent'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'ইএনটি (নাক-কান-গলা)' : 'ENT Surgery'}</button>
              <button onClick={() => { setSelectedCategory('general'); scrollToSection('doctors'); }} className="text-left hover:text-white hover:underline cursor-pointer">{lang === 'BD' ? 'জেনারেল প্র্যাকটিশনার' : 'General Practitioner'}</button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400 block mb-1">
                {lang === 'BD' ? 'সাম্প্রতিক আপডেটস ফেসবুক:' : 'Social Channels:'}
              </h5>
              <a 
                href="https://facebook.com/NiramoyCilinic" 
                target="_blank" 
                className="text-xs text-[#1ac0c6] hover:underline"
              >
                Niramoy Cilinic Facebook Page
              </a>
            </div>
          </div>

          {/* Sincere Google maps placeholder or clinical guidance map */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-bold text-sm md:text-base uppercase tracking-wider text-[#1ac0c6]">
              {lang === 'BD' ? 'ক্লিনিকের লোকেশন ও ম্যাপ' : 'Physical Location Locator'}
            </h5>
            
            <div className="h-44 bg-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#198a96_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
              <MapPin className="w-8 h-8 text-[#1ac0c6] mb-2 relative z-10" />
              <span className="text-xs text-white font-bold relative z-10 block">
                {lang === 'BD' ? 'পৌরসভা ভবনের উত্তর পাশে' : 'North of Lalmonirhat Municipal'}
              </span>
              <p className="text-[10px] text-gray-300 mt-1 max-w-[220px] relative z-10 font-sans">
                Khordda Sapatana, BDR Road, Lalmonirhat Sadar, Rangpur Division.
              </p>
              <a 
                href="https://maps.google.com/?q=Niramoy+Clinic+Lalmonirhat" 
                target="_blank" 
                className="mt-3 inline-flex bg-[#198a96] text-white px-3.5 py-1 rounded text-[10px] font-bold uppercase hover:bg-teal-700 transition-all select-none relative z-10 cursor-pointer"
              >
                {lang === 'BD' ? 'গুগল ম্যাপে দেখুন' : 'Get Directions'}
              </a>
            </div>
          </div>

        </div>

        {/* Humble corporate standard copyrights footer */}
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-sans select-none">
          <p>
            © 2026 Niramoy Clinic & Diagnosis Center. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span>{lang === 'BD' ? 'লালমনিরহাটের বিশ্বস্ত ক্লিনিক' : 'Lalmonirhat Specialized Network'}</span>
            <span>•</span>
            <span>{lang === 'BD' ? 'প্যাথলজি ও ল্যাবরেটরি' : 'Certified Diagnostics'}</span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom-Right Patient AI Chat Assistance */}
      <AIChatBot lang={lang} />
    </div>
  );
}

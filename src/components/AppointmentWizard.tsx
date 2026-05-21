import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DOCTORS_DATA } from '../data';
import { Doctor, Appointment } from '../types';
import { Calendar, User, Phone, Clipboard, ArrowRight, CheckCircle2, Printer, RefreshCw, Layers, CalendarRange, Trash2, PhoneCall, Heart, Clock, Check } from 'lucide-react';

interface AppointmentWizardProps {
  lang: 'BD' | 'EN';
  preselectedDoctor: Doctor | null;
  onClearPreselected: () => void;
}

export default function AppointmentWizard({
  lang,
  preselectedDoctor,
  onClearPreselected
}: AppointmentWizardProps) {
  // Wizard steps: 'form' | 'success'
  const [step, setStep] = React.useState<'form' | 'success'>('form');
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string>(preselectedDoctor?.id || '');
  const [patientName, setPatientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [age, setAge] = React.useState('');
  const [appointmentDate, setAppointmentDate] = React.useState('');
  const [notes, setNotes] = React.useState('');
  
  const [activeTab, setActiveTab] = React.useState<'book' | 'my-serials'>('book');
  const [mySerials, setMySerials] = React.useState<Appointment[]>([]);
  const [latestAppointment, setLatestAppointment] = React.useState<Appointment | null>(null);

  React.useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctorId(preselectedDoctor.id);
      setActiveTab('book');
      setStep('form');
    }
  }, [preselectedDoctor]);

  React.useEffect(() => {
    const stored = localStorage.getItem('niramoy_appointments');
    if (stored) {
      setMySerials(JSON.parse(stored));
    }
  }, []);

  const selectedDoctor = React.useMemo(() => {
    return DOCTORS_DATA.find(d => d.id === selectedDoctorId) || null;
  }, [selectedDoctorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !patientName || !phone || !age || !appointmentDate) {
      alert(lang === 'BD' ? 'অনুগ্রহ করে সকল অবৈতনিক তথ্য পূরণ করুন।' : 'Please fill out all required fields.');
      return;
    }

    const doc = DOCTORS_DATA.find(d => d.id === selectedDoctorId)!;
    const randomSerial = Math.floor(Math.random() * 25) + 3;
    const refId = `NCD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: refId,
      patientName,
      phone,
      age,
      date: appointmentDate,
      doctorId: selectedDoctorId,
      doctorNameBD: doc.nameBD,
      doctorNameEN: doc.nameEN,
      status: 'Pending',
      serialNo: String(randomSerial),
      notes: notes || (lang === 'BD' ? "সাধারণ কনসালটেশন" : "General Consultation"),
      createdAt: new Date().toISOString()
    };

    const updated = [newAppointment, ...mySerials];
    setMySerials(updated);
    localStorage.setItem('niramoy_appointments', JSON.stringify(updated));

    setLatestAppointment(newAppointment);
    setStep('success');
    
    setPatientName('');
    setPhone('');
    setAge('');
    setNotes('');
    setAppointmentDate('');
    onClearPreselected();
  };

  const deleteAppointment = (id: string) => {
    const filtered = mySerials.filter(app => app.id !== id);
    setMySerials(filtered);
    localStorage.setItem('niramoy_appointments', JSON.stringify(filtered));
  };

  const printTicket = () => {
    window.print();
  };

  const getUpcomingDays = (doctorObj: Doctor | null) => {
    if (!doctorObj) return [];
    
    const days: string[] = [];
    const date = new Date('2026-05-21T07:00:00Z');
    const targetDaysBD = doctorObj.daysBD;
    
    for (let i = 0; i < 14; i++) {
      const futureDate = new Date(date);
      futureDate.setDate(date.getDate() + i);
      const dayNameBD = futureDate.toLocaleDateString('bn-BD', { weekday: 'long' });
      const dayNameEN = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      const isGeneralAndNotFriday = doctorObj.categories.includes('general') && dayNameEN !== 'Friday';
      const isMatchingDoctorDay = targetDaysBD.some(d => dayNameBD.includes(d) || d.includes(dayNameBD));

      if (isMatchingDoctorDay || isGeneralAndNotFriday) {
        days.push(futureDate.toISOString().split('T')[0]);
      }
    }
    return days;
  };

  const availableDates = getUpcomingDays(selectedDoctor);

  const translateStatus = (status: string) => {
    if (status === 'Pending') {
      return lang === 'BD' ? 'কল করে কনফার্ম করুন' : 'Call to Confirm';
    }
    return lang === 'BD' ? 'নিশ্চিতকৃত' : 'Confirmed';
  };

  return (
    <div id="booking-system" className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xl">
      {/* Top Hotline Banner to ensure visibility of key requirement */}
      <div className="bg-gradient-to-r from-[#198a96] to-[#0b2447] text-white px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-lg animate-pulse">
            <PhoneCall className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <p className="text-xs font-medium text-teal-100 uppercase tracking-widest">
              {lang === 'BD' ? 'জরুরী সিরিয়াল হেল্পলাইন' : 'Direct Booking Hotline'}
            </p>
            <p className="text-sm font-extrabold tracking-tight">
              {lang === 'BD' ? 'সিরিয়াল করতে সরাসরি কল করুন:' : 'To request or change serial, call:'}
            </p>
          </div>
        </div>
        <a 
          href="tel:01797975461" 
          className="bg-teal-400 hover:bg-teal-300 text-[#0b2447] hover:scale-105 active:scale-95 transition-all font-black text-sm px-5 py-2 rounded-xl flex items-center gap-2 shadow-md shrink-0"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          01797975461
        </a>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-gray-100 bg-[#0a1b3a] p-1.5">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'book'
              ? 'bg-white text-[#0b2447] shadow-lg scale-100'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#198a96]" />
          {lang === 'BD' ? 'নতুন সিরিয়াল বুকিং' : 'Schedule Serial'}
        </button>
        <button
          onClick={() => setActiveTab('my-serials')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'my-serials'
              ? 'bg-white text-[#0b2447] shadow-lg scale-100'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-[#198a96]" />
          {lang === 'BD' ? 'আমার বুকিং ও স্লিপসমূহ' : 'My Bookings / Slips'}
          {mySerials.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 animate-pulse">
              {mySerials.length}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'book' ? (
          step === 'form' ? (
            <motion.form
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[#198a96]">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {lang === 'BD' ? 'নিরাময় অনলাইন সেবা' : 'Niramoy Digital Consultation Service'}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#0b2447] tracking-tight mt-1">
                  {lang === 'BD' ? 'বিশেষজ্ঞ ডাক্তারের সিরিয়াল বুকিং ফর্ম' : 'Specialist Consultation Serial Booking'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                  {lang === 'BD' 
                    ? 'নিচের ফর্মটি নির্ভুল তথ্য দিয়ে পূরণ করুন। ফর্ম সাবমিট করার পর সিরিয়ালটি কনফার্ম করতে অবিলম্বে ০১৭৯৭৯৭৫৪৬১ নাম্বারে ফোন কল করতে হবে।'
                    : 'Fill out the patient details below. Once registered online, you must immediately call 01797975461 to confirm your physical serial number.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Selector */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'ডাক্তার নির্বাচন করুন *' : 'Select Doctor *'}
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => {
                      setSelectedDoctorId(e.target.value);
                      setAppointmentDate('');
                    }}
                    required
                    className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                  >
                    <option value="">{lang === 'BD' ? '-- ডাক্তার নির্বাচন করুন --' : '-- Choose Doctor --'}</option>
                    {DOCTORS_DATA.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {lang === 'BD' ? `${doc.nameBD} - ${doc.titleBD}` : `${doc.nameEN} - ${doc.titleEN}`}
                      </option>
                    ))}
                  </select>

                  {selectedDoctor && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#f0f9fa] p-3.5 rounded-xl text-xs leading-relaxed text-slate-700 border border-[#198a96]/20 shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#0b2447] mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#198a96]" />
                        <span>{lang === 'BD' ? 'চেম্বার সময় ও দিন:' : 'Visiting Schedule:'}</span>
                      </div>
                      <p className="font-semibold text-gray-700">
                        {lang === 'BD' ? selectedDoctor.scheduleBD : selectedDoctor.scheduleEN}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {lang === 'BD' ? 'চেম্বার দিনসমূহ: ' : 'Days: '}{lang === 'BD' ? selectedDoctor.daysBD.join(', ') : selectedDoctor.daysEN.join(', ')}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Patient Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'রোগীর পূর্ণ নাম *' : 'Patient Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={lang === 'BD' ? "যেমন: আব্দুর রহমান" : "e.g. John Doe"}
                    className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                  />
                </div>

                {/* Patient Phone */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'মোবাইল নম্বর *' : 'Contact Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9+() -]*"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === 'BD' ? "যেমন: 01700-000000" : "e.g. +88017xxxxxxxx"}
                    className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                  />
                </div>

                {/* Patient Age */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'বয়স *' : 'Patient Age *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={lang === 'BD' ? "বছর (যেমন: ৪৫)" : "Years (e.g. 45)"}
                    className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                  />
                </div>

                {/* Scheduling Date */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <CalendarRange className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'সাক্ষাতের প্রত্যাশিত তারিখ *' : 'Select Chamber Date *'}
                  </label>
                  
                  {selectedDoctor ? (
                    availableDates.length > 0 ? (
                      <select
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                        className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                      >
                        <option value="">{lang === 'BD' ? '-- তারিখ নির্বাচন করুন --' : '-- Choose Date --'}</option>
                        {availableDates.map((dateStr) => {
                          const dayLabel = new Date(dateStr).toLocaleDateString(lang === 'BD' ? 'bn-BD' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                          return (
                            <option key={dateStr} value={dateStr}>
                              {dayLabel}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <div className="text-xs text-red-600 font-bold p-3 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                        {lang === 'BD' 
                          ? 'এই ডাক্তারের জন্য কোনো চেম্বার ডেট এই মুহূর্তে খালি নেই।' 
                          : 'No visible upcoming days found for this doctor\'s visiting schedule.'
                        }
                      </div>
                    )
                  ) : (
                    <input
                      type="text"
                      disabled
                      placeholder={lang === 'BD' ? "আগে উপর থেকে ডাক্তার নির্বাচন করুন ⬆" : "Select Doctor First ⬆"}
                      className="w-full bg-gray-50 text-gray-400 border-2 border-gray-100 p-3 rounded-xl text-sm cursor-not-allowed font-medium text-center"
                    />
                  )}
                </div>

                {/* Symptom / Notes */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447] flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-[#198a96]" />
                    {lang === 'BD' ? 'লক্ষণ ও রোগ বিবরণী (ঐচ্ছিক)' : 'Symptoms / Medical History (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'BD' ? "যেমন: গ্যাসট্রিক, মাথাব্যথা, চোখের সমস্যা..." : "e.g. Gastric issues, headache, eye pain..."}
                    className="w-full bg-white border-2 border-gray-200 hover:border-[#198a96]/40 p-3 rounded-xl text-sm focus:outline-none focus:border-[#198a96] transition-all font-medium text-[#0b2447]"
                  />
                </div>
              </div>

              {/* Action and bottom notice */}
              <div className="pt-5 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="bg-[#fcf8e3] border border-[#faebcc] px-4 py-3 rounded-xl flex items-center gap-3">
                  <span className="text-xl sm:text-2xl animate-bounce">📢</span>
                  <p className="text-xs text-[#8a6d3b] font-bold leading-relaxed">
                    {lang === 'BD' 
                      ? 'সিরিয়ালটি অগ্রিম বুক করার পর অবশ্যই নিশ্চিত করতে সরাসরি ০১৭৯৭৯৭৫৪৬১ নাম্বারে কল করুন!' 
                      : 'After submitting this request, you MUST call 01797975461 immediately to secure your appointment.'
                    }
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#198a96] to-[#126b75] hover:from-[#126b75] hover:to-[#0f545c] text-white px-8 py-4 rounded-xl font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {lang === 'BD' ? 'অনলাইন সিরিয়াল বুকিং করুন' : 'Confirm & Request Ticket'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          ) : (
            /* SUCCESS TICKET SLIP VISUALIZATION */
            latestAppointment && (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="p-6 md:p-8 space-y-6"
              >
                {/* ATTENTION REQUIRED BURST HERO BANNER */}
                <div className="bg-gradient-to-r from-red-550 to-orange-500 bg-red-600 text-white rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-full flex items-center justify-center animate-bounce">
                      <PhoneCall className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white">
                        {lang === 'BD' ? '⚠️ বুকিং সম্পন্ন করতে শেষ ধাপ বাকি!' : '⚠️ Final step required to complete booking!'}
                      </h4>
                      <p className="text-xs text-white/90">
                        {lang === 'BD' 
                          ? 'আপনার অনলাইন খসড়া বুকিংটি সাময়িকভাবে নথিভুক্ত হয়েছে। সিরিয়ালটি লক করতে নিচের নাম্বারে এখনি একটি ফোন কল করুন।' 
                          : 'Your online draft booking is temporarily stored. You must make a phone call to lock your schedule node.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-teal-100 uppercase tracking-wider font-bold">
                        {lang === 'BD' ? 'নিরাময় সরাসরি কল সেন্টার' : 'Niramoy Direct Helpline'}
                      </p>
                      <p className="text-xl font-black font-sans text-white">01797-975461</p>
                    </div>
                    
                    <a 
                      href="tel:01797975461" 
                      className="bg-white text-red-600 hover:bg-slate-100 px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all text-center w-full sm:w-auto justify-center"
                    >
                      <PhoneCall className="w-4 h-4" />
                      {lang === 'BD' ? 'এখনি ডায়াল করুন' : 'Dial Helpline Now'}
                    </a>
                  </div>
                </div>

                {/* Successful Tentative Badge */}
                <div className="text-center py-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {lang === 'BD' ? 'অনলাইন খসড়া রেজিস্ট্রেশন সম্পন্ন!' : 'Online Draft Slip Registered Successfully!'}
                  </span>
                </div>

                {/* Patient Ticket Visual Slip */}
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 bg-[#f8fafc] relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#0b2447]/5 rounded-full translate-x-8 -translate-y-8" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-gray-200">
                    <div>
                      <h5 className="font-extrabold text-lg text-[#0b2447]">
                        {lang === 'BD' ? 'নিরাময় ক্লিনিক এন্ড ডায়াগনোসিস' : 'Niramoy Clinic & Diagnosis'}
                      </h5>
                      <p className="text-xs text-gray-500 font-medium">BDR Road, Khordda Sapatana, Lalmonirhat Sadar</p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#0b2447] text-white px-3 py-1 rounded-lg">
                      ID: {latestAppointment.id}
                    </span>
                  </div>

                  <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-slate-800">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'BD' ? 'রোগীর নাম' : 'Patient Name'}</p>
                      <p className="font-bold text-[#0b2447] text-base mt-0.5">{latestAppointment.patientName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'BD' ? 'মোবাইল নম্বর' : 'Phone Number'}</p>
                      <p className="font-bold text-[#0b2447] text-base mt-0.5">{latestAppointment.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'BD' ? 'রোগীর বয়স' : 'Patient Age'}</p>
                      <p className="font-bold text-gray-700 mt-0.5">{latestAppointment.age} {lang === 'BD' ? 'বছর' : 'Yrs'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'BD' ? 'প্রত্যাশিত সাক্ষাতের তারিখ' : 'Requested Day'}</p>
                      <p className="font-bold text-[#198a96] mt-0.5 font-sans">
                        {new Date(latestAppointment.date).toLocaleDateString(lang === 'BD' ? 'bn-BD' : 'en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="sm:col-span-2 border-t border-gray-100 pt-3">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'BD' ? 'নির্বাচিত বিশেষজ্ঞ চিকিৎসক' : 'Specialist Consultant'}</p>
                      <p className="font-extrabold text-[#0b2447] text-base mt-0.5">
                        {lang === 'BD' ? latestAppointment.doctorNameBD : latestAppointment.doctorNameEN}
                      </p>
                    </div>
                    <div className="sm:col-span-2 bg-[#eafbfd] border border-[#b2ebf2] p-4 rounded-xl flex items-center justify-between gap-4 mt-2">
                      <div>
                        <p className="text-[10px] text-[#0f545c] font-black uppercase tracking-widest">{lang === 'BD' ? 'অনলাইন টোকেন নং (সাময়িক)' : 'Tentative Token No'}</p>
                        <p className="text-xs text-[#0f545c] font-medium mt-0.5">{lang === 'BD' ? 'কনফার্মেশন কলেই এটি চূড়ান্ত নিশ্চিত করা হবে।' : 'Pending validation on call.'}</p>
                      </div>
                      <span className="text-3xl font-black text-[#198a96]">#{latestAppointment.serialNo}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 text-[11px] leading-relaxed text-slate-500">
                    <p className="font-extrabold text-amber-700">📌 {lang === 'BD' ? 'জরুরী নির্দেশনা:' : 'Please Note:'}</p>
                    <p className="font-medium mt-1">
                      {lang === 'BD' 
                        ? 'এই স্লিপটি প্রিন্ট অথবা স্ক্রিনশট দিয়ে রাখুন। যেকোনো প্রয়োজনে এখনই হাসপাতালের সরাসরি বুকিং হেল্পলাইন ০১৭৯৭৯৭৫৪৬১ নাম্বারে কথা বলুন।' 
                        : 'Print or take a screenshot of this slip. For any inquiries, speak immediately to our billing desk at 01797975461.'
                      }
                    </p>
                  </div>
                </div>

                {/* Success Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={printTicket}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    {lang === 'BD' ? 'টিকিট স্লিপ প্রিন্ট করুন' : 'Print Coupon Slip'}
                  </button>

                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0b2447] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {lang === 'BD' ? 'সহজ নতুন সিরিয়াল বুক করুন' : 'Book Another Doctor Serial'}
                  </button>
                </div>
              </motion.div>
            )
          )
        ) : (
          /* MY ORDERED SERIAL SLIPS LIST VIEW */
          <motion.div
            key="registered-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 space-y-6"
          >
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#0b2447]">
                {lang === 'BD' ? 'আমার নিবন্ধিত সিরিয়ালসমূহ' : 'My Registered Consultation Serials'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {lang === 'BD' 
                  ? 'আপনার মোবাইল বা ব্রাউজারে সফলভাবে সংরক্ষিত সিরিয়াল সমূহের ডিজিটাল স্লিপ তালিকা।' 
                  : 'Check status and manage recent booking slips stored in your local session.'
                }
              </p>
            </div>

            {mySerials.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-xs font-bold text-gray-500">{lang === 'BD' ? 'আপনার কোনো সিরিয়াল টিকিট বুকিং করা নেই।' : 'No registered serial coupons found in this browser.'}</p>
                <button 
                  onClick={() => setActiveTab('book')} 
                  className="mt-3 text-xs text-[#198a96] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  {lang === 'BD' ? 'এখানে প্রথম নতুন সিরিয়াল স্লিপ বুক করুন' : 'Click here to book a doctor serial now'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {/* EMERGENCY ALERT CALL NOTICE */}
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl text-xs text-[#0b2447]">
                  <p className="font-extrabold flex items-center gap-1.5 text-red-800 text-sm">
                    <PhoneCall className="w-4 h-4 text-red-650 animate-pulse text-red-600" />
                    {lang === 'BD' ? 'জরুরী নিশ্চিতকরণ নোটিশ:' : 'Action Required to Finalise Timings:'}
                  </p>
                  <p className="mt-1.5 font-medium text-slate-700 leading-relaxed text-xs">
                    {lang === 'BD'
                      ? 'নিচের যেকোনো বুকিংয়ের চেম্বার সময় চূড়ান্ত নিশ্চিত করতে সরাসরি হাসপাতালের বুকিং হটলাইন ০১৭৯৭-৯৭৫৪৬১ নাম্বারে ফোন কল করুন।'
                      : 'Please call our direct consultation office at 01797-975461 immediately to secure physical appointment timings for your booked codes.'
                    }
                  </p>
                  <div className="mt-3">
                    <a 
                      href="tel:01797975461" 
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black px-4 py-2 rounded-lg transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      {lang === 'BD' ? '০১৭৯৭৯৭৫৪৬১ নাম্বারে কল করুন' : 'Call 01797-975461 Now'}
                    </a>
                  </div>
                </div>

                {mySerials.map((app) => (
                  <div 
                    key={app.id} 
                    className="p-5 bg-white border-2 border-gray-150 hover:border-[#198a96]/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs md:text-sm shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-[#0b2447] text-base">{app.patientName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                          {app.id}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-[#0b2447]">
                        <p className="text-xs">
                          <strong className="text-gray-500 font-bold">{lang === 'BD' ? 'ডাক্তার: ' : 'Doctor: '}</strong>
                          <span className="font-extrabold">{lang === 'BD' ? app.doctorNameBD : app.doctorNameEN}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-semibold font-sans pt-1">
                          <span className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md">🏥 Serial: #{app.serialNo}</span>
                          <span className="bg-slate-50 text-[#198a96] px-2.5 py-1 rounded-md">📅 Date: {new Date(app.date).toLocaleDateString(lang === 'BD' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="bg-slate-50 text-emerald-700 px-2.5 py-1 rounded-md">📞 Phone: {app.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pb-1.5 md:pb-0 justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 shrink-0">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {translateStatus(app.status)}
                      </span>
                      
                      <button
                        onClick={() => deleteAppointment(app.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        title={lang === 'BD' ? "ডিলেট করুন" : "Delete Slip"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

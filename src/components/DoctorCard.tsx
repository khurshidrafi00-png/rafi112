import { Doctor } from '../types';
import { Calendar, Phone, MapPin, Award, CheckCircle2, ChevronRight } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  lang: 'BD' | 'EN';
  onBook: (doctor: Doctor) => void;
  key?: string | number;
}

export default function DoctorCard({ doctor, lang, onBook }: DoctorCardProps) {
  // Map of category colours
  const departmentConfig: Record<string, { bg: string; text: string; labelBD: string; labelEN: string }> = {
    medicine: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-100', text: 'text-emerald-700', labelBD: 'মেডিসিন ও হৃদরোগ', labelEN: 'Medicine & Diabetes' },
    gynecology: { bg: 'bg-pink-50 text-pink-800 border-pink-100', text: 'text-pink-700', labelBD: 'স্ত্রীরোগ ও প্রসূতি (গাইনী)', labelEN: 'Gynecology & Obs' },
    surgery: { bg: 'bg-blue-50 text-blue-800 border-blue-100', text: 'text-blue-700', labelBD: 'জেনারেল ও ল্যাপারোস্কপিক সার্জারি', labelEN: 'General Surgery' },
    orthopedics: { bg: 'bg-amber-50 text-amber-800 border-amber-100', text: 'text-amber-700', labelBD: 'অর্থোপেডিকস (হাড়-জোড় ও বাতের চিকিৎসা)', labelEN: 'Orthopedic Surgery' },
    ent: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-100', text: 'text-indigo-700', labelBD: 'নাক, কান, গলা (ইএনটি)', labelEN: 'ENT / Otorhinolaryngology' },
    general: { bg: 'bg-slate-50 text-slate-800 border-slate-100', text: 'text-slate-700', labelBD: 'জেনারেল প্র্যাকটিস (জিবি)', labelEN: 'General Practitioner' }
  };

  const primaryCategory = doctor.categories[0] || 'general';
  const isCustomImage = doctor.image && doctor.image.startsWith('/input_file_');

  // Specialties
  const specialties = lang === 'BD' ? doctor.specialtiesBD : doctor.specialtiesEN;

  return (
    <div 
      id={`doctor-${doctor.id}`} 
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group"
    >
      {/* Visual Header / Avatar Banner */}
      <div className="relative h-64 md:h-72 bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 border-b border-gray-50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#198a96]/5 rounded-full blur-2xl group-hover:bg-[#198a96]/10 transition-all duration-300" />
        
        {isCustomImage ? (
          <img 
            src={doctor.image} 
            alt={lang === 'BD' ? doctor.nameBD : doctor.nameEN} 
            className="w-full h-full object-contain object-bottom transform group-hover:scale-103 transition-transform duration-500 select-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Elegant premium medical icon avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0b2447] to-[#198a96] flex items-center justify-center text-white shadow-md text-3xl font-bold mb-4 relative">
              {doctor.nameEN.split(' ').pop()?.substring(0, 2) || "Dr"}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
              {lang === 'BD' ? 'নিরাময় প্যানেল ডাক্তার' : 'NCD Medical Panel'}
            </p>
          </div>
        )}

        {/* Floating Specialty Tag */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <span className={`px-3 py-1 text-[11px] md:text-xs font-bold uppercase rounded-lg border shadow-xs tracking-wider ${departmentConfig[primaryCategory].bg}`}>
            {lang === 'BD' ? departmentConfig[primaryCategory].labelBD : departmentConfig[primaryCategory].labelEN}
          </span>
        </div>
      </div>

      {/* Main Text Details */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          {/* Institution Credential */}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#198a96] flex-shrink-0" />
            <span className="truncate">
              {lang === 'BD' 
                ? (doctor.designationBD.includes('রংপুর') ? 'রংপুর মেডিকেল কলেজ সংশ্লিষ্ট' : 'বিশেষজ্ঞ চিকিৎসক')
                : (doctor.designationEN.includes('Rangpur') ? 'Rangpur Med. College Panel' : 'Staff Consultant')
              }
            </span>
          </div>

          {/* Dr. Name */}
          <h3 className="text-lg md:text-xl font-bold text-[#0b2447] leading-snug tracking-tight group-hover:text-[#198a96] transition-colors">
            {lang === 'BD' ? doctor.nameBD : doctor.nameEN}
          </h3>

          {/* Title / Specialties summary */}
          <p className="text-sm font-semibold text-[#198a96] mt-1.5">
            {lang === 'BD' ? doctor.titleBD : doctor.titleEN}
          </p>

          {/* Academic Qualifications */}
          <p className="text-xs text-gray-600 mt-2 font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100/50 leading-relaxed font-sans">
            <span className="block text-gray-400 font-bold uppercase text-[9px] tracking-widest mb-0.5">
              {lang === 'BD' ? 'ডিগ্রি ও শিক্ষাগত যোগ্যতা' : 'Qualifications'}
            </span>
            {lang === 'BD' ? doctor.qualificationsBD : doctor.qualificationsEN}
          </p>

          {/* Hospital Designation / Chamber Info */}
          <p className="text-xs text-gray-500 mt-2.5 leading-relaxed italic">
            {lang === 'BD' ? doctor.designationBD : doctor.designationEN}
          </p>

          {/* Dynamic Specializations treated list */}
          {specialties && specialties.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="block text-gray-400 font-extrabold uppercase text-[9px] tracking-widest mb-2">
                {lang === 'BD' ? 'বিশেষ চিকিৎসা সেবাসমূহ' : 'Clinical Specializations'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((spec, index) => (
                  <span 
                    key={index} 
                    className="text-[10px] md:text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Schedule Grid Box */}
        <div className="mt-5 pt-4 border-t border-gray-100 bg-slate-50/70 p-3.5 rounded-xl border border-dashed border-gray-200">
          <div className="flex items-start gap-2.5 text-xs">
            <Calendar className="w-4 h-4 text-[#198a96] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-extrabold uppercase text-[9px] text-gray-400 tracking-wider block mb-0.5">
                {lang === 'BD' ? 'চেম্বার ও সাক্ষাতের সময়সূচী' : 'Visiting Schedule'}
              </span>
              <span className="font-bold text-gray-800 text-[13px] leading-relaxed">
                {lang === 'BD' ? doctor.scheduleBD : doctor.scheduleEN}
              </span>
            </div>
          </div>
        </div>

        {/* Hot Action Trigger Block */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          {/* Dial Direct Contact serial panel */}
          <a
            href={`tel:${doctor.phoneSerials[0].replace('-', '')}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all sm:w-2/5 border border-gray-200 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'BD' ? 'কল করুন' : 'Call Serial'}
          </a>

          {/* Book inside dynamic interactive scheduler form */}
          <button
            onClick={() => onBook(doctor)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#198a96] hover:bg-[#126b75] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {lang === 'BD' ? 'সিরিয়াল বুক করুন' : 'Book Appointment'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

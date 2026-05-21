import React from 'react';
import { DIAGNOSTICS_DATA } from '../data';
import { Test } from '../types';
import { Search, Info, Check, Plus, Trash2, FileText, Sparkles } from 'lucide-react';

interface DiagnosticSelectorProps {
  lang: 'BD' | 'EN';
  onTotalChange?: (total: number) => void;
}

export default function DiagnosticSelector({ lang, onTotalChange }: DiagnosticSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedTests, setSelectedTests] = React.useState<Test[]>([]);

  const categories = React.useMemo(() => {
    const list: { key: string; labelBD: string; labelEN: string }[] = [
      { key: 'all', labelBD: 'সকল টেস্ট', labelEN: 'All Tests' },
      { key: 'Hematology', labelBD: 'হেমাটোলজি/রক্ত পরীক্ষা', labelEN: 'Hematology' },
      { key: 'Biochemistry', labelBD: 'বায়োকেমিস্ট্রি', labelEN: 'Biochemistry' },
      { key: 'Hormone Assay', labelBD: 'হরমোন ও ভাইরাস', labelEN: 'Hormones' },
      { key: 'Urine & Stool', labelBD: 'ইউরিন ও স্টুল', labelEN: 'Urine & Stool' },
      { key: 'Imaging', labelBD: 'ইউএসজি ও এক্স-রে', labelEN: 'USG & X-Ray' }
    ];
    return list;
  }, []);

  const filteredTests = React.useMemo(() => {
    return DIAGNOSTICS_DATA.filter((test) => {
      const matchSearch = 
        test.nameEN.toLowerCase().includes(searchTerm.toLowerCase()) || 
        test.nameBD.includes(searchTerm) || 
        test.categoryEN.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || test.categoryEN === selectedCategory || (selectedCategory === 'Hormone Assay' && test.categoryEN === 'Viral Markers');

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelectTest = (test: Test) => {
    if (selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const clearSelected = () => {
    setSelectedTests([]);
  };

  // Convert Bengali numerals/text price to actual number for calculation
  const parsePrice = (priceBD: string) => {
    const numbersOnly = priceBD.replace(/[^০-৯0-9]/g, '');
    const banglaToEnglish: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    let engStr = '';
    for (const char of numbersOnly) {
      engStr += banglaToEnglish[char] || char;
    }
    return parseInt(engStr, 10) || 0;
  };

  // Calculate Subtotal & Discount & Total
  const subtotal = selectedTests.reduce((sum, t) => sum + parsePrice(t.priceBD), 0);
  const discountRate = 0.30; // 30% discount mentioned in prompt details
  const discountAmount = Math.round(subtotal * discountRate);
  const finalTotal = subtotal - discountAmount;

  React.useEffect(() => {
    if (onTotalChange) {
      onTotalChange(finalTotal);
    }
  }, [finalTotal, onTotalChange]);

  // Convert number to Bengali digits
  const toBengaliNumber = (num: number) => {
    const englishToBangla: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(char => englishToBangla[char] || char).join('');
  };

  return (
    <div className="bg-slate-50/50 rounded-3xl p-6 md:p-8 border border-gray-100/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: Test directory searching */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-[#0b2447]">
              {lang === 'BD' ? 'প্যাথলজিক্যাল ও ইমেজিং টেস্ট সেবা' : 'Lab Test Directory'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {lang === 'BD' 
                ? 'রুটিন চেকআপ থেকে শুরু করে উন্নত হরমোন ও ডিজিটাল আল্ট্রাসনোগ্রাফি সুবিধা।' 
                : 'Browse our standardized diagnostic procedures, required preparation, and rate guidelines.'
              }
            </p>
          </div>

          {/* Quick Search and Pill Filtering */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'BD' ? "পরীক্ষার নাম খুঁজুন (যেমন: CBC, FBS, USG...)" : "Search test name (e.g. CBC, Kidney, USG...)"}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-[#1ac0c6] shadow-xs"
              />
            </div>

            {/* Sub-Category Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all whitespace-nowrap ${
                    selectedCategory === cat.key
                      ? 'bg-[#0b2447] text-white border-[#0b2447]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {lang === 'BD' ? cat.labelBD : cat.labelEN}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => {
                const isChecked = !!selectedTests.find((t) => t.id === test.id);
                return (
                  <div
                    key={test.id}
                    onClick={() => handleSelectTest(test)}
                    className={`p-4 bg-white rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#1ac0c6] ${
                      isChecked ? 'border-[#1ac0c6] bg-[#1ac0c6]/5' : 'border-gray-200/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 transition-all ${
                        isChecked ? 'bg-[#198a96] border-[#198a96] text-white' : 'border-gray-300'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm md:text-base text-[#0b2447]">
                            {lang === 'BD' ? test.nameBD : test.nameEN}
                          </h4>
                          {test.popular && (
                            <span className="bg-amber-50 text-amber-900 border border-amber-100 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                              {lang === 'BD' ? 'জনপ্রিয়' : 'Routine'}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-[11px] font-bold uppercase mt-0.5">
                          {lang === 'BD' ? test.categoryBD : test.categoryEN}
                        </p>

                        {/* Medical Prep Alert */}
                        <div className="flex items-start gap-1 text-xs text-gray-500 mt-2">
                          <Info className="w-3.5 h-3.5 text-[#198a96] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong className="text-gray-600">{lang === 'BD' ? 'প্রস্তুতি: ' : 'Instruction: '}</strong>
                            {lang === 'BD' ? test.preparationBD : test.preparationEN}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Costing tag */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-100 pt-2.5 md:pt-0">
                      <span className="text-xs text-slate-400 block md:hidden">
                        {lang === 'BD' ? 'সংশ্লিষ্ট ফি' : 'Standard Rate'}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-base md:text-lg text-slate-800">
                          {test.priceBD}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">
                  {lang === 'BD' ? 'কোনো টেস্ট পাওয়া যায়নি।' : 'No matching tests found.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Interactive billing basket + 30% discounts details */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 sticky top-28 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#198a96]" />
                <h4 className="font-bold text-md text-[#0b2447]">
                  {lang === 'BD' ? 'টেস্ট হিসাব বুকলেট' : 'My Selection Basket'}
                </h4>
              </div>
              {selectedTests.length > 0 && (
                <button
                  onClick={clearSelected}
                  className="text-xs text-red-500 hover:underline font-bold flex items-center gap-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {lang === 'BD' ? 'সব মুছুন' : 'Clear'}
                </button>
              )}
            </div>

            {selectedTests.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                <p>{lang === 'BD' ? 'বাম দিক থেকে টেস্ট সিলেক্ট করুন।' : 'Add tests on the left to estimate pricing.'}</p>
                <div className="mt-4 p-4 bg-amber-50/50 rounded-xl text-amber-800 text-left border border-amber-100/40 leading-relaxed">
                  <span className="font-bold block">💡 {lang === 'BD' ? '৩০% পর্যন্ত বিশাল ছাড়!' : 'Up to 30% Diagnostic Discount'}</span>
                  {lang === 'BD' 
                    ? 'প্যাথলজিক্যাল টেস্টে নির্দিষ্ট কর্পোরেট কার্ড, সরকারি রেফারাল বা ইন্স্যুরেন্স কার্ডে ৩০% পর্যন্ত ডিসকাউন্ট পেতে পারেন।' 
                    : 'Show your corporate ID or referral during physical billing to receive the diagnostic partner discount.'
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {/* List of select tests */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedTests.map((t) => (
                    <div key={t.id} className="flex justify-between items-center text-xs text-gray-600 bg-slate-50 p-2 rounded-lg">
                      <span className="font-medium truncate max-w-[180px]">
                        {lang === 'BD' ? t.nameBD : t.nameEN}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{t.priceBD}</span>
                        <button 
                          onClick={() => handleSelectTest(t)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Calculation details */}
                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>{lang === 'BD' ? 'উপ-মোট ফি:' : 'Subtotal Fee:'}</span>
                    <span className="font-medium">
                      {lang === 'BD' ? `৳ ${toBengaliNumber(subtotal)}` : `৳ ${subtotal}`}
                    </span>
                  </div>

                  {/* 30% partner discount badge */}
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'BD' ? 'রেফারাল ছাড় (৩০%):' : 'Partner Discount (30%):'}
                    </span>
                    <span>
                      {lang === 'BD' ? `- ৳ ${toBengaliNumber(discountAmount)}` : `- ৳ ${discountAmount}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-800 text-base font-extrabold border-t border-gray-100 pt-2">
                    <span>{lang === 'BD' ? 'চূড়ান্ত প্রাক্কলিত বিল:' : 'Total Estimate:'}</span>
                    <span className="text-[#198a96]">
                      {lang === 'BD' ? `৳ ${toBengaliNumber(finalTotal)}` : `৳ ${finalTotal}`}
                    </span>
                  </div>
                </div>

                {/* Info Disclaimer */}
                <p className="text-[10px] text-gray-400 leading-normal italic pt-2">
                  * {lang === 'BD' 
                    ? 'এটি একটি আনুমানিক হিসাব। সরকারি ফি ও রি-এজেন্ট চার্জের সর্বশেষ পরিবর্তন সাপেক্ষে হসপিটাল কাউন্টারে মূল বিল নির্ধারিত হবে।' 
                    : 'This is an estimate. Rates might shift depending on government regulation and diagnostic reagent costs.'
                  }
                </p>

                {/* Call helpline to verify discount and book */}
                <div className="pt-3">
                  <a
                    href="tel:+8801797-975461"
                    className="w-full flex items-center justify-center gap-2 bg-[#0b2447] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {lang === 'BD' ? 'টেস্টের জন্য অগ্রিম বুকিং কল করুন' : 'Call and Pre-Book Tests'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { DOCTORS_DATA, DIAGNOSTICS_DATA } from '../data';
import { CreditCard, Check, ShieldCheck, Printer, RefreshCw, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

interface PaymentSystemProps {
  lang: 'BD' | 'EN';
  selectedDiagnosticsTotal?: number;
}

interface SavedTransaction {
  trxId: string;
  patientName: string;
  phone: string;
  amount: number;
  paymentType: string;
  method: 'bkash' | 'nagad' | 'rocket';
  date: string;
  reference: string;
}

export default function PaymentSystem({ lang, selectedDiagnosticsTotal = 0 }: PaymentSystemProps) {
  // Navigation tabs: 'pay' | 'history'
  const [activeTab, setActiveTab] = React.useState<'pay' | 'history'>('pay');
  const [paymentType, setPaymentType] = React.useState<string>('doctor');
  const [doctorId, setDoctorId] = React.useState<string>('');
  const [patientName, setPatientName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [reference, setReference] = React.useState<string>('');
  const [customAmount, setCustomAmount] = React.useState<string>('');
  
  // Selected payment gateway state
  const [method, setMethod] = React.useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  
  // Interactive Simulator flow: 'input' | 'otp' | 'pin' | 'success'
  const [flowState, setFlowState] = React.useState<'input' | 'otp' | 'pin' | 'success'>('input');
  const [walletNumber, setWalletNumber] = React.useState<string>('');
  const [otpCode, setOtpCode] = React.useState<string>('');
  const [pinCode, setPinCode] = React.useState<string>('');
  
  const [latestTrx, setLatestTrx] = React.useState<SavedTransaction | null>(null);
  const [transHistory, setTransHistory] = React.useState<SavedTransaction[]>([]);
  const [agreeTerms, setAgreeTerms] = React.useState<boolean>(true);

  // Load transaction history from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('niramoy_payments');
    if (saved) {
      setTransHistory(JSON.parse(saved));
    }
  }, []);

  // Compute total amount based on payment type
  const computedAmount = React.useMemo(() => {
    if (paymentType === 'doctor') {
      const doc = DOCTORS_DATA.find(d => d.id === doctorId);
      if (!doc) return 0;
      // Extract numeric fee from string, fallback to 500
      if (doc.id === 'dr-nur-islam') return 700;
      if (['dr-shariful-nontu', 'dr-israt-jahan-lopa', 'dr-mm-haq-mahfil', 'dr-abdul-jabbar'].includes(doc.id)) return 600;
      if (doc.id === 'dr-nobiur-rahman') return 200;
      return 500;
    }
    if (paymentType === 'diagnostic') {
      return selectedDiagnosticsTotal > 0 ? selectedDiagnosticsTotal : 800; // default standard package if none selected
    }
    return parseFloat(customAmount) || 0;
  }, [paymentType, doctorId, customAmount, selectedDiagnosticsTotal]);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert(lang === 'BD' ? "অনুগ্রহ করে শর্তাবলীর সাথে সম্মত হন।" : "Please agree to the payment policy.");
      return;
    }
    if (computedAmount <= 0) {
      alert(lang === 'BD' ? "অনুগ্রহ করে একটি সঠিক টাকার পরিমাণ প্রদান করুন।" : "Please provide a valid payment amount.");
      return;
    }
    if (!patientName || !phone) {
      alert(lang === 'BD' ? "অনুগ্রহ করে রোগীর নাম এবং মোবাইল নম্বর প্রদান করুন।" : "Please provide patient name and contact number.");
      return;
    }
    // Set mock wallet number to match patient phone
    setWalletNumber(phone);
    setFlowState('otp');
  };

  const verifyOTP = () => {
    if (otpCode === '123456' || otpCode.length >= 4) {
      setFlowState('pin');
    } else {
      alert(lang === 'BD' ? "ভুল ওটিপি কোড! সিমুলেটরের জন্য '123456' ব্যবহার করুন বা যেকোনো ৪-৬ সংখ্যার নাম্বার দিন।" : "Incorrect OTP code. Use '123456' for simulation approval.");
    }
  };

  const verifyPIN = () => {
    if (pinCode.length >= 4) {
      const generatedTrxId = `NCD-TRX-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const pTypeName = paymentType === 'doctor' 
        ? (lang === 'BD' ? "ডাক্তার ভিজিট ফি" : "Doctor Visit Fee")
        : paymentType === 'diagnostic'
        ? (lang === 'BD' ? "ল্যাব ডায়াগনস্টিক ফি" : "Diagnostic Pathology")
        : (lang === 'BD' ? "ক্লিনিক জেনারেল বিল" : "Hospital Bill / Utilities");

      const newTrx: SavedTransaction = {
        trxId: generatedTrxId,
        patientName,
        phone,
        amount: computedAmount,
        paymentType: pTypeName,
        method,
        date: new Date().toLocaleDateString(lang === 'BD' ? 'bn-BD' : 'en-US', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        reference: reference || (paymentType === 'doctor' ? (DOCTORS_DATA.find(d => d.id === doctorId)?.nameBD || '') : "General payment")
      };

      const updatedHistory = [newTrx, ...transHistory];
      setTransHistory(updatedHistory);
      localStorage.setItem('niramoy_payments', JSON.stringify(updatedHistory));
      
      setLatestTrx(newTrx);
      setFlowState('success');
      
      // Clear payment values
      setOtpCode('');
      setPinCode('');
    } else {
      alert(lang === 'BD' ? "অনুগ্রহ করে একটি সঠিক পিন নম্বর প্রদান করুন।" : "Please enter a valid PIN.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const triggerReset = () => {
    setFlowState('input');
    setDoctorId('');
    setPatientName('');
    setPhone('');
    setReference('');
    setCustomAmount('');
  };

  // Color mappings for bKash, Nagad, Rocket brandings
  const brandConfig = {
    bkash: {
      name: lang === 'BD' ? "বিকাশ" : "bKash",
      color: "bg-[#e2125a]",
      textColor: "text-[#e2125a]",
      borderColor: "border-[#e2125a]",
      accentBg: "bg-[#e2125a]/10"
    },
    nagad: {
      name: lang === 'BD' ? "নগদ" : "Nagad",
      color: "bg-[#f58220]",
      textColor: "text-[#f58220]",
      borderColor: "border-[#f58220]",
      accentBg: "bg-[#f58220]/10"
    },
    rocket: {
      name: lang === 'BD' ? "রকেট" : "Rocket",
      color: "bg-[#8c3494]",
      textColor: "text-[#8c3494]",
      borderColor: "border-[#8c3494]",
      accentBg: "bg-[#8c3494]/10"
    }
  };

  return (
    <div id="payment-gateways" className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      {/* Top Bar Header */}
      <div className="bg-[#0b2447] text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#1ac0c6]" />
            {lang === 'BD' ? 'নিরাময় ডিজিটাল পেমেন্ট পোর্টাল' : 'Niramoy Digital Payment Gateways'}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            {lang === 'BD' 
              ? 'মোবাইল ফাইনান্সিয়াল সার্ভিস (bKash, Nagad, Rocket) ব্যবহার করে সহজেই ফি ও বিল পরিশোধ করুন।' 
              : 'Secure clinical payments instantly using active bKash, Nagad, or Rocket account credentials.'
            }
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900/40 p-1.5 rounded-xl border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('pay')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pay' ? 'bg-white text-[#0b2447]' : 'text-gray-350 hover:text-white'
            }`}
          >
            {lang === 'BD' ? 'বিল পরিশোধ করুন' : 'Pay Medical Bill'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'history' ? 'bg-white text-[#0b2447]' : 'text-gray-350 hover:text-white'
            }`}
          >
            {lang === 'BD' ? 'প্রিভিয়াস ট্রানজেকশন' : 'Receipt History'}
            {transHistory.length > 0 && (
              <span className="bg-[#1ac0c6] text-[#0b2447] text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                {transHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'pay' ? (
        flowState === 'input' ? (
          <form onSubmit={handleStartPayment} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Form Details */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#0b2447]">
                    {lang === 'BD' ? 'বিল ও পেমেন্টের ধরণ নির্বাচন করুন *' : 'Select Payment Category *'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'doctor', titleBD: 'ডাক্তার ফি', titleEN: 'Doctor Fee' },
                      { id: 'diagnostic', titleBD: 'ল্যাব টেস্ট', titleEN: 'Lab Test' },
                      { id: 'custom', titleBD: 'অন্যান্য বিল', titleEN: 'Other Bills' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPaymentType(t.id)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          paymentType === t.id 
                            ? 'bg-[#198a96] text-white border-[#198a96] shadow-sm'
                            : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'BD' ? t.titleBD : t.titleEN}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Fields */}
                {paymentType === 'doctor' && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#0b2447]">{lang === 'BD' ? 'ডাক্তার নির্বাচন করুন *' : 'Select Doctor *'}</label>
                    <select
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm"
                    >
                      <option value="">{lang === 'BD' ? '-- ডাক্তার নির্বাচন করুন --' : '-- Choose Specialist --'}</option>
                      {DOCTORS_DATA.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {lang === 'BD' ? `${doc.nameBD} (${doc.titleBD})` : `${doc.nameEN} (${doc.titleEN})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {paymentType === 'diagnostic' && (
                  <div className="bg-[#f0f9fa] border border-[#1ac0c6]/20 p-3 rounded-2xl text-xs space-y-1.5 text-slate-700">
                    <span className="font-bold text-[#0b2447] block">🔬 {lang === 'BD' ? 'ডায়াগনস্টিক ক্যালকুলেটর সিঙ্ক:' : 'Diagnostic Sync Info:'}</span>
                    <p>
                      {selectedDiagnosticsTotal > 0 
                        ? (lang === 'BD' 
                            ? `ল্যাব টেস্ট বিভাগ থেকে নির্বাচনকৃত টেস্টগুলোর সর্বমোট বিলঃ ${selectedDiagnosticsTotal} ৳` 
                            : `Selected laboratory diagnostic total synced: ${selectedDiagnosticsTotal} ৳`)
                        : (lang === 'BD' 
                            ? `অ্যাক্টিভ কোনো নির্বাচন নেই। স্ট্যান্ডার্ড সাধারণ ফুল বডি টেস্ট প্যাকেজ ফিঃ ৮০০ ৳ নেওয়া হবে।` 
                            : `No active diagnostic basket. Standard General Checkup Package: 800 ৳ will be compiled.`)}
                    </p>
                  </div>
                )}

                {paymentType === 'custom' && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#0b2447]">{lang === 'BD' ? 'বিল প্রদানের বিবরণ ও খাত *' : 'Enter billing purpose *'}</label>
                    <input
                      type="text"
                      required
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder={lang === 'BD' ? "যেমন: কেবিন বা বেড চার্জ, ঔষধের বিল..." : "e.g. Ward Charge, Medicine bill, etc."}
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm"
                    />
                  </div>
                )}

                {paymentType === 'custom' && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#0b2447]">{lang === 'BD' ? 'টাকার পরিমাণ (৳) *' : 'Payable Amount (৳) *'}</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={lang === 'BD' ? "টাকার পরিমাণ লিখুন" : "Enter amount in BDT"}
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm"
                    />
                  </div>
                )}

                {/* Patient Credentials */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#0b2447]">{lang === 'BD' ? 'রোগীর নাম *' : 'Patient Name *'}</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={lang === 'BD' ? "রোগীর পূর্ণ নাম প্রদান করুন" : "Enter Patient Full Name"}
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#0b2447]">{lang === 'BD' ? 'মোবাইল নম্বর *' : 'Patient Mobile *'}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === 'BD' ? "যেমন: 01700-000000" : "Mobile for credentials verification"}
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Right Column: Gateway selection & Checkout totals */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-gray-200/55 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#0b2447] text-sm mb-3">
                    {lang === 'BD' ? 'পেমেন্ট গেটওয়ে চ্যানেল নির্বাচন করুন' : 'Select Mobile Payment Channel'}
                  </h4>

                  {/* Brand Selector Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => setMethod('bkash')}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        method === 'bkash' 
                          ? 'border-[#e2125a] bg-white shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {method === 'bkash' && <div className="w-2 h-2 rounded-full bg-[#e2125a]" />}
                        </div>
                        <div>
                          <strong className="text-gray-800 text-sm block">bKash (বিকাশ)</strong>
                          <span className="text-[10px] text-gray-400">Merchant Payment Gateways • Instant API</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#e2125a]/5 flex items-center justify-center text-[10px] font-extrabold text-[#e2125a]">
                        bKash
                      </div>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => setMethod('nagad')}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        method === 'nagad' 
                          ? 'border-[#f58220] bg-white shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {method === 'nagad' && <div className="w-2 h-2 rounded-full bg-[#f58220]" />}
                        </div>
                        <div>
                          <strong className="text-gray-800 text-sm block">Nagad (নগদ)</strong>
                          <span className="text-[10px] text-gray-400">Fast transaction • Charge 0%</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#f58220]/5 flex items-center justify-center text-[10px] font-extrabold text-[#f58220]">
                        Nagad
                      </div>
                    </button>

                    {/* Rocket */}
                    <button
                      type="button"
                      onClick={() => setMethod('rocket')}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        method === 'rocket' 
                          ? 'border-[#8c3494] bg-white shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {method === 'rocket' && <div className="w-2 h-2 rounded-full bg-[#8c3494]" />}
                        </div>
                        <div>
                          <strong className="text-gray-800 text-sm block">DBBL Rocket (রকেট)</strong>
                          <span className="text-[10px] text-gray-400">Dutch-Bangla Bank Secure Link</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#8c3494]/5 flex items-center justify-center text-[10px] font-extrabold text-[#8c3494]">
                        Rocket
                      </div>
                    </button>

                  </div>
                </div>

                {/* Confirm Card block and summary */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-bold">{lang === 'BD' ? 'পরিশোধযোগ্য বিলঃ' : 'Clinical Amount:'}</span>
                    <strong className="text-lg text-[#0b2447] font-black">{computedAmount} ৳</strong>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <input
                      id="agree-terms-check"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5"
                    />
                    <label htmlFor="agree-terms-check" className="text-[10px] text-gray-500 font-sans cursor-pointer leading-tight select-none">
                      {lang === 'BD' 
                        ? 'আমি নিরাময় ক্লিনিক লালমনিরহাটের ডিজিটাল রিফান্ড ও পেমেন্ট সার্ভিস প্রাইভেসী পলিসি মেনে নিচ্ছি।' 
                        : 'I accept NCD Lalmonirhat medical billing audit and instant checkout specifications.'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 text-center text-white text-xs font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${brandConfig[method].color}`}
                  >
                    {lang === 'BD' 
                      ? `${brandConfig[method].name} এর মাধ্যমে পরিশোধ করুন (${computedAmount} ৳)` 
                      : `Proceed with ${brandConfig[method].name} (${computedAmount} ৳)`}
                  </button>
                </div>

              </div>

            </div>
          </form>
        ) : (
          /* DIGITAL POPUP GATEWAY COMPILER OVERLAYS */
          <div className="p-6 md:p-12 flex items-center justify-center bg-slate-100 min-h-[360px]">
            <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              
              {/* Branded Gateway Header */}
              <div className={`p-5 text-white flex justify-between items-center ${brandConfig[method].color}`}>
                <div className="uppercase tracking-widest font-black text-sm">
                  {brandConfig[method].name} Checkout
                </div>
                <div className="text-xs bg-black/25 px-2 py-0.5 rounded-full font-bold">
                  {computedAmount} ৳
                </div>
              </div>

              {/* Core interactive input panels */}
              <div className="p-6 space-y-5">
                
                {flowState === 'otp' && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      {lang === 'BD' 
                        ? `রোগীর মোবাইল নাম্বারে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে। নিশ্চিতকরণের জন্য ওটিপি কোডটি টাইপ করুন।` 
                        : `A 6-digit verification code has been dispatched. Enter authentication code to continue.`}
                    </p>

                    <div className="bg-amber-50 border border-amber-200/50 p-2.5 rounded-xl text-[11px] text-amber-850 font-bold block">
                      💡 {lang === 'BD' ? `টেস্ট কোডঃ ` : `Simulator code: `} <span className="text-red-500 font-extrabold font-mono">123456</span>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="------"
                      className="w-full text-center tracking-[12px] font-black text-xl p-3 border border-gray-200 rounded-xl"
                    />

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setFlowState('input')}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {lang === 'BD' ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        disabled={otpCode.length < 4}
                        onClick={verifyOTP}
                        className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${brandConfig[method].color}`}
                      >
                        {lang === 'BD' ? 'যাচাই করুন' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {flowState === 'pin' && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      {lang === 'BD' 
                        ? `আপনার ${brandConfig[method].name} পিন নম্বর প্রদান করুন (নিরাপদ সিমুলেটর)।` 
                        : `Enter your private ${brandConfig[method].name} wallet PIN credentials.`}
                    </p>

                    <input
                      type="password"
                      maxLength={5}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="••••"
                      className="w-full text-center tracking-[16px] font-black text-xl p-3 border border-gray-200 rounded-xl"
                    />

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setFlowState('otp')}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {lang === 'BD' ? 'পিছনে যান' : 'Back'}
                      </button>
                      <button
                        type="button"
                        disabled={pinCode.length < 4}
                        onClick={verifyPIN}
                        className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${brandConfig[method].color}`}
                      >
                        {lang === 'BD' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm PAY'}
                      </button>
                    </div>
                  </div>
                )}

                {flowState === 'success' && latestTrx && (
                  <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h4 className="font-extrabold text-base text-emerald-600">
                        {lang === 'BD' ? 'পরিশোধ সফল হয়েছে!' : 'Payment Complete!'}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {lang === 'BD' ? 'ডিজিটাল পরিশোধ রসিদ মেমোরেন্ডাম' : 'Clinical Transaction Slip Generated'}
                      </p>
                    </div>

                    {/* Receipt Body */}
                    <div className="border border-dashed border-gray-200 p-4 rounded-2xl bg-slate-50 text-xs space-y-2.5 relative">
                      {/* Paid stamp mark */}
                      <div className="absolute right-3 top-3 border-4 border-emerald-500/30 text-emerald-500/40 text-[10px] font-black tracking-widest px-1 py-0.5 rounded-lg select-none uppercase rotate-12">
                        PAID - সফল হয়েছে
                      </div>

                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block">{lang === 'BD' ? 'রোগীর নাম' : 'Patient Name'}</span>
                        <strong className="text-gray-800">{latestTrx.patientName}</strong>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest block">{lang === 'BD' ? 'মোবাইল নম্বর' : 'Phone'}</span>
                          <strong className="text-gray-800">{latestTrx.phone}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest block">{lang === 'BD' ? 'পেমেন্ট মেথড' : 'Method'}</span>
                          <span className="text-[#0b2447] font-bold uppercase">{latestTrx.method} ({brandConfig[latestTrx.method].name})</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest block">{lang === 'BD' ? 'টাকার পরিমাণ' : 'Amount'}</span>
                          <strong className="text-[#198a96]">{latestTrx.amount} ৳</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest block">{lang === 'BD' ? 'খাত ও বিবরণ' : 'Ref/Purpose'}</span>
                          <strong className="text-gray-700 truncate block">{latestTrx.reference}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Transaction ID (TrxID)</span>
                        <strong className="text-[#0b2447] text-xs font-mono select-all block">{latestTrx.trxId}</strong>
                      </div>
                    </div>

                    {/* Return tools */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        {lang === 'BD' ? 'প্রিন্ট' : 'Print'}
                      </button>
                      <button
                        onClick={triggerReset}
                        className="flex-1 py-2 bg-[#0b2447] hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {lang === 'BD' ? 'নতুন পেমেন্ট' : 'Another Pay'}
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        )
      ) : (
        /* SAVED TRANSACTIONS HISTORY */
        <div className="p-6 md:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-lg font-bold text-[#0b2447]">
              {lang === 'BD' ? 'সংরক্ষিত পেমেন্ট রসিদ সমূহ' : 'Electronic Transaction Registry'}
            </h4>
            <p className="text-xs text-gray-500">
              {lang === 'BD' 
                ? 'এই ব্রাউজারে সংরক্ষিত আপনার সাম্প্রতিক সকল মোবাইল পেমেন্ট স্লিপের তালিকা।' 
                : 'Manage or print your previous payment confirmations recorded on this machine.'
              }
            </p>
          </div>

          {transHistory.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-150 rounded-2xl text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-bold leading-normal">
                {lang === 'BD' ? 'এখনো কোনো অনলাইন পেমেন্ট করা হয়নি।' : 'No successful active transactions found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {transHistory.map((trx) => (
                <div key={trx.trxId} className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0b2447] text-sm">{trx.patientName}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold text-[10px] border border-emerald-100 uppercase tracking-wider">
                        PAID
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 mt-1 mb-1.5 font-medium">
                      <span>🏷️ {trx.paymentType}</span>
                      <span>📞 {trx.phone}</span>
                      <span>🗓️ {trx.date}</span>
                    </div>

                    <div className="font-mono text-[10px] text-gray-400">
                      TrxID: <span className="font-bold text-gray-600 select-all">{trx.trxId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between w-full md:w-auto border-t md:border-t-0 border-gray-150 pt-2.5 md:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] block font-bold text-slate-400 uppercase">{brandConfig[trx.method].name}</span>
                      <strong className="text-[#198a96] text-sm font-black">{trx.amount} ৳</strong>
                    </div>

                    <button
                      onClick={() => {
                        setLatestTrx(trx);
                        setMethod(trx.method);
                        setFlowState('success');
                        setActiveTab('pay');
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold rounded-lg hover:border-gray-300 cursor-pointer text-[11px]"
                    >
                      {lang === 'BD' ? 'রসিদ দেখুন' : 'Slip'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

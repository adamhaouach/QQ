
import React, { useState } from 'react';
import { Coach, User, CoachingSession } from '../types';
import { INITIAL_TIME_SLOTS } from '../data/mockData';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  CheckCircle, 
  Award, 
  Clock, 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  AlertCircle, 
  Loader2, 
  Shield 
} from 'lucide-react';

interface CoachingProps {
  user: User;
  coaches: Coach[];
  sessions: CoachingSession[];
  onBook: (session: CoachingSession) => void;
}

type Step = 'LIST' | 'SCHEDULE' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

const Coaching: React.FC<CoachingProps> = ({ user, coaches, sessions, onBook }) => {
  const [currentStep, setCurrentStep] = useState<Step>('LIST');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [sessionType, setSessionType] = useState<'Private' | 'Group'>('Private');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(60);
  
  // Payment Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const calculateTotalPrice = () => {
    if (!selectedCoach) return 0;
    const baseRate = sessionType === 'Private' ? selectedCoach.price : Math.floor(selectedCoach.price / 2);
    return duration === 90 ? Math.floor(baseRate * 1.5) : baseRate;
  };

  const handleStartSchedule = (coach: Coach) => {
    setSelectedCoach(coach);
    setCurrentStep('SCHEDULE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setCurrentStep('PROCESSING');

    // Simulated API Call
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setPaymentError("Authentication failed. Review card credentials.");
      setCurrentStep('PAYMENT');
      return;
    }

    const newSession: CoachingSession = {
      id: Math.random().toString(36).substr(2, 9),
      coachId: selectedCoach!.id,
      coachName: selectedCoach!.name,
      userId: user.id,
      userName: user.name,
      date: selectedDate,
      time: selectedSlot!,
      duration: duration,
      price: calculateTotalPrice(),
      type: sessionType,
      status: 'Booked',
      transactionId: `TXN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    onBook(newSession);
    setCurrentStep('SUCCESS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSlotBooked = (coachId: string, date: string, slot: string) => {
    return sessions.some(s => 
      s.coachId === coachId && 
      s.date === date && 
      s.time === slot && 
      s.status !== 'Cancelled'
    );
  };

  const renderCoachList = () => (
    <>
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#95f122]/10 border border-[#95f122]/20 mb-4">
            <Award size={12} className="text-[#95f122]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#95f122]">Professional Academy</span>
          </div>
          <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Certified Instruction</h1>
          <p className="text-slate-400 text-lg">Book personalized training with our elite Federation coaches.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => setSessionType('Private')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${sessionType === 'Private' ? 'bg-[#95f122] text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Private
          </button>
          <button 
            onClick={() => setSessionType('Group')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${sessionType === 'Group' ? 'bg-[#95f122] text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Clinic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {coaches.map((coach) => (
          <div key={coach.id} className="group bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-[#95f122]/50 transition-all flex flex-col h-full shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-slate-900">
              <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Star className="w-3 h-3 text-[#95f122] fill-[#95f122]" />
                <span className="text-xs font-bold text-white">{coach.rating}</span>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-[#95f122] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded italic">
                  {coach.level}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#95f122]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">FMP Certified</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-[#95f122] transition-colors italic uppercase tracking-tighter">{coach.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                {coach.bio}
              </p>
              
              <div className="pt-6 border-t border-slate-700 mt-auto flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Rate</p>
                  <p className="text-xl font-black text-white">{sessionType === 'Private' ? coach.price : Math.floor(coach.price / 2)} MAD<span className="text-xs font-normal text-slate-500"> / hr</span></p>
                </div>
                <button
                  onClick={() => handleStartSchedule(coach)}
                  className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#95f122] hover:text-slate-900 transition-all flex items-center shadow-md"
                >
                  Schedule
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderSchedule = () => (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button 
        onClick={() => setCurrentStep('LIST')}
        className="flex items-center gap-3 text-slate-600 hover:text-white mb-12 font-bold text-[9px] uppercase tracking-[0.3em] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to coaches
      </button>

      <div className="mb-12">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">Schedule Lesson</h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">with {selectedCoach?.name}</p>
      </div>

      <div className="space-y-12 bg-[#12192b] p-10 rounded-2xl border border-white/5 shadow-2xl">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Select Date</h3>
          <div className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide border-b border-white/5">
            {[0, 1, 2, 3, 4, 5, 6].map(offset => {
              const d = new Date();
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = d.getDate();
              
              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedSlot(null);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[80px] p-5 rounded border transition-all ${
                    selectedDate === dateStr
                      ? 'bg-[#95f122] text-[#040812] border-[#95f122] scale-105 shadow-xl'
                      : 'bg-[#0a0f1c]/50 border-white/5 hover:border-white/10 text-slate-500 font-bold'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] mb-1">{dayName}</span>
                  <span className="text-xl font-black tracking-tighter">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Available Slots</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INITIAL_TIME_SLOTS.map(slot => {
              const isBooked = isSlotBooked(selectedCoach!.id, selectedDate, slot);
              return (
                <button
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-5 rounded text-[10px] font-bold border transition-all uppercase tracking-widest ${
                    isBooked
                      ? 'bg-transparent border-white/5 text-slate-800 cursor-not-allowed opacity-30'
                      : selectedSlot === slot
                        ? 'bg-[#95f122] text-[#040812] border-[#95f122]'
                        : 'bg-[#0a0f1c]/50 border-white/5 hover:border-[#95f122]/30 text-slate-500'
                  }`}
                >
                  {slot.split(' - ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">3. Duration</h3>
          <div className="flex gap-4">
            {[60, 90].map(m => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={`flex-1 py-4 rounded border font-bold text-[10px] uppercase tracking-widest transition-all ${
                  duration === m 
                    ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                    : 'bg-[#0a0f1c]/50 border-white/5 text-slate-500'
                }`}
              >
                {m} Minutes
              </button>
            ))}
          </div>
        </div>

        {selectedSlot && (
          <div className="pt-10 flex flex-col items-center">
             <div className="mb-8 text-center">
               <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Session Total</p>
               <p className="text-4xl font-black text-white italic tracking-tighter">{calculateTotalPrice()} MAD</p>
             </div>
             <button
                onClick={() => setCurrentStep('PAYMENT')}
                className="bg-[#95f122] text-[#040812] px-14 py-5 rounded font-black text-[10px] uppercase tracking-[0.2em] italic hover:bg-[#aeff33] transition-all flex items-center gap-4 shadow-xl shadow-[#95f122]/10"
              >
                Continue to Payment <ChevronRight size={14} />
              </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-500">
      <button 
        onClick={() => setCurrentStep('SCHEDULE')}
        className="flex items-center gap-3 text-slate-600 hover:text-white mb-12 font-bold text-[9px] uppercase tracking-[0.3em] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to schedule
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-[#12192b] p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#95f122]/30"></div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-14 flex items-center gap-4">
            <CreditCard className="text-[#95f122]" size={20} /> Secure Checkout
          </h2>

          <form onSubmit={handleProcessPayment} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="PLAYER NAME"
                className="w-full bg-[#0a0f1c] border border-white/5 rounded px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors uppercase tracking-widest placeholder:text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors placeholder:text-slate-800"
                />
                <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Expiry</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors text-center placeholder:text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">CVC</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="***"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors text-center placeholder:text-slate-800"
                />
              </div>
            </div>

            {paymentError && (
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded flex items-center gap-3 text-red-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <AlertCircle size={14} />
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#95f122] text-[#040812] py-5 rounded font-black text-[10px] uppercase italic tracking-[0.1em] hover:bg-[#aeff33] transition-all shadow-xl shadow-[#95f122]/10"
            >
              Confirm Payment ({calculateTotalPrice()} MAD)
            </button>
          </form>
        </div>

        <div className="space-y-10">
          <div className="bg-[#12192b] border border-white/5 p-10 rounded-2xl shadow-2xl">
            <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-12">Session Details</h3>
            <div className="space-y-10">
              <div className="flex items-center gap-6 pb-10 border-b border-white/5">
                <img src={selectedCoach?.avatar} className="w-20 h-20 rounded-full object-cover grayscale opacity-40" alt="" />
                <div>
                  <h4 className="text-white font-black italic uppercase tracking-tighter text-xl">{selectedCoach?.name}</h4>
                  <p className="text-[#95f122] text-[9px] font-black uppercase tracking-[0.25em] mt-1">{selectedCoach?.level} COACH</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Deployment</span>
                  <span className="text-white font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Window</span>
                  <span className="text-white font-bold">{selectedSlot}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Duration</span>
                  <span className="text-white font-bold">{duration} MINUTES</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Session Type</span>
                  <span className="text-white font-bold uppercase">{sessionType}</span>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Total Value</span>
                  <span className="text-3xl font-black text-white italic tracking-tighter">{calculateTotalPrice()} <span className="text-[10px] font-normal text-slate-500 uppercase italic tracking-normal ml-1">MAD</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0f1c] p-7 rounded-xl border border-white/5 space-y-5">
            <div className="flex items-center gap-4 text-[9px] text-slate-700 font-black uppercase tracking-[0.25em]">
              <Lock className="w-3.5 h-3.5 text-[#95f122]" /> SSL ENCRYPTED GATEWAY
            </div>
            <div className="flex items-center gap-4 text-[9px] text-slate-700 font-black uppercase tracking-[0.25em]">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-800" /> PCI COMPLIANT AUTHENTICATION
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-500">
      <div className="relative mb-14">
        <Loader2 className="w-20 h-20 text-[#95f122] animate-spin opacity-30" strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-[#95f122]" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-5">Verifying Transaction</h2>
      <p className="text-slate-600 max-w-sm mx-auto text-[10px] leading-relaxed font-black uppercase tracking-widest">
        Synchronizing with network gateway nodes. Please wait.
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="min-h-[600px] flex flex-col items-center justify-center text-center p-12 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-[#95f122] rounded-full flex items-center justify-center mb-12 shadow-2xl shadow-[#95f122]/20 border border-white/10">
        <CheckCircle className="w-10 h-10 text-[#040812]" />
      </div>
      <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">Session <br/><span className="text-[#95f122]">Authorized.</span></h2>
      <p className="text-slate-500 max-w-md mx-auto text-lg mb-16 font-bold uppercase italic tracking-tighter leading-relaxed">
        Your lesson with <strong>{selectedCoach?.name}</strong> is confirmed. Access tokens have been synced.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl mb-16">
        <div className="bg-[#12192b] p-8 rounded border border-white/5 shadow-2xl">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em] mb-3">Deployment</p>
          <p className="font-black text-white italic tracking-tighter text-xl uppercase">{selectedDate} @ {selectedSlot?.split(' - ')[0]}</p>
        </div>
        <div className="bg-[#12192b] p-8 rounded border border-white/5 shadow-2xl">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em] mb-3">Ledger Code</p>
          <p className="font-black text-[#95f122] italic tracking-tighter text-xl uppercase">COACH_{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <button 
          onClick={() => window.location.hash = '/profile'}
          className="bg-[#95f122] text-[#040812] px-12 py-5 rounded font-black text-[10px] uppercase italic tracking-[0.3em] hover:bg-[#aeff33] transition-all shadow-xl"
        >
          Player Dashboard
        </button>
        <button 
          onClick={() => {
            setCurrentStep('LIST');
            setSelectedCoach(null);
            setSelectedSlot(null);
          }}
          className="bg-slate-800 text-white border border-white/5 px-12 py-5 rounded font-black text-[10px] uppercase italic tracking-[0.3em] hover:bg-slate-700 transition-all"
        >
          New Booking
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {currentStep === 'LIST' && renderCoachList()}
      {currentStep === 'SCHEDULE' && renderSchedule()}
      {currentStep === 'PAYMENT' && renderPayment()}
      {currentStep === 'PROCESSING' && renderProcessing()}
      {currentStep === 'SUCCESS' && renderSuccess()}

      {currentStep === 'LIST' && (
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <ShieldCheck />, text: "FMP Certified Instructors" },
            { icon: <MapPin />, text: "Premium Facilities" },
            { icon: <Star />, text: "98% Player Satisfaction" },
            { icon: <CheckCircle />, text: "Video Analysis Available" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl text-center border border-white/5">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-[#95f122] mb-4 border border-white/5 shadow-inner">
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coaching;

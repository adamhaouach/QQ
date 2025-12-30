
import React, { useState } from 'react';
import { ClubEvent, User, TournamentRegistration, UserRole, TournamentMatch, MatchStatus, TournamentType } from '../types';
import TournamentBracket from '../components/TournamentBracket';
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Zap, 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Award,
  Info,
  Layout,
  Trophy,
  Filter,
  Swords
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventsProps {
  events: ClubEvent[];
  user: User | null;
  registrations: TournamentRegistration[];
  onRegister: (r: TournamentRegistration) => void;
}

type Step = 'List' | 'Payment' | 'Processing' | 'Success' | 'Bracket';

const Events: React.FC<EventsProps> = ({ events, user, registrations, onRegister }) => {
  const [currentStep, setCurrentStep] = useState<Step>('List');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [filterType, setFilterType] = useState<'All' | TournamentType>('All');
  
  // Payment Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isUserRegistered = (eventId: string) => {
    return user && registrations.some(r => r.tournamentId === eventId && r.userId === user.id);
  };

  const handleStartRegistration = (event: ClubEvent) => {
    if (event.status === 'Closed') {
      alert("REGISTRATION CLOSED: Bracket generation is currently in progress.");
      return;
    }
    if (!user) {
      window.location.hash = '/login';
      return;
    }
    setSelectedEvent(event);
    setCurrentStep('Payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewBracket = (event: ClubEvent) => {
    setSelectedEvent(event);
    setCurrentStep('Bracket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setCurrentStep('Processing');

    await new Promise(resolve => setTimeout(resolve, 2500));

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setPaymentError("Authentication failed. Review card credentials.");
      setCurrentStep('Payment');
      return;
    }

    const newReg: TournamentRegistration = {
      id: `reg_${Math.random().toString(36).substr(2, 6)}`,
      tournamentId: selectedEvent!.id,
      userId: user!.id,
      userName: user!.name,
      status: 'Paid',
      paidAmount: selectedEvent!.price,
      transactionId: `TXN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      registrationDate: new Date().toISOString()
    };

    onRegister(newReg);
    setCurrentStep('Success');
  };

  const filteredEvents = filterType === 'All' 
    ? events 
    : events.filter(e => e.type === filterType);

  const renderPayment = () => (
    <div className="max-w-4xl mx-auto pt-10 animate-in slide-in-from-right-8 duration-500 px-4 sm:px-6">
      <button 
        onClick={() => setCurrentStep('List')}
        className="flex items-center gap-3 text-slate-600 hover:text-white mb-8 md:mb-12 font-bold text-[8px] md:text-[9px] uppercase tracking-[0.3em] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to tournaments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="bg-[#12192b] p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#95f122]/30"></div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-10 md:mb-14 flex items-center gap-4">
            <CreditCard className="text-[#95f122]" size={20} /> Entry Payment
          </h2>

          <form onSubmit={handleProcessPayment} className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <label className="block text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Athlete Name</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="PRO NAME"
                className="w-full bg-[#0a0f1c] border border-white/5 rounded px-4 md:px-6 py-4 md:py-4 text-[11px] font-black text-white focus:outline-none focus:border-[#95f122]/40 transition-colors uppercase tracking-widest placeholder:text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Credential Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-4 md:px-6 py-4 md:py-4 text-[11px] font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors placeholder:text-slate-800"
                />
                <CreditCard className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">Expiry</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-4 md:px-6 py-4 md:py-4 text-[11px] font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors text-center placeholder:text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] ml-1">CVC</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="***"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded px-4 md:px-6 py-4 md:py-4 text-[11px] font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-colors text-center placeholder:text-slate-800"
                />
              </div>
            </div>

            {paymentError && (
              <div className="p-4 md:p-4 bg-red-950/20 border border-red-900/30 rounded flex items-center gap-3 text-red-400 text-[9px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                <Info size={14} />
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#95f122] text-[#040812] py-5 md:py-5 rounded font-black text-xs md:text-[10px] uppercase italic tracking-[0.1em] hover:bg-[#aeff33] transition-all shadow-xl shadow-[#95f122]/10 mt-4"
            >
              Authorize Payment ({selectedEvent?.price} MAD)
            </button>
          </form>
        </div>

        <div className="space-y-6 md:space-y-10">
          <div className="bg-[#12192b] border border-white/5 p-6 md:p-10 rounded-2xl shadow-2xl">
            <h3 className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-8 md:mb-12">Tournament Order</h3>
            <div className="space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 md:gap-6 pb-6 md:pb-10 border-b border-white/5">
                <img src={selectedEvent?.image} className="w-16 h-16 md:w-20 md:h-20 rounded object-cover grayscale opacity-40" alt="" />
                <div className="min-w-0">
                  <h4 className="text-white font-black italic uppercase tracking-tighter text-lg md:text-xl truncate">{selectedEvent?.title}</h4>
                  <p className="text-[#95f122] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mt-1">{selectedEvent?.category} CATEGORY</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center text-[10px] md:text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Deployment</span>
                  <span className="text-white font-bold">{selectedEvent?.date}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-xs">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Format</span>
                  <span className="text-white font-bold uppercase">{selectedEvent?.format}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-xs pt-4 border-t border-white/5">
                  <span className="text-slate-600 font-black uppercase tracking-[0.2em]">Tournament Protocol</span>
                  <span className={`font-black italic ${selectedEvent?.type === TournamentType.RANKED ? 'text-[#95f122]' : 'text-slate-400'}`}>
                    {selectedEvent?.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="pt-8 md:pt-10 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Total Value</span>
                  <span className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{selectedEvent?.price} <span className="text-[8px] md:text-[10px] font-normal text-slate-500 uppercase italic tracking-normal ml-1">MAD</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBracketView = () => {
    const displayBracket = selectedEvent?.bracket || [];
    return (
      <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-white/5 pb-8 md:pb-10 gap-6">
          <div>
            <button 
              onClick={() => setCurrentStep('List')}
              className="flex items-center gap-3 text-slate-600 hover:text-white mb-6 md:mb-8 font-bold text-[8px] md:text-[9px] uppercase tracking-[0.3em] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to event list
            </button>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4 md:gap-6">
               <Trophy className="text-[#95f122] shrink-0" size={24} /> <span className="truncate">{selectedEvent?.title}</span> <span className="hidden sm:inline text-slate-700">MATRIX</span>
            </h2>
            <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mt-3 md:mt-4">Real-time competitive outcome telemetry.</p>
          </div>
        </header>

        {displayBracket.length > 0 ? (
          <TournamentBracket matches={displayBracket as TournamentMatch[]} canEdit={false} />
        ) : (
          <div className="py-20 md:py-32 text-center bg-slate-900 border border-white/5 p-8">
             {/* Fix: removed invalid md:size prop from Lucide icon */}
             <Trophy size={40} className="mx-auto text-slate-800 mb-6" />
             <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Bracket Offline</h3>
             <p className="text-slate-600 text-[9px] md:text-[10px] uppercase font-bold tracking-widest max-w-xs md:max-w-sm mx-auto">Registration is active. Matrix will initialize once capacity is reached.</p>
          </div>
        )}
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="min-h-[400px] md:min-h-[500px] pt-24 md:pt-32 flex flex-col items-center justify-center text-center p-8 md:p-12 animate-in fade-in duration-500">
      <div className="relative mb-10 md:mb-14">
        <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-[#95f122] animate-spin opacity-30" strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#95f122]" />
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-4 md:mb-5">Validating Entry</h2>
      <p className="text-slate-600 max-w-[280px] md:max-w-sm mx-auto text-[8px] md:text-[10px] leading-relaxed font-black uppercase tracking-widest">
        Syncing with inter-bank gateway nodes. Transaction in progress.
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="min-h-[500px] md:min-h-[600px] pt-24 md:pt-32 flex flex-col items-center justify-center text-center p-8 md:p-12 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-[#95f122] rounded-full flex items-center justify-center mb-8 md:mb-12 shadow-2xl shadow-[#95f122]/20 border border-white/10">
        <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-[#040812]" />
      </div>
      <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6 md:mb-8 leading-none">Entry <br/><span className="text-[#95f122]">Confirmed.</span></h2>
      <p className="text-slate-500 max-w-[280px] md:max-w-md mx-auto text-sm md:text-lg mb-10 md:mb-16 font-bold uppercase italic tracking-tighter leading-relaxed">
        Your position in the <strong>{selectedEvent?.title}</strong> is secured. Access tokens have been synced.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-xl mb-10 md:mb-16 px-4">
        <div className="bg-[#12192b] p-6 md:p-8 rounded border border-white/5 shadow-2xl">
          <p className="text-[8px] md:text-[9px] text-slate-700 font-black uppercase tracking-[0.3em] mb-2 md:mb-3">Deployment</p>
          <p className="font-black text-white italic tracking-tighter text-lg md:text-xl uppercase">{selectedEvent?.date}</p>
        </div>
        <div className="bg-[#12192b] p-6 md:p-8 rounded border border-white/5 shadow-2xl">
          <p className="text-[8px] md:text-[9px] text-slate-700 font-black uppercase tracking-[0.3em] mb-2 md:mb-3">Ticket Ledger</p>
          <p className="font-black text-[#95f122] italic tracking-tighter text-lg md:text-xl uppercase">TOURN_{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full md:w-auto px-4">
        <button 
          onClick={() => window.location.hash = '/profile'}
          className="w-full md:w-auto bg-[#95f122] text-[#040812] px-10 md:px-12 py-5 md:py-5 rounded font-black text-xs md:text-[10px] uppercase italic tracking-[0.3em] hover:bg-[#aeff33] transition-all shadow-xl"
        >
          View Dashboard
        </button>
        <button 
          onClick={() => {
            setCurrentStep('List');
            setSelectedEvent(null);
          }}
          className="w-full md:w-auto bg-slate-800 text-white border border-white/20 px-10 md:px-12 py-5 md:py-5 rounded font-black text-xs md:text-[10px] uppercase italic tracking-[0.3em] hover:bg-slate-700 transition-all"
        >
          Back to Events
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040812]">
      {currentStep === 'List' && (
        <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-[#95f122]/10 border border-[#95f122]/20 px-2 md:px-3 py-1 mb-4 md:mb-6">
              <Zap size={14} className="text-[#95f122]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#95f122]">Competitive Events</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl sport-headline text-white italic mb-6 md:mb-8 leading-none">
              TOURNAMENT <span className="text-[#95f122]">RADAR.</span>
            </h1>
            
            <div className="flex bg-[#0c1221] border border-white/5 p-1 rounded-sm w-full sm:w-auto overflow-x-auto custom-scrollbar gap-1 mb-8">
              {(['All', TournamentType.CASUAL, TournamentType.RANKED] as const).map(type => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 min-w-[80px] sm:min-w-[120px] py-2 px-4 text-[9px] font-black uppercase tracking-widest transition-all ${
                    filterType === type ? 'bg-[#95f122] text-[#040812]' : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <p className="hidden md:block text-slate-400 text-base md:text-xl font-bold uppercase italic tracking-tighter opacity-80 max-w-2xl leading-tight">
              Compete in open tournaments and exclusive club events across Morocco. Prove your level in Ranked matches or enjoy Casual play.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {filteredEvents.filter(e => e.status !== 'Cancelled').map((event) => (
              <div key={event.id} className="group relative bg-slate-900 border border-white/5 md:border-2 hover:border-[#95f122] transition-all duration-300 shadow-2xl flex flex-col md:flex-row">
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r-2 border-white/10">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover filter grayscale contrast-150 brightness-50 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b1a] to-transparent md:hidden"></div>
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
                    <div className="bg-[#95f122] text-[#040812] px-3 py-1 md:px-4 md:py-1.5 font-black uppercase italic tracking-tighter text-[10px] md:text-xs transform -skew-x-12">
                      <span className="block transform skew-x-12">{event.category?.toUpperCase() || 'FEATURED EVENT'}</span>
                    </div>
                    {event.type === TournamentType.RANKED && (
                      <div className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-1.5 font-black uppercase italic tracking-tighter text-[10px] md:text-xs transform -skew-x-12 flex items-center gap-2">
                        <Swords size={12} className="transform skew-x-12" />
                        <span className="block transform skew-x-12">RANKED SYSTEM</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 md:p-10 lg:p-16 md:w-3/5 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6 md:mb-8">
                    <span className="flex items-center gap-2 text-slate-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#95f122]" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2 text-slate-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#95f122]" /> CLUB ARENA
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 md:mb-6 group-hover:text-[#95f122] transition-colors">{event.title}</h2>
                  <p className="hidden md:block text-slate-400 text-sm md:text-lg font-bold uppercase italic tracking-tighter leading-tight mb-8 md:mb-12 opacity-80">{event.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-14">
                    <div>
                      <p className="text-[8px] md:text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">ENTRY FEE</p>
                      <p className="text-2xl md:text-4xl font-black text-white italic tracking-tighter">
                        {event.type === TournamentType.RANKED ? `${event.price} MAD` : 'FREE'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">CAPACITY</p>
                      <p className="text-2xl md:text-4xl font-black text-[#95f122] italic tracking-tighter">{event.capacity - event.registeredCount} <span className="text-[10px] md:text-sm font-black text-slate-700 tracking-normal opacity-50 uppercase"> SLOTS</span></p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
                    {isUserRegistered(event.id) ? (
                      <div className="w-full sm:w-auto bg-teal-900/20 text-[#95f122] px-8 md:px-12 py-5 md:py-5 border border-[#95f122]/30 text-xs md:text-sm font-black uppercase italic tracking-widest flex items-center justify-center gap-3 md:gap-4">
                        <ShieldCheck size={18} /> REGISTERED
                      </div>
                    ) : event.status === 'Closed' ? (
                       <div className="w-full sm:w-auto bg-red-900/10 text-red-500 px-8 md:px-12 py-5 md:py-5 border border-red-900/20 text-xs md:text-sm font-black uppercase italic tracking-widest flex items-center justify-center gap-3 md:gap-4">
                        CLOSED
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStartRegistration(event)}
                        className="w-full sm:w-auto bg-[#95f122] text-[#040812] px-8 md:px-12 py-5 md:py-5 btn-sport text-sm md:text-sm flex items-center justify-center gap-3 md:gap-4 shadow-2xl">
                        {event.type === TournamentType.RANKED ? 'Enter Tournament' : 'Join Casual Event'} <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={4} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewBracket(event)}
                      className="w-full sm:w-auto bg-slate-800 text-white border border-white/20 px-8 md:px-12 py-5 md:py-5 btn-sport text-sm md:text-sm flex items-center justify-center gap-2 md:gap-3">
                      <Layout size={16} className="shrink-0" /> View Matrix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'Payment' && renderPayment()}
      {currentStep === 'Processing' && renderProcessing()}
      {currentStep === 'Success' && renderSuccess()}
      {currentStep === 'Bracket' && renderBracketView()}
    </div>
  );
};

export default Events;

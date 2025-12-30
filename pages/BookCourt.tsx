import React, { useState, useEffect, useMemo } from 'react';
import { 
  Court, Booking, User, FeatureConfig, MatchType, SkillLevel, 
  GenderPreference, MatchMessage, PlayerRank, SkillTier, SquadMember, Friend 
} from '../types';
import { INITIAL_TIME_SLOTS } from '../data/mockData';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft,
  Users,
  Target,
  Zap,
  Star,
  Swords,
  CheckCircle2,
  Activity,
  Wifi,
  WifiOff,
  User as UserIcon,
  ThumbsUp,
  MessageCircle,
  Filter,
  Flag,
  Trophy,
  Dribbble,
  Circle,
  X as XIcon,
  Send,
  ChevronRight,
  Settings2,
  UserPlus,
  Trash2
} from 'lucide-react';

interface BookCourtProps {
  user: User;
  courts: Court[];
  bookings: Booking[];
  onBook: (booking: Booking) => void;
  featureConfig: FeatureConfig;
}

type Step = 'Selection' | 'Squad' | 'Payment' | 'Processing' | 'Success';
type BookingMode = 'Standard' | 'Matchmaking';
type MatchmakingStep = 'config' | 'searching' | 'found' | 'active' | 'rating';

const BookCourt: React.FC<BookCourtProps> = ({ user, courts, bookings, onBook, featureConfig }) => {
  const [bookingMode, setBookingMode] = useState<BookingMode>('Standard');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('Selection');
  
  // Squad State
  const [squad, setSquad] = useState<SquadMember[]>([]);

  // Matchmaking State
  const [mmStep, setMmStep] = useState<MatchmakingStep>('config');
  const [mmSize, setMmSize] = useState<'1v1' | '2v2'>('2v2');
  const [targetSkill, setTargetSkill] = useState<SkillLevel>(SkillLevel.INTERMEDIATE);
  const [genderPref, setGenderPref] = useState<GenderPreference>(GenderPreference.ANY);
  const [searchTimer, setSearchTimer] = useState(0);
  const [foundPlayersCount, setFoundPlayersCount] = useState(1);
  const [foundTimer, setFoundTimer] = useState(10);
  const [chatMessages, setChatMessages] = useState<MatchMessage[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState('');

  const canLaunchMatchRequest = useMemo(() => {
    return !!selectedCourt && !!selectedDate && !!selectedSlot && (bookingMode === 'Standard' || !!mmSize);
  }, [selectedCourt, selectedDate, selectedSlot, bookingMode, mmSize]);

  // Squad Completeness check
  const isSquadComplete = useMemo(() => {
    if (bookingMode === 'Standard') return true;
    const requiredSize = mmSize === '1v1' ? 1 : 2; // My side size
    return squad.length >= requiredSize;
  }, [bookingMode, mmSize, squad]);

  const bookingCalendar = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        full: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        num: d.getDate(),
        label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      };
    });
  }, []);

  useEffect(() => {
    let interval: number;
    if (mmStep === 'searching') {
      interval = window.setInterval(() => {
        setSearchTimer(prev => prev + 1);
        if (searchTimer === 3) setFoundPlayersCount(2);
        if (searchTimer === 6) setFoundPlayersCount(mmSize === '1v1' ? 2 : 3);
        if (searchTimer === 10) {
          setFoundPlayersCount(mmSize === '1v1' ? 2 : 4);
          setMmStep('found');
          setFoundTimer(10);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mmStep, searchTimer, mmSize]);

  useEffect(() => {
    let interval: number;
    if (mmStep === 'found' && foundTimer > 0) {
      interval = window.setInterval(() => setFoundTimer(prev => prev - 1), 1000);
    } else if (foundTimer === 0 && mmStep === 'found') {
      setMmStep('active');
    }
    return () => clearInterval(interval);
  }, [mmStep, foundTimer]);

  const handleStartMatchmakingFlow = () => {
    if (bookingMode === 'Standard') {
      setCurrentStep('Payment');
    } else {
      // Enter Squad Lobby
      setSquad([{ id: user.id, name: user.name, avatar: user.avatar || '', isReady: true, isHost: true }]);
      setCurrentStep('Squad');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('Processing');
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (bookingMode === 'Matchmaking') {
      setMmStep('searching');
      setSearchTimer(0);
      setFoundPlayersCount(1);
      setCurrentStep('Selection');
    } else {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        courtId: selectedCourt!.id,
        courtName: selectedCourt!.name,
        date: selectedDate!,
        timeSlot: selectedSlot!,
        price: selectedCourt!.price,
        status: 'Confirmed',
        transactionId: `TXN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      };
      onBook(newBooking);
      setCurrentStep('Success');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ProgressIndicator = () => {
    const phases = [
      { id: 'Selection', label: 'Select' },
      { id: 'Squad', label: 'Squad' },
      { id: 'Payment', label: 'Confirm' }
    ];
    if (bookingMode === 'Standard') phases.splice(1, 1);

    const currentPhaseIndex = currentStep === 'Selection' ? 0 : 
                             currentStep === 'Squad' ? 1 : 
                             currentStep === 'Payment' || currentStep === 'Processing' ? 2 : 3;

    return (
      <div className="flex items-center justify-center gap-4 mb-16 px-4">
        {phases.map((phase, idx) => {
          const isDone = idx < currentPhaseIndex;
          const isCurrent = currentStep === phase.id;
          return (
            <React.Fragment key={phase.id}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-[#95f122] border-[#95f122] text-[#040812]' :
                  isCurrent ? 'border-[#95f122] text-[#95f122] shadow-[0_0_10px_rgba(149,241,34,0.3)] animate-pulse' :
                  'border-white/10 text-slate-700'
                }`}>
                  {isDone ? <CheckCircle size={14} strokeWidth={4} /> : <span className="text-[10px] font-black italic">{idx + 1}</span>}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] italic transition-colors ${isCurrent || isDone ? 'text-white' : 'text-slate-800'}`}>
                  {phase.label}
                </span>
              </div>
              {idx < phases.length - 1 && (
                <div className={`w-8 h-[1px] ${isDone ? 'bg-[#95f122]' : 'bg-white/5'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderSquadLobby = () => {
    const maxSquadSize = mmSize === '1v1' ? 1 : 2;

    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-12">
        <header className="flex justify-between items-center border-b border-white/5 pb-8">
           <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Arena Squad Lobby</h2>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Protocol: Matchmaking {mmSize} • Arena: {selectedCourt?.name}</p>
           </div>
           <button onClick={() => setCurrentStep('Selection')} className="text-slate-700 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95"><ArrowLeft size={14}/> ABORT</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 italic"><Users size={16} className="text-[#95f122]"/> Your Battle Team</h3>
            <div className="grid grid-cols-2 gap-6">
               {[...Array(maxSquadSize)].map((_, idx) => {
                 const member = squad[idx];
                 return (
                   <div key={idx} className={`aspect-square border-2 flex flex-col items-center justify-center relative transition-all duration-500 rounded-sm ${member ? 'border-[#95f122] bg-[#95f122]/5 shadow-[0_0_20px_rgba(149,241,34,0.1)] scale-[1.02]' : 'border-white/5 bg-[#0a0f1c] border-dashed group hover:border-white/10'}`}>
                      {member ? (
                        <>
                          <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-20 h-20 rounded-full border-4 border-[#040812] mb-4 animate-in zoom-in duration-300" />
                          <p className="text-[11px] font-black text-white uppercase italic">{member.name}</p>
                          <span className={`text-[7px] font-black px-2 py-0.5 mt-2 rounded-[1px] ${member.isHost ? 'bg-amber-500 text-black' : 'bg-[#95f122] text-black'}`}>
                             {member.isHost ? 'HOST' : 'READY'}
                          </span>
                          {!member.isHost && (
                            <button onClick={() => setSquad(squad.filter(s => s.id !== member.id))} className="absolute top-2 right-2 text-slate-800 hover:text-red-500 transition-colors active:scale-75"><Trash2 size={12}/></button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-800 group-hover:text-slate-600 transition-colors">
                           <UserPlus size={32} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Waiting for Sync</span>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
            {squad.length < maxSquadSize && (
              <p className="text-[9px] text-slate-600 font-bold uppercase text-center leading-relaxed">Open your CLUSTER NODES panel to invite partners to your side.</p>
            )}
          </div>

          <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm flex flex-col justify-between">
             <div className="space-y-6">
                <h3 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Operational Summary</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-black text-slate-700 uppercase">Opponent Strategy</span>
                      <span className="text-[10px] font-black text-[#95f122] uppercase italic">Randomized Search</span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-black text-slate-700 uppercase">Match Protocol</span>
                      <span className="text-[10px] font-black text-white uppercase italic">{mmSize} Arena</span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-black text-slate-700 uppercase">Skill Floor</span>
                      <span className="text-[10px] font-black text-teal-500 uppercase italic">{targetSkill}</span>
                   </div>
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex justify-between items-end mb-8">
                   <div>
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Fee per Athlete</p>
                      <p className="text-2xl font-black text-white italic tracking-tighter">{Math.floor(selectedCourt!.price / (mmSize === '1v1' ? 2 : 4))} MAD</p>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                         <div className={`w-1.5 h-1.5 rounded-full ${isSquadComplete ? 'bg-[#95f122]' : 'bg-red-500 animate-pulse'}`} />
                         <span className={`text-[8px] font-black uppercase tracking-widest ${isSquadComplete ? 'text-[#95f122]' : 'text-red-500'}`}>{isSquadComplete ? 'CLUSTER READY' : 'NODES MISSING'}</span>
                      </div>
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Awaiting {maxSquadSize - squad.length} Syncs</p>
                   </div>
                </div>

                <button 
                  onClick={() => setCurrentStep('Payment')}
                  disabled={!isSquadComplete}
                  className={`w-full py-6 font-black text-[12px] uppercase italic tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 ${isSquadComplete ? 'bg-[#95f122] text-[#040812] hover:bg-[#aeff33] hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-600 opacity-30 cursor-not-allowed'}`}
                >
                   PROCEED TO SETTLEMENT <ChevronRight size={16} strokeWidth={4} />
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSelection = () => (
    <div className="space-y-12 pb-32">
      <ProgressIndicator />
      <div className="flex bg-[#0c1221] p-1 border border-white/5 rounded-sm max-w-sm">
        <button onClick={() => { setBookingMode('Standard'); setMmStep('config'); setSelectedCourt(null); setSelectedDate(null); setSelectedSlot(null); }} className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-95 ${bookingMode === 'Standard' ? 'bg-[#95f122] text-[#040812] shadow-[0_0_15px_rgba(149,241,34,0.3)]' : 'text-slate-500 hover:text-white'}`}>
          <Target size={12} /> Full Court
        </button>
        <button onClick={() => { setBookingMode('Matchmaking'); setMmStep('config'); setSelectedCourt(null); setSelectedDate(null); setSelectedSlot(null); }} className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-95 ${bookingMode === 'Matchmaking' ? 'bg-[#95f122] text-[#040812] shadow-[0_0_15px_rgba(149,241,34,0.3)]' : 'text-slate-500 hover:text-white'}`}>
          <Users size={12} /> Matchmaking
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[320px] space-y-8">
          <section className="bg-[#12192b] p-6 rounded-sm border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Facility Node</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {courts.map(court => {
                const isActive = selectedCourt?.id === court.id;
                return (
                  <button key={court.id} onClick={() => setSelectedCourt(court)} className={`flex items-center p-4 border-2 transition-all duration-200 ease-out rounded-sm text-left group relative overflow-hidden active:scale-[0.97] ${isActive ? 'bg-[#0c1221] border-[#95f122] shadow-[0_0_20px_rgba(149,241,34,0.3)] scale-[1.02] z-10' : 'bg-[#0a0f1c]/50 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5'}`}>
                    <img src={court.image} className={`w-10 h-10 rounded-sm object-cover mr-3 transition-all duration-300 ${isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-50'}`} />
                    <div className="min-w-0 pr-6"><p className={`text-[10px] font-black uppercase italic truncate transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>{court.name}</p><p className={`text-[7px] font-bold uppercase mt-0.5 ${isActive ? 'text-[#95f122]' : 'text-slate-700'}`}>{court.price} MAD</p></div>
                    {isActive && <CheckCircle2 size={14} className="absolute right-2 top-2 text-[#95f122] animate-in zoom-in-50 duration-200" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex-grow space-y-10">
          {selectedCourt ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#12192b] p-8 md:p-10 rounded-sm border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="mb-12">
                  <h3 className="text-xs font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-3"><CalendarIcon size={14} className="text-[#95f122]" /> 1. Operational Date</h3>
                  <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                    {bookingCalendar.map(d => (
                      <button key={d.full} onClick={() => { setSelectedDate(d.full); setSelectedSlot(null); }} className={`min-w-[85px] p-5 border-2 transition-all duration-200 ease-out rounded-sm flex flex-col items-center gap-1 active:scale-[0.97] ${selectedDate === d.full ? 'bg-[#0c1221] border-[#95f122] shadow-[0_0_20px_rgba(149,241,34,0.3)] scale-[1.02] font-black' : 'bg-[#0a0f1c] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5'}`}><span className={`text-[8px] font-black uppercase tracking-widest ${selectedDate === d.full ? 'text-[#95f122]' : 'text-slate-600'}`}>{d.day}</span><span className={`text-xl font-black italic tracking-tighter ${selectedDate === d.full ? 'text-white' : 'text-slate-500'}`}>{d.num}</span></button>
                    ))}
                  </div>
              </div>
              
              <div className={`${!selectedDate ? 'opacity-20 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                <h3 className="text-xs font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-3"><Clock size={14} className="text-[#95f122]" /> 2. Available Windows</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {INITIAL_TIME_SLOTS.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-5 text-[10px] font-black uppercase border-2 transition-all duration-200 ease-out active:scale-[0.97] ${selectedSlot === slot ? 'bg-[#95f122] text-[#040812] border-[#95f122] shadow-[0_0_20px_rgba(149,241,34,0.3)] scale-[1.02]' : 'bg-[#0a0f1c] border-white/5 text-slate-500 opacity-60 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5'}`}>{slot.split(' - ')[0]}</button>
                  ))}
                </div>
              </div>

              {bookingMode === 'Matchmaking' && selectedSlot && (
                <div className="mt-12 pt-12 border-t border-white/5 space-y-12 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">3. Match Protocol</label>
                      <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => setMmSize('1v1')} className={`p-6 border-2 rounded-sm flex flex-col items-center gap-3 transition-all duration-200 ease-out active:scale-[0.97] ${mmSize === '1v1' ? 'bg-[#0c1221] border-[#95f122] shadow-[0_0_20px_rgba(149,241,34,0.3)] scale-[1.02]' : 'bg-[#0a0f1c] border-white/5 text-slate-600 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5'}`}><div className="flex gap-2"><Circle size={16} fill={mmSize === '1v1' ? "#95f122" : "transparent"} className={mmSize === '1v1' ? 'text-[#95f122]' : 'text-slate-800'} /><div className="w-[1px] h-4 bg-white/20" /><Circle size={16} fill={mmSize === '1v1' ? "#95f122" : "transparent"} className={mmSize === '1v1' ? 'text-[#95f122]' : 'text-slate-800'} /></div><span className={`text-[10px] font-black uppercase tracking-widest ${mmSize === '1v1' ? 'text-white' : 'text-slate-600'}`}>Singles (1v1)</span></button>
                         <button onClick={() => setMmSize('2v2')} className={`p-6 border-2 rounded-sm flex flex-col items-center gap-3 transition-all duration-200 ease-out active:scale-[0.97] ${mmSize === '2v2' ? 'bg-[#0c1221] border-[#95f122] shadow-[0_0_20px_rgba(149,241,34,0.3)] scale-[1.02]' : 'bg-[#0a0f1c] border-white/5 text-slate-600 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5'}`}><div className="flex flex-col gap-1 items-center"><div className="flex gap-1.5"><Circle size={10} fill={mmSize === '2v2' ? "#95f122" : "transparent"} className={mmSize === '2v2' ? 'text-[#95f122]' : 'text-slate-800'}/><Circle size={10} fill={mmSize === '2v2' ? "#95f122" : "transparent"} className={mmSize === '2v2' ? 'text-[#95f122]' : 'text-slate-800'}/></div><div className="w-6 h-[1px] bg-white/20" /><div className="flex gap-1.5"><Circle size={10} fill={mmSize === '2v2' ? "#95f122" : "transparent"} className={mmSize === '2v2' ? 'text-[#95f122]' : 'text-slate-800'}/><Circle size={10} fill={mmSize === '2v2' ? "#95f122" : "transparent"} className={mmSize === '2v2' ? 'text-[#95f122]' : 'text-slate-800'}/></div></div><span className={`text-[10px] font-black uppercase tracking-widest ${mmSize === '2v2' ? 'text-white' : 'text-slate-600'}`}>Doubles (2v2)</span></button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">4. Competitive Filters</label>
                      <div className="space-y-4 bg-[#0a0f1c] p-6 border border-white/5 shadow-inner"><div className="space-y-2"><p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Skill Floor</p><select value={targetSkill} onChange={e => setTargetSkill(e.target.value as any)} className="w-full bg-[#040812] border border-white/10 p-3 text-[10px] font-black text-white uppercase outline-none focus:border-[#95f122]/30 transition-all duration-200">{Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}</select></div><div className="space-y-2"><p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Gender Pref</p><div className="flex gap-2">{[GenderPreference.ANY, GenderPreference.MALE, GenderPreference.FEMALE].map(g => (<button key={g} onClick={() => setGenderPref(g)} className={`flex-1 py-2 text-[8px] font-black uppercase border-2 transition-all duration-200 ease-out active:scale-[0.97] ${genderPref === g ? 'bg-[#0c1221] border-[#95f122] text-white shadow-[0_0_10px_#95f12233]' : 'border-white/10 text-slate-700 hover:border-white/20'}`}>{g.split(' ')[0]}</button>))}</div></div></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : <div className="h-96 flex flex-col items-center justify-center bg-[#0c1221] border border-dashed border-white/5 opacity-30 text-center p-12"><Target size={40} className="mb-6" /><h3 className="text-xl font-black text-white uppercase italic tracking-widest">Select Arena Hub</h3></div>}
        </div>
      </div>

      {canLaunchMatchRequest && currentStep === 'Selection' && (
        <div className="fixed bottom-0 left-0 w-full z-50 animate-in slide-in-from-bottom-full duration-300 ease-out">
          <div className="bg-[#12192b]/98 backdrop-blur-xl border-t border-[#95f122]/30 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]"><div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8"><div className="flex items-center gap-8 min-w-0"><div className="hidden sm:flex w-16 h-16 bg-[#040812] border-2 border-[#95f122]/20 items-center justify-center shrink-0 shadow-[0_0_15px_rgba(149,241,34,0.1)]">{bookingMode === 'Standard' ? <Target size={24} className="text-[#95f122]" /> : <Users size={24} className="text-[#95f122]" />}</div><div className="min-w-0"><p className="text-[9px] font-black text-[#95f122] uppercase italic tracking-widest mb-1 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#95f122] animate-pulse" /> Mission Ready</p><h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate leading-none mb-2">{selectedCourt?.name}</h4><div className="flex flex-wrap items-center gap-x-4 gap-y-1"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><CalendarIcon size={12}/> {bookingCalendar.find(d => d.full === selectedDate)?.label}</span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> {selectedSlot}</span><span className="text-[10px] font-black text-teal-500 uppercase tracking-widest flex items-center gap-2 italic"><Zap size={10} strokeWidth={3}/> {bookingMode === 'Standard' ? 'Full Court' : `MM Protocol (${mmSize})`}</span></div></div></div><div className="flex items-center gap-10 w-full md:w-auto"><div className="text-right hidden sm:block"><p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Settlement</p><p className="text-2xl font-black text-white italic tracking-tighter">{bookingMode === 'Standard' ? selectedCourt?.price : Math.floor(selectedCourt!.price / (mmSize === '1v1' ? 2 : 4))} <span className="text-xs font-normal text-slate-500 ml-1">MAD</span></p></div><button onClick={handleStartMatchmakingFlow} className="flex-grow md:flex-none px-12 py-5 bg-[#95f122] text-[#040812] font-black text-[11px] uppercase italic tracking-[0.2em] shadow-[0_0_20px_rgba(149,241,34,0.3)] hover:bg-[#aeff33] hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center gap-4">{bookingMode === 'Standard' ? 'CONFIRM ACTION' : 'LAUNCH SQUAD LOBBY'} <ChevronRight size={14} strokeWidth={3} /></button></div></div></div>
        </div>
      )}
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-5xl mx-auto pt-10 animate-in slide-in-from-right-8 duration-500">
      <ProgressIndicator />
      <button onClick={() => setCurrentStep(bookingMode === 'Matchmaking' ? 'Squad' : 'Selection')} className="flex items-center gap-3 text-slate-600 hover:text-white mb-12 font-black text-[10px] uppercase tracking-widest transition-colors active:scale-95"><ArrowLeft size={16}/> BACK</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16"><div className="bg-[#12192b] p-12 rounded-sm border border-white/5 shadow-2xl relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-[1px] bg-[#95f122]/30"></div><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-14 flex items-center gap-4"><CreditCard className="text-[#95f122]" size={28} /> AUTHORIZE PAYMENT</h2><form onSubmit={handleProcessPayment} className="space-y-8"><div className="space-y-2"><label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Account Holder</label><input type="text" required placeholder="NAME ON CARD" className="w-full bg-[#0a0f1c] border border-white/5 p-4 text-[11px] font-black text-white focus:outline-none focus:border-[#95f122]/40 uppercase tracking-widest placeholder:text-slate-900 transition-all" /></div><div className="space-y-2"><label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Card Sequence</label><input type="text" required placeholder="0000 0000 0000 0000" className="w-full bg-[#0a0f1c] border border-white/5 p-4 text-[11px] font-black text-white focus:outline-none focus:border-[#95f122]/40 tracking-[0.2em] placeholder:text-slate-900 transition-all" /></div><div className="grid grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Expiry</label><input type="text" required placeholder="MM/YY" className="bg-[#0a0f1c] border border-white/5 p-4 text-[11px] font-black text-white text-center focus:outline-none focus:border-[#95f122]/40 placeholder:text-slate-900 transition-all" /></div><div className="space-y-2"><label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">CVC</label><input type="text" required placeholder="***" className="bg-[#0a0f1c] border border-white/5 p-4 text-[11px] font-black text-white text-center focus:outline-none focus:border-[#95f122]/40 placeholder:text-slate-900 transition-all" /></div></div><button type="submit" className="w-full bg-[#95f122] text-[#040812] py-5 font-black text-[12px] uppercase italic tracking-[0.2em] mt-6 shadow-[0_15px_30px_rgba(149,241,34,0.3)] hover:bg-[#aeff33] active:scale-95 transition-all">CONFIRM SETTLEMENT</button></form></div><div className="bg-[#12192b] border border-white/5 p-12 rounded-sm space-y-12 shadow-2xl relative"><p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-4">MATCH SUMMARY</p><div className="flex gap-8 pb-10 border-b border-white/5"><img src={selectedCourt?.image} className="w-24 h-24 grayscale opacity-40 rounded-sm object-cover border border-white/5" /><div className="min-w-0"><h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedCourt?.name}</h4><p className="text-[#95f122] text-[11px] font-black mt-4 tracking-[0.2em] uppercase italic flex items-center gap-2"><Zap size={14} /> {bookingMode === 'Matchmaking' ? `MATCHMAKING (${mmSize})` : 'FULL ARENA RESERVATION'}</p><p className="text-slate-500 text-[10px] font-bold uppercase mt-1">{selectedDate} @ {selectedSlot}</p></div></div><div className="flex justify-between items-center text-xs font-black uppercase border-t border-white/5 pt-10"><span className="text-slate-600 tracking-[0.4em]">TOTAL COST</span><span className="text-white italic text-5xl tracking-tighter">{bookingMode === 'Matchmaking' ? Math.floor(selectedCourt!.price / (mmSize === '1v1' ? 2 : 4)) : selectedCourt?.price} <span className="text-[12px] font-normal text-slate-500 tracking-normal ml-2">MAD</span></span></div></div></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto overflow-x-hidden selection:bg-[#95f122] selection:text-[#040812]">
      {currentStep === 'Selection' && renderSelection()}
      {currentStep === 'Squad' && renderSquadLobby()}
      {currentStep === 'Payment' && renderPayment()}
      {currentStep === 'Processing' && (
        <div className="min-h-[600px] flex flex-col items-center justify-center p-12 animate-in fade-in duration-700">
          <Loader2 className="w-20 h-20 text-[#95f122] animate-spin opacity-30 mb-12" strokeWidth={1} />
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Verifying Credits</h2>
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">Connecting to network gateway nodes...</p>
        </div>
      )}
      {currentStep === 'Success' && (
        <div className="min-h-[700px] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500">
          <ProgressIndicator />
          <div className="w-28 h-28 bg-[#95f122] rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(149,241,34,0.3)] animate-in zoom-in duration-700"><CheckCircle size={48} className="text-[#040812]" /></div>
          <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">AUTHORIZED.</h2>
          <p className="text-slate-600 text-lg font-bold uppercase italic tracking-tighter max-w-xl mx-auto mb-20 leading-relaxed opacity-80">Match deployment successful. Check your dashboard for live telemetry.</p>
          <div className="flex flex-col sm:flex-row gap-6">
             <button onClick={() => window.location.hash = '/dashboard'} className="bg-[#95f122] text-[#040812] px-16 py-6 text-[12px] font-black uppercase tracking-[0.3em] italic shadow-2xl hover:bg-[#aeff33] transition-all active:scale-95">GO TO DASHBOARD</button>
             <button onClick={() => { setCurrentStep('Selection'); setSelectedCourt(null); setMmStep('config'); setBookingMode('Standard'); }} className="bg-slate-900 text-white border border-white/10 px-16 py-6 text-[12px] font-black uppercase tracking-[0.3em] italic hover:bg-slate-800 transition-all active:scale-95">NEW MISSION</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCourt;
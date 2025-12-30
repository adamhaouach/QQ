
import React, { useState } from 'react';
import { User, Court, Booking, Coach, ClubEvent, TournamentRegistration, TournamentMatch, MatchStatus, SeedingMode, TournamentLevel, ClubTier, UserRole, TournamentFormat } from '../types';
import TournamentBracket from '../components/TournamentBracket';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  BarChart2, 
  Plus, 
  Users, 
  ShieldCheck, 
  Edit3, 
  Power, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  Activity,
  UserPlus,
  Trophy,
  Info,
  ChevronLeft,
  X,
  Layout,
  Save,
  Share2,
  Lock,
  RefreshCw,
  Crown,
  History,
  Briefcase,
  Building2
} from 'lucide-react';

interface ClubDashboardProps {
  user: User;
  courts: Court[];
  bookings: Booking[];
  coaches: Coach[];
  events: ClubEvent[];
  registrations: TournamentRegistration[];
  onCreateTournament: (e: ClubEvent) => void;
  onUpdateTournament: (e: ClubEvent) => void;
  allUsers: User[];
}

type DashboardTab = 'inventory' | 'bookings' | 'staff' | 'revenue' | 'tournaments';
type CreationStep = 1 | 2 | 3 | 4 | 5;

const ClubDashboard: React.FC<ClubDashboardProps> = ({ 
  user, courts: initialCourts, bookings, coaches, events: initialEvents, registrations, onCreateTournament, onUpdateTournament, allUsers 
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('inventory');
  const [courts, setCourts] = useState<Court[]>(initialCourts);
  const [events, setEvents] = useState<ClubEvent[]>(initialEvents);
  const [isCreatingTournament, setIsCreatingTournament] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [creationStep, setCreationStep] = useState<CreationStep>(1);
  
  // Bracket State
  const [selectedTournament, setSelectedTournament] = useState<ClubEvent | null>(null);
  const [isManagingBracket, setIsManagingBracket] = useState(false);
  const [activeMatch, setActiveMatch] = useState<TournamentMatch | null>(null);

  // Feature Toggles based on Tier
  const canAccessTournaments = user.clubTier !== ClubTier.BASIC;
  const canAccessFullAnalytics = user.clubTier === ClubTier.ELITE;

  // Initialize bracket if missing
  const initBracket = (eventId: string): TournamentMatch[] => {
    const qf: TournamentMatch[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `${eventId}_qf_${i}`,
      round: 'QF',
      position: i,
      status: MatchStatus.PENDING,
      nextMatchId: `${eventId}_sf_${Math.floor(i/2)}`,
      nextMatchSlot: i % 2 === 0 ? 'A' : 'B'
    }));
    const sf: TournamentMatch[] = Array.from({ length: 2 }).map((_, i) => ({
      id: `${eventId}_sf_${i}`,
      round: 'SF',
      position: i,
      status: MatchStatus.PENDING,
      nextMatchId: `${eventId}_final_0`,
      nextMatchSlot: i % 2 === 0 ? 'A' : 'B'
    }));
    const final: TournamentMatch[] = [{
      id: `${eventId}_final_0`,
      round: 'Final',
      position: 0,
      status: MatchStatus.PENDING
    }];
    return [...qf, ...sf, ...final];
  };

  const handleUpdateMatch = () => {
    if (!activeMatch || !selectedTournament) return;

    let updatedBracket = selectedTournament.bracket?.map(m => m.id === activeMatch.id ? activeMatch : m) || [];

    if (activeMatch.status === MatchStatus.COMPLETED && activeMatch.winnerId && activeMatch.nextMatchId) {
      const winnerName = activeMatch.winnerId === 'A' ? activeMatch.teamA : activeMatch.teamB;
      updatedBracket = updatedBracket.map(m => {
        if (m.id === activeMatch.nextMatchId) {
          const updatedM = {
            ...m,
            [activeMatch.nextMatchSlot === 'A' ? 'teamA' : 'teamB']: winnerName
          };
          if (updatedM.teamA && updatedM.teamB) {
            updatedM.status = MatchStatus.SCHEDULED;
          }
          return updatedM;
        }
        return m;
      });
    }

    const updatedEvent = { ...selectedTournament, bracket: updatedBracket };
    setSelectedTournament(updatedEvent);
    onUpdateTournament(updatedEvent);
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setActiveMatch(null);
  };

  const handleAutoSeed = (tournamentId: string) => {
    const t = events.find(e => e.id === tournamentId);
    if (!t) return;

    const tournamentRegs = registrations.filter(r => r.tournamentId === tournamentId);
    const registeredUserNames = tournamentRegs.map(r => r.userName);
    
    while(registeredUserNames.length < 8) registeredUserNames.push(`PLAYER ${registeredUserNames.length + 1}`);
    
    let seededPlayers = [...registeredUserNames];
    if (t.seedingMode === SeedingMode.RANDOM) {
      seededPlayers.sort(() => Math.random() - 0.5);
    } else if (t.seedingMode === SeedingMode.RANKING) {
      const playerWithPoints = seededPlayers.map(name => {
        const u = allUsers.find(userObj => userObj.name === name);
        return { name, points: u?.points || 0 };
      });
      playerWithPoints.sort((a, b) => b.points - a.points);
      seededPlayers = [
        playerWithPoints[0].name, playerWithPoints[7].name,
        playerWithPoints[3].name, playerWithPoints[4].name,
        playerWithPoints[1].name, playerWithPoints[6].name,
        playerWithPoints[2].name, playerWithPoints[5].name,
      ];
    }

    const updatedBracket = t.bracket?.map((m) => {
      if (m.round === 'QF') {
        const p1 = seededPlayers[m.position * 2];
        const p2 = seededPlayers[m.position * 2 + 1];
        return { 
          ...m, 
          teamA: p1, 
          teamB: p2, 
          status: MatchStatus.SCHEDULED 
        };
      }
      return m;
    });

    const updatedEvent = { ...t, bracket: updatedBracket, status: 'Closed' as const };
    onUpdateTournament(updatedEvent);
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSelectedTournament(updatedEvent);
    alert("Automatic seeding protocol complete. Bracket synchronized.");
  };

  const clubName = user.name.includes('CLUB') ? user.name : `${user.name} ARENA`;
  const clubEvents = events.filter(e => e.clubId === user.id || e.id === 'e1' || e.id === 'e2');
  
  const updatePrice = (id: string, price: number) => {
    setCourts(prev => prev.map(c => c.id === id ? { ...c, price } : c));
  };

  const totalRevenue = bookings.reduce((acc, b) => b.status === 'Confirmed' ? acc + b.price : acc, 0);

  const [newTournament, setNewTournament] = useState<Partial<ClubEvent>>({
    title: '',
    category: 'Open',
    format: TournamentFormat.KNOCKOUT,
    gender: 'Mixed',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    capacity: 32,
    price: 150,
    prizePoolPercent: 30,
    rules: 'Standard FMP scoring rules apply.',
    description: '',
    image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800',
    level: TournamentLevel.OPEN_1000
  });

  const handleCreateSubmit = () => {
    const eventId = `e_new_${Math.random().toString(36).substr(2, 5)}`;
    const finalTournament: ClubEvent = {
      ...newTournament as ClubEvent,
      id: eventId,
      clubId: user.id,
      registeredCount: 0,
      status: 'Pending',
      bracket: initBracket(eventId),
      seedingMode: SeedingMode.RANKING,
      level: TournamentLevel.OPEN_1000
    };
    onCreateTournament(finalTournament);
    setEvents(prev => [...prev, finalTournament]);
    setIsCreatingTournament(false);
    setCreationStep(1);
  };

  const renderInventory = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Asset Inventory</h3>
        <button className="w-full sm:w-auto bg-[#95f122] text-[#040812] px-6 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-[#aeff33] transition-all flex items-center justify-center gap-2 shadow-lg">
          <Plus size={14} /> Provision Court
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {courts.map((court) => (
          <div key={court.id} className="bg-[#0c1221] border border-white/5 overflow-hidden flex flex-col group relative rounded-sm shadow-xl">
            <div className="relative h-40 md:h-48 overflow-hidden">
              <img src={court.image} className="w-full h-full object-cover grayscale brightness-50 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1221] to-transparent" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-2 bg-[#040812]/80 text-[#95f122] border border-white/10 hover:border-[#95f122] transition-colors">
                  <Edit3 size={14} />
                </button>
                <button className="p-2 bg-[#040812]/80 text-red-500 border border-white/10 hover:border-red-500 transition-colors">
                  <Power size={14} />
                </button>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-black text-white uppercase italic tracking-tighter truncate">{court.name}</h4>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{court.type} Arena</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Rate</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={court.price} 
                      onChange={(e) => updatePrice(court.id, parseInt(e.target.value))}
                      className="w-14 md:w-20 bg-[#040812] border border-white/10 px-2 py-1 text-[10px] md:text-xs font-black text-[#95f122] focus:outline-none focus:border-[#95f122]"
                    />
                    <span className="text-[8px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest">MAD</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase text-slate-600 border-t border-white/5 pt-4">
                 <span className="flex items-center gap-1.5"><Activity size={12} className="text-[#95f122]" /> 84% Load</span>
                 <span className="text-[#95f122]">Operational</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTournaments = () => {
    if (!canAccessTournaments) {
      return (
        <div className="bg-[#0c1221] border border-dashed border-white/10 p-10 md:p-20 text-center rounded-sm">
           <Lock size={32} className="text-slate-800 mx-auto mb-6" />
           <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter mb-4">Tournaments Restricted</h3>
           <p className="text-slate-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest max-w-xs md:max-w-sm mx-auto leading-relaxed">
             The Pro or Elite monetization plan is required to create and manage national tournaments.
           </p>
           <button className="mt-8 w-full sm:w-auto px-8 py-3 bg-[#95f122] text-[#040812] text-[9px] font-black uppercase tracking-widest hover:bg-[#aeff33] transition-all italic shadow-xl">Upgrade Node Plan</button>
        </div>
      );
    }

    return (
      <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-8 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Competitive Events</h3>
          <button 
            onClick={() => setIsCreatingTournament(true)}
            className="w-full sm:w-auto bg-[#95f122] text-[#040812] px-6 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-[#aeff33] transition-all flex items-center justify-center gap-2 shadow-lg">
            <Plus size={14} /> New Tournament
          </button>
        </div>

        <div className="bg-[#0c1221] border border-white/5 overflow-x-auto custom-scrollbar rounded-sm shadow-2xl">
          <table className="w-full text-left min-w-[750px] lg:min-w-0">
            <thead className="bg-[#040812] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Event</th>
                <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Slots</th>
                <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Status</th>
                <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Seeding</th>
                <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clubEvents.map((e) => (
                <tr key={e.id} className="text-[9px] md:text-[10px] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-black text-white uppercase italic tracking-widest truncate max-w-[150px]">{e.title}</p>
                    <p className="text-[7px] md:text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{e.category} • {e.date}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-200">
                    <span className="text-[#95f122]">{e.registeredCount}</span> / {e.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[7px] md:text-[8px] font-black uppercase italic tracking-[0.1em] md:tracking-[0.2em] px-2 py-1 rounded-[1px] ${
                      e.status === 'Approved' ? 'text-[#95f122] bg-[#95f122]/5' : 
                      e.status === 'Closed' ? 'text-blue-500 bg-blue-500/5' :
                      e.status === 'Pending' ? 'text-amber-500 bg-amber-500/5' : 'text-red-500 bg-red-500/5'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      disabled={e.status === 'Closed'}
                      value={e.seedingMode || SeedingMode.RANKING}
                      onChange={(event) => onUpdateTournament({...e, seedingMode: event.target.value as SeedingMode})}
                      className="bg-transparent border border-white/10 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 outline-none p-1"
                    >
                      {Object.values(SeedingMode).map(mode => <option key={mode} value={mode} className="bg-slate-900">{mode}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          if (!e.bracket) e.bracket = initBracket(e.id);
                          setSelectedTournament(e);
                          setIsManagingBracket(true);
                        }}
                        className="flex items-center gap-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-[#95f122] hover:bg-[#95f122]/10 px-2.5 py-1.5 border border-[#95f122]/20 transition-all rounded-[1px]"
                      >
                        <Layout size={10} /> Bracket
                      </button>
                      {e.status === 'Approved' && (
                        <button 
                          onClick={() => handleAutoSeed(e.id)}
                          className="flex items-center gap-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 px-2.5 py-1.5 border border-blue-500/20 transition-all rounded-[1px]"
                        >
                          <RefreshCw size={10} /> Seed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRevenue = () => {
    const requests = [
      { id: '1', amount: 5400, date: '2024-06-01', status: 'Approved' },
      { id: '2', amount: 3200, date: '2024-06-15', status: 'Pending' }
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm">
              <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest mb-8">P&L Forecasting</h3>
              <div className="space-y-6">
                {[
                  { label: 'Booking Revenue', val: totalRevenue, pts: '+12%' },
                  { label: 'Tournament Fees', val: 12500, pts: '+5%' },
                  { label: 'Coach Commission', val: 2400, pts: '-2%' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-2xl font-black text-white italic tracking-tighter">{item.val} <span className="text-[10px] font-normal text-slate-500">MAD</span></p>
                    </div>
                    <span className={`text-[9px] font-bold ${item.pts.startsWith('+') ? 'text-[#95f122]' : 'text-red-500'}`}>{item.pts}</span>
                  </div>
                ))}
              </div>
              <button className="mt-10 w-full py-4 bg-[#95f122] text-[#040812] text-[9px] font-black uppercase tracking-widest italic shadow-xl">Initiate Payout Request</button>
           </div>

           <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm">
              <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest mb-8 flex items-center gap-3">
                <History size={16} className="text-slate-600" /> Payout Ledger
              </h3>
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/5 hover:border-white/10 transition-all rounded-sm">
                    <div>
                      <p className="text-[10px] font-black text-white italic">{req.amount} MAD</p>
                      <p className="text-[7px] font-bold text-slate-700 uppercase tracking-widest mt-1">{req.date}</p>
                    </div>
                    <span className={`text-[7px] font-black uppercase italic tracking-widest px-2 py-1 ${req.status === 'Approved' ? 'text-[#95f122] bg-[#95f122]/5' : 'text-amber-500 bg-amber-500/5'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {!canAccessFullAnalytics && (
          <div className="bg-teal-900/5 border border-teal-500/20 p-8 text-center rounded-sm group hover:border-teal-500 transition-all cursor-pointer">
            <Crown size={24} className="text-teal-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">Upgrade to Elite Fleet</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-xs mx-auto">Unlock heatmaps, player retention forensics, and multi-venue synchronization.</p>
          </div>
        )}
      </div>
    );
  };

  const renderCreationModal = () => (
    <div className="fixed inset-0 z-[140] bg-[#040812]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
      <div className="bg-[#12192b] border border-white/5 w-full max-w-2xl p-8 md:p-12 rounded-2xl shadow-3xl animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Tournament Deployment</h3>
          <button onClick={() => setIsCreatingTournament(false)} className="text-slate-500 hover:text-white p-1"><X size={20}/></button>
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
            <input 
                type="text" 
                placeholder="TOURNAMENT TITLE" 
                value={newTournament.title}
                onChange={(e) => setNewTournament({...newTournament, title: e.target.value})}
                className="w-full bg-[#0a0f1c] border border-white/5 p-3 md:p-4 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[#95f122]/30 placeholder:text-slate-800"
            />
          </div>
          <button 
            onClick={handleCreateSubmit}
            className="w-full py-4 bg-[#95f122] text-[#040812] text-[9px] md:text-[10px] font-black uppercase tracking-widest italic shadow-xl"
          >
            Authorize Deployment
          </button>
        </div>
      </div>
    </div>
  );

  const renderBracketView = () => (
    <div className="fixed inset-0 z-[140] bg-[#040812] overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto py-24 md:py-32 px-4 md:px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter truncate max-w-full">Matrix: {selectedTournament?.title}</h2>
          <button onClick={() => setIsManagingBracket(false)} className="flex items-center gap-2 text-slate-500 hover:text-white uppercase text-[8px] md:text-[9px] font-black tracking-widest p-2 bg-[#0c1221] border border-white/5">
            <ChevronLeft size={16} /> Close Management
          </button>
        </header>
        <TournamentBracket 
          matches={selectedTournament?.bracket || []} 
          canEdit={true} 
          onEditMatch={(id) => {
            const m = selectedTournament?.bracket?.find(match => match.id === id);
            if (m) setActiveMatch(m);
          }}
        />
        
        {activeMatch && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c1221] border border-white/10 p-8 md:p-10 max-w-md w-full rounded-xl shadow-3xl">
              <h4 className="text-white font-black uppercase italic mb-8 text-xs md:text-sm leading-relaxed">Match: {activeMatch.teamA} vs {activeMatch.teamB}</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block ml-1">Team A Score</label>
                    <input type="number" value={activeMatch.scoreA || 0} onChange={e => setActiveMatch({...activeMatch, scoreA: parseInt(e.target.value)})} className="bg-[#040812] border border-white/10 p-3 md:p-4 w-full text-white font-black text-base focus:border-[#95f122] outline-none" />
                  </div>
                  <div className="w-1/2 space-y-2">
                    <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block ml-1">Team B Score</label>
                    <input type="number" value={activeMatch.scoreB || 0} onChange={e => setActiveMatch({...activeMatch, scoreB: parseInt(e.target.value)})} className="bg-[#040812] border border-white/10 p-3 md:p-4 w-full text-white font-black text-base focus:border-[#95f122] outline-none" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => { setActiveMatch({...activeMatch, winnerId: 'A', status: MatchStatus.COMPLETED}); }} className={`flex-1 py-3 border text-[9px] font-black uppercase transition-all ${activeMatch.winnerId === 'A' ? 'bg-[#95f122] text-[#040812] border-[#95f122]' : 'text-white border-white/10 hover:border-white/20'}`}>A Wins</button>
                  <button onClick={() => { setActiveMatch({...activeMatch, winnerId: 'B', status: MatchStatus.COMPLETED}); }} className={`flex-1 py-3 border text-[9px] font-black uppercase transition-all ${activeMatch.winnerId === 'B' ? 'bg-[#95f122] text-[#040812] border-[#95f122]' : 'text-white border-white/10 hover:border-white/20'}`}>B Wins</button>
                </div>
                <div className="flex gap-3 pt-6 border-t border-white/5">
                  <button onClick={handleUpdateMatch} className="flex-1 py-4 bg-[#95f122] text-[#040812] font-black uppercase text-[9px] md:text-[10px] italic shadow-lg">Commit</button>
                  <button onClick={() => setActiveMatch(null)} className="flex-1 py-4 bg-slate-800 text-white font-black uppercase text-[9px] md:text-[10px] italic">Abort</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-8 duration-500">
      <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Facility Logbook</h3>
      <div className="bg-[#0c1221] border border-white/5 overflow-x-auto custom-scrollbar rounded-sm shadow-2xl">
        <table className="w-full text-left min-w-[500px] lg:min-w-0">
          <thead className="bg-[#040812] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Athlete</th>
              <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Arena</th>
              <th className="px-6 py-4 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map(b => (
              <tr key={b.id} className="text-[9px] md:text-[10px] hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-white uppercase font-black truncate max-w-[150px]">{b.userName}</td>
                <td className="px-6 py-4 text-slate-500 uppercase font-black truncate max-w-[150px]">{b.courtName}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-0.5 rounded-[1px] text-[7px] md:text-[8px] font-black uppercase ${b.status === 'Confirmed' ? 'bg-teal-500/10 text-[#95f122]' : 'bg-red-500/10 text-red-500'}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <header className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Instruction Staff</h3>
        <button className="text-[8px] font-black text-[#95f122] uppercase hover:underline flex items-center gap-2">
          <UserPlus size={12} /> Recruit Coach
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allUsers.filter(u => u.role === UserRole.COACH).map(coach => (
          <div key={coach.id} className="bg-[#0c1221] border border-white/5 p-6 rounded-sm flex flex-col group relative">
            <div className="flex items-center gap-4 mb-6">
              <img src={coach.avatar || `https://ui-avatars.com/api/?name=${coach.name}&background=1e293b&color=ffffff`} className="w-12 h-12 rounded-full border border-white/5 grayscale group-hover:grayscale-0 transition-all" alt="" />
              <div>
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">{coach.name}</h4>
                <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em]">{coach.skillLevel} LEVEL</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-600">
                <span>Revenue Share</span>
                <span className="text-white">80 / 20</span>
              </div>
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-600">
                <span>Active Slots</span>
                <span className="text-[#95f122]">14 / WEEK</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 py-2.5 bg-[#0a0f1c] border border-white/5 text-white text-[7px] font-black uppercase tracking-widest hover:border-blue-500 transition-all">Schedule</button>
              <button className="flex-1 py-2.5 bg-[#0a0f1c] border border-white/5 text-red-500 text-[7px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Relieve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {isCreatingTournament && renderCreationModal()}
      {isManagingBracket && renderBracketView()}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* DASHBOARD SIDEBAR */}
        <aside className="lg:w-[280px] space-y-6">
          <div className="bg-[#0c1221] border border-white/5 p-8 text-center shadow-2xl relative overflow-hidden rounded-sm">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-[#040812] flex items-center justify-center border border-white/10 rounded-sm">
                <Building2 size={32} className="text-[#95f122]" />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#95f122] p-1.5 rounded-full border-2 border-[#0c1221]">
                <Crown size={12} className="text-[#040812]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{clubName}</h2>
            <p className="text-[#95f122] text-[9px] font-black uppercase tracking-[0.3em] mb-8">{user.clubTier} Fleet</p>

            <nav className="space-y-2">
              {[
                { id: 'inventory', icon: <Layout size={14} />, label: 'Asset Fleet' },
                { id: 'bookings', icon: <Clock size={14} />, label: 'Logbook' },
                { id: 'tournaments', icon: <Trophy size={14} />, label: 'Tournaments' },
                { id: 'staff', icon: <Briefcase size={14} />, label: 'Instruction' },
                { id: 'revenue', icon: <DollarSign size={14} />, label: 'Settlement' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-4 p-4 text-[10px] font-black uppercase italic tracking-widest transition-all border rounded-sm ${
                    activeTab === item.id 
                      ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                      : 'bg-[#040812] text-slate-600 border-white/5 hover:text-white hover:border-white/10'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* DASHBOARD CONTENT */}
        <div className="flex-grow">
          <header className="mb-12 border-b border-white/5 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#95f122]/10 border border-[#95f122]/20 mb-3">
                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#95f122]">Authorized Facility Node</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {activeTab === 'inventory' && 'Operational Assets'}
                {activeTab === 'bookings' && 'Facility Logbook'}
                {activeTab === 'tournaments' && 'Competitive Matrix'}
                {activeTab === 'staff' && 'Instruction Staff'}
                {activeTab === 'revenue' && 'Revenue Command'}
              </h1>
            </div>
          </header>

          <main>
            {activeTab === 'inventory' && renderInventory()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'tournaments' && renderTournaments()}
            {activeTab === 'staff' && renderStaff()}
            {activeTab === 'revenue' && renderRevenue()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;

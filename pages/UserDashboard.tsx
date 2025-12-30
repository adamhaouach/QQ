import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Booking, CoachingSession, PlatformRules, TournamentRegistration, SkillTier, ReportReason } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Calendar, 
  LogOut, 
  Plus, 
  Trash2, 
  Zap, 
  Clock, 
  Download, 
  X, 
  Trophy, 
  Medal, 
  Activity, 
  Flag, 
  BrainCircuit, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  bookings: Booking[];
  sessions: CoachingSession[];
  registrations: TournamentRegistration[];
  onCancelBooking: (id: string) => void;
  onLogout: () => void;
  platformRules: PlatformRules;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, bookings, sessions, registrations, onCancelBooking, onLogout, platformRules }) => {
  const userBookings = bookings.filter(b => b.userId === user.id);
  const upcomingBookings = userBookings.filter(b => b.status === 'Confirmed');

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ reason: ReportReason.OTHER, comment: '' });
  
  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const getTierColor = (tier: SkillTier) => {
    switch (tier) {
      case SkillTier.ROOKIE: return 'text-slate-500';
      case SkillTier.CONTENDER: return 'text-blue-400';
      case SkillTier.ELITE: return 'text-amber-500';
      case SkillTier.COMPETITIVE: return 'text-red-500';
      default: return 'text-white';
    }
  };

  const generateAIInsight = async () => {
    setLoadingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this Padel player profile: Rank ${user.rank || 'Bronze'}, Tier ${user.skillTier || 'Rookie'}, Matches ${user.totalMatches || 0}. Provide one ultra-concise technical Padel tip for their next match in uppercase.`,
      });
      setAiInsight(response.text || "KEEP TRAINING TO UNLOCK MORE DATA.");
    } catch (error) {
      setAiInsight("AI CLUSTER SYNC FAILED. REFRESH NODE.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Fair-play report dispatched to admin cluster for node review.");
    setShowReportModal(false);
    setReportData({ reason: ReportReason.OTHER, comment: '' });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto overflow-x-hidden">
      
      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#12192b] border border-white/10 p-8 md:p-10 w-full max-w-md rounded-sm shadow-3xl animate-in zoom-in-95 duration-200">
              <header className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                   <Flag size={20} className="text-red-500" /> Fair-Play Protocol
                 </h3>
                 <button onClick={() => setShowReportModal(false)} className="text-slate-600 hover:text-white"><X size={20}/></button>
              </header>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Report Reason</label>
                    <select 
                      value={reportData.reason}
                      onChange={e => setReportData({...reportData, reason: e.target.value as ReportReason})}
                      className="w-full bg-[#040812] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none"
                    >
                       {Object.values(ReportReason).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Observation Logs</label>
                    <textarea 
                      placeholder="Describe the discrepancy in node behavior..."
                      value={reportData.comment}
                      onChange={e => setReportData({...reportData, comment: e.target.value})}
                      className="w-full bg-[#040812] border border-white/5 p-4 text-xs font-bold text-white min-h-[100px] focus:outline-none"
                    />
                 </div>
                 <button type="submit" className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest italic hover:bg-red-500 shadow-xl transition-all">Submit Entry</button>
              </form>
           </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="lg:w-[320px] shrink-0 space-y-6">
          <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#95f122]/20"></div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=95f122&color=040812&size=128`} className="w-24 h-24 rounded-full border-4 border-[#95f122]/10 p-1 grayscale" alt=""/>
                <div className="absolute bottom-1 right-1 bg-[#95f122] p-1.5 rounded-full border-2 border-[#0c1221]"><Trophy size={10} className="text-[#040812]"/></div>
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">{user.name}</h2>
              <div className="flex items-center gap-2 mb-8">
                 <span className="text-[10px] font-black text-[#95f122] uppercase tracking-widest italic">{user.rank || 'BRONZE'}</span>
                 <div className="w-[1px] h-3 bg-white/10"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">SR {user.skillScore || 35}</span>
              </div>
              
              <div className="w-full grid grid-cols-3 gap-2 border-t border-white/5 pt-8">
                 <div className="text-center">
                    <p className="text-xl font-black text-white italic tracking-tighter">{user.totalMatches || 0}</p>
                    <p className="text-[7px] font-bold text-slate-700 uppercase">Matches</p>
                 </div>
                 <div className="text-center border-x border-white/5">
                    <p className="text-xl font-black text-white italic tracking-tighter">{user.averageRating?.toFixed(1) || '0.0'}</p>
                    <p className="text-[7px] font-bold text-slate-700 uppercase">Rating</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xl font-black text-[#95f122] italic tracking-tighter">{user.reliabilityScore || 0}%</p>
                    <p className="text-[7px] font-bold text-slate-700 uppercase">Reliability</p>
                 </div>
              </div>
            </div>
          </div>

          {/* AI SKILL PREDICTION BOX */}
          <div className="bg-gradient-to-br from-indigo-900/10 to-[#0c1221] border border-indigo-500/20 p-8 rounded-sm relative overflow-hidden">
             <div className="absolute top-2 right-2 opacity-10">
                <BrainCircuit size={40} className="text-indigo-400" />
             </div>
             <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <BrainCircuit size={10}/> AI Skill Prognosis
             </p>
             <div className="flex items-center justify-between mb-4">
                <div>
                   <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{user.skillScore || 35}%</p>
                   <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${getTierColor(user.skillTier || SkillTier.ROOKIE)}`}>
                      {user.skillTier || 'ROOKIE'} TIER
                   </p>
                </div>
                <div className="w-14 h-14 rounded-full border-[3px] border-indigo-500/10 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin-slow"></div>
                   <span className="text-[8px] font-black text-white">SYNC</span>
                </div>
             </div>
             
             {/* Dynamic AI Tip */}
             <div className="mt-6 pt-4 border-t border-indigo-500/10">
                {aiInsight ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1 italic">Pro Strategy Insight:</p>
                    <p className="text-[9px] font-bold text-white uppercase italic leading-relaxed tracking-tighter">"{aiInsight}"</p>
                  </div>
                ) : (
                  <button 
                    onClick={generateAIInsight}
                    disabled={loadingInsight}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
                  >
                    {loadingInsight ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    {loadingInsight ? 'GENERATING...' : 'REQUEST STRATEGY TIP'}
                  </button>
                )}
             </div>
          </div>

          <div className="bg-[#0c1221] border border-white/5 p-2 rounded-sm space-y-1">
             <button onClick={() => setShowReportModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-all group rounded-sm border border-transparent hover:border-red-900/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-red-500 italic">Report Misconduct</span>
                <Flag size={14} className="text-slate-700 group-hover:text-red-500" />
             </button>
             <button onClick={onLogout} className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-900/10 transition-all group rounded-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Exit Node</span>
                <LogOut size={16} className="text-red-500" />
             </button>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-grow space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Link to="/book-court" className="flex items-center justify-between p-10 bg-[#0c1221] border border-white/5 hover:border-[#95f122]/30 transition-all shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#95f122]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="flex items-center gap-6 z-10">
                   <div className="w-14 h-14 bg-[#95f122]/10 flex items-center justify-center border border-[#95f122]/10"><Calendar className="text-[#95f122]" size={20}/></div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Arena Booking</h3>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">Reserve dedicated arena nodes</p>
                   </div>
                </div>
                <Plus size={18} className="text-slate-800 group-hover:text-[#95f122] transition-all group-hover:rotate-90"/>
             </Link>
             <div className="bg-gradient-to-br from-teal-900/20 to-transparent border border-teal-500/20 p-10 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-4 opacity-5"><Medal size={80}/></div>
                <div className="w-14 h-14 bg-teal-500/10 flex items-center justify-center border border-teal-500/20"><Activity className="text-teal-500" size={20}/></div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Season 2 Progress</h3>
                      <span className="text-[8px] font-black px-2 py-0.5 bg-teal-500/20 text-teal-400 border border-teal-500/30">ACTIVE</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="text-[9px] font-black text-slate-500 uppercase">National SR Index</span>
                           <span className="text-[9px] font-black text-teal-500">450 / 1000 PTS</span>
                        </div>
                        <div className="w-48 h-1.5 bg-slate-900 overflow-hidden rounded-full">
                           <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="text-center border-l border-white/5 pl-4">
                         <p className="text-2xl font-black text-white italic tracking-tighter">#14</p>
                         <p className="text-[7px] font-black text-slate-700 uppercase">Global</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <section>
             <header className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 italic"><Zap size={18} className="text-[#95f122]" /> Signal Stream</h3>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Nodes Synchronized</span>
                   </div>
                </div>
             </header>
             <div className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(b => (
                    <div key={b.id} className="bg-[#0c1221] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#111827] transition-all rounded-sm group relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 left-0 w-1 h-full bg-[#95f122] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-[#040812] border border-white/5 flex flex-col items-center justify-center shrink-0">
                             <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{b.date.split('-')[1]}</span>
                             <span className="text-2xl font-black text-[#95f122] italic tracking-tighter leading-none mt-1">{b.date.split('-')[2]}</span>
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest italic truncate">{b.courtName}</h4>
                                {b.isOpenMatch && <span className="px-2 py-0.5 bg-blue-900/20 text-blue-400 border border-blue-500/20 text-[7px] font-black uppercase">Open Match</span>}
                             </div>
                             <p className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2 tracking-widest mt-1"><Clock size={12} className="text-[#95f122]" /> {b.timeSlot}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-4 bg-[#040812] border border-white/5 text-slate-700 hover:text-[#95f122] transition-all"><Download size={18}/></button>
                          <button onClick={() => onCancelBooking(b.id)} className="p-4 bg-[#040812] border border-white/5 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-[#0c1221]/30 border border-dashed border-white/10 rounded-sm italic text-slate-800 text-[10px] uppercase font-black tracking-widest">Registry synchronized. No active sessions.</div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
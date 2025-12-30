
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, SkillTier, ReportReason } from '../types';
import { INITIAL_SPONSORS } from '../data/mockData';
import { Trophy, Award, History, TrendingUp, Shield, MapPin, Zap, Flag, BrainCircuit, X } from 'lucide-react';
import SponsorBanner from '../components/SponsorBanner';

interface PlayerProfilePublicProps {
  users: User[];
}

const PlayerProfilePublic: React.FC<PlayerProfilePublicProps> = ({ users }) => {
  const { id } = useParams<{ id: string }>();
  const player = users.find(u => u.id === id);
  const profileSponsor = INITIAL_SPONSORS.find(s => s.placement === 'profile');

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ reason: ReportReason.OTHER, comment: '' });

  if (!player) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center p-12">
        <h2 className="text-4xl font-black text-white uppercase italic mb-8">Identity Node Not Found</h2>
        <Link to="/rankings" className="bg-[#95f122] text-[#040812] px-8 py-3 btn-sport text-xs">Back to Rankings</Link>
      </div>
    );
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Misconduct protocol initiated against node ${player.name}. Admin review pending.`);
    setShowReportModal(false);
  };

  const getTierColor = (tier: SkillTier) => {
    switch (tier) {
      case SkillTier.ROOKIE: return 'text-slate-500';
      case SkillTier.CONTENDER: return 'text-blue-400';
      case SkillTier.ELITE: return 'text-amber-500';
      case SkillTier.COMPETITIVE: return 'text-red-500';
      default: return 'text-white';
    }
  };

  const winRate = player.winCount && player.lossCount 
    ? Math.round((player.winCount / (player.winCount + player.lossCount)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#040812] pt-24 pb-20">
      
      {showReportModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#12192b] border border-white/10 p-8 md:p-10 w-full max-w-md rounded-sm shadow-3xl animate-in zoom-in-95 duration-200">
              <header className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                   <Flag size={20} className="text-red-500" /> Misconduct Report
                 </h3>
                 <button onClick={() => setShowReportModal(false)} className="text-slate-600 hover:text-white"><X size={20}/></button>
              </header>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Violation Type</label>
                    <select 
                      value={reportData.reason}
                      onChange={e => setReportData({...reportData, reason: e.target.value as ReportReason})}
                      className="w-full bg-[#040812] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none"
                    >
                       {Object.values(ReportReason).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Evidence Narrative</label>
                    <textarea 
                      placeholder="Specify behavioral discrepancies observed in the arena..."
                      value={reportData.comment}
                      onChange={e => setReportData({...reportData, comment: e.target.value})}
                      className="w-full bg-[#040812] border border-white/5 p-4 text-xs font-bold text-white min-h-[100px] focus:outline-none"
                    />
                 </div>
                 <button type="submit" className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest italic hover:bg-red-500 shadow-xl transition-all">Submit Report</button>
              </form>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* PROFILE HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 bg-[#0c1221] border border-white/5 p-12 rounded-sm text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#95f122]/50 to-transparent" />
             
             <div className="absolute top-4 right-4">
                <button onClick={() => setShowReportModal(true)} className="p-2 bg-red-900/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-sm shadow-lg">
                   <Flag size={14} />
                </button>
             </div>

             <img 
               src={player.avatar || `https://ui-avatars.com/api/?name=${player.name}&background=95f122&color=040812&size=256`} 
               className="w-40 h-40 rounded-full mx-auto mb-10 border-4 border-[#040812] shadow-2xl grayscale brightness-90"
               alt=""
             />
             
             <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{player.name}</h1>
             <div className="flex flex-col gap-2 mb-8">
                <p className="text-[#95f122] text-[10px] font-black uppercase tracking-[0.4em]">{player.skillLevel} Contender</p>
                <div className="flex items-center justify-center gap-2">
                   <BrainCircuit size={12} className="text-indigo-400" />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${getTierColor(player.skillTier || SkillTier.ROOKIE)}`}>
                      {player.skillTier || 'ROOKIE'} TIER (SR {player.skillScore || 0})
                   </span>
                </div>
             </div>
             
             <div className="flex justify-center gap-3 mb-10">
                {player.badges?.map(badge => (
                  <div key={badge} className="px-3 py-1 bg-slate-900 border border-white/5 rounded-[1px]" title={badge}>
                     <Award size={14} className="text-slate-500" />
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-10">
                <div>
                   <p className="text-3xl font-black text-white italic tracking-tighter">{player.points?.toLocaleString() || 0}</p>
                   <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">Global Pts</p>
                </div>
                <div className="border-l border-white/5">
                   <p className="text-3xl font-black text-[#95f122] italic tracking-tighter">#{Math.floor(Math.random() * 50) + 1}</p>
                   <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">National Rank</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0c1221] border border-white/5 p-8 flex flex-col justify-center items-center text-center group">
                   <TrendingUp className="text-[#95f122] mb-4 group-hover:scale-110 transition-transform" size={24} />
                   <p className="text-3xl font-black text-white italic tracking-tighter">{winRate}%</p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Efficiency Rate</p>
                </div>
                <div className="bg-[#0c1221] border border-white/5 p-8 flex flex-col justify-center items-center text-center group">
                   <Zap className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                   <p className="text-3xl font-black text-white italic tracking-tighter">{player.winCount || 0}</p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Victories</p>
                </div>
                <div className="bg-[#0c1221] border border-white/5 p-8 flex flex-col justify-center items-center text-center group">
                   <Shield className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                   <p className="text-3xl font-black text-white italic tracking-tighter">{player.lossCount || 0}</p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Defeats</p>
                </div>
             </div>

             <div className="bg-[#0c1221] border border-white/5 overflow-hidden shadow-2xl">
                <header className="px-8 py-6 bg-[#040812] border-b border-white/5 flex items-center gap-4">
                   <History size={16} className="text-slate-700" />
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Competitive Timeline</h3>
                </header>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <tbody className="divide-y divide-white/5">
                         {player.matchHistory?.map(m => (
                            <tr key={m.id} className="hover:bg-white/[0.01] transition-colors">
                               <td className="px-8 py-6">
                                  <p className="text-[10px] font-black text-slate-600 uppercase mb-1">{m.date}</p>
                                  <p className="text-xs font-black text-white uppercase italic tracking-widest">{m.tournamentName}</p>
                               </td>
                               <td className="px-8 py-6">
                                  <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mb-1">Opponent</p>
                                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{m.opponent}</p>
                               </td>
                               <td className="px-8 py-6 text-center">
                                  <p className="text-sm font-black text-white italic tracking-widest">{m.score}</p>
                                </td>
                               <td className="px-8 py-6 text-right">
                                  <span className={`px-4 py-1 text-[10px] font-black italic rounded-[1px] ${m.result === 'W' ? 'bg-[#95f122]/10 text-[#95f122]' : 'bg-red-500/10 text-red-500'}`}>
                                     {m.result === 'W' ? 'VICTORY' : 'DEFEAT'}
                                  </span>
                               </td>
                            </tr>
                         ))}
                         {!player.matchHistory && (
                            <tr>
                               <td colSpan={4} className="px-8 py-20 text-center text-slate-800 font-black text-[9px] uppercase tracking-widest italic opacity-40">
                                  Historical record initialized. No data packets found.
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>

             {profileSponsor && <SponsorBanner sponsor={profileSponsor} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePublic;

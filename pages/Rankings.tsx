
import React, { useState, useMemo } from 'react';
import { User, RankingEntry } from '../types';
import { INITIAL_RANKINGS } from '../data/mockData';
import { Trophy, TrendingUp, TrendingDown, Search, Filter, Award, Target, Star, MapPin, Calendar, Clock } from 'lucide-react';

interface RankingsProps {
  users: User[];
}

const Rankings: React.FC<RankingsProps> = ({ users }) => {
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeason, setActiveSeason] = useState('S2');

  const seasons = [
    { id: 'S2', label: 'Season 2 (Active)', period: 'June - Aug 2024' },
    { id: 'S1', label: 'Season 1 (Archived)', period: 'Mar - May 2024' }
  ];

  const filteredRankings = useMemo(() => {
    return INITIAL_RANKINGS.filter(r => {
      const matchCategory = categoryFilter === 'All Categories' || r.category.includes(categoryFilter);
      const matchSearch = r.userName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
        // Simple seasonal logic simulation
        if (activeSeason === 'S1') {
           // For S1, we mock a different order or different points for demo
           return b.points - a.points + (a.userName === 'MEHDI BENANI' ? -2000 : 0);
        }
        return b.points - a.points;
    });
  }, [categoryFilter, searchQuery, activeSeason]);

  return (
    <div className="min-h-screen bg-[#040812] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-4xl mb-20 animate-in fade-in slide-in-from-left-2 duration-500">
           <div className="inline-flex items-center gap-2 bg-[#95f122]/5 border border-[#95f122]/10 px-3 py-1 mb-6">
              <Trophy size={14} className="text-[#95f122]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#95f122]">National Leaderboard</span>
           </div>
           <h1 className="text-6xl md:text-8xl sport-headline text-white italic mb-8">
              PLAYER <span className="text-[#95f122]">RANKINGS.</span>
           </h1>

           <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-[#0c1221] border border-white/5 p-6 rounded-sm mb-10 max-w-xl">
              <div className="flex-grow">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Competitive Window</p>
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">
                    {seasons.find(s => s.id === activeSeason)?.label}
                 </h4>
                 <p className="text-[9px] font-bold text-slate-700 uppercase mt-1">
                    <Clock size={10} className="inline mr-1" /> {seasons.find(s => s.id === activeSeason)?.period}
                 </p>
              </div>
              <div className="flex gap-2">
                 {seasons.map(s => (
                   <button 
                    key={s.id}
                    onClick={() => setActiveSeason(s.id)}
                    className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest border transition-all ${activeSeason === s.id ? 'bg-[#95f122] text-[#040812] border-[#95f122]' : 'bg-[#040812] text-slate-600 border-white/10'}`}
                   >
                    {s.id}
                   </button>
                 ))}
              </div>
           </div>

           <p className="text-slate-400 text-xl font-bold uppercase italic tracking-tighter opacity-80 max-w-2xl leading-tight">
              The official competitive matrix for Moroccan Padel. Points awarded based on tournament tier and performance.
           </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
           <div className="flex bg-[#0c1221] border border-white/5 p-1 rounded-sm overflow-x-auto w-full lg:w-auto">
              {['All Categories', 'Male', 'Female', 'Pro', 'Intermediate'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    categoryFilter === cat ? 'bg-[#95f122] text-[#040812]' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           <div className="relative w-full lg:w-80">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
              <input 
                type="text" 
                placeholder="Search athlete..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c1221] border border-white/5 pl-12 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 transition-all placeholder:text-slate-800"
              />
           </div>
        </div>

        {/* RANKING LIST */}
        <div className="bg-[#0c1221] border border-white/5 overflow-hidden shadow-3xl">
           <table className="w-full text-left">
              <thead className="bg-[#040812] border-b border-white/5">
                 <tr>
                    <th className="px-8 py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Matrix Rank</th>
                    <th className="px-8 py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Athlete</th>
                    <th className="px-8 py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Category</th>
                    <th className="px-8 py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Arena Hub</th>
                    <th className="px-8 py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Network Points</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {filteredRankings.map((r, i) => (
                    <tr key={r.userId} className="group hover:bg-white/[0.01] transition-colors">
                       <td className="px-8 py-8">
                          <div className="flex items-center gap-6">
                             <span className={`text-2xl font-black italic tracking-tighter ${i < 3 ? 'text-[#95f122]' : 'text-slate-700'}`}>
                                #{(i + 1).toString().padStart(2, '0')}
                             </span>
                             <div className="flex flex-col gap-1">
                                {activeSeason === 'S2' && (r.rank < r.prevRank ? (
                                   <TrendingUp size={10} className="text-[#95f122]" />
                                ) : r.rank > r.prevRank ? (
                                   <TrendingDown size={10} className="text-red-500" />
                                ) : (
                                   <div className="w-1.5 h-0.5 bg-slate-800" />
                                ))}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-8">
                          <div className="flex items-center gap-5">
                             <img src={`https://ui-avatars.com/api/?name=${r.userName}&background=${i < 3 ? '95f122' : '0c1221'}&color=${i < 3 ? '040812' : 'ffffff'}`} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all border border-white/5" alt="" />
                             <div>
                                <p className="font-black text-white uppercase italic tracking-widest text-sm">{r.userName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <Award size={10} className="text-slate-700" />
                                   <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.2em]">Verified Contender</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-8">
                          <span className="px-3 py-1 bg-slate-900 border border-white/5 text-[8px] font-black uppercase text-slate-500 tracking-widest">
                             {r.category}
                          </span>
                       </td>
                       <td className="px-8 py-8">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-tighter">
                             <MapPin size={10} className="text-[#95f122]" /> {r.club}
                          </div>
                       </td>
                       <td className="px-8 py-8">
                          <div className="flex items-end gap-2">
                             <span className="text-2xl font-black text-white italic tracking-tighter">
                                {activeSeason === 'S1' ? (r.points - (i * 100)).toLocaleString() : r.points.toLocaleString()}
                             </span>
                             <span className="text-[9px] font-bold text-slate-700 uppercase mb-1">Pts</span>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* INFO FOOTER */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
           <div className="p-8 bg-[#0c1221] border border-white/5">
              <Star className="text-[#95f122] mb-6" size={20} />
              <h4 className="text-xs font-black text-white uppercase italic mb-3 tracking-widest">Point Aggregation</h4>
              <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed tracking-tight">Points expire on a rolling 52-week cycle to maintain active competitiveness across the cluster.</p>
           </div>
           <div className="p-8 bg-[#0c1221] border border-white/5">
              <Target className="text-[#95f122] mb-6" size={20} />
              <h4 className="text-xs font-black text-white uppercase italic mb-3 tracking-widest">Elite Seeding</h4>
              <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed tracking-tight">Top-ranked athletes receive priority seeding in all Open-tier tournaments throughout the network.</p>
           </div>
           <div className="p-8 bg-[#0c1221] border border-white/5">
              <TrendingUp className="text-[#95f122] mb-6" size={20} />
              <h4 className="text-xs font-black text-white uppercase italic mb-3 tracking-widest">Global Synchronization</h4>
              <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed tracking-tight">Ranking matrix updates automatically every 24 hours following tournament final settlement.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;

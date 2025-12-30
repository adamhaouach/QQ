
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Coach, CoachingSession } from '../types';
import { Award, Star, History, Clock, MapPin, Zap, ChevronRight } from 'lucide-react';

const PublicCoach: React.FC<{ coaches: Coach[]; sessions: CoachingSession[] }> = ({ coaches, sessions }) => {
  const { id } = useParams();
  const coach = coaches.find(c => c.id === id) || coaches[0];

  return (
    <div className="min-h-screen bg-[#040812] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0c1221] border border-white/5 p-12 text-center rounded-sm relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#95f122]/50 to-transparent" />
                <img src={coach.avatar} className="w-40 h-40 rounded-full mx-auto mb-10 border-4 border-[#040812] shadow-2xl grayscale brightness-90" alt="" />
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{coach.name}</h1>
                <p className="text-[#95f122] text-[10px] font-black uppercase tracking-[0.4em] mb-8">{coach.level} Instructor</p>
                <div className="flex justify-center gap-2 mb-10">
                   <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-[1px]"><Award size={14} className="text-slate-500" /></div>
                   <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-[1px]"><Zap size={14} className="text-slate-500" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-10">
                   <div>
                      <p className="text-2xl font-black text-white italic tracking-tighter">{coach.rating}</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">Rating</p>
                   </div>
                   <div className="border-l border-white/5">
                      <p className="text-2xl font-black text-white italic tracking-tighter">420+</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">Hours</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
             <section className="bg-slate-900 border border-white/5 p-10">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.3em] mb-6 italic">Bio Dispatch</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium italic uppercase tracking-tighter opacity-80">{coach.bio}</p>
                <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#040812] border border-white/5 text-[#95f122]"><Award size={18}/></div>
                      <div>
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Certification</p>
                         <p className="text-xs font-black text-white uppercase italic">Federation level 2</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#040812] border border-white/5 text-[#95f122]"><MapPin size={18}/></div>
                      <div>
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Base Node</p>
                         <p className="text-xs font-black text-white uppercase italic">Casablanca Arena</p>
                      </div>
                   </div>
                </div>
             </section>

             <div className="bg-[#95f122] text-[#040812] p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div>
                   <h4 className="text-2xl font-black italic uppercase tracking-tighter">Secure a session.</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Direct instruction scheduling for pro entities.</p>
                </div>
                <Link to="/coaching" className="px-10 py-4 bg-[#040812] text-white btn-sport text-[10px] flex items-center gap-3">
                   Initialize Calendar <ChevronRight size={14} strokeWidth={3} />
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCoach;

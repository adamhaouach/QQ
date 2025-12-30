
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_COACHES } from '../data/mockData';
import { Star, ShieldCheck, ArrowRight, Award, Zap } from 'lucide-react';

const PublicCoaching: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Pro' | 'Advanced' | 'Intermediate'>('All');

  const filteredCoaches = filter === 'All' 
    ? INITIAL_COACHES 
    : INITIAL_COACHES.filter(c => c.level === filter);

  return (
    <div className="min-h-screen bg-[#040812] pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mb-12 animate-in fade-in slide-in-from-right-2 duration-500 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#95f122]/5 border border-[#95f122]/10 px-2 py-0.5 mb-4 mx-auto md:mx-0">
            <Award size={10} className="text-[#95f122]" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-[#95f122]">Academy Command</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl sport-headline text-white italic mb-6 leading-none">
            FIND A <span className="text-[#95f122]">COACH.</span>
          </h1>
          <p className="hidden md:block text-slate-500 text-base md:text-xl font-bold uppercase italic tracking-tighter max-w-2xl opacity-90 leading-tight">
            Improve your game with certified coaches specializing in competitive padel.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10 mt-8 md:mt-10">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">12</span>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Staff Coaches</span>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/5 self-center"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">100%</span>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Certified</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 md:mb-12 gap-2 custom-scrollbar">
          {['All', 'Pro', 'Advanced', 'Intermediate'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level as any)}
              className={`px-6 py-3 md:px-5 md:py-2 btn-sport text-[9px] border transition-all whitespace-nowrap ${
                filter === level 
                  ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                  : 'bg-transparent border-white/5 text-slate-600 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredCoaches.map((coach, idx) => (
            <div key={coach.id} className="group bg-slate-900 border border-white/5 hover:border-[#95f122]/30 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-sm overflow-hidden flex flex-col h-full shadow-2xl">
              <div className="relative aspect-[4/5] md:aspect-[4/5] overflow-hidden shrink-0">
                <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover grayscale brightness-[0.6] md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute top-4 left-4">
                  <div className="bg-[#040812]/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5 border border-white/5">
                    <Star size={8} className="text-[#95f122] fill-[#95f122]" />
                    <span className="text-[10px] font-black text-white">{coach.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-6 right-6">
                   <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-1">{coach.name}</h3>
                   <div className="flex items-center gap-2">
                     <div className="bg-[#95f122] w-1.5 h-1.5" />
                     <p className="text-[#95f122]/80 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">{coach.level} Instructor</p>
                   </div>
                </div>
              </div>

              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <p className="text-slate-500 text-[10px] md:text-[11px] font-bold uppercase italic tracking-tighter leading-tight mb-6 h-10 md:h-12 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
                  {coach.bio}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-6 mt-auto">
                  <div className="bg-[#040812] p-4 border border-white/5 text-center">
                    <p className="text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest mb-0.5">Price / HR</p>
                    <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{coach.price} MAD</p>
                  </div>
                  <div className="bg-[#040812] p-4 border border-white/5 flex flex-col justify-center items-center">
                    <Zap size={14} className="text-[#95f122] mb-0.5" />
                    <span className="text-[7px] md:text-[8px] font-black text-[#95f122] uppercase tracking-widest">Private</span>
                  </div>
                </div>

                <Link to="/login" className="w-full py-5 md:py-4 bg-slate-800 text-white btn-sport text-[9px] md:text-[10px] flex items-center justify-center gap-2 hover:bg-[#95f122] hover:text-[#040812] transition-all shadow-xl">
                  Book Lesson <ArrowRight size={12} strokeWidth={3} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicCoaching;

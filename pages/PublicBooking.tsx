
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Court, FeatureConfig } from '../types';
import { INITIAL_COURTS, INITIAL_TIME_SLOTS } from '../data/mockData';
import { Clock, MapPin, ArrowRight, Lock, Trophy, ShieldX } from 'lucide-react';

const PublicBooking: React.FC<{ courts: Court[]; featureConfig: FeatureConfig }> = ({ courts, featureConfig }) => {
  const [activeCourt, setActiveCourt] = useState<Court>(courts[0]);

  if (featureConfig.emergencyBookingDisable) {
    return (
      <div className="min-h-screen bg-[#040812] flex items-center justify-center p-6 md:p-10">
        <div className="max-w-md text-center bg-red-900/10 border border-red-900/20 p-8 md:p-12 rounded-xl">
           {/* Fix: removed invalid md:size prop from Lucide icon */}
           <ShieldX size={40} className="text-red-500 mx-auto mb-6" />
           <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-4">LOCKOUT IN EFFECT</h2>
           <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest leading-relaxed">Booking nodes have been restricted by central admin. Please monitor cluster channels for updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040812] pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <header className="max-w-4xl mb-8 md:mb-16 animate-in fade-in slide-in-from-left-2 duration-500">
          <h1 className="text-4xl md:text-6xl lg:text-8xl sport-headline text-white italic mb-4">
            FIND A <span className="text-[#95f122]">COURT.</span>
          </h1>
          <p className="hidden md:block text-slate-500 text-base md:text-xl font-bold uppercase italic tracking-tighter max-w-2xl leading-tight">
            Book courts at our clubs. Select your preferred time and play.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4">Available Courts</h3>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 md:gap-3 custom-scrollbar">
              {courts.map((court) => (
                <button
                  key={court.id}
                  onClick={() => setActiveCourt(court)}
                  className={`min-w-[200px] md:min-w-0 w-full group relative flex items-center p-4 md:p-4 border transition-all duration-200 shrink-0 lg:shrink ${
                    activeCourt.id === court.id
                      ? 'bg-slate-900 border-[#95f122]/50 shadow-2xl'
                      : 'bg-transparent border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 overflow-hidden mr-3 md:mr-4 border border-white/5 shrink-0">
                    <img src={court.image} alt={court.name} className="w-full h-full object-cover filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className={`text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-colors truncate ${activeCourt.id === court.id ? 'text-white' : 'text-slate-600'}`}>
                      {court.name}
                    </h4>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{court.type}</p>
                  </div>
                  {activeCourt.id === court.id && (
                    <div className="absolute right-3 md:right-4">
                      <div className="w-1.5 h-1.5 bg-[#95f122]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 md:p-8 bg-[#95f122] text-[#040812] relative overflow-hidden group rounded-sm shadow-xl">
              <div className="relative z-10">
                <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-1">Early Access</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter mb-6 leading-tight">Club members get 14-day advance booking.</p>
                <Link to="/register" className="inline-flex items-center gap-2 bg-[#040812] text-white px-5 py-3 btn-sport text-[9px] shadow-lg">
                  Join Now <ArrowRight size={10} strokeWidth={3} />
                </Link>
              </div>
              <Trophy size={80} className="absolute -bottom-4 -right-4 text-[#040812] opacity-5 -rotate-12" />
            </div>
          </div>

          <div className="lg:col-span-8 mt-8 lg:mt-0">
            <div className="bg-slate-900 border border-white/5 p-4 md:p-10 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-10 md:mb-12 p-2 md:p-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#040812] flex items-center justify-center border border-white/5 shrink-0">
                    <Clock size={16} className="text-[#95f122]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tighter truncate">{activeCourt.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={8} className="text-[#95f122]" /> CLUSTER NODE
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-[#040812] border border-white/10 text-center md:min-w-[140px] rounded-sm">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Court Rate</p>
                  <p className="text-xl md:text-2xl font-black text-[#95f122] italic tracking-tighter">{activeCourt.price} MAD</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-10 px-2 md:px-0">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] md:tracking-[0.3em]">Availability Grid</h4>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-800" />
                      <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#95f122]" />
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Open</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                  {INITIAL_TIME_SLOTS.map((slot, idx) => {
                    const isBooked = idx === 1 || idx === 4 || idx === 6;
                    return (
                      <div key={slot} className={`p-4 md:p-6 border transition-all text-center rounded-sm ${
                          isBooked ? 'bg-transparent border-white/5 opacity-10' : 'bg-slate-950 border-white/10 hover:border-[#95f122] cursor-pointer'
                        }`}
                      >
                        <p className={`text-base md:text-lg font-black italic tracking-tighter mb-0.5 ${isBooked ? 'text-slate-800' : 'text-white'}`}>
                          {slot.split(' - ')[0]}
                        </p>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{isBooked ? 'Reserved' : 'Available'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 md:mt-16 relative">
                <div className="absolute inset-0 bg-[#040812]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 md:p-12 text-center z-10 border border-white/5 rounded-sm">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#95f122]/5 border border-[#95f122]/30 flex items-center justify-center mb-4 md:mb-6 shrink-0">
                    <Lock size={16} className="text-[#95f122]" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">Authentication Required</h3>
                  <p className="text-slate-600 text-[8px] md:text-[9px] max-w-[240px] mb-6 md:mb-8 font-black uppercase tracking-widest leading-relaxed">Secure node verification is required to finalize slot dispatch.</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm px-4">
                    <Link to="/login" className="bg-[#95f122] text-[#040812] py-4 md:py-3.5 btn-sport text-[9px] md:text-xs flex-1">Login</Link>
                    <Link to="/register" className="bg-slate-800 text-white border border-white/10 py-4 md:py-3.5 btn-sport text-[9px] md:text-xs flex-1">Sign Up</Link>
                  </div>
                </div>
                <div className="h-40 md:h-48 bg-slate-950/20 w-full opacity-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;

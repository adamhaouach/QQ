
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Court, ClubEvent } from '../types';
import { MapPin, Trophy, Star, ChevronRight, Zap } from 'lucide-react';

const PublicClub: React.FC<{ courts: Court[]; events: ClubEvent[] }> = ({ courts, events }) => {
  const { id } = useParams();
  const clubCourts = courts.slice(0, 3);
  const clubEvents = events.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#040812] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header className="mb-16 border-b border-white/5 pb-12 animate-in fade-in duration-500">
           <div className="inline-flex items-center gap-1.5 bg-[#95f122]/5 border border-[#95f122]/10 px-2 py-0.5 mb-4">
            <MapPin size={10} className="text-[#95f122]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#95f122]">Authorized Facility</span>
          </div>
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-4">CASABLANCA ARENA</h1>
          <p className="text-slate-500 text-lg font-bold uppercase italic tracking-tighter max-w-2xl">The premier padel node in the heart of Morocco.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
             <section>
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.3em] mb-8 italic">Operational Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {clubCourts.map(court => (
                     <div key={court.id} className="bg-slate-900 border border-white/5 p-6 group">
                        <img src={court.image} className="w-full h-40 object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all mb-6" alt="" />
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{court.name}</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{court.type} Arena</p>
                        <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
                           <span className="text-xl font-black text-white">{court.price} MAD</span>
                           <Link to="/booking" className="btn-sport text-[9px] bg-[#95f122] text-[#040812] px-4 py-2">Book Now</Link>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-[#0c1221] border border-white/5 p-8">
                <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mb-6 italic">Facility Rating</h4>
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black text-white italic tracking-tighter">4.9</span>
                   <div className="flex text-[#95f122]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#95f122" />)}
                   </div>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">BASED ON 142 VERIFIED PLAYER SESSIONS</p>
             </div>

             <div className="bg-gradient-to-br from-[#111827] to-[#040812] border border-[#95f122]/10 p-8">
                <Zap size={24} className="text-[#95f122] mb-6" />
                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">Host Node</h4>
                <div className="space-y-4">
                   {clubEvents.map(e => (
                     <div key={e.id} className="pb-4 border-b border-white/5">
                        <p className="text-xs font-black text-white uppercase italic truncate">{e.title}</p>
                        <p className="text-[8px] text-[#95f122] uppercase font-bold mt-1">{e.date}</p>
                     </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PublicClub;

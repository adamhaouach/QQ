
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClubEvent, MatchStatus } from '../types';
// Fix: INITIAL_SPONSORS import corrected to come from data/mockData
import { INITIAL_SPONSORS } from '../data/mockData';
import TournamentBracket from '../components/TournamentBracket';
import { Trophy, Calendar, MapPin, Share2, ArrowLeft, Zap, Info, ShieldCheck } from 'lucide-react';
import SponsorBanner from '../components/SponsorBanner';

interface TournamentPublicProps {
  events: ClubEvent[];
}

const TournamentPublic: React.FC<TournamentPublicProps> = ({ events }) => {
  const { id } = useParams<{ id: string }>();
  const tournament = events.find(e => e.id === id);
  const tournamentSponsor = INITIAL_SPONSORS.find(s => s.placement === 'tournament');

  if (!tournament) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center p-12">
        <h2 className="text-4xl font-black text-white uppercase italic mb-8">Tournament Not Found</h2>
        <Link to="/events" className="bg-[#95f122] text-[#040812] px-8 py-3 btn-sport text-xs">Back to Events</Link>
      </div>
    );
  }

  const liveMatches = tournament.bracket?.filter(m => m.status === MatchStatus.IN_PROGRESS) || [];

  return (
    <div className="min-h-screen bg-[#040812] selection:bg-[#95f122] selection:text-[#040812]">
      {/* IMPACT HEADER */}
      <section className="relative h-[45vh] overflow-hidden">
        <img src={tournament.image} className="w-full h-full object-cover grayscale brightness-[0.3] contrast-125" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040812] to-transparent opacity-90" />
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-[#95f122] text-[#040812] px-3 py-1 text-[10px] font-black uppercase italic tracking-tighter transform -skew-x-12">
                        <span className="transform skew-x-12">{tournament.level} SERIES</span>
                    </div>
                    {tournament.isFederationApproved && (
                      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 text-[10px] font-black uppercase italic tracking-tighter transform -skew-x-12">
                         <ShieldCheck size={12} className="transform skew-x-12" />
                         <span className="transform skew-x-12">Federation Approved</span>
                      </div>
                    )}
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                    {tournament.title}
                 </h1>
                 <div className="flex flex-wrap items-center gap-6 mt-6">
                    <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                       <Calendar size={14} className="text-[#95f122]" /> {tournament.date}
                    </span>
                    <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                       <MapPin size={14} className="text-[#95f122]" /> CLUSTER FACILITY
                    </span>
                 </div>
              </div>
              
              <div className="hidden lg:flex gap-10 bg-[#0c1221] border border-white/5 p-8 rounded-sm">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Category</p>
                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{tournament.category}</p>
                 </div>
                 <div className="w-[1px] h-10 bg-white/5" />
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Format</p>
                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{tournament.format}</p>
                 </div>
                 <div className="w-[1px] h-10 bg-white/5" />
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Entries</p>
                    <p className="text-2xl font-black text-[#95f122] italic uppercase tracking-tighter">{tournament.registeredCount}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* LIVE BAR */}
      {liveMatches.length > 0 && (
        <div className="bg-[#95f122] py-3 overflow-hidden whitespace-nowrap">
           <div className="inline-flex gap-20 animate-marquee items-center">
              {liveMatches.map(m => (
                <div key={m.id} className="flex items-center gap-4">
                   <div className="w-2 h-2 bg-[#040812] rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-[#040812] uppercase italic">
                      {m.round}: {m.teamA} {m.scoreA} - {m.scoreB} {m.teamB}
                   </span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* MAIN BRACKET VIEWPORT */}
      <main className="max-w-[1600px] mx-auto py-20 px-6 lg:px-8">
         <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-9">
                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                    <div>
                    <h3 className="text-xs font-black text-[#95f122] uppercase tracking-[0.4em] mb-2 italic">Competitive Matrix</h3>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Tournament progression synchronized in real-time with arena nodes.</p>
                    </div>
                </div>

                <TournamentBracket matches={tournament.bracket || []} canEdit={false} />
            </div>

            <aside className="xl:col-span-3 space-y-8">
                {tournamentSponsor && <SponsorBanner sponsor={tournamentSponsor} />}
                
                <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Points Rulebook</h4>
                   <div className="space-y-4">
                      {[
                        { label: 'Winner', pts: tournament.level === 'Open 1000' ? '1000' : '500' },
                        { label: 'Finalist', pts: tournament.level === 'Open 1000' ? '600' : '300' },
                        { label: 'Semi-Final', pts: '180' },
                        { label: 'Quarter-Final', pts: '90' }
                      ].map(rule => (
                        <div key={rule.label} className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                           <span className="text-slate-700">{rule.label}</span>
                           <span className="text-[#95f122] italic">{rule.pts} PTS</span>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 pt-8 border-t border-white/5">
                      <p className="text-[8px] text-slate-800 leading-relaxed uppercase tracking-widest font-bold">Official National Padel points allocation rules apply. Matches follow standard FMP tie-break protocols.</p>
                   </div>
                </div>

                <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Recent Results</h4>
                   <div className="space-y-3">
                      {tournament.bracket?.filter(m => m.status === MatchStatus.COMPLETED).slice(-3).map(m => (
                        <div key={m.id} className="p-3 bg-[#040812] border border-white/5 rounded-sm">
                           <p className="text-[8px] font-black text-slate-700 uppercase mb-1">{m.round}</p>
                           <p className="text-[10px] font-black text-white italic truncate">{m.teamA} vs {m.teamB}</p>
                           <p className="text-xs font-black text-[#95f122] mt-1 italic">{m.scoreA} - {m.scoreB}</p>
                        </div>
                      ))}
                   </div>
                </div>
            </aside>
         </div>

         {/* Share Bar */}
         <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-10 p-10 bg-[#0c1221] border border-white/5">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-[#95f122]/5 border border-[#95f122]/20 flex items-center justify-center">
                  <Share2 size={24} className="text-[#95f122]" />
               </div>
               <div>
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Spread the arena.</h4>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Share this live bracket with players and fans.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => alert('Link copied to clipboard')} className="px-8 py-3 bg-[#040812] border border-white/10 text-white text-[9px] font-black uppercase italic tracking-widest hover:border-[#95f122]/40 transition-all">Copy Direct URL</button>
               <button className="px-8 py-3 bg-[#95f122] text-[#040812] text-[9px] font-black uppercase italic tracking-widest hover:bg-[#aeff33] transition-all">Twitter Share</button>
            </div>
         </div>
      </main>

      {/* FOOTER MINI */}
      <footer className="py-12 border-t border-white/5 text-center">
         <div className="flex items-center justify-center gap-4 text-slate-800">
            <Zap size={14} />
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">Powered by Morocco Padel Cluster Operational Command</p>
         </div>
      </footer>
    </div>
  );
};

export default TournamentPublic;

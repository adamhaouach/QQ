
import React from 'react';
import { TournamentMatch, MatchStatus, UserRole } from '../types';
import { Trophy, ChevronRight, Edit3, CheckCircle2, Activity, Zap } from 'lucide-react';

interface TournamentBracketProps {
  matches: TournamentMatch[];
  onEditMatch?: (matchId: string) => void;
  canEdit: boolean;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ matches, onEditMatch, canEdit }) => {
  const qf = matches.filter(m => m.round === 'QF').sort((a, b) => a.position - b.position);
  const sf = matches.filter(m => m.round === 'SF').sort((a, b) => a.position - b.position);
  const final = matches.filter(m => m.round === 'Final');

  const MatchCard = ({ match }: { match: TournamentMatch }) => {
    const isCompleted = match.status === MatchStatus.COMPLETED;
    const isLive = match.status === MatchStatus.IN_PROGRESS;
    
    return (
      <div 
        onClick={() => canEdit && onEditMatch?.(match.id)}
        className={`relative w-48 bg-[#0c1221] border transition-all duration-300 group rounded-sm ${
          canEdit ? 'cursor-pointer hover:border-[#95f122]/50 hover:shadow-[0_0_20px_rgba(149,241,34,0.1)]' : 'cursor-default'
        } ${
          isCompleted ? 'border-[#95f122]/20 shadow-inner' : 
          isLive ? 'border-[#95f122]/40 shadow-[0_0_15px_rgba(149,241,34,0.1)] animate-pulse' : 'border-white/5'
        }`}
      >
        {/* Status indicator top left */}
        <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 border-2 border-[#040812] rounded-full z-10 ${
          match.status === MatchStatus.COMPLETED ? 'bg-[#95f122]' : 
          match.status === MatchStatus.IN_PROGRESS ? 'bg-[#95f122] animate-pulse' :
          match.status === MatchStatus.SCHEDULED ? 'bg-blue-500' : 'bg-slate-800'
        }`} />

        {isLive && (
          <div className="absolute -top-3 right-2 flex items-center gap-1 bg-[#95f122] px-1.5 py-0.5 rounded-[2px]">
             <Zap size={8} className="text-[#040812] animate-bounce" />
             <span className="text-[6px] font-black text-[#040812] uppercase tracking-tighter">LIVE</span>
          </div>
        )}

        <div className="p-3 space-y-2">
          {/* Team A */}
          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-black uppercase italic tracking-tighter truncate max-w-[100px] ${
              match.winnerId === 'A' ? 'text-[#95f122]' : match.winnerId === 'B' ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {match.teamA || 'TBD'}
            </span>
            <span className={`text-[11px] font-black italic ${isLive ? 'text-[#95f122]' : 'text-white'}`}>{match.scoreA ?? '-'}</span>
          </div>
          
          <div className="h-[1px] bg-white/5" />

          {/* Team B */}
          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-black uppercase italic tracking-tighter truncate max-w-[100px] ${
              match.winnerId === 'B' ? 'text-[#95f122]' : match.winnerId === 'A' ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {match.teamB || 'TBD'}
            </span>
            <span className={`text-[11px] font-black italic ${isLive ? 'text-[#95f122]' : 'text-white'}`}>{match.scoreB ?? '-'}</span>
          </div>
        </div>

        {canEdit && (
          <div className="absolute inset-0 bg-[#95f122]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Edit3 size={14} className="text-[#95f122]" />
          </div>
        )}
      </div>
    );
  };

  const RoundColumn = ({ title, roundMatches, roundKey }: { title: string, roundMatches: TournamentMatch[], roundKey: string }) => (
    <div className="flex flex-col h-full shrink-0">
      <div className="mb-10 text-center">
        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 mb-2 italic">{title}</h4>
        <div className="w-8 h-0.5 bg-[#95f122]/20 mx-auto" />
      </div>
      <div className="flex flex-col justify-around flex-grow space-y-12">
        {roundMatches.map((m, idx) => (
          <div key={m.id} className="relative flex items-center">
            <MatchCard match={m} />
            
            {/* Bracket Connector lines (QF -> SF -> Final) */}
            {roundKey !== 'Final' && (
              <>
                {/* Horizontal line out */}
                <div className="absolute -right-6 w-6 h-[1px] bg-white/10" />
                {/* Vertical line connector */}
                {idx % 2 === 0 ? (
                   <div className="absolute -right-6 top-1/2 w-[1px] h-16 bg-white/10" />
                ) : (
                   <div className="absolute -right-6 bottom-1/2 w-[1px] h-16 bg-white/10" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto py-10 px-4 bg-[#040812] border border-white/5 relative min-h-[600px] flex items-center justify-center custom-scrollbar">
      <div className="flex items-stretch gap-10 md:gap-20 min-w-max px-8">
        <RoundColumn title="Quarter Finals" roundMatches={qf} roundKey="QF" />
        <RoundColumn title="Semi Finals" roundMatches={sf} roundKey="SF" />
        
        <div className="flex flex-col h-full shrink-0">
          <div className="mb-10 text-center">
            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#95f122] mb-2 italic flex items-center justify-center gap-2">
              <Trophy size={10} /> Grand Final
            </h4>
            <div className="w-12 h-0.5 bg-[#95f122] mx-auto" />
          </div>
          <div className="flex flex-col justify-center flex-grow">
            <div className="relative p-1 bg-gradient-to-br from-[#95f122]/20 to-transparent rounded-sm">
               <MatchCard match={final[0]} />
            </div>
            
            {final[0].winnerId && (
              <div className="mt-12 text-center animate-in zoom-in duration-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Champion</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#95f122] text-[#040812] rounded-sm shadow-2xl shadow-[#95f122]/20">
                  <Trophy size={14} className="animate-bounce" />
                  <span className="text-xs font-black uppercase italic tracking-tighter">
                    {final[0].winnerId === 'A' ? final[0].teamA : final[0].teamB}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#95f122]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
};

export default TournamentBracket;

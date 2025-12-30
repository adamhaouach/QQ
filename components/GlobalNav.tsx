
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCw, ChevronRight, Home } from 'lucide-react';

interface GlobalNavProps {
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ canBack, canForward, onBack, onForward, onRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(p => p !== '');
  
  return (
    <div className="fixed top-[68px] md:top-[80px] left-0 w-full z-40 bg-[#0c1221]/40 backdrop-blur-md border-b border-white/[0.02] py-2 px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex bg-[#040812]/50 border border-white/[0.05] rounded-sm p-0.5 shadow-inner">
            <button 
              onClick={onBack}
              disabled={!canBack}
              className={`p-1.5 transition-all ${canBack ? 'hover:text-[#95f122] text-slate-400' : 'text-slate-800 cursor-not-allowed'}`}
              title="Back"
            >
              <ArrowLeft size={14} />
            </button>
            <button 
              onClick={onForward}
              disabled={!canForward}
              className={`p-1.5 border-l border-white/[0.03] transition-all ${canForward ? 'hover:text-[#95f122] text-slate-400' : 'text-slate-800 cursor-not-allowed'}`}
              title="Forward"
            >
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={onRefresh}
              className="p-1.5 hover:text-[#95f122] transition-all text-slate-600 border-l border-white/[0.03] group"
              title="Refresh State"
            >
              <RotateCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
          </div>
          
          <div className="h-3 w-[1px] bg-white/[0.05] mx-4 hidden sm:block"></div>
          
          <nav className="hidden sm:flex items-center text-[9px] font-bold uppercase tracking-widest text-slate-600">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-slate-300 flex items-center transition-colors group"
            >
              <Home size={10} className="mr-2 group-hover:text-[#95f122] transition-colors" /> Home
            </button>
            
            {pathParts.map((part, i) => {
              const target = '/' + pathParts.slice(0, i + 1).join('/');
              const isLast = i === pathParts.length - 1;
              
              return (
                <React.Fragment key={i}>
                  <ChevronRight size={10} className="mx-2 text-slate-800 shrink-0" />
                  <button 
                    onClick={() => !isLast && navigate(target)}
                    disabled={isLast}
                    className={`transition-colors whitespace-nowrap ${isLast ? 'text-[#95f122]/70 cursor-default' : 'hover:text-slate-300 cursor-pointer'}`}
                  >
                    {part.replace(/-/g, ' ')}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Subtle Activity Dot Only */}
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full border border-white/[0.03] bg-white/[0.01]">
            <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse shadow-[0_0_4px_rgba(20,184,166,0.5)]"></div>
            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Secure Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalNav;

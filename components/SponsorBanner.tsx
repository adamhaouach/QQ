
import React from 'react';
import { Sponsor } from '../types';
import { ExternalLink } from 'lucide-react';

interface SponsorBannerProps {
  sponsor: Sponsor;
}

const SponsorBanner: React.FC<SponsorBannerProps> = ({ sponsor }) => {
  return (
    <a 
      href={sponsor.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="bg-slate-900/50 border border-white/5 rounded-sm p-4 flex items-center justify-between hover:border-[#95f122]/30 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center overflow-hidden p-2">
            <img src={sponsor.imageUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
          </div>
          <div>
            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Official Network Partner</p>
            <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest">{sponsor.name}</h4>
          </div>
        </div>
        <ExternalLink size={12} className="text-slate-700 group-hover:text-[#95f122] transition-colors" />
      </div>
    </a>
  );
};

export default SponsorBanner;

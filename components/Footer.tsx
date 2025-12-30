
import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040812] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-1.5">
              <div className="bg-[#95f122] px-1.5 py-0.5 transform -skew-x-12">
                <span className="text-[#040812] font-black text-lg italic tracking-tighter block transform skew-x-12">P</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-black text-white tracking-tighter uppercase italic">Padel</span>
                <span className="text-lg font-normal text-[#95f122] tracking-tighter uppercase italic ml-0.5 opacity-90">Club</span>
              </div>
            </div>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest italic leading-relaxed">
              Book courts and play padel in Morocco. Access coaching and tournaments.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 hover:text-[#95f122] transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white mb-8">Play</h3>
            <ul className="space-y-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
              <li><Link to="/booking" className="hover:text-[#95f122]">Book Court</Link></li>
              <li><Link to="/coaching" className="hover:text-[#95f122]">Coaching</Link></li>
              <li><Link to="/membership" className="hover:text-[#95f122]">Membership</Link></li>
              <li><Link to="/events" className="hover:text-[#95f122]">Tournaments</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white mb-8">Services</h3>
            <ul className="space-y-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
              <li>Matchmaking</li>
              <li>Player Stats</li>
              <li>Court Rules</li>
              <li>Pro Shop</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white mb-8">Contact</h3>
            <ul className="space-y-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
              <li className="flex items-center space-x-3">
                <MapPin size={12} className="text-[#95f122] flex-shrink-0" />
                <span>Casablanca HQ</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={12} className="text-[#95f122] flex-shrink-0" />
                <span>+212 522 99</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={12} className="text-[#95f122] flex-shrink-0" />
                <span>hq@padelclub.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-800 text-[8px] font-black uppercase tracking-widest">© {new Date().getFullYear()} PADELCLUB MOROCCO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[8px] font-black uppercase tracking-widest text-slate-800">
            <a href="#">Privacy</a>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

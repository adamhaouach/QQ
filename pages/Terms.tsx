
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, Scale, HelpCircle, FileText, Zap, MapPin } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#040812] pt-24 pb-20 selection:bg-[#95f122] selection:text-[#040812]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* HEADER */}
        <header className="mb-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="inline-flex items-center gap-1.5 bg-[#95f122]/5 border border-[#95f122]/10 px-2 py-0.5 mb-4">
            <FileText size={10} className="text-[#95f122]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#95f122]">Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
            TERMS OF <span className="text-[#95f122]">USE.</span>
          </h1>
          <p className="text-slate-500 text-lg font-bold uppercase italic tracking-tighter max-w-2xl opacity-90 leading-tight">
            Simple rules for a better arena experience. No complex legal jargon.
          </p>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="space-y-12">
          
          <section className="bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="text-[#95f122]" size={20} />
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">1. Our Role</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              PadelClub acts as a <strong className="text-white">digital intermediary</strong> connecting Players, Coaches, and Clubs. We provide the technology to book courts, schedule lessons, and track competitions. 
            </p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              We do not own the courts or directly employ the coaches; we facilitate the connection and secure the payments.
            </p>
          </section>

          <section className="bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <CreditCard className="text-[#95f122]" size={20} />
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">2. Payments & Refunds</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Online Priority</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  All reservations and tournament entries must be paid <strong className="text-white">online</strong> via our secure gateway to be confirmed in the cluster network.
                </p>
              </div>
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Cancellation Policy</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li className="flex gap-3">
                    <span className="text-[#95f122] font-black">24H+:</span>
                    Full refund or credit if cancelled more than 24 hours before the slot.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">-24H:</span>
                    No refunds for cancellations made within 24 hours of the reserved window.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-[#95f122]" size={20} />
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">3. Responsibilities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Facility & Coach</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Clubs are responsible for court maintenance and safety. Coaches are responsible for lesson quality and professional certification.
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Player Conduct</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Respect club rules, equipment, and other athletes. Aggressive behavior or equipment damage may result in network suspension.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Scale className="text-[#95f122]" size={20} />
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">4. Competitive Integrity</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Tournament results feed our national ranking matrix. Falsifying scores or unsportsmanlike conduct in competition will lead to the removal of points and potential tournament bans.
            </p>
            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-sm">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                Ranking points are symbolic for the platform and carry no cash value.
              </p>
            </div>
          </section>

          <section className="bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-[#95f122]" size={20} />
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">5. Legal Notice</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              These terms are governed by <strong className="text-white">Moroccan Law</strong>. By using PadelClub, you agree that we are not liable for physical injuries sustained on court or loss of personal property at facility locations.
            </p>
            <div className="flex items-center gap-3 text-slate-600">
               <HelpCircle size={14} />
               <p className="text-[9px] font-black uppercase tracking-widest">Questions? Email us: hq@padelclub.ma</p>
            </div>
          </section>

        </div>

        {/* FOOTER ACTION */}
        <div className="mt-16 text-center border-t border-white/5 pt-12">
           <Link to="/register" className="bg-[#95f122] text-[#040812] px-10 py-4 btn-sport text-[11px]">
              Accept & Join The Arena
           </Link>
           <p className="mt-6 text-slate-700 text-[8px] font-black uppercase tracking-[0.3em]">Last Updated: June 2024</p>
        </div>

      </div>
    </div>
  );
};

export default Terms;

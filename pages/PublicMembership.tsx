
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Zap, CheckCircle2, Trophy, Clock, Target } from 'lucide-react';

const PublicMembership: React.FC = () => {
  const plans = [
    {
      name: 'Rookie',
      price: 'Free',
      period: 'Forever',
      description: 'Standard access for casual play.',
      icon: <Target size={16} className="text-slate-700" />,
      features: ['Standard court booking', 'Market rate pricing', 'Player profile', 'Event news'],
      cta: 'Sign Up',
      color: 'border-white/5',
      badge: null
    },
    {
      name: 'Challenger',
      price: '290',
      period: 'MAD / Month',
      description: 'For active weekly competitors.',
      icon: <Zap size={16} className="text-[#95f122]" />,
      features: ['-15% Court discounts', '10-Day Advance Booking', '2 Free Gear Rentals', 'Lounge access'],
      cta: 'Join Now',
      color: 'border-[#95f122]/20',
      badge: 'POPULAR'
    },
    {
      name: 'Elite',
      price: '890',
      period: 'MAD / Month',
      description: 'The ultimate club experience.',
      icon: <Crown size={16} className="text-[#95f122]" />,
      features: ['-30% Court discounts', 'Unlimited Gear Rental', '1 Monthly Private Lesson', 'Tournament Priority'],
      cta: 'Join Now',
      color: 'border-[#95f122]/40',
      badge: 'ELITE'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040812] pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#95f122]/5 border border-[#95f122]/10 px-2 py-0.5 mb-4 mx-auto md:mx-0">
            <Trophy size={10} className="text-[#95f122]" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[#95f122]">Tier Access</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl sport-headline text-white italic mb-6 leading-none">
            JOIN THE <span className="text-[#95f122]">CLUB.</span>
          </h1>
          <p className="text-slate-500 text-base md:text-xl font-bold uppercase italic tracking-tighter max-w-2xl opacity-90 leading-tight">
            Unlock exclusive court rates, advance booking, and premium services across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
          {plans.map((plan, idx) => (
            <div key={plan.name} className={`relative bg-slate-900 border-2 p-6 md:p-8 flex flex-col h-full hover:bg-slate-800 transition-all shadow-2xl rounded-sm`}
              style={{ borderColor: plan.badge ? 'var(--color-accent)' : 'rgba(255,255,255,0.02)' }}>
              {plan.badge && (
                <div className="absolute -top-3 left-4 bg-[#95f122] text-[#040812] text-[8px] font-black px-3 py-1 italic shadow-xl">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6 p-3 bg-[#040812] inline-block border border-white/5 shrink-0">{plan.icon}</div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6 md:mb-8 border-b border-white/5 pb-6">
                <span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">{plan.price}</span>
                <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest">{plan.period}</span>
              </div>
              <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 md:gap-3">
                    <CheckCircle2 size={14} className="text-[#95f122] shrink-0 mt-0.5" />
                    <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-tight md:tracking-tighter">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" className={`w-full py-4 btn-sport text-[9px] md:text-[10px] shadow-2xl ${plan.badge ? 'bg-[#95f122] text-[#040812]' : 'bg-slate-800 text-white'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-slate-900 border-l-4 border-[#95f122] p-8 md:p-12 mb-20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <Clock size={16} />, title: 'ADVANCE BOOKING', desc: 'Secure peak slots before they open to the public.' },
              { icon: <Trophy size={16} />, title: 'CLUB LADDER', desc: 'Automatic entry into national player rankings.' },
              { icon: <Target size={16} />, title: 'FIND PLAYERS', desc: 'Connect with others at your specific skill level.' }
            ].map((perk, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-[#95f122] shrink-0 mt-1">{perk.icon}</div>
                <div>
                  <h4 className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest italic mb-2">{perk.title}</h4>
                  <p className="text-slate-600 text-[8px] md:text-[9px] font-bold uppercase tracking-tight leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMembership;

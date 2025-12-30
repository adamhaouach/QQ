
import React from 'react';
import { User, MembershipType } from '../types';
import { Check, Zap, Crown, Rocket, ShieldCheck } from 'lucide-react';

const Membership: React.FC<{ user: User | null }> = ({ user }) => {
  const plans = [
    {
      type: MembershipType.BASIC,
      price: 'Free',
      period: 'Forever',
      icon: <Rocket className="w-6 h-6 text-slate-700" />,
      features: ['Standard court booking', 'Market rate pricing', 'Club house access', 'Network news feed'],
      cta: 'Current',
      color: 'slate-400'
    },
    {
      type: MembershipType.PREMIUM,
      price: '290 MAD',
      period: 'per month',
      icon: <Zap className="w-6 h-6 text-teal-600" />,
      features: ['-15% on all bookings', '10 days advance access', '2 Free gear rentals / mo', 'Match-making service'],
      cta: 'Join Premium',
      popular: true,
      color: 'teal-600'
    },
    {
      type: MembershipType.ELITE,
      price: '890 MAD',
      period: 'per month',
      icon: <Crown className="w-6 h-6 text-[#c5a059]" />,
      features: ['-30% on all bookings', 'Unlimited gear rental', '1 Free lesson / month', 'Concierge support'],
      cta: 'Go Elite',
      color: 'amber-600'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <h1 className="text-5xl font-light text-white uppercase tracking-tighter mb-8">Tier <span className="font-bold text-teal-600">Access</span></h1>
        <p className="text-slate-600 text-lg font-medium leading-relaxed">
          Manage your player status and unlock elite network privileges across all Moroccan facilities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-20 bg-[#12192b] border border-teal-900/20 p-8 rounded-xl flex items-center gap-7 shadow-2xl shadow-black/40">
        <div className="bg-teal-950/40 p-4 rounded-lg shrink-0 border border-teal-900/20">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
        </div>
        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed uppercase tracking-widest">
          <span className="text-[#c5a059] font-bold mr-2">Instant Sync:</span> Subscriptions update your operational status immediately across the cluster network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.type}
            className={`relative flex flex-col p-12 rounded-2xl border bg-[#12192b] transition-all hover:translate-y-[-4px] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] ${
              plan.popular ? 'border-teal-700/30 ring-1 ring-teal-900/10' : 'border-white/5'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-700 text-white text-[8px] font-bold px-6 py-2.5 rounded uppercase tracking-[0.3em] shadow-2xl">
                Most Preferred
              </span>
            )}

            <div className="mb-10 p-5 bg-[#0a0f1c] inline-block rounded-lg border border-white/5 shadow-inner">
              {plan.icon}
            </div>

            <h3 className="text-2xl font-light text-white uppercase tracking-[0.15em] mb-2">{plan.type}</h3>
            <div className="flex items-baseline mb-12 border-b border-white/5 pb-10">
              <span className="text-3xl font-black text-slate-200 tracking-tighter">{plan.price}</span>
              <span className="text-slate-600 ml-2 text-[9px] font-bold uppercase tracking-[0.2em]">{plan.period}</span>
            </div>

            <div className="flex-grow space-y-5 mb-14">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0 opacity-80" />
                  <span className="text-slate-500 text-xs font-semibold leading-tight uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-5 rounded font-bold text-[9px] uppercase tracking-[0.3em] transition-all ${
                plan.type === user?.membership || (plan.type === MembershipType.BASIC && user?.membership === MembershipType.NONE)
                  ? 'bg-slate-900 text-slate-700 border border-white/5 cursor-default'
                  : plan.popular
                    ? 'bg-teal-700 text-white hover:bg-teal-600 shadow-xl shadow-teal-950/40'
                    : 'bg-[#1e293b] text-slate-400 border border-white/5 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {plan.type === user?.membership ? 'Operational' : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
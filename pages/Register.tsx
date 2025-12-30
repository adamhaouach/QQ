
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole, SkillLevel } from '../types';
import { User as UserIcon, Mail, Trophy, Lock, ArrowRight } from 'lucide-react';
import { getRedirectPath } from '../App';

interface RegisterProps {
  onLogin: (user: User) => void;
  user?: User | null;
}

const Register: React.FC<RegisterProps> = ({ onLogin, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skillLevel: SkillLevel.BEGINNER
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Role Logic: Sticky Test Role > Default Player
    const savedRole = localStorage.getItem('padel_active_role') as UserRole | null;
    const finalRole = savedRole || UserRole.PLAYER;

    // Fixed: Added missing required 'gender' property
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: formData.name,
      email: formData.email,
      role: finalRole,
      skillLevel: formData.skillLevel,
      gender: 'Other'
    };

    onLogin(newUser);
    setIsSubmitting(false);
    navigate(getRedirectPath(newUser));
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col lg:flex-row overflow-hidden selection:bg-[#95f122] selection:text-slate-900">
      
      {/* LEFT COLUMN */}
      <section className="relative lg:w-1/2 h-[30vh] lg:h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=2000"
          alt="Outdoor Padel Court"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden"></div>
      </section>

      {/* RIGHT COLUMN */}
      <section className="lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#95f122]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-3 leading-none">
              JOIN THE <span className="text-[#95f122]">ARENA.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Start your professional padel journey today.</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 group">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#95f122]" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Full Name"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#95f122]/50 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 group">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Level</label>
                  <div className="relative">
                    <Trophy size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#95f122]" />
                    <select
                      value={formData.skillLevel}
                      onChange={(e) => setFormData({...formData, skillLevel: e.target.value as SkillLevel})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#95f122]/50 transition-all appearance-none"
                    >
                      {Object.values(SkillLevel).map(level => (
                        <option key={level} value={level} className="bg-slate-900">{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#95f122]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@address.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#95f122]/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#95f122]" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#95f122]/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden bg-[#95f122] text-slate-950 py-4 rounded-xl font-bold text-[13px] hover:bg-[#a6ff33] transform hover:translate-y-[-2px] active:translate-y-[0px] transition-all shadow-xl shadow-[#95f122]/10 flex items-center justify-center gap-2 mt-4 uppercase tracking-[0.2em]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign Up <ArrowRight size={14} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-500 text-[11px] font-medium">
                Already a member?{' '}
                <Link to="/login" className="text-[#95f122] font-bold hover:text-white transition-colors ml-1 uppercase">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

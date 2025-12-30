import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';
import { getRedirectPath } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
  user?: User | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    // Role Logic: Sticky Test Role > Email Detection > Default Player
    const savedRole = localStorage.getItem('padel_active_role') as UserRole | null;
    let detectedRole = savedRole;

    if (!detectedRole) {
      if (email.toLowerCase().includes('admin')) detectedRole = UserRole.ADMIN;
      else if (email.toLowerCase().includes('coach')) detectedRole = UserRole.COACH;
      else if (email.toLowerCase().includes('club')) detectedRole = UserRole.CLUB;
      else detectedRole = UserRole.PLAYER;
    }

    // Fixed: Added missing required 'gender' property
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: detectedRole,
      gender: 'Other'
    };

    onLogin(mockUser);
    setIsSubmitting(false);
    navigate(getRedirectPath(mockUser));
  };

  return (
    <div id="login-viewport" className="flex min-h-screen bg-[#040812] selection:bg-[#95f122] selection:text-[#040812] overflow-hidden">
      {/* LEFT COLUMN: BRAND IMPACT */}
      <section 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#040812] border-r border-white/5"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/images/login-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Deep branding gradient layers - Kept as fallback/depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1221] to-[#040812] opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(149,241,34,0.03)_0%,_transparent_70%)]"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          <div>
            <div className="inline-block px-3 py-1 bg-[#95f122] text-[#040812] text-[10px] font-black uppercase italic tracking-tighter transform -skew-x-12 mb-8">
              EST. 2024
            </div>
          </div>
          
          <div>
            <h1 className="text-7xl font-black text-white italic leading-[0.9] tracking-tighter uppercase mb-6">
              BOOK. PLAY. <br />
              <span className="text-[#95f122]">REPEAT.</span>
            </h1>
            <p className="text-slate-400 text-lg font-bold uppercase italic tracking-tighter opacity-80 max-w-md">
              Your professional gateway to the PadelClub arena.
            </p>
          </div>
          
          <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
            PadelClub Network &copy; 2024
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: LOGIN FORM - Centered & Isolated */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col justify-center">
          
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="bg-[#95f122] w-7 h-7 flex items-center justify-center rounded-sm transform -skew-x-12">
              <span className="text-[#040812] font-black text-sm italic transform skew-x-12">P</span>
            </div>
            <span className="text-white font-black uppercase italic tracking-tighter text-base">PadelClub</span>
          </div>

          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">PLAYER LOGIN</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Access the arena hub.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-0.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL"
                  className="w-full bg-[#0c1221] border border-white/5 rounded-sm py-4 pl-12 pr-4 text-[13px] font-bold text-white placeholder:text-slate-900 focus:outline-none focus:border-[#95f122]/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="KEY"
                  className="w-full bg-[#0c1221] border border-white/5 rounded-sm py-4 pl-12 pr-12 text-[13px] font-bold text-white placeholder:text-slate-900 focus:outline-none focus:border-[#95f122]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#95f122] text-[#040812] py-5 rounded-sm font-black text-[11px] uppercase italic tracking-[0.1em] hover:bg-[#aeff33] transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#040812]/20 border-t-[#040812] rounded-full animate-spin"></div>
              ) : (
                <>
                  SIGN IN <ArrowRight size={14} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest text-center leading-loose">
              New to the hub?{' '}
              <Link to="/register" className="text-[#95f122] font-black hover:underline block md:inline mt-1 md:mt-0">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
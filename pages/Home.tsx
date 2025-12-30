
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Calendar, 
  Users, 
  Trophy, 
  CreditCard, 
  MapPin, 
  Clock,
  ChevronRight,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { User, UserRole, FeatureConfig } from '../types';
import { INITIAL_COURTS, INITIAL_EVENTS, INITIAL_COACHES } from '../data/mockData';
import { getRedirectPath } from '../App';

interface HomeProps {
  onLogin?: (user: User) => void;
  user?: User | null;
  featureConfig?: FeatureConfig;
}

const Home: React.FC<HomeProps> = ({ onLogin, user, featureConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

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
      id: Math.random().toString(36).substring(2, 11),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: detectedRole,
      gender: 'Other'
    };

    onLogin(mockUser);
    setIsSubmitting(false);
    navigate(getRedirectPath(mockUser));
  };

  const quickActions = [
    { label: 'Book', icon: <Calendar size={22} />, path: user ? '/book-court' : '/booking', color: 'text-accent', enabled: true },
    { label: 'Coaching', icon: <Users size={22} />, path: '/coaching', color: 'text-white', enabled: featureConfig?.coachingEnabled },
    { label: 'Events', icon: <Trophy size={22} />, path: '/events', color: 'text-white', enabled: featureConfig?.tournamentsEnabled },
    { label: 'Member', icon: <CreditCard size={22} />, path: '/membership', color: 'text-white', enabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#040812] pt-20 md:pt-24 pb-10 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {featureConfig?.emergencyBookingDisable && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 flex items-center gap-4 animate-pulse rounded-sm">
            <ShieldAlert size={18} className="text-red-500 shrink-0" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500">FACILITY LOCKOUT ACTIVE.</p>
          </div>
        )}

        {/* HERO SECTION FOR MOBILE */}
        <div className="lg:hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h1 className="text-5xl font-black text-white italic leading-[0.9] tracking-tighter uppercase mb-6">
              BOOK. PLAY. <br />
              <span className="text-[#95f122]">REPEAT.</span>
           </h1>
           <p className="text-slate-500 text-xs font-black uppercase tracking-widest italic opacity-80">Morocco's premier padel cluster nodes.</p>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12">
          {quickActions.map((action) => (
            <Link 
              key={action.label} 
              to={action.enabled ? action.path : '#'}
              className={`flex flex-col items-center justify-center p-4 md:p-6 bg-[#0c1221] border border-white/5 rounded-sm hover:border-accent/30 transition-all group ${!action.enabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <div className={`mb-2 md:mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          <div className="lg:col-span-8 space-y-4 md:space-y-8">
            <header className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-6">
              <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Zap size={16} className="text-accent" /> LIVE SLOTS
              </h2>
              <Link to="/booking" className="text-[10px] md:text-xs font-bold text-accent uppercase hover:underline">View All</Link>
            </header>

            <div className="space-y-2 md:space-y-4">
              {INITIAL_COURTS.slice(0, 4).map((court) => (
                <div key={court.id} className="flex items-center p-3 md:p-5 bg-[#0c1221] border border-white/5 rounded-sm hover:bg-[#111827] transition-colors group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 overflow-hidden border border-white/5 mr-4 shrink-0">
                    <img src={court.image} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="flex-grow min-w-0 pr-2">
                    <h3 className="text-xs md:text-sm font-black text-white uppercase truncate tracking-tight">{court.name}</h3>
                    <div className="flex items-center gap-3 mt-1 overflow-hidden">
                      <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate">
                        <MapPin size={10} className="text-accent shrink-0" /> {court.type} Facility
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-xs md:text-lg font-black text-white italic leading-none">{court.price} <span className="hidden sm:inline text-[8px] font-normal text-slate-500">MAD</span></p>
                    <Link to={user ? "/book-court" : "/booking"} className="inline-block mt-1 px-3 md:px-4 py-1.5 md:py-2 bg-accent text-[#040812] text-[9px] md:text-[11px] font-black uppercase italic rounded-sm hover:bg-accent-hover shadow-lg">Book</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 mt-4 lg:mt-0">
            {!user ? (
              <div className="bg-[#0c1221] border border-white/5 p-6 md:p-10 rounded-sm shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/20"></div>
                <header className="mb-6 md:mb-8">
                  <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest italic">Identity Auth</h3>
                  <p className="hidden md:block text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">Authorized Node Connection</p>
                </header>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest ml-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" className="w-full bg-[#040812] border border-white/10 p-4 text-xs font-bold text-white focus:outline-none focus:border-accent/40 placeholder:text-slate-800 rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest ml-1">Key</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full bg-[#040812] border border-white/10 p-4 text-xs font-bold text-white focus:outline-none focus:border-accent/40 placeholder:text-slate-800 rounded-sm" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-[#040812] py-4 text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.15em] hover:bg-accent-hover transition-all flex items-center justify-center gap-3 shadow-xl">
                    {isSubmitting ? "SYNCING..." : "ENTER CLUSTER"}
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-[#0c1221] border border-white/5 p-6 md:p-12 rounded-sm text-center shadow-2xl min-h-[300px] flex flex-col justify-center">
                 <div className="relative inline-block mb-6 mx-auto">
                   <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=95f122&color=040812&size=128`} className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-accent/10 grayscale shadow-2xl" alt="" />
                   <div className="absolute bottom-1 right-1 w-3 h-3 bg-accent rounded-full border-2 border-[#0c1221] animate-pulse"></div>
                 </div>
                 <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">Welcome, {user.name}</h3>
                 <Link to={getRedirectPath(user)} className="block w-full bg-slate-900 border border-white/10 text-white py-4 text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl mt-6">Go to Dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

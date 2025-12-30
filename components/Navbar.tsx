import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, Notification } from '../types';
import { Menu, X, ChevronDown, ChevronRight, Bell, Ban, LayoutDashboard, LogOut, User as UserIcon, Shield, Users } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import RoleSwitcher from './RoleSwitcher';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onRoleSwitch?: (user: User) => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onToggleFriends: () => void;
  pendingFriendsCount: number;
  hasOnlineFriends: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, onLogout, onRoleSwitch, notifications, onMarkRead, onClearAll, onToggleFriends, pendingFriendsCount, hasOnlineFriends 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Play', path: user ? '/book-court' : '/booking' },
    { name: 'Coaching', path: '/coaching' },
    { name: 'Events', path: '/events' },
    { name: 'Rankings', path: '/rankings' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/[0.03] ${
      scrolled ? 'bg-[#040812]/95 backdrop-blur-md h-[64px]' : 'bg-[#040812] h-[72px]'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LEFT ZONE: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="bg-[#95f122] w-7 h-7 flex items-center justify-center transform -skew-x-12 shadow-lg shadow-[#95f122]/10 transition-transform group-hover:scale-105">
              <span className="text-[#040812] font-black text-lg italic block transform skew-x-12">P</span>
            </div>
            <div className="flex items-baseline overflow-hidden">
              <span className="text-xl font-black text-white tracking-[-0.04em] uppercase italic">PADEL</span>
              <span className="text-xl font-light text-[#95f122] tracking-[0.02em] uppercase italic ml-0.5 opacity-90">CLUB</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[9px] font-black uppercase tracking-[0.25em] transition-all hover:text-white ${
                  isActive(link.path) ? 'text-[#95f122]' : 'text-slate-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CENTER ZONE: Interactive Role Switcher */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          {onRoleSwitch && <RoleSwitcher onRoleSwitch={onRoleSwitch} currentUser={user} />}
        </div>

        {/* RIGHT ZONE: Social + Notifications + Profile */}
        <div className="flex items-center space-x-5">
          {user ? (
            <div className="flex items-center gap-3">
              {/* FRIENDS ENTRY POINT */}
              <div className="relative">
                <button 
                  onClick={onToggleFriends}
                  className="p-1.5 text-slate-500 hover:text-[#95f122] transition-all border border-transparent hover:border-[#95f122]/20 rounded-full group relative"
                >
                  <Users size={16} />
                  {hasOnlineFriends && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#95f122] rounded-full border-2 border-[#040812] shadow-[0_0_5px_#95f122]" />
                  )}
                  {pendingFriendsCount > 0 && (
                    <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[7px] font-black px-1 rounded-full min-w-[14px] border border-[#040812]">
                      {pendingFriendsCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                  className="p-1.5 text-slate-500 hover:text-white relative transition-all"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#95f122] rounded-full border border-[#040812]"></span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-6 z-[400] animate-in fade-in slide-in-from-top-2 duration-200">
                    <NotificationCenter 
                      notifications={notifications} 
                      onMarkRead={onMarkRead} 
                      onClearAll={onClearAll}
                      onClose={() => setIsNotificationsOpen(false)} 
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="flex items-center gap-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 pl-1.5 pr-3 py-1 transition-all rounded-full group"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-[#95f122]/30 transition-all">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={12} className="text-slate-500" />
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={10} className="text-slate-600 group-hover:text-[#95f122]" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-[#0c1221] border border-white/10 p-1 shadow-3xl animate-in fade-in slide-in-from-top-2 duration-200 rounded-sm overflow-hidden z-[400]">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-3.5 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-[#95f122] transition-all rounded-sm" 
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard size={13} /> Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 w-full text-left px-3.5 py-2.5 text-[9px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all border-t border-white/5 rounded-sm mt-0.5"
                    >
                      <LogOut size={13} /> Exit Node
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="bg-[#95f122] text-[#040812] px-5 py-1.5 btn-sport text-[8px] shadow-lg shadow-[#95f122]/10 hover:bg-[#aeff33]">Join Club</Link>
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-400 hover:text-white p-1">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-[#040812] z-50 animate-in slide-in-from-right duration-300 overflow-y-auto w-full border-t border-white/5">
          <div className="p-8 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-5 text-3xl font-black uppercase italic tracking-tighter border-b border-white/[0.02] ${
                  isActive(link.path) ? 'text-[#95f122]' : 'text-slate-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <>
              <button
                className="block w-full py-6 text-3xl font-black uppercase italic tracking-tighter text-white flex items-center justify-between border-b border-white/[0.02]"
                onClick={() => { setIsOpen(false); onToggleFriends(); }}
              >
                Social Cluster <Users size={32} />
              </button>
              <Link
                to="/dashboard"
                className="block py-6 text-3xl font-black uppercase italic tracking-tighter text-[#95f122] flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                Dashboard <ChevronRight size={32} />
              </Link>
              </>
            )}
            <div className="pt-10">
               {!user ? (
                 <Link to="/register" className="w-full bg-[#95f122] text-[#040812] py-6 block text-center btn-sport text-xl italic font-black">Join Now</Link>
               ) : (
                 <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 py-6 text-center btn-sport text-xl font-black italic border border-red-500/20">Sign Out</button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
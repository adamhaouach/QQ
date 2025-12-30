
import React, { useState } from 'react';
import { User, CoachingSession, AvailabilitySlot, SkillLevel } from '../types';
import { INITIAL_TIME_SLOTS } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  Star, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  History as HistoryIcon, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  Edit2,
  Trash2,
  Lock,
  Save,
  User as UserIcon,
  MapPin
} from 'lucide-react';

interface CoachDashboardProps {
  user: User;
  sessions: CoachingSession[];
}

type Tab = 'overview' | 'schedule' | 'history' | 'settings';

const CoachDashboard: React.FC<CoachDashboardProps> = ({ user, sessions }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { day: 'Monday', slots: INITIAL_TIME_SLOTS.slice(0, 4) },
    { day: 'Wednesday', slots: INITIAL_TIME_SLOTS.slice(2, 6) },
    { day: 'Friday', slots: INITIAL_TIME_SLOTS },
  ]);

  const [coachProfile, setCoachProfile] = useState({
    name: user.name,
    bio: 'FMP Level 2 Certified Instructor with 10 years of competitive experience. Specialized in tactical defensive positioning.',
    skillLevel: user.skillLevel || SkillLevel.ADVANCED,
    payoutBank: 'Morocco Central Node'
  });

  const coachSessions = sessions.filter(s => s.coachId === user.id || s.coachName.toUpperCase() === user.name);
  const upcomingSessions = coachSessions.filter(s => s.status === 'Booked');
  const pastSessions = coachSessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

  const totalEarnings = coachSessions.reduce((acc, s) => s.status !== 'Cancelled' ? acc + s.price : acc, 0);
  const pendingEarnings = upcomingSessions.reduce((acc, s) => acc + s.price, 0);

  const toggleSlot = (day: string, slot: string) => {
    setAvailability(prev => {
      const dayIndex = prev.findIndex(a => a.day === day);
      if (dayIndex === -1) {
        return [...prev, { day, slots: [slot] }];
      }
      const newAvailability = [...prev];
      const dayObj = { ...newAvailability[dayIndex] };
      if (dayObj.slots.includes(slot)) {
        dayObj.slots = dayObj.slots.filter(s => s !== slot);
      } else {
        dayObj.slots = [...dayObj.slots, slot].sort();
      }
      newAvailability[dayIndex] = dayObj;
      return newAvailability;
    });
  };

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0c1221] border border-white/5 p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#95f122]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#95f122]/10 transition-colors"></div>
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Total Revenue</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">{totalEarnings} MAD</h3>
            <span className="text-[9px] font-bold text-[#95f122] flex items-center mb-1"><TrendingUp size={10} className="mr-1" /> +14%</span>
          </div>
        </div>
        <div className="bg-[#0c1221] border border-white/5 p-8 shadow-xl relative overflow-hidden group">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Upcoming Payout</p>
          <h3 className="text-3xl font-black text-white italic tracking-tighter">{pendingEarnings} MAD</h3>
        </div>
        <div className="bg-[#0c1221] border border-white/5 p-8 shadow-xl relative overflow-hidden group">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Rating</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">4.9</h3>
            <div className="flex text-[#95f122]">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < 4 ? "#95f122" : "none"} />)}
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <Calendar className="text-[#95f122]" size={16} /> Immediate Schedule
          </h3>
          <button onClick={() => setActiveTab('schedule')} className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">View All</button>
        </div>
        
        <div className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="bg-[#0c1221] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#95f122]/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#040812] border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{session.date.split('-')[1]}</span>
                    <span className="text-2xl font-black text-[#95f122] italic tracking-tighter leading-none">{session.date.split('-')[2]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-widest">{session.userName}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                        <Clock size={10} /> {session.time}
                      </span>
                      <span className="px-2 py-0.5 bg-[#95f122]/5 text-[#95f122] text-[8px] font-black uppercase tracking-widest border border-[#95f122]/10">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Session Value</p>
                  <p className="text-lg font-black text-white italic tracking-tighter">{session.price} MAD</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-[#0c1221]/30 border border-dashed border-white/5 rounded-sm">
              <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em]">No upcoming sessions scheduled.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderSchedule = () => (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-12">
      <div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Availability Control</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Select your active instruction windows across the week.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
          const dayAvailability = availability.find(a => a.day === day);
          return (
            <div key={day} className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5 pb-2">{day.slice(0, 3)}</h4>
              <div className="grid grid-cols-1 gap-2">
                {INITIAL_TIME_SLOTS.map(slot => {
                  const isActive = dayAvailability?.slots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(day, slot)}
                      className={`py-3 px-2 rounded-sm text-[8px] font-black uppercase tracking-tighter transition-all border ${
                        isActive 
                          ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                          : 'bg-[#0c1221] text-slate-700 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {slot.split(' - ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-[#95f122]/5 border border-[#95f122]/10 flex items-center gap-4">
        <CheckCircle className="text-[#95f122]" size={16} />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Changes are synchronized globally in real-time. Players will see updated windows immediately.</p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
      <div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Coaching Ledger</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Historical record of all completed instruction cycles.</p>
      </div>

      <div className="bg-[#0c1221] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#040812] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Athlete</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Date & Window</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Type</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Earnings</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pastSessions.map((session) => (
              <tr key={session.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <p className="text-[11px] font-black text-white uppercase italic tracking-widest">{session.userName}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{session.date} • {session.time}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{session.type}</span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-black text-white italic tracking-tighter">{session.price} MAD</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {session.status === 'Completed' ? (
                      <CheckCircle size={12} className="text-[#95f122]" />
                    ) : (
                      <XCircle size={12} className="text-red-500" />
                    )}
                    <span className={`text-[8px] font-black uppercase italic tracking-widest ${session.status === 'Completed' ? 'text-[#95f122]' : 'text-red-500'}`}>
                      {session.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {pastSessions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-800 font-black text-[9px] uppercase tracking-widest">
                  History ledger is currently empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PUBLIC PROFILE */}
        <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm space-y-8">
           <header className="flex justify-between items-center border-b border-white/5 pb-6">
              <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                <UserIcon size={14} className="text-[#95f122]" /> Public Identity
              </h3>
              <button className="text-[8px] font-black text-[#95f122] uppercase hover:underline">Edit Bio</button>
           </header>
           <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=ffffff`} className="w-16 h-16 rounded-full border border-white/5 p-1" alt="" />
                <button className="px-4 py-2 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Update Avatar</button>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Staff Biography</label>
                   <textarea 
                    value={coachProfile.bio} 
                    onChange={e => setCoachProfile({...coachProfile, bio: e.target.value})}
                    className="w-full bg-[#040812] border border-white/5 p-4 text-[10px] text-slate-400 font-bold uppercase italic focus:outline-none focus:border-[#95f122]/30 min-h-[120px]"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Skill Level</label>
                      <select 
                        value={coachProfile.skillLevel} 
                        onChange={e => setCoachProfile({...coachProfile, skillLevel: e.target.value as SkillLevel})}
                        className="w-full bg-[#040812] border border-white/5 p-3 text-[10px] font-black text-white uppercase outline-none"
                      >
                         {Object.values(SkillLevel).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Certification</label>
                      <div className="w-full bg-[#040812] border border-white/5 p-3 text-[10px] font-black text-teal-500 uppercase flex items-center gap-2">
                        <ShieldCheck size={12}/> FMP LEVEL 2
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* FINANCIALS */}
        <div className="space-y-8">
           <div className="bg-[#0c1221] border border-white/5 p-8 rounded-sm">
              <header className="flex justify-between items-center border-b border-white/5 pb-6 mb-8">
                  <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    <DollarSign size={14} className="text-[#95f122]" /> Settlement Node
                  </h3>
                  <Lock size={12} className="text-slate-700" />
              </header>
              <div className="space-y-6">
                <div className="p-4 bg-[#040812] border border-white/5">
                   <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1">Active Settlement Bank</p>
                   <p className="text-xs font-black text-white uppercase italic">{coachProfile.payoutBank}</p>
                </div>
                <div className="p-4 bg-[#040812] border border-white/5">
                   <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1">Commission Node Index</p>
                   <p className="text-xs font-black text-[#95f122] uppercase italic">80.0% DIRECT SHARE</p>
                </div>
                <button className="w-full py-4 bg-[#0a0f1c] border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">Request Bank Link Update</button>
              </div>
           </div>

           <div className="bg-red-950/5 border border-red-900/10 p-8 rounded-sm">
              <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4">Node Security</h4>
              <p className="text-[8px] font-bold text-slate-700 uppercase mb-6 leading-relaxed">Suspending your coach identity will immediately hide your availability from the public search matrix.</p>
              <button className="text-[9px] font-black text-red-500 uppercase hover:underline">Initiate Suspension</button>
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-white/5">
         <button className="px-10 py-4 bg-[#95f122] text-[#040812] text-[10px] font-black uppercase tracking-widest italic shadow-xl flex items-center gap-3 group">
            <Save size={14} className="group-active:scale-90 transition-transform"/> Commit Profile Protocols
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* DASHBOARD SIDEBAR */}
        <aside className="lg:w-[280px] space-y-6">
          <div className="bg-[#0c1221] border border-white/5 p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <div className="w-2 h-2 bg-[#95f122] rounded-full animate-pulse shadow-[0_0_10px_#95f122]"></div>
            </div>
            
            <div className="relative inline-block mb-6">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=95f122&color=040812&size=128`}
                alt={user.name}
                className="w-24 h-24 rounded-full border-2 border-[#95f122]/20 p-1 object-cover grayscale"
              />
              <div className="absolute bottom-0 right-0 bg-[#95f122] p-1.5 rounded-full border-2 border-[#0c1221]">
                <Award size={12} className="text-[#040812]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{user.name}</h2>
            <p className="text-[#95f122] text-[9px] font-black uppercase tracking-[0.3em] mb-8">Federation Coach</p>

            <nav className="space-y-2">
              {[
                { id: 'overview', icon: <LayoutDashboard size={14} />, label: 'HQ Overview' },
                { id: 'schedule', icon: <Calendar size={14} />, label: 'Schedule Control' },
                { id: 'history', icon: <HistoryIcon size={14} />, label: 'Ledger History' },
                { id: 'settings', icon: <Settings size={14} />, label: 'Credentials' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`w-full flex items-center gap-4 p-4 text-[10px] font-black uppercase italic tracking-widest transition-all border ${
                    activeTab === item.id 
                      ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                      : 'bg-[#040812] text-slate-600 border-white/5 hover:text-white hover:border-white/10'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-gradient-to-br from-[#111827] to-[#040812] border border-[#95f122]/10 p-8 rounded-sm text-center">
            <DollarSign className="mx-auto mb-4 text-[#95f122]" size={24} />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Lifetime Earnings</p>
            <h4 className="text-2xl font-black text-white italic tracking-tighter">{totalEarnings + 14500} <span className="text-[10px] text-slate-600">MAD</span></h4>
          </div>
        </aside>

        {/* DASHBOARD CONTENT */}
        <div className="flex-grow">
          <header className="mb-12 border-b border-white/5 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#95f122]/10 border border-[#95f122]/20 mb-3">
                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#95f122]">Authorized Coach Access</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {activeTab === 'overview' && 'Operations Command'}
                {activeTab === 'schedule' && 'Instruction Calendar'}
                {activeTab === 'history' && 'Instruction History'}
                {activeTab === 'settings' && 'Coach Credentials'}
              </h1>
            </div>
          </header>

          <main>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'schedule' && renderSchedule()}
            {activeTab === 'history' && renderHistory()}
            {activeTab === 'settings' && renderSettings()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;

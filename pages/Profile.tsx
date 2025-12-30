
import React from 'react';
import { User, Booking, CoachingSession } from '../types';
import { Settings, Calendar, History, Shield, Trash2, ShieldCheck } from 'lucide-react';

interface ProfileProps {
  user: User;
  bookings: Booking[];
  sessions: CoachingSession[];
  onCancelBooking: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, bookings, sessions, onCancelBooking }) => {
  const userBookings = bookings.filter(b => b.userId === user.id);
  const userSessions = sessions.filter(s => s.userId === user.id);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-teal-900/20 text-teal-500 border-teal-800/30';
      case 'Cancelled':
        return 'bg-red-900/10 text-red-400/80 border-red-900/20';
      default:
        return 'bg-slate-800 text-slate-600 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <aside className="lg:w-[280px] space-y-8">
          <div className="bg-[#12192b] border border-white/5 rounded-2xl p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4">
              <button className="text-slate-700 hover:text-teal-600 transition-colors p-2 bg-[#0a0f1c] rounded border border-white/5">
                <Settings size={14} />
              </button>
            </div>
            
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0f766e&color=ffffff&size=128`}
              alt={user.name}
              className="w-24 h-24 rounded mx-auto mb-8 border border-white/10 shadow-2xl object-cover grayscale brightness-90"
            />
            
            <h2 className="text-2xl font-light text-white uppercase tracking-tight mb-2 leading-none">{user.name}</h2>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em] mb-10">{user.email}</p>
            
            <div className="inline-block px-5 py-2.5 rounded-sm bg-teal-700 text-white text-[8px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-teal-950/20">
              {user.membership || 'Standard Tier'}
            </div>

            <div className="grid grid-cols-2 gap-5 border-t border-white/5 mt-12 pt-12">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-300 tracking-tighter">{userBookings.length}</p>
                <p className="text-[8px] text-slate-700 uppercase font-bold tracking-[0.3em]">Reservations</p>
              </div>
              <div className="text-center border-l border-white/5">
                <p className="text-2xl font-black text-slate-300 tracking-tighter">{userSessions.length}</p>
                <p className="text-[8px] text-slate-700 uppercase font-bold tracking-[0.3em]">Lessons</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12192b] border border-white/5 rounded-2xl p-8 space-y-5 shadow-xl">
            <h3 className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-700 mb-8 flex items-center gap-3">
              <Shield size={12} className="text-teal-700" /> Operational Keys
            </h3>
            <button className="w-full py-4 bg-[#0a0f1c] border border-white/5 rounded text-[8px] font-bold uppercase tracking-[0.3em] text-slate-600 hover:text-white hover:border-teal-800/40 transition-all shadow-inner">
              Reset Security
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow space-y-16">
          <section>
            <div className="flex items-center gap-5 mb-10">
              <Calendar className="text-teal-700" size={18} />
              <h3 className="text-2xl font-light text-slate-200 uppercase tracking-[0.2em]">Active Fleet</h3>
            </div>
            
            <div className="space-y-4">
              {userBookings.filter(b => b.status !== 'Cancelled').length > 0 ? (
                userBookings.filter(b => b.status !== 'Cancelled').map(booking => (
                  <div key={booking.id} className="bg-[#12192b] border border-white/5 p-7 rounded-xl flex items-center justify-between group hover:border-teal-800/20 transition-all shadow-lg">
                    <div className="flex items-center gap-10">
                      <div className="w-14 h-14 bg-[#0a0f1c] rounded flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span className="text-[8px] font-bold text-slate-700 uppercase tracking-tighter">{booking.date.split('-')[1]}</span>
                        <span className="text-2xl font-black text-teal-600 tracking-tighter leading-none mt-1">{booking.date.split('-')[2]}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200 tracking-tight">{booking.courtName}</h4>
                        <div className="flex items-center gap-5 mt-2">
                          <span className={`px-2.5 py-1 rounded-sm text-[7px] font-bold uppercase border tracking-[0.1em] ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.25em]">• {booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                    {booking.status === 'Confirmed' && (
                       <button 
                       onClick={() => onCancelBooking(booking.id)}
                       className="p-3 text-slate-800 hover:text-red-500 hover:bg-red-500/5 rounded transition-all"
                       title="Remove Slot"
                     >
                       <Trash2 size={15} />
                     </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-24 text-center bg-[#12192b]/40 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-slate-800 text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Zero active operational telemetry</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-5 mb-10">
              <History className="text-teal-700" size={18} />
              <h3 className="text-2xl font-light text-slate-200 uppercase tracking-[0.2em]">Transaction Ledger</h3>
            </div>
            <div className="bg-[#12192b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0a0f1c]">
                    <tr>
                      <th className="px-8 py-6 text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Date</th>
                      <th className="px-8 py-6 text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Item Description</th>
                      <th className="px-8 py-6 text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Settlement</th>
                      <th className="px-8 py-6 text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userBookings.map(b => (
                      <tr key={b.id} className="text-[10px] hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6 text-slate-600 font-medium tracking-wider">{b.date}</td>
                        <td className="px-8 py-6 text-slate-400 uppercase tracking-[0.15em] font-semibold">{b.courtName}</td>
                        <td className="px-8 py-6 font-bold text-slate-300 tracking-tight">{b.price} MAD</td>
                        <td className="px-8 py-6">
                          <span className={`px-2.5 py-1 rounded-sm text-[7px] font-bold uppercase border tracking-[0.1em] ${getStatusStyles(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-6 p-8 bg-[#12192b] rounded-2xl border border-white/5 shadow-xl">
              <ShieldCheck size={20} className="text-teal-700" />
              <span className="text-[9px] text-slate-700 font-bold leading-relaxed uppercase tracking-[0.25em]">Transaction integrity secured by multi-node inter-bank SSL authentication protocols.</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
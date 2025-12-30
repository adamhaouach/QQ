import React, { useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle, BellOff, Filter } from 'lucide-react';
import { Notification, NotificationCategory } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkRead, onClose, onClearAll }) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('All');
  
  const sorted = [...notifications]
    .filter(n => activeTab === 'All' || n.category === activeTab)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const IconMap = {
    info: <Info size={14} className="text-blue-500" />,
    success: <CheckCircle size={14} className="text-[#95f122]" />,
    warning: <AlertTriangle size={14} className="text-amber-500" />,
    error: <BellOff size={14} className="text-red-500" />,
  };

  const tabs: NotificationCategory[] = ['All', 'Match', 'Friends', 'System'];

  return (
    <div className="bg-[#0c1221] border border-white/10 shadow-3xl flex flex-col max-h-[500px] w-80 md:w-96 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <header className="p-4 bg-[#040812] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-[#95f122]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Alert Streams</h3>
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </header>

      {/* TABS */}
      <div className="flex bg-[#040812] border-b border-white/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${
              activeTab === tab ? 'bg-[#95f122] text-[#040812]' : 'text-slate-600 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto flex-grow custom-scrollbar bg-[#0c1221]/50">
        {sorted.length > 0 ? (
          sorted.map((n) => (
            <div 
              key={n.id} 
              onClick={() => onMarkRead(n.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] relative group ${!n.read ? 'bg-[#95f122]/5' : ''}`}
            >
              {!n.read && <div className="absolute left-0 top-0 w-[2px] h-full bg-[#95f122]" />}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">{IconMap[n.type]}</div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest truncate ${!n.read ? 'text-[#95f122]' : 'text-slate-200'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[7px] text-slate-700 font-bold uppercase shrink-0">{n.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                  <p className="text-[8px] text-slate-800 mt-2 font-black uppercase tracking-tighter italic">{n.date}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 text-center text-slate-800 italic flex flex-col items-center">
            <BellOff size={32} className="mb-4 opacity-10" />
            <p className="text-[9px] uppercase font-black tracking-[0.3em] opacity-30">Zero active signals</p>
          </div>
        )}
      </div>

      <footer className="p-3 bg-[#040812] border-t border-white/5 flex justify-between items-center px-4">
        <p className="text-[8px] font-black text-slate-800 uppercase tracking-widest italic">Node: 142.1.0</p>
        <button 
          onClick={onClearAll}
          className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-[#95f122] transition-colors"
        >
          Flush Data
        </button>
      </footer>
    </div>
  );
};

export default NotificationCenter;
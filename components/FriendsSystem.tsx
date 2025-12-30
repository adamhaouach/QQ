
import React, { useState, useEffect, useMemo, useRef } from 'react';
/* Fix: Added History as HistoryIcon to imports to avoid conflict with global browser History and resolved the missing import */
import { Users, UserPlus, MessageCircle, Swords, X, Trash2, Search, Check, AlertCircle, Loader2, UserMinus, ChevronLeft, Award, Trophy, Zap, Clock, MapPin, TrendingUp, Shield, BarChart3, Lock, Send, Info, History as HistoryIcon } from 'lucide-react';
import { Friend, FriendStatus, FriendStats, PlayerRank, SkillTier, ChatMessage } from '../types';

interface FriendsSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitePlayer?: (player: Friend) => void;
}

const MOCK_STATS: Record<string, FriendStats> = {
  'f1': {
    totalMatches: 142,
    matchesTogether: 18,
    winsTogether: 12,
    lossesTogether: 6,
    winRate: 67,
    avgDuration: '58m',
    lastMatch: '2024-06-12',
    favArena: 'Casablanca Pro',
    history: [
      { id: 'h1', date: '2024-06-12', arena: 'Casablanca Pro', type: '2v2', result: 'Win', srChange: '+25' },
      { id: 'h2', date: '2024-06-10', arena: 'Atlas Panoramic', type: '2v2', result: 'Loss', srChange: '-15' },
      { id: 'h3', date: '2024-06-08', arena: 'Casablanca Pro', type: '2v2', result: 'Win', srChange: '+22' },
    ]
  },
  'f2': {
    totalMatches: 89,
    matchesTogether: 4,
    winsTogether: 3,
    lossesTogether: 1,
    winRate: 75,
    avgDuration: '45m',
    lastMatch: '2024-06-01',
    favArena: 'Oasis Garden',
    history: [
      { id: 'h4', date: '2024-06-01', arena: 'Oasis Garden', type: '1v1', result: 'Win', srChange: '+30' },
    ]
  }
};

const MOCK_INITIAL_FRIENDS: Friend[] = [
  { id: 'f1', name: 'ZAYD_PADEL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zayd', status: FriendStatus.ONLINE, isFriend: true, isPending: false, incoming: false, rank: PlayerRank.ELITE, skillTier: SkillTier.COMPETITIVE, unreadCount: 0 },
  { id: 'f2', name: 'YASMIN_VIBES', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin', status: FriendStatus.SEARCHING, isFriend: true, isPending: false, incoming: false, rank: PlayerRank.GOLD, skillTier: SkillTier.ELITE, unreadCount: 0 },
  { id: 'f3', name: 'KHALID_PRO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid', status: FriendStatus.IN_MATCH, isFriend: true, isPending: false, incoming: false, rank: PlayerRank.SILVER, skillTier: SkillTier.CONTENDER, unreadCount: 0 },
  { id: 'f4', name: 'SARA_JABRI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', status: FriendStatus.OFFLINE, isFriend: true, isPending: false, incoming: false, rank: PlayerRank.BRONZE, skillTier: SkillTier.ROOKIE, statsHidden: true, unreadCount: 0 },
  { id: 'r1', name: 'MEHDI_STRKR', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi', status: FriendStatus.OFFLINE, isFriend: false, isPending: true, incoming: true },
  { id: 'r2', name: 'NORA_NET', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora', status: FriendStatus.OFFLINE, isFriend: false, isPending: true, incoming: true },
];

const playSound = (type: 'invite' | 'accept' | 'decline' | 'squad_ready' | 'profile_click' | 'message_received' | 'message_sent') => {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play().catch(() => {
    console.debug(`Sound trigger: ${type} (Audio file placeholder)`);
  });
};

const FriendsSystem: React.FC<FriendsSystemProps> = ({ isOpen, onClose, onInvitePlayer }) => {
  const [activeTab, setActiveTab] = useState<'ONLINE' | 'OFFLINE' | 'REQUESTS'>('ONLINE');
  const [friends, setFriends] = useState<Friend[]>(MOCK_INITIAL_FRIENDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [addState, setAddState] = useState<'idle' | 'loading' | 'sent' | 'exists'>('idle');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<Friend | null>(null);
  const [toasts, setToasts] = useState<{ id: string, msg: string }[]>([]);
  
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatSessions, activeChatFriendId, isTyping]);

  const selectedFriend = useMemo(() => 
    friends.find(f => f.id === (selectedFriendId || activeChatFriendId)),
    [friends, selectedFriendId, activeChatFriendId]
  );

  const onlineFriends = useMemo(() => 
    friends.filter(f => f.isFriend && f.status !== FriendStatus.OFFLINE && f.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [friends, searchQuery]
  );
  
  const offlineFriends = useMemo(() => 
    friends.filter(f => f.isFriend && f.status === FriendStatus.OFFLINE && f.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [friends, searchQuery]
  );

  const pendingRequests = useMemo(() => 
    friends.filter(f => f.isPending && f.incoming), 
    [friends]
  );

  const addToast = (msg: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !activeChatFriendId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current_user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions(prev => ({
      ...prev,
      [activeChatFriendId]: [...(prev[activeChatFriendId] || []), userMsg]
    }));
    setChatInput('');
    playSound('message_sent');

    // Simulated Auto-Reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replies = ['Ready', 'Let’s go', 'Invite me', 'Wait, I am in match', 'Cancel please'];
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const friendMsg: ChatMessage = {
          id: Date.now().toString() + '_reply',
          senderId: activeChatFriendId,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatSessions(prev => ({
          ...prev,
          [activeChatFriendId]: [...(prev[activeChatFriendId] || []), friendMsg]
        }));
        playSound('message_received');
        
        // If not in active chat, increment unread count
        if (activeChatFriendId !== activeChatFriendId) {
           setFriends(prev => prev.map(f => f.id === activeChatFriendId ? { ...f, unreadCount: (f.unreadCount || 0) + 1 } : f));
        }
      }, 2000);
    }, 1500);
  };

  const handleOpenChat = (id: string) => {
    playSound('profile_click');
    setActiveChatFriendId(id);
    setSelectedFriendId(null);
    setFriends(prev => prev.map(f => f.id === id ? { ...f, unreadCount: 0 } : f));
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addInput.trim()) return;
    if (friends.some(f => f.name.toLowerCase() === addInput.toLowerCase())) {
      setAddState('exists');
      return;
    }
    setAddState('loading');
    await new Promise(r => setTimeout(r, 1000));
    setAddState('sent');
    setTimeout(() => {
      setShowAddModal(false);
      setAddInput('');
      setAddState('idle');
      addToast(`Sync request sent to ${addInput.toUpperCase()}`);
    }, 1500);
  };

  const handleAccept = (id: string) => {
    playSound('accept');
    setFriends(prev => prev.map(f => 
      f.id === id ? { ...f, isFriend: true, isPending: false, incoming: false, status: FriendStatus.ONLINE } : f
    ));
    addToast("Player added to your hub.");
  };

  const handleDecline = (id: string) => {
    playSound('decline');
    setFriends(prev => prev.filter(f => f.id !== id));
  };

  const handleRemove = (id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setShowRemoveConfirm(null);
    setSelectedFriendId(null);
    setActiveChatFriendId(null);
    addToast("Node disconnected.");
  };

  const handleInvite = (friend: Friend) => {
    if (friend.status === FriendStatus.ONLINE || friend.status === FriendStatus.SEARCHING) {
      playSound('invite');
      setFriends(prev => prev.map(f => 
        f.id === friend.id ? { ...f, status: FriendStatus.INVITE_SENT } : f
      ));
      addToast(`Invite sent to ${friend.name}`);
      onInvitePlayer?.(friend);
      
      setTimeout(() => {
        setFriends(prev => prev.map(f => {
           if (f.id === friend.id && f.status === FriendStatus.INVITE_SENT) {
             playSound('accept');
             return { ...f, status: FriendStatus.ARENA_ENGAGED };
           }
           return f;
        }));
      }, 3000);
    }
  };

  const renderChat = (friend: Friend) => {
    const messages = chatSessions[friend.id] || [];
    return (
      <div className="animate-in slide-in-from-right-10 duration-300 flex flex-col h-full bg-[#0c1221]">
        <header className="p-6 border-b border-white/5 bg-[#040812]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setActiveChatFriendId(null)} className="text-slate-500 hover:text-white transition-colors active:scale-90">
               <ChevronLeft size={20} strokeWidth={3} />
             </button>
             <div className="relative">
                <img src={friend.avatar} className="w-8 h-8 rounded-full border border-white/10" alt=""/>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#040812] ${friend.status === FriendStatus.OFFLINE ? 'bg-slate-700' : 'bg-[#95f122]'}`} />
             </div>
             <div>
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">{friend.name}</h4>
                <p className="text-[7px] font-bold text-slate-700 uppercase tracking-widest leading-none">COMM LINK: ACTIVE</p>
             </div>
          </div>
          <button onClick={() => { setActiveChatFriendId(null); setSelectedFriendId(friend.id); }} className="text-slate-700 hover:text-[#95f122] transition-colors active:scale-90">
             <Info size={16} />
          </button>
        </header>

        <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#040812]/20">
           {messages.length === 0 ? (
             <div className="py-20 text-center opacity-30">
                <MessageCircle size={32} className="mx-auto text-slate-800 mb-4" />
                <p className="text-[9px] font-black uppercase tracking-widest italic text-slate-700">Encrypted signal initialized.</p>
             </div>
           ) : (
             messages.map((m) => (
               <div key={m.id} className={`flex flex-col ${m.senderId === 'current_user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-sm text-[11px] font-bold ${m.senderId === 'current_user' ? 'bg-[#95f122] text-[#040812] shadow-[0_5px_15px_rgba(149,241,34,0.15)]' : 'bg-[#12192b] text-slate-200 border border-white/5'}`}>
                     {m.text}
                  </div>
                  <span className="text-[7px] text-slate-800 mt-1 font-black uppercase tracking-tighter italic">{m.timestamp}</span>
               </div>
             ))
           )}
           {isTyping && (
             <div className="flex items-center gap-2 text-slate-600 italic text-[9px] font-black uppercase tracking-widest animate-pulse">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce delay-200"></div>
                </div>
                Player typing...
             </div>
           )}
        </main>

        <footer className="p-4 bg-[#040812] border-t border-white/5">
           <form onSubmit={handleSendMessage} className="flex gap-3">
              <input 
                type="text" 
                autoFocus
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="TYPE MESSAGE..."
                className="flex-grow bg-[#12192b] border border-white/5 rounded-sm px-4 py-3 text-[10px] font-bold text-white focus:outline-none focus:border-[#95f122]/30 placeholder:text-slate-800 uppercase tracking-widest"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-[#95f122] text-[#040812] p-3 rounded-sm disabled:opacity-30 hover:bg-[#aeff33] transition-all active:scale-90"
              >
                <Send size={18} strokeWidth={3} />
              </button>
           </form>
        </footer>
      </div>
    );
  };

  const renderFriendProfile = (friend: Friend) => {
    const stats = MOCK_STATS[friend.id];
    return (
      <div className="animate-in slide-in-from-right-10 duration-300 flex flex-col h-full bg-[#0c1221]">
        <header className="p-6 border-b border-white/5 bg-[#040812]/50">
          <button 
            onClick={() => setSelectedFriendId(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-[9px] font-black uppercase tracking-widest italic active:scale-95"
          >
            <ChevronLeft size={14} strokeWidth={3} /> Return to Cluster
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <img src={friend.avatar} className="w-24 h-24 rounded-full border-4 border-[#95f122]/20 p-1 grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
              <div className="absolute -bottom-2 -right-2 bg-[#95f122] p-2 rounded-full border-2 border-[#040812] shadow-xl">
                 <Trophy size={14} className="text-[#040812]" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{friend.name}</h3>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-[#95f122] uppercase tracking-widest">{friend.rank || 'ROOKIE'}</span>
               <div className="w-[1px] h-3 bg-white/10" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{friend.skillTier || 'N/A'}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {friend.statsHidden ? (
            <div className="py-20 text-center space-y-4 opacity-50">
               <Lock size={32} className="mx-auto text-slate-700" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Stats restricted</p>
            </div>
          ) : stats ? (
            <>
              <div className="space-y-4">
                 <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                    <BarChart3 size={12} className="text-[#95f122]" /> Efficiency Metrics
                 </h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#040812] border border-white/5 p-4 rounded-sm">
                       <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Load</p>
                       <p className="text-lg font-black text-white italic">{stats.totalMatches}</p>
                    </div>
                    <div className="bg-[#040812] border border-white/5 p-4 rounded-sm">
                       <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Co-Ops</p>
                       <p className="text-lg font-black text-white italic">{stats.matchesTogether}</p>
                    </div>
                    <div className="bg-[#040812] border border-white/5 p-4 rounded-sm">
                       <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Win probability</p>
                       <p className="text-lg font-black text-[#95f122] italic">{stats.winRate}%</p>
                    </div>
                    <div className="bg-[#040812] border border-white/5 p-4 rounded-sm">
                       <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Avg Frame</p>
                       <p className="text-lg font-black text-white italic">{stats.avgDuration}</p>
                    </div>
                 </div>
                 <div className="bg-[#040812] border border-white/5 p-4 rounded-sm flex justify-between items-center">
                    <div>
                       <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Home Hub</p>
                       <p className="text-xs font-black text-white uppercase italic">{stats.favArena}</p>
                    </div>
                    <MapPin size={16} className="text-slate-700" />
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                    {/* Fix: Resolved collision and added proper Lucide icon component */}
                    <HistoryIcon size={12} className="text-[#95f122]" /> Activity Log
                 </h4>
                 <div className="space-y-2">
                    {stats.history.map(h => (
                      <div key={h.id} className="bg-[#040812]/50 border border-white/5 p-3 flex justify-between items-center rounded-sm hover:border-white/10 transition-colors">
                         <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">{h.date} • {h.type}</p>
                            <p className="text-[10px] font-black text-white uppercase italic truncate pr-4">{h.arena}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className={`text-[10px] font-black italic ${h.result === 'Win' ? 'text-[#95f122]' : 'text-red-500'}`}>{h.result.toUpperCase()}</p>
                            <p className="text-[8px] font-bold text-slate-700">{h.srChange} SR</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-800 uppercase italic font-black text-[9px] tracking-widest">Awaiting node sync...</div>
          )}
        </main>

        <footer className="p-6 bg-[#040812] border-t border-white/5 space-y-3">
           <button onClick={() => handleOpenChat(friend.id)} className="w-full py-4 border border-white/10 text-white font-black uppercase text-[10px] italic tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3 active:scale-95">
             <MessageCircle size={16} /> Open Chat
           </button>
           {friend.status !== FriendStatus.OFFLINE && (
              <button 
                onClick={() => handleInvite(friend)}
                className="w-full py-4 bg-[#95f122] text-[#040812] font-black uppercase text-[10px] italic tracking-[0.2em] shadow-2xl hover:bg-[#aeff33] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Swords size={16} /> Deploy Squad
              </button>
           )}
        </footer>
      </div>
    );
  };

  if (!isOpen && !showAddModal && !showRemoveConfirm) return null;

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-[320px] md:w-[380px] bg-[#0c1221] z-[100] shadow-2xl border-l border-white/5 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {activeChatFriendId ? renderChat(selectedFriend!) : selectedFriendId ? renderFriendProfile(selectedFriend!) : (
          <>
            <header className="p-6 border-b border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                  <Users size={20} className="text-[#95f122]" /> SOCIAL CLUSTER
                </h2>
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-6">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input 
                  type="text" 
                  placeholder="Search athletes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#040812] border border-white/5 pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/30 placeholder:text-slate-800"
                />
              </div>

              <nav className="flex gap-1 bg-[#040812] p-1 rounded-sm">
                {[{ id: 'ONLINE', label: 'ONLINE', count: onlineFriends.length }, { id: 'OFFLINE', label: 'OFFLINE', count: offlineFriends.length }, { id: 'REQUESTS', label: 'REQUESTS', count: pendingRequests.length }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#95f122] text-[#040812]' : 'text-slate-600 hover:text-white'}`}
                  >
                    {tab.label} {tab.count > 0 && `(${tab.count})`}
                  </button>
                ))}
              </nav>
            </header>

            <main className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar p-6 space-y-4">
              {activeTab === 'ONLINE' && (onlineFriends.length > 0 ? onlineFriends.map(f => (
                <FriendCard key={f.id} friend={f} onInvite={() => handleInvite(f)} onRemove={() => setShowRemoveConfirm(f)} onSelect={() => { playSound('profile_click'); setSelectedFriendId(f.id); }} onChat={() => handleOpenChat(f.id)} />
              )) : <div className="py-20 text-center text-slate-800 font-black text-[9px] uppercase tracking-widest italic">Zero active nodes.</div>)}

              {activeTab === 'OFFLINE' && (offlineFriends.length > 0 ? offlineFriends.map(f => (
                <FriendCard key={f.id} friend={f} onRemove={() => setShowRemoveConfirm(f)} onSelect={() => { playSound('profile_click'); setSelectedFriendId(f.id); }} onChat={() => handleOpenChat(f.id)} />
              )) : <div className="py-20 text-center text-slate-800 font-black text-[9px] uppercase tracking-widest italic">No offline nodes.</div>)}

              {activeTab === 'REQUESTS' && (pendingRequests.length > 0 ? pendingRequests.map(f => (
                <div key={f.id} className="bg-[#040812] border border-white/5 p-4 flex items-center justify-between rounded-sm group hover:border-[#95f122]/20 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={f.avatar} className="w-10 h-10 rounded-full border border-white/5" alt="" />
                    <div><p className="text-[10px] font-black text-white uppercase italic tracking-widest">{f.name}</p><p className="text-[7px] font-bold text-slate-700 uppercase">Incoming Request</p></div>
                  </div>
                  <div className="flex gap-2"><button onClick={() => handleAccept(f.id)} className="p-2 bg-[#95f122]/10 text-[#95f122] hover:bg-[#95f122] hover:text-[#040812] transition-all rounded-sm active:scale-90"><Check size={14} /></button><button onClick={() => handleDecline(f.id)} className="p-2 bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm active:scale-90"><X size={14} /></button></div>
                </div>
              )) : <div className="py-20 text-center text-slate-800 font-black text-[9px] uppercase tracking-widest italic">No pending requests.</div>)}
            </main>

            <footer className="absolute bottom-0 left-0 w-full p-6 bg-[#0c1221] border-t border-white/5">
              <button onClick={() => setShowAddModal(true)} className="w-full py-4 bg-[#95f122] text-[#040812] font-black uppercase text-[10px] italic tracking-[0.2em] shadow-xl hover:bg-[#aeff33] transition-all flex items-center justify-center gap-3 active:scale-95">
                <UserPlus size={16} /> Recruit Athlete
              </button>
            </footer>
          </>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[160] bg-[#040812]/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#12192b] border border-white/10 w-full max-w-md p-10 rounded-sm shadow-3xl animate-in zoom-in-95 duration-200">
            <header className="flex justify-between items-center mb-10"><h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Add Athlete Node</h3><button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white p-2 active:scale-90"><X size={20}/></button></header>
            <form onSubmit={handleAddFriend} className="space-y-6">
              <div className="space-y-2"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Handle</label><div className="relative"><Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" /><input type="text" required autoFocus placeholder="USERNAME OR EMAIL" value={addInput} onChange={(e) => { setAddInput(e.target.value); setAddState('idle'); }} className="w-full bg-[#040812] border border-white/5 rounded-sm py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40 uppercase tracking-widest placeholder:text-slate-900" /></div>{addState === 'exists' && <p className="text-[9px] font-bold text-amber-500 uppercase tracking-tight flex items-center gap-2 mt-2"><AlertCircle size={10}/> Already in hub.</p>}</div>
              <button disabled={!addInput.trim() || addState === 'loading' || addState === 'sent'} className="w-full py-5 bg-[#95f122] text-[#040812] font-black uppercase text-[10px] italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-2xl active:scale-95">{addState === 'loading' ? <Loader2 className="animate-spin" size={16}/> : addState === 'sent' ? <><Check size={16}/> Dispatched</> : 'Authorize Sync'}</button>
            </form>
          </div>
        </div>
      )}

      {showRemoveConfirm && (
        <div className="fixed inset-0 z-[160] bg-[#040812]/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
          <div className="bg-[#12192b] border border-white/10 w-full max-w-sm p-10 rounded-sm shadow-3xl animate-in zoom-in-95 duration-200"><Trash2 size={40} className="text-red-500 mx-auto mb-6" /><h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Disconnect Node?</h3><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-10">Remove <strong className="text-white italic">{showRemoveConfirm.name}</strong> from your active hub?</p><div className="grid grid-cols-2 gap-4"><button onClick={() => setShowRemoveConfirm(null)} className="py-4 border border-white/10 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-all active:scale-95">Abort</button><button onClick={() => handleRemove(showRemoveConfirm.id)} className="py-4 bg-red-600 text-white font-black uppercase text-[10px] italic shadow-xl active:scale-95">Confirm</button></div></div>
        </div>
      )}

      <div className="fixed bottom-24 right-8 z-[200] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#95f122] text-[#040812] px-6 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest italic shadow-3xl flex items-center gap-3 animate-in slide-in-from-right-10"><Check size={14} strokeWidth={4} /> {t.msg}</div>
        ))}
      </div>

      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-[#040812]/40 backdrop-blur-sm z-[90] animate-in fade-in duration-300" />}
    </>
  );
};

const FriendCard: React.FC<{ friend: Friend, onInvite?: () => void, onRemove: () => void, onSelect: () => void, onChat: () => void }> = ({ friend, onInvite, onRemove, onSelect, onChat }) => {
  const getStatusColor = (status: FriendStatus) => {
    switch (status) {
      case FriendStatus.ONLINE: return 'bg-green-500 shadow-[0_0_8px_#22c55e]';
      case FriendStatus.SEARCHING: return 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
      case FriendStatus.IN_MATCH: return 'bg-yellow-500 shadow-[0_0_8px_#eab308]';
      case FriendStatus.INVITE_SENT: return 'bg-amber-500 animate-pulse';
      case FriendStatus.ARENA_ENGAGED: return 'bg-[#95f122] shadow-[0_0_12px_#95f122]';
      case FriendStatus.OFFLINE: return 'bg-slate-700';
      default: return 'bg-slate-700';
    }
  };

  const getStatusText = (status: FriendStatus) => {
    switch (status) {
      case FriendStatus.ONLINE: return 'Status: Online';
      case FriendStatus.SEARCHING: return 'Lobby: Active';
      case FriendStatus.IN_MATCH: return 'Arena: Engaged';
      case FriendStatus.INVITE_SENT: return 'Invite Dispatched';
      case FriendStatus.ARENA_ENGAGED: return 'Squad Locked';
      case FriendStatus.OFFLINE: return 'Status: Offline';
      default: return '';
    }
  };

  const isAvailable = friend.status === FriendStatus.ONLINE || friend.status === FriendStatus.SEARCHING;
  const isInvited = friend.status === FriendStatus.INVITE_SENT;

  return (
    <div className={`bg-[#040812] border p-4 rounded-sm group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.97] ${isInvited ? 'border-[#95f122] shadow-[0_0_15px_rgba(149,241,34,0.3)]' : 'border-white/5 hover:border-[#95f122]/30'}`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4 cursor-pointer flex-grow" onClick={onSelect}>
          <div className="relative">
            <img src={friend.avatar} className={`w-12 h-12 rounded-full border-2 transition-all ${friend.status === FriendStatus.OFFLINE ? 'grayscale border-white/5 opacity-50' : 'border-[#95f122]/30 shadow-xl'}`} alt="" />
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#040812] ${getStatusColor(friend.status)}`} />
            {(friend.unreadCount || 0) > 0 && (
               <div className="absolute -top-1 -left-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#040812] animate-bounce">
                  {friend.unreadCount}
               </div>
            )}
          </div>
          <div>
            <h4 className={`text-[11px] font-black uppercase italic tracking-widest transition-colors ${friend.status === FriendStatus.OFFLINE ? 'text-slate-700' : 'text-white'}`}>{friend.name}</h4>
            <p className="text-[7px] font-bold text-slate-700 uppercase tracking-[0.2em] mt-1">{getStatusText(friend.status)}</p>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button 
             onClick={(e) => { e.stopPropagation(); onChat(); }}
             title="Open Chat" 
             className={`p-2.5 rounded-sm transition-all active:scale-75 ${friend.unreadCount ? 'bg-[#95f122] text-[#040812] animate-pulse' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
             <MessageCircle size={14} />
          </button>
          {onInvite && isAvailable && (
            <button 
              onClick={(e) => { e.stopPropagation(); onInvite(); }} 
              title="Invite to Arena"
              className="p-2.5 bg-[#95f122]/10 text-[#95f122] hover:bg-[#95f122] hover:text-[#040812] transition-all rounded-sm active:scale-75"
            >
              <Swords size={14} />
            </button>
          )}
          {isInvited && <div className="px-3 py-2 bg-[#95f122] text-[#040812] text-[7px] font-black uppercase italic rounded-sm">Invited</div>}
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Disconnect" className="p-2.5 bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm active:scale-75"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-[1px] h-full bg-[#95f122] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default FriendsSystem;

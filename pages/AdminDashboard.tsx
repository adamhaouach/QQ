
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Court, Coach, Booking, User, UserRole, SkillLevel, MembershipType, 
  ClubEvent, TournamentRegistration, ClubTier, Sponsor, FeatureConfig, 
  PlatformRules, RolePermissions, AuditEntry, PayoutRequest, TournamentFormat, TournamentLevel, SeedingMode, UserPermissions, UserReport, ReportReason
} from '../types';
import { 
  TrendingUp, Users, Calendar, DollarSign, 
  MapPin, Clock, ArrowUpRight, Plus, 
  ShieldAlert, Settings, LayoutDashboard, 
  Search, Filter, Edit2, UserPlus, 
  Power, CheckCircle2, MoreVertical, X, Check, AlertTriangle, ShieldCheck,
  Building2, Award, Briefcase, FileText, Download, Bell, Zap, ShieldX, CreditCard,
  MessageSquare, Sliders, Info, RefreshCcw, Trophy, Megaphone, CheckCircle, History, LifeBuoy,
  Activity, Scale, Eye, UserX, Key, Trash2, Ban, Lock, Unlock, ClipboardList, ChevronRight, Globe, Flag
} from 'lucide-react';

interface AdminDashboardProps {
  courts: Court[];
  coaches: Coach[];
  bookings: Booking[];
  users: User[];
  events: ClubEvent[];
  registrations: TournamentRegistration[];
  onUpdateEvent: (e: ClubEvent) => void;
  featureConfig: FeatureConfig;
  onUpdateConfig: (c: FeatureConfig) => void;
  platformRules: PlatformRules;
  onUpdateRules: (r: PlatformRules) => void;
  onUpdateUser: (u: User) => void;
  onAddUser: (u: User) => void;
  onUpdatePermission: (role: UserRole, p: RolePermissions) => void;
  onRefund: (id: string) => void;
  permissions: Record<UserRole, RolePermissions>;
  auditTrail: AuditEntry[];
  payouts: PayoutRequest[];
  onApprovePayout: (id: string) => void;
  onAddCourt: (c: Court) => void;
  onUpdateCourt: (c: Court) => void;
  adminUser: User | null;
  onImpersonate: (u: User) => void;
}

type AdminTab = 'hq' | 'identity' | 'entities' | 'ops' | 'finance' | 'tournaments' | 'system' | 'reports' | 'audit';

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.PLAYER]: { canAccessAdmin: false, canAccessClub: false, canAccessCoach: false, canBookCourts: true, canManageUsers: false, canManageTournaments: false, canViewFinancials: false },
  [UserRole.COACH]: { canAccessAdmin: false, canAccessClub: false, canAccessCoach: true, canBookCourts: true, canManageUsers: false, canManageTournaments: false, canViewFinancials: true },
  [UserRole.CLUB]: { canAccessAdmin: false, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: false, canManageTournaments: true, canViewFinancials: true },
  [UserRole.ADMIN]: { canAccessAdmin: true, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: true, canManageTournaments: true, canViewFinancials: true },
  [UserRole.SUPER_ADMIN]: { canAccessAdmin: true, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: true, canManageTournaments: true, canViewFinancials: true },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  courts, coaches, bookings, users, events, registrations, onUpdateEvent, 
  featureConfig, onUpdateConfig, platformRules, onUpdateRules, onUpdateUser, onAddUser,
  onUpdatePermission, onRefund, permissions, auditTrail, payouts, onApprovePayout,
  onAddCourt, onUpdateCourt, adminUser, onImpersonate
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hq');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const isSuper = adminUser?.role === UserRole.SUPER_ADMIN;

  // Reports state (mock)
  const [reports, setReports] = useState<UserReport[]>([
    { id: 'rep_1', reporterId: 'u5', reporterName: 'AMINE RADI', targetId: 'u8', targetName: 'OMAR EL FASSI', reason: ReportReason.NO_SHOW, comment: 'Target did not arrive at Casablanca node for scheduled session.', status: 'Open', date: '2024-06-12' },
    { id: 'rep_2', reporterId: 'u6', reporterName: 'SARA JABRI', targetId: 'u5', targetName: 'AMINE RADI', reason: ReportReason.UNSPORTSMANLIKE, comment: 'Aggressive behavior regarding line calls.', status: 'Reviewed', date: '2024-06-10' }
  ]);

  // Create User Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.PLAYER
  });

  // Auto-dismiss notifications (2s)
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const notify = (message: string, type: NotificationItem['type'] = 'success') => {
    setNotifications(prev => [...prev, { id: Math.random().toString(), message, type }]);
  };

  const handleToggleFeature = (key: keyof FeatureConfig) => {
    if (!isSuper) return notify('Super Admin authority required.', 'error');
    onUpdateConfig({ ...featureConfig, [key]: !featureConfig[key] });
    notify(`${key.replace(/([A-Z])/g, ' $1').toUpperCase()} state modified.`, 'info');
  };

  const handleUpdateRule = (key: keyof PlatformRules, value: any) => {
    if (!isSuper) return notify('Super Admin authority required.', 'error');
    onUpdateRules({ ...platformRules, [key]: value });
    notify(`Rule engine update: ${key} synchronized.`, 'success');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.role === UserRole.ADMIN || newUser.role === UserRole.SUPER_ADMIN) {
      if (!isSuper) return notify('Only Super Admin can provision Admin nodes.', 'error');
    }
    const id = 'usr_' + Math.random().toString(36).substr(2, 9);
    onAddUser({ ...newUser, id, points: 0, isSuspended: false, gender: 'Other' } as User);
    notify(`Identity ${newUser.name} provisioned successfully.`);
    setShowCreateModal(false);
    setNewUser({ name: '', email: '', role: UserRole.PLAYER });
  };

  const handleUpdateRole = (user: User, role: UserRole) => {
    if ((role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) && !isSuper) {
      return notify('Administrative role modification requires Super Admin clearance.', 'error');
    }
    onUpdateUser({ ...user, role, permissions: DEFAULT_ROLE_PERMISSIONS[role] });
    notify(`Role updated for ${user.name} to ${role.toUpperCase()}`);
  };

  const handleToggleSuspend = (user: User) => {
    if ((user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) && !isSuper) {
      return notify('Cannot suspend Administrative nodes without Super Admin authority.', 'error');
    }
    const nextState = !user.isSuspended;
    onUpdateUser({ ...user, isSuspended: nextState });
    notify(`Account ${user.name} ${nextState ? 'SUSPENDED' : 'ACTIVATED'}`, nextState ? 'warning' : 'success');
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    if (!editingUser) return;
    if ((editingUser.role === UserRole.ADMIN || editingUser.role === UserRole.SUPER_ADMIN) && !isSuper) {
      return notify('Administrative permission overrides restricted.', 'error');
    }
    const currentPerms = editingUser.permissions || DEFAULT_ROLE_PERMISSIONS[editingUser.role];
    const updatedUser = {
      ...editingUser,
      permissions: {
        ...currentPerms,
        [key]: !currentPerms[key]
      }
    };
    setEditingUser(updatedUser);
  };

  const saveIdentityChanges = () => {
    if (editingUser) {
      onUpdateUser(editingUser);
      notify(`Protocols updated for ${editingUser.name}.`);
      setShowRoleModal(false);
      setEditingUser(null);
    }
  };

  const handleReportAction = (reportId: string, status: UserReport['status']) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    notify(`Report status updated to ${status.toUpperCase()}.`, 'info');
  };

  const renderRoleEditorModal = () => (
    <div className="fixed inset-0 z-[160] bg-[#040812]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6">
      <div className="bg-[#12192b] border border-white/10 w-full max-w-2xl rounded-2xl shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center bg-[#0a0f1c]">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Identity Role Editor</h3>
            <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configuring: {editingUser?.name}</p>
          </div>
          <button onClick={() => setShowRoleModal(false)} className="text-slate-600 hover:text-white transition-colors p-2"><X size={24}/></button>
        </header>
        
        <div className="p-6 md:p-10 space-y-8 md:space-y-10 max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Role Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Master Role Cluster</label>
              {!isSuper && (editingUser?.role === UserRole.ADMIN || editingUser?.role === UserRole.SUPER_ADMIN) && (
                 <span className="text-[7px] md:text-[8px] font-black text-amber-500 uppercase flex items-center gap-1"><Lock size={10} /> Super Admin Only</span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {Object.values(UserRole).map(role => {
                const disabled = !isSuper && (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN || editingUser?.role === UserRole.ADMIN || editingUser?.role === UserRole.SUPER_ADMIN);
                return (
                  <button
                    key={role}
                    disabled={disabled}
                    onClick={() => handleUpdateRole(editingUser!, role)}
                    className={`py-2.5 md:py-3 px-3 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all ${
                      editingUser?.role === role 
                        ? 'bg-[#95f122] text-[#040812] border-[#95f122]' 
                        : 'bg-[#0a0f1c] text-slate-500 border-white/5 hover:border-white/20'
                    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {role.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Granular Capability Matrix</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {Object.entries(editingUser?.permissions || DEFAULT_ROLE_PERMISSIONS[editingUser?.role || UserRole.PLAYER]).map(([key, val]) => {
                 const disabled = !isSuper && (editingUser?.role === UserRole.ADMIN || editingUser?.role === UserRole.SUPER_ADMIN);
                 return (
                  <label key={key} className={`flex items-center justify-between p-3 md:p-4 bg-[#0a0f1c] border border-white/5 transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.02] cursor-pointer group'}`}>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 group-hover:text-white truncate pr-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div 
                      onClick={() => !disabled && handlePermissionToggle(key as keyof UserPermissions)}
                      className={`w-9 md:w-10 h-4 md:h-5 rounded-full relative transition-all duration-200 shrink-0 ${
                        val ? 'bg-[#95f122]' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-3 h-3 md:w-3 md:h-3 rounded-full bg-[#040812] transition-transform duration-200 ease-in-out ${
                        val ? 'translate-x-4 md:translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                 );
              })}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Identity Node Status</label>
            {(!isSuper && (editingUser?.role === UserRole.ADMIN || editingUser?.role === UserRole.SUPER_ADMIN)) ? (
               <div className="w-full flex items-center justify-between p-4 md:p-5 border border-white/5 bg-[#0a0f1c] text-slate-700">
                  <div className="flex items-center gap-3">
                    <Lock size={16}/>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">ADMIN NODE PROTECTION ACTIVE</span>
                  </div>
               </div>
            ) : (
              <button 
                onClick={() => editingUser && setEditingUser({...editingUser, isSuspended: !editingUser.isSuspended})}
                className={`w-full flex items-center justify-between p-4 md:p-5 border transition-all ${
                  editingUser?.isSuspended 
                    ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                    : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {editingUser?.isSuspended ? <Ban size={18}/> : <CheckCircle2 size={18}/>}
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{editingUser?.isSuspended ? 'SUSPENDED' : 'ACTIVE'}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all duration-200 ${editingUser?.isSuspended ? 'bg-red-500' : 'bg-teal-500'}`}>
                  <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ease-in-out ${editingUser?.isSuspended ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            )}
          </div>
        </div>

        <footer className="p-6 md:p-10 border-t border-white/5 flex flex-col sm:flex-row gap-3 md:gap-4 bg-[#0a0f1c]">
           <button 
             onClick={saveIdentityChanges} 
             disabled={!isSuper && (editingUser?.role === UserRole.ADMIN || editingUser?.role === UserRole.SUPER_ADMIN)}
             className="flex-1 py-4 md:py-5 bg-[#95f122] text-[#040812] font-black uppercase text-[10px] md:text-[11px] italic tracking-widest shadow-2xl hover:bg-[#aeff33] transition-all disabled:opacity-40"
           >
              Authorize Update
           </button>
           <button onClick={() => setShowRoleModal(false)} className="px-6 md:px-10 py-4 md:py-5 border border-white/10 text-slate-500 font-black uppercase text-[10px] md:text-[11px] hover:text-white transition-all">Abort</button>
        </footer>
      </div>
    </div>
  );

  const renderCreateModal = () => (
    <div className="fixed inset-0 z-[160] bg-[#040812]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6">
      <div className="bg-[#12192b] border border-white/10 w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-3xl animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Provision New Identity</h3>
          <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white p-1"><X size={20}/></button>
        </header>
        <form onSubmit={handleCreateUser} className="space-y-5 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
            <input type="text" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-[#0a0f1c] border border-white/5 p-3 md:p-4 text-xs font-black text-white focus:outline-none focus:border-[#95f122]/30" />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
            <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-[#0a0f1c] border border-white/5 p-3 md:p-4 text-xs font-black text-white focus:outline-none focus:border-[#95f122]/30" />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Role</label>
            <select 
              value={newUser.role} 
              onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})} 
              className="w-full bg-[#0a0f1c] border border-white/5 p-3 md:p-4 text-xs font-black text-white focus:outline-none focus:border-[#95f122]/30"
            >
              {Object.values(UserRole).map(r => {
                const disabled = !isSuper && (r === UserRole.ADMIN || r === UserRole.SUPER_ADMIN);
                return <option key={r} value={r} disabled={disabled}>{r.toUpperCase().replace('_', ' ')} {disabled ? '(Locked)' : ''}</option>;
              })}
            </select>
          </div>
          <button type="submit" className="w-full py-4 md:py-5 bg-[#95f122] text-[#040812] font-black uppercase text-[10px] md:text-[11px] italic mt-4 shadow-xl">Authorize Provisioning</button>
        </form>
      </div>
    </div>
  );

  const renderHQ = () => (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-[#12192b] border border-white/5 p-6 md:p-10 rounded-2xl col-span-2">
           <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-700 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
              <TrendingUp size={16} className="text-teal-600 shrink-0" /> Performance Matrix
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-4 md:space-y-6">
                {[
                  { label: 'Booking Liquidity', val: '94.2%', color: 'text-[#95f122]' },
                  { label: 'Coach Utilization', val: '68.1%', color: 'text-blue-500' },
                  { label: 'Active Sessions', val: bookings.length.toString(), color: 'text-white' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 md:pb-4">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.label}</span>
                    <span className={`text-xl md:text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 md:space-y-6">
                 {[
                  { label: 'Federation Clubs', val: users.filter(u => u.role === UserRole.CLUB).length.toString(), color: 'text-white' },
                  { label: 'National Coaches', val: users.filter(u => u.role === UserRole.COACH).length.toString(), color: 'text-white' },
                  { label: 'System Latency', val: '12ms', color: 'text-teal-500' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 md:pb-4">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.label}</span>
                    <span className={`text-xl md:text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
        <div className="bg-[#12192b] border border-white/5 p-8 md:p-10 rounded-2xl text-center flex flex-col justify-center relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#95f122]/30 to-transparent"></div>
           {/* Fix: remove md:size as it is not a valid prop for Lucide icons */}
           <Activity size={40} className="text-[#95f122] mx-auto mb-4 md:mb-6 opacity-30 group-hover:opacity-100 transition-opacity" />
           <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter mb-2">Operational Nodes</h4>
           <p className="text-slate-600 text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-relaxed">All 14 regional clusters reporting status: GREEN.</p>
           <button className="mt-6 md:mt-8 text-[8px] md:text-[9px] font-black uppercase text-[#95f122] hover:underline">Download Global Snapshot</button>
        </div>
      </div>
    </div>
  );

  const renderIdentity = () => (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
          <input 
            type="text" 
            placeholder="Search registry..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12192b] border border-white/5 pl-12 pr-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-white focus:outline-none focus:border-[#95f122]/40"
          />
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 md:py-4 bg-[#95f122] text-[#040812] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-[#aeff33] transition-all flex items-center justify-center gap-3 shadow-xl">
          <UserPlus size={14} /> Provision New
        </button>
      </div>

      <div className="bg-[#12192b] border border-white/5 overflow-x-auto custom-scrollbar rounded-sm shadow-2xl">
        <table className="w-full text-left min-w-[700px] lg:min-w-0">
          <thead className="bg-[#0a0f1c] border-b border-white/5">
            <tr>
              <th className="px-6 md:px-8 py-5 md:py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Identity Hub</th>
              <th className="px-6 md:px-8 py-5 md:py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Role</th>
              <th className="px-6 md:px-8 py-5 md:py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Status</th>
              <th className="px-6 md:px-8 py-5 md:py-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] text-right">Protocols</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => {
              const isAdminNode = u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN;
              return (
                <tr key={u.id} className="text-[10px] md:text-[11px] hover:bg-white/[0.01] group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=1e293b&color=ffffff`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 shrink-0" alt="" />
                      <div className="min-w-0">
                        <p className="font-black text-white uppercase italic tracking-widest truncate">{u.name}</p>
                        <p className="text-[7px] md:text-[8px] text-slate-700 font-bold uppercase truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                          u.role === UserRole.SUPER_ADMIN ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                          u.role === UserRole.ADMIN ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                          u.role === UserRole.CLUB ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                          u.role === UserRole.COACH ? 'bg-[#95f122]/10 border-[#95f122]/20 text-[#95f122]' :
                          'bg-slate-500/10 border-white/10 text-slate-400'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${u.isSuspended ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-teal-500 shadow-[0_0_5px_teal]'}`} />
                      <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500">{u.isSuspended ? 'Suspended' : 'Verified'}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center justify-end gap-2 md:gap-4">
                      <button 
                        onClick={() => onImpersonate(u)} 
                        className="p-2 text-slate-700 hover:text-amber-500 transition-colors" 
                        title="Ghost Session"
                      >
                        <Eye size={14}/>
                      </button>
                      <button 
                        onClick={() => { setEditingUser(u); setShowRoleModal(true); }}
                        className={`p-2 transition-colors ${(!isSuper && isAdminNode) ? 'text-slate-900 cursor-not-allowed' : 'text-slate-700 hover:text-[#95f122]'}`}
                        title="Edit Node"
                      >
                        {(!isSuper && isAdminNode) ? <Lock size={14} /> : <Edit2 size={14}/>}
                      </button>
                      <button 
                        onClick={() => handleToggleSuspend(u)} 
                        disabled={!isSuper && isAdminNode}
                        className={`p-2 transition-all ${(!isSuper && isAdminNode) ? 'text-slate-900 cursor-not-allowed' : u.isSuspended ? 'text-teal-500 hover:text-teal-400' : 'text-slate-700 hover:text-red-500'}`}
                        title="Suspend Node"
                      >
                        {u.isSuspended ? <Power size={14}/> : <UserX size={14}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEntities = () => (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CLUBS MANAGEMENT */}
        <div className="bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl">
          <header className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-3">
              <Building2 size={16} className="text-blue-500" /> Club Entities
            </h3>
            <button className="text-[8px] font-black text-[#95f122] uppercase hover:underline">Manage All</button>
          </header>
          <div className="space-y-4">
            {users.filter(u => u.role === UserRole.CLUB).map(club => (
              <div key={club.id} className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/5 hover:border-white/10 transition-all rounded-sm group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-white/5 shrink-0">
                    <Building2 size={16} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white uppercase italic truncate">{club.name}</p>
                    <p className="text-[8px] font-bold text-slate-700 uppercase">{club.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingUser(club); setShowRoleModal(true); }} className="p-2 text-slate-700 hover:text-[#95f122] transition-colors"><Edit2 size={12}/></button>
                  <button onClick={() => handleToggleSuspend(club)} className={`p-2 transition-colors ${club.isSuspended ? 'text-teal-500' : 'text-slate-700 hover:text-red-500'}`}><Power size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COACHES MANAGEMENT */}
        <div className="bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl">
          <header className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-3">
              <Award size={16} className="text-[#95f122]" /> Coach Entities
            </h3>
            <button className="text-[8px] font-black text-[#95f122] uppercase hover:underline">Manage All</button>
          </header>
          <div className="space-y-4">
            {users.filter(u => u.role === UserRole.COACH).map(coach => (
              <div key={coach.id} className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/5 hover:border-white/10 transition-all rounded-sm group">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={coach.avatar || `https://ui-avatars.com/api/?name=${coach.name}&background=1e293b&color=ffffff`} className="w-10 h-10 rounded-full border border-white/5 shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white uppercase italic truncate">{coach.name}</p>
                    <p className="text-[8px] font-bold text-slate-700 uppercase">LVL {coach.skillLevel?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingUser(coach); setShowRoleModal(true); }} className="p-2 text-slate-700 hover:text-[#95f122] transition-colors"><Edit2 size={12}/></button>
                  <button onClick={() => handleToggleSuspend(coach)} className={`p-2 transition-colors ${coach.isSuspended ? 'text-teal-500' : 'text-slate-700 hover:text-red-500'}`}><Power size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
       <header className="flex justify-between items-center border-b border-white/5 pb-6">
          <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-3">
             <Flag size={16} className="text-red-500" /> Misconduct Reports
          </h3>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">{reports.length} ENTRIES LOGGED</span>
       </header>
       <div className="grid grid-cols-1 gap-4">
          {reports.map(report => (
            <div key={report.id} className="bg-[#0c1221] border border-white/5 p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-red-500/20 transition-all">
               <div className="space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                     <span className="px-2 py-0.5 bg-red-900/20 text-red-500 border border-red-500/30 text-[7px] font-black uppercase">{report.reason}</span>
                     <span className="text-slate-700 font-black text-[10px] uppercase">Reporter: {report.reporterName}</span>
                  </div>
                  <h4 className="text-base font-black text-white uppercase italic tracking-tighter">Target Athlete: {report.targetName}</h4>
                  <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed max-w-2xl">"{report.comment}"</p>
                  <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Logged: {report.date}</p>
               </div>
               <div className="flex flex-col gap-2 shrink-0">
                  <div className={`px-4 py-1 text-center text-[7px] font-black uppercase tracking-widest ${report.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-500/10 text-teal-500'}`}>{report.status}</div>
                  <div className="flex gap-2">
                     <button onClick={() => handleReportAction(report.id, 'Reviewed')} className="p-3 bg-teal-900/10 border border-teal-500/20 text-teal-500 hover:bg-teal-500 hover:text-[#040812] transition-all"><CheckCircle size={14}/></button>
                     <button onClick={() => handleReportAction(report.id, 'Actioned')} className="p-3 bg-red-900/10 border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"><ShieldAlert size={14}/></button>
                  </div>
               </div>
            </div>
          ))}
          {reports.length === 0 && (
             <div className="py-20 text-center text-slate-800 uppercase italic font-black text-[9px] tracking-widest">Cluster is clean. Zero misconduct reports found.</div>
          )}
       </div>
    </div>
  );

  const renderOps = () => (
    <div className="space-y-10 md:space-y-12 animate-in slide-in-from-right-8 duration-500">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl">
             <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-tighter mb-6 md:mb-8 flex items-center justify-between">
                <span>Fleet Overrides</span>
                <Plus size={16} className={`text-[#95f122] cursor-pointer ${!isSuper ? 'opacity-30 cursor-not-allowed' : ''}`} />
             </h3>
             <div className="space-y-3 md:space-y-4">
                {courts.slice(0, 4).map(court => (
                  <div key={court.id} className="flex items-center justify-between p-3 md:p-4 bg-[#0a0f1c] border border-white/5 hover:border-white/10 transition-all">
                     <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${court.isLocked ? 'bg-red-500' : 'bg-teal-500'}`} />
                        <div className="min-w-0">
                          <p className="text-[9px] md:text-[10px] font-black text-white uppercase italic truncate">{court.name}</p>
                          <p className="text-[7px] md:text-[8px] font-bold text-slate-700 uppercase">{court.price} MAD</p>
                        </div>
                     </div>
                     <div className="flex gap-2 shrink-0">
                        <button 
                          disabled={!isSuper}
                          onClick={() => onUpdateCourt({...court, isLocked: !court.isLocked})} 
                          className={`p-2 rounded-sm border ${!isSuper ? 'bg-slate-900 border-white/5 text-slate-800' : court.isLocked ? 'bg-teal-900/20 border-teal-500/30 text-teal-500' : 'bg-red-900/20 border-red-500/30 text-red-500'}`}
                        >
                           {court.isLocked ? <Unlock size={12}/> : <Lock size={12}/>}
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl">
             <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-tighter mb-6 md:mb-8">Settlement Ledger</h3>
             <div className="space-y-3 md:space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {bookings.filter(b => b.status === 'Confirmed').slice(0, 6).map(b => (
                  <div key={b.id} className="p-3 md:p-4 bg-[#0a0f1c] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group">
                     <div>
                        <p className="text-[9px] md:text-[10px] font-black text-white uppercase truncate">{b.userName} • {b.courtName}</p>
                        <p className="text-[7px] md:text-[8px] font-bold text-slate-700 uppercase mt-0.5">{b.date} • {b.timeSlot}</p>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onRefund(b.id)} className="flex-1 sm:flex-none px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/30 text-[7px] md:text-[8px] font-black uppercase whitespace-nowrap">Refund</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-8 md:space-y-12 animate-in slide-in-from-right-8 duration-500">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-[#12192b] border border-white/5 p-5 md:p-8 rounded-sm">
             <p className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Commission Yield</p>
             <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter">15.4%</p>
          </div>
          <div className="bg-[#12192b] border border-white/5 p-5 md:p-8 rounded-sm">
             <p className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Gross Net Flow</p>
             <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter">142k</p>
          </div>
          <div className="bg-[#12192b] border border-white/5 p-5 md:p-8 rounded-sm">
             <p className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Pending Payouts</p>
             <p className="text-xl md:text-3xl font-black text-[#95f122] italic tracking-tighter">{payouts.filter(p => p.status === 'Pending').length}</p>
          </div>
          <div className="bg-[#12192b] border border-white/5 p-5 md:p-8 rounded-sm">
             <p className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Platform Fees</p>
             <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter">12k</p>
          </div>
       </div>

       <div className="bg-[#12192b] border border-white/5 overflow-hidden rounded-sm">
          <header className="px-6 md:px-8 py-5 md:py-6 bg-[#0a0f1c] border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest">Payout Queue</h3>
             <div className="flex gap-4">
                {isSuper && <button className="text-[8px] md:text-[9px] font-black text-[#95f122] uppercase tracking-widest hover:underline">Batch Approve</button>}
             </div>
          </header>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[600px] lg:min-w-0">
                <thead className="bg-[#0c1221] border-b border-white/5">
                <tr>
                    <th className="px-6 md:px-8 py-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Beneficiary</th>
                    <th className="px-6 md:px-8 py-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Type</th>
                    <th className="px-6 md:px-8 py-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Settlement</th>
                    <th className="px-6 md:px-8 py-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Status</th>
                    <th className="px-6 md:px-8 py-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {payouts.map(p => (
                    <tr key={p.id} className="text-[9px] md:text-[10px] hover:bg-white/[0.01]">
                    <td className="px-6 md:px-8 py-4 text-white font-black uppercase italic truncate max-w-[150px]">{p.entityName}</td>
                    <td className="px-6 md:px-8 py-4 text-slate-600 font-bold uppercase">{p.type}</td>
                    <td className="px-6 md:px-8 py-4 text-white font-black italic">{p.amount} MAD</td>
                    <td className="px-6 md:px-8 py-4">
                        <span className={`text-[7px] md:text-[8px] font-black uppercase ${p.status === 'Approved' ? 'text-[#95f122]' : 'text-amber-500'}`}>{p.status}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right">
                        {p.status === 'Pending' && (
                            <button onClick={() => onApprovePayout(p.id)} className="px-3 md:px-4 py-1 md:py-1.5 bg-[#95f122] text-[#040812] font-black uppercase text-[7px] md:text-[8px] italic">Approve</button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
       </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-3">
          <Trophy size={16} className="text-[#95f122]" /> Platform Tournament Grid
        </h3>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest italic shadow-lg">New Federation Event</button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-[#12192b] border border-white/5 p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-[#95f122]/30 transition-all">
            <div className="flex items-center gap-6 min-w-0">
               <img src={event.image} className="w-16 h-16 object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all" alt="" />
               <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-black text-white uppercase italic truncate">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-1">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{event.date}</span>
                    <span className={`text-[8px] font-black uppercase italic tracking-widest px-2 py-0.5 rounded-[1px] ${event.isFederationApproved ? 'bg-blue-900/20 text-blue-400 border border-blue-500/20' : 'bg-slate-900/40 text-slate-700'}`}>
                      {event.isFederationApproved ? 'Federation Approved' : 'Unofficial'}
                    </span>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{event.type}</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto self-stretch">
               <div className="flex-grow md:flex-none text-right px-4 border-r border-white/5">
                  <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Entries</p>
                  <p className="text-sm font-black text-[#95f122] italic">{event.registeredCount} / {event.capacity}</p>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => onUpdateEvent({...event, isFederationApproved: !event.isFederationApproved})}
                    className={`p-3 border transition-all ${event.isFederationApproved ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0a0f1c] border-white/5 text-slate-700 hover:text-blue-500'}`}
                    title="Toggle Federation State"
                  >
                    <ShieldCheck size={14}/>
                  </button>
                  <Link to={`/tournament/${event.id}`} className="p-3 bg-[#0a0f1c] border border-white/5 text-[#95f122] hover:bg-[#95f122]/10 transition-all">
                    <Globe size={14}/>
                  </Link>
                  <button onClick={() => notify(`Protocol initiated for ${event.title}`)} className="p-3 bg-red-900/10 border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={14}/>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-10 md:space-y-12 animate-in slide-in-from-right-8 duration-500">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Permission Matrix */}
          <div className="bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl">
             <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-tighter mb-6 md:mb-8 flex items-center gap-3">
                <Sliders size={16} className="text-[#95f122] shrink-0" /> Global Defaults
             </h3>
             <div className="space-y-4 md:space-y-6">
                {[UserRole.PLAYER, UserRole.COACH, UserRole.CLUB].map(role => (
                  <div key={role} className={`p-4 bg-[#0a0f1c] border border-white/5 rounded-sm transition-opacity ${!isSuper ? 'opacity-60' : ''}`}>
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[9px] md:text-[10px] font-black text-white uppercase italic tracking-widest">{role} Node</h4>
                        {!isSuper && <Lock size={10} className="text-slate-700" />}
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {Object.entries(permissions[role]).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between text-[8px] md:text-[9px] font-bold uppercase text-slate-600 p-2 bg-[#040812]/50 border border-white/[0.02]">
                             <span className="truncate pr-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                             <div 
                                onClick={() => isSuper && onUpdatePermission(role, {...permissions[role], [key]: !val})}
                                className={`w-8 md:w-10 h-4 md:h-5 rounded-full relative transition-all duration-200 shrink-0 ${val ? 'bg-[#95f122]' : 'bg-slate-800'} ${!isSuper ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                             >
                                <div className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-3 h-3 md:w-3 md:h-3 rounded-full bg-[#040812] transition-transform duration-200 ease-in-out ${val ? 'translate-x-4 md:translate-x-5' : 'translate-x-0'}`} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Logic Engine */}
          <div className="space-y-8 md:space-y-10">
             <div className={`bg-[#12192b] border border-white/5 p-6 md:p-8 rounded-2xl transition-opacity ${!isSuper ? 'opacity-60' : ''}`}>
                <h3 className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-tighter mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                    <Scale size={16} className="text-teal-600 shrink-0" /> Platform Rules
                   </div>
                   {!isSuper && <span className="text-[7px] md:text-[8px] font-black text-amber-500 uppercase flex items-center gap-1"><Lock size={10} /> Super Admin Only</span>}
                </h3>
                <div className="space-y-4 md:space-y-6">
                   {[
                      { key: 'clubCommission', label: 'Club Node Commission (%)' },
                      { key: 'coachCommission', label: 'Coach Node Commission (%)' },
                      { key: 'tournamentCommission', label: 'Tournament Flow Tax (%)' }
                   ].map(rule => (
                      <div key={rule.key} className="flex items-center justify-between">
                         <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{rule.label}</span>
                         <input 
                            disabled={!isSuper}
                            type="number" 
                            value={platformRules[rule.key as keyof PlatformRules]} 
                            onChange={(e) => handleUpdateRule(rule.key as keyof PlatformRules, parseInt(e.target.value))}
                            className={`w-14 md:w-16 bg-[#040812] border border-white/10 px-2 py-1 text-[10px] md:text-xs font-black text-[#95f122] focus:outline-none ${!isSuper ? 'opacity-30 cursor-not-allowed' : 'focus:border-[#95f122]'}`}
                         />
                      </div>
                   ))}
                   <div className="pt-6 border-t border-white/5">
                      <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-4">Seasonal Control</h4>
                      <button 
                        disabled={!isSuper}
                        onClick={() => notify("Seasonal points reset initiated for Season 3.", "warning")}
                        className="w-full py-4 bg-teal-900/20 border border-teal-500/20 text-teal-400 text-[9px] font-black uppercase tracking-widest italic hover:bg-teal-500 hover:text-[#040812] transition-all disabled:opacity-30"
                      >
                         Simulate Seasonal Ladder Reset
                      </button>
                   </div>
                </div>
             </div>

             <div className={`bg-red-900/5 border border-red-900/20 p-6 md:p-8 rounded-2xl transition-opacity ${!isSuper ? 'opacity-20' : ''}`}>
                <h3 className="text-[10px] md:text-xs font-black text-red-500 uppercase italic tracking-tighter mb-6 md:mb-8 flex items-center gap-3">
                   <ShieldX size={16} className="shrink-0" /> Danger Protocols
                </h3>
                <div className="space-y-3 md:space-y-4">
                   <button 
                      disabled={!isSuper}
                      onClick={() => handleToggleFeature('maintenanceMode')}
                      className={`w-full py-3 md:py-4 border font-black uppercase text-[9px] md:text-[10px] italic transition-all ${featureConfig.maintenanceMode ? 'bg-red-500 text-white border-red-600' : 'bg-[#0a0f1c] text-red-500 border-red-900/30 hover:bg-red-900/20'} ${!isSuper ? 'cursor-not-allowed' : ''}`}
                   >
                      {featureConfig.maintenanceMode ? 'EXIT MAINTENANCE' : 'SYSTEM MAINTENANCE'}
                   </button>
                   <button 
                      disabled={!isSuper}
                      onClick={() => handleToggleFeature('emergencyBookingDisable')}
                      className={`w-full py-3 md:py-4 border font-black uppercase text-[9px] md:text-[10px] italic transition-all ${featureConfig.emergencyBookingDisable ? 'bg-red-500 text-white border-red-600' : 'bg-[#0a0f1c] text-red-500 border-red-900/30 hover:bg-red-900/20'} ${!isSuper ? 'cursor-not-allowed' : ''}`}
                   >
                      {featureConfig.emergencyBookingDisable ? 'RESTORE NODES' : 'EMERGENCY LOCKOUT'}
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-8 duration-500">
       <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Platform Audit Trail</h3>
       </div>
       <div className="bg-[#12192b] border border-white/5 overflow-x-auto custom-scrollbar shadow-2xl rounded-sm">
          <table className="w-full text-left min-w-[600px] lg:min-w-0">
            <thead className="bg-[#0a0f1c] border-b border-white/5">
              <tr>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Timestamp</th>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Authority</th>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Protocol</th>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditTrail.length > 0 ? auditTrail.map(log => (
                <tr key={log.id} className="text-[9px] md:text-[10px] hover:bg-white/[0.01]">
                   <td className="px-6 md:px-8 py-4 text-slate-600 font-bold whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                   <td className="px-6 md:px-8 py-4 text-white font-black italic truncate max-w-[120px]">{log.adminId}</td>
                   <td className="px-6 md:px-8 py-4 text-[#95f122] font-black uppercase tracking-widest">{log.action}</td>
                   <td className="px-6 md:px-8 py-4 text-slate-500 font-bold uppercase truncate max-w-[120px]">{log.target}</td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="px-8 py-16 md:py-20 text-center text-slate-800 uppercase text-[8px] md:text-[9px] font-black tracking-widest italic">Ledger synchronized. Zero recent entries.</td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-12 md:space-y-16">
      
      {showRoleModal && renderRoleEditorModal()}
      {showCreateModal && renderCreateModal()}

      {/* NOTIFICATIONS - Mobile Optimized */}
      <div className="fixed top-20 md:top-24 right-4 md:right-8 z-[120] flex flex-col gap-3 md:gap-4 w-[calc(100%-2rem)] max-w-xs pointer-events-none">
        {notifications.map((n) => (
          <div key={n.id} className={`pointer-events-auto flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border rounded-sm shadow-2xl animate-out fade-out slide-out-to-right-10 duration-500 backdrop-blur-md ${
            n.type === 'success' ? 'bg-teal-950/90 border-teal-600 text-teal-400' :
            n.type === 'warning' ? 'bg-amber-950/90 border-amber-600 text-amber-400' :
            n.type === 'error' ? 'bg-red-950/90 border-red-600 text-red-400' :
            'bg-slate-900/95 border-slate-700 text-slate-300'
          }`}>
            <div className="shrink-0">{n.type === 'success' ? <Check size={14} /> : n.type === 'error' ? <X size={14} /> : <Info size={14} />}</div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-relaxed">{n.message}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 md:gap-10 border-b border-white/5 pb-10 md:pb-12">
        <div className="max-w-full min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/10 border border-red-900/20 mb-4 md:mb-6 rounded-sm">
            <ShieldAlert size={14} className="text-red-500 shrink-0" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-red-500 italic truncate">{isSuper ? 'Central Owner Authority' : 'Operational Admin'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none truncate">
             Operational <span className="text-teal-600">Command.</span>
          </h1>
          <p className="text-slate-700 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] leading-relaxed">Morocco Cluster Governance Hub</p>
        </div>

        <nav className="flex bg-[#0c1221] border border-white/5 p-1 rounded-sm overflow-x-auto w-full xl:w-auto custom-scrollbar">
          {[
            { id: 'hq', icon: <LayoutDashboard size={14} />, label: 'HQ' },
            { id: 'identity', icon: <Users size={14} />, label: 'Identity' },
            { id: 'entities', icon: <Building2 size={14} />, label: 'Entities' },
            { id: 'ops', icon: <Activity size={14} />, label: 'Operations' },
            { id: 'finance', icon: <DollarSign size={14} />, label: 'Finance' },
            { id: 'tournaments', icon: <Trophy size={14} />, label: 'Matrix' },
            { id: 'reports', icon: <Flag size={14} />, label: 'Reports' },
            { id: 'system', icon: <Sliders size={14} />, label: 'Governance' },
            { id: 'audit', icon: <ClipboardList size={14} />, label: 'Audit' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-teal-700 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="shrink-0">{tab.icon}</div> <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <main className="min-h-[400px] md:min-h-[600px] border border-white/5 bg-white/[0.01] p-6 md:p-10 rounded-2xl relative shadow-inner">
        <div className="absolute top-4 right-6 md:right-8 flex items-center gap-2">
           <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#95f122] rounded-full animate-pulse" />
           <span className="text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Logic Node: Active</span>
        </div>
        
        {activeTab === 'hq' && renderHQ()}
        {activeTab === 'identity' && renderIdentity()}
        {activeTab === 'entities' && renderEntities()}
        {activeTab === 'ops' && renderOps()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'audit' && renderAudit()}
      </main>
    </div>
  );
};

export default AdminDashboard;

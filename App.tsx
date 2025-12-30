import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, Booking, Court, Coach, ClubEvent, CoachingSession, TournamentRegistration, Notification, FeatureConfig, PlatformRules, RolePermissions, AuditEntry, PayoutRequest, UserPermissions, FriendStatus, Friend, NotificationCategory } from './types';
import { INITIAL_COURTS, INITIAL_COACHES, INITIAL_EVENTS, INITIAL_USERS } from './data/mockData';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookCourt from './pages/BookCourt';
import PublicBooking from './pages/PublicBooking';
import Coaching from './pages/Coaching';
import PublicCoaching from './pages/PublicCoaching';
import Membership from './pages/Membership';
import PublicMembership from './pages/PublicMembership';
import Events from './pages/Events';
import UserDashboard from './pages/UserDashboard'; 
import AdminDashboard from './pages/AdminDashboard';
import CoachDashboard from './pages/CoachDashboard';
import ClubDashboard from './pages/ClubDashboard';
import TournamentPublic from './pages/TournamentPublic';
import Rankings from './pages/Rankings';
import PlayerProfilePublic from './pages/PlayerProfilePublic';
import Terms from './pages/Terms';
import PublicCoach from './pages/PublicCoach';
import PublicClub from './pages/PublicClub';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalNav from './components/GlobalNav';
import FriendsSystem from './components/FriendsSystem';
import { Bell, Check, X, Info, AlertTriangle, Zap, Swords, Users as UsersIcon } from 'lucide-react';

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.PLAYER]: { canAccessAdmin: false, canAccessClub: false, canAccessCoach: false, canBookCourts: true, canManageUsers: false, canManageTournaments: false, canViewFinancials: false },
  [UserRole.COACH]: { canAccessAdmin: false, canAccessClub: false, canAccessCoach: true, canBookCourts: true, canManageUsers: false, canManageTournaments: false, canViewFinancials: true },
  [UserRole.CLUB]: { canAccessAdmin: false, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: false, canManageTournaments: true, canViewFinancials: true },
  [UserRole.ADMIN]: { canAccessAdmin: true, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: true, canManageTournaments: true, canViewFinancials: true },
  [UserRole.SUPER_ADMIN]: { canAccessAdmin: true, canAccessClub: true, canAccessCoach: true, canBookCourts: true, canManageUsers: true, canManageTournaments: true, canViewFinancials: true },
};

// Global Test Mode Context
const TestModeContext = createContext<{
  isTestMode: boolean;
  activeRole: UserRole | null;
}>({ isTestMode: true, activeRole: null });

export const getRedirectPath = (user: User | null): string => {
  if (!user) return '/';
  return '/dashboard';
};

const playNotificationSound = (type: string) => {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play().catch(() => console.debug('Sound hook:', type));
};

// Isolated Toast Item Component - Handles its own 3s lifecycle
const ToastItem: React.FC<{ t: Notification; onRemove: (id: string) => void }> = ({ t, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  const handleDismiss = useCallback(() => {
    if (!isVisible) return;
    setIsVisible(false);
    // Animation buffer
    setTimeout(() => onRemove(t.id), 200);
  }, [isVisible, t.id, onRemove]);

  useEffect(() => {
    // Exact 3s auto-dismiss
    timerRef.current = window.setTimeout(handleDismiss, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleDismiss]);

  return (
    <div 
      className={`pointer-events-auto min-w-[280px] max-w-sm bg-[#12192b]/95 border-l-4 p-4 shadow-2xl flex items-start gap-4 backdrop-blur-md transition-all duration-200 transform ${
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-4 opacity-0 scale-95'
      } ${
        t.type === 'success' ? 'border-[#95f122]' :
        t.type === 'error' ? 'border-red-500' :
        t.type === 'warning' ? 'border-amber-500' : 'border-blue-500'
      }`}
    >
      <div className="mt-1 shrink-0">
         {t.category === 'Match' ? <Swords size={16} className="text-[#95f122]" /> :
          t.category === 'Friends' ? <UsersIcon size={16} className="text-blue-500" /> :
          <Zap size={16} className="text-amber-500" />}
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest mb-1">{t.title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-relaxed line-clamp-2">{t.message}</p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="text-slate-700 hover:text-white transition-colors cursor-pointer p-1 active:scale-90"
        aria-label="Close"
      >
        <X size={14}/>
      </button>
    </div>
  );
};

const DashboardWrapper: React.FC<any> = (props) => {
  const { user } = props;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role;
  const perms = user.permissions || DEFAULT_PERMISSIONS[role as UserRole] || DEFAULT_PERMISSIONS[UserRole.PLAYER];

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN || perms.canAccessAdmin) {
    return (
      <AdminDashboard 
        courts={props.courts}
        coaches={props.coaches}
        bookings={props.bookings}
        users={props.users}
        events={props.events}
        registrations={props.registrations}
        onUpdateEvent={props.updateEvent}
        featureConfig={props.featureConfig}
        onUpdateConfig={props.updateConfig}
        platformRules={props.platformRules}
        onUpdateRules={props.updateRules}
        onUpdateUser={props.updateUser}
        onAddUser={props.addUser}
        onUpdatePermission={props.updatePermission}
        onAddCourt={props.addCourt}
        onUpdateCourt={props.updateCourt}
        onRefund={props.refundBooking}
        permissions={props.permissions}
        auditTrail={props.auditTrail}
        payouts={props.payouts}
        onApprovePayout={props.approvePayout}
        adminUser={user}
        onImpersonate={props.onImpersonate}
      />
    );
  }

  if (role === UserRole.CLUB || perms.canAccessClub) {
    return (
      <ClubDashboard 
        user={user}
        courts={props.courts}
        bookings={props.bookings}
        coaches={props.coaches}
        events={props.events}
        registrations={props.registrations}
        onCreateTournament={props.addEvent}
        onUpdateTournament={props.updateEvent}
        allUsers={props.users}
      />
    );
  }

  if (role === UserRole.COACH || perms.canAccessCoach) {
    return (
      <CoachDashboard 
        user={user}
        sessions={props.sessions}
      />
    );
  }

  return (
    <UserDashboard 
      user={user}
      bookings={props.bookings}
      sessions={props.sessions}
      registrations={props.registrations}
      onCancelBooking={props.cancelBooking}
      onLogout={props.onLogout}
      platformRules={props.platformRules}
    />
  );
};

const AppRoutes: React.FC<{
  user: User | null;
  onLogin: (u: User) => void;
  onLogout: () => void;
  courts: Court[];
  coaches: Coach[];
  events: ClubEvent[];
  users: User[];
  bookings: Booking[];
  sessions: CoachingSession[];
  registrations: TournamentRegistration[];
  notifications: Notification[];
  featureConfig: FeatureConfig;
  platformRules: PlatformRules;
  permissions: Record<UserRole, RolePermissions>;
  auditTrail: AuditEntry[];
  payouts: PayoutRequest[];
  addBooking: (b: Booking) => void;
  addSession: (s: CoachingSession) => void;
  addEvent: (e: ClubEvent) => void;
  updateEvent: (e: ClubEvent) => void;
  addRegistration: (r: TournamentRegistration) => void;
  cancelBooking: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  updateConfig: (c: FeatureConfig) => void;
  updateRules: (r: PlatformRules) => void;
  updateUser: (u: User) => void;
  addUser: (u: User) => void;
  updatePermission: (role: UserRole, p: RolePermissions) => void;
  refundBooking: (id: string) => void;
  addAudit: (action: string, target: string) => void;
  approvePayout: (id: string) => void;
  addCourt: (c: Court) => void;
  updateCourt: (c: Court) => void;
  onImpersonate: (u: User) => void;
  isImpersonating: boolean;
  onExitImpersonation: () => void;
  historyStack: string[];
  historyPointer: number;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onSoftRefresh: () => void;
  refreshKey: number;
}> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const shownIds = useRef<Set<string>>(new Set());

  const isLoginRoute = location.pathname === '/login';

  useEffect(() => {
    if (isLoginRoute) {
      document.documentElement.classList.add('is-login-route');
    } else {
      document.documentElement.classList.remove('is-login-route');
    }
  }, [isLoginRoute]);

  // Event-based notification trigger
  useEffect(() => {
    const unread = props.notifications.filter(n => !n.read);
    unread.forEach(n => {
      if (!shownIds.current.has(n.id)) {
        shownIds.current.add(n.id);
        setActiveToasts(prev => [...prev, n]);
        playNotificationSound('notify');
        // Acknowledge globally
        props.markNotificationRead(n.id);
      }
    });
  }, [props.notifications, props.markNotificationRead]);

  const handleTestRoleSwitch = (u: User) => {
    props.onLogin(u);
    navigate(getRedirectPath(u));
  };

  // Human-Friendly System Messages
  useEffect(() => {
    if (props.user) {
      const timers = [
        setTimeout(() => props.addNotification({ 
          title: 'Squad ready', 
          message: 'Your team is full. Match initialization complete.', 
          type: 'success', 
          category: 'Match' 
        }), 8000),
        setTimeout(() => props.addNotification({ 
          title: 'Friend online', 
          message: 'Zayd is now active in the arena.', 
          type: 'info', 
          category: 'Friends' 
        }), 12000)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [props.user?.id]);

  if (props.featureConfig.maintenanceMode && !props.user?.permissions?.canAccessAdmin) {
    return (
      <div className="min-h-screen bg-[#040812] flex items-center justify-center text-center p-10">
        <div>
          <h1 className="text-4xl font-black text-white italic mb-4">SYSTEM MAINTENANCE</h1>
          <p className="text-slate-500 uppercase tracking-widest text-sm">PadelClub is currently upgrading its cluster nodes. Please return shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div key={props.refreshKey} className={`flex flex-col min-h-screen ${!isLoginRoute ? 'app-content-scope' : ''}`}>
      <Navbar 
        user={props.user} 
        onLogout={props.onLogout} 
        onRoleSwitch={handleTestRoleSwitch} 
        notifications={props.notifications} 
        onMarkRead={props.markNotificationRead} 
        onClearAll={props.clearAllNotifications}
        onToggleFriends={() => setIsFriendsOpen(!isFriendsOpen)}
        pendingFriendsCount={2}
        hasOnlineFriends={true}
      />
      <GlobalNav 
        canBack={props.historyPointer > 0} 
        canForward={props.historyPointer < props.historyStack.length - 1}
        onBack={props.onNavigateBack}
        onForward={props.onNavigateForward}
        onRefresh={props.onSoftRefresh}
      />
      
      {props.user && (
        <FriendsSystem 
          isOpen={isFriendsOpen} 
          onClose={() => setIsFriendsOpen(false)} 
          onInvitePlayer={(p) => props.addNotification({
            title: 'Invite sent',
            message: `Invitation successfully delivered to ${p.name}.`,
            type: 'info',
            category: 'Match'
          })}
        />
      )}

      {/* TOAST SYSTEM */}
      <div className="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none items-end">
        {activeToasts.map((t) => (
          <ToastItem 
            key={t.id} 
            t={t} 
            onRemove={(id) => setActiveToasts(prev => prev.filter(toast => toast.id !== id))} 
          />
        ))}
      </div>
      
      {props.isImpersonating && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-amber-500 text-black py-2 px-6 flex justify-between items-center font-black text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>Protocol Active: Impersonating {props.user?.name}</span>
          </div>
          <button 
            onClick={props.onExitImpersonation}
            className="bg-black text-amber-500 px-4 py-1 rounded-sm hover:bg-zinc-900 transition-colors"
          >
            Exit Protocol
          </button>
        </div>
      )}

      <main className={`flex-grow pt-[120px] md:pt-[132px]`}>
        <Routes>
          <Route path="/" element={<Home onLogin={props.onLogin} user={props.user} featureConfig={props.featureConfig} />} />
          <Route path="/login" element={<Login onLogin={props.onLogin} user={props.user} />} />
          <Route path="/register" element={<Register onLogin={props.onLogin} user={props.user} />} />
          <Route path="/dashboard" element={<DashboardWrapper {...props} />} />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
          <Route path="/book-court" element={
            props.user ? (
              props.featureConfig.emergencyBookingDisable && !props.user.permissions?.canAccessAdmin 
              ? <Navigate to="/booking" /> 
              : <BookCourt user={props.user} courts={props.courts} onBook={props.addBooking} bookings={props.bookings} featureConfig={props.featureConfig} />
            ) : <Navigate to="/booking" />
          } />
          <Route path="/booking" element={<PublicBooking courts={props.courts} featureConfig={props.featureConfig} />} />
          <Route path="/coaching" element={
            props.featureConfig.coachingEnabled ? (props.user ? <Coaching user={props.user} coaches={props.coaches} onBook={props.addSession} sessions={props.sessions} /> : <PublicCoaching />) : <Navigate to="/" />
          } />
          <Route path="/coach/:id" element={<PublicCoach coaches={props.coaches} sessions={props.sessions} />} />
          <Route path="/club/:id" element={<PublicClub courts={props.courts} events={props.events} />} />
          <Route path="/membership" element={
            props.user ? <Membership user={props.user} /> : <PublicMembership />
          } />
          <Route path="/events" element={
            props.featureConfig.tournamentsEnabled ? (
            <Events 
              events={props.events} 
              user={props.user} 
              registrations={props.registrations}
              onRegister={props.addRegistration}
            />) : <Navigate to="/" />
          } />
          <Route path="/tournament/:id" element={<TournamentPublic events={props.events} />} />
          <Route path="/rankings" element={<Rankings users={props.users} />} />
          <Route path="/player/:id" element={<PlayerProfilePublic users={props.users} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLoginRoute && <Footer />}
    </div>
  );
};

const HistoryManager: React.FC<{ children: (navProps: any) => React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [historyStack, setHistoryStack] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('padel_nav_stack');
    return saved ? JSON.parse(saved) : [location.pathname || '/'];
  });
  
  const [historyPointer, setHistoryPointer] = useState<number>(() => {
    const saved = sessionStorage.getItem('padel_nav_pointer');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isInternalNav, setIsInternalNav] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('padel_nav_stack', JSON.stringify(historyStack));
    sessionStorage.setItem('padel_nav_pointer', historyPointer.toString());
  }, [historyStack, historyPointer]);

  useEffect(() => {
    if (isInternalNav) {
      setIsInternalNav(false);
      return;
    }

    const currentPath = location.pathname;
    const existingIndex = historyStack.indexOf(currentPath);
    
    if (existingIndex !== -1 && existingIndex !== historyPointer) {
      setHistoryPointer(existingIndex);
    } else if (currentPath !== historyStack[historyPointer]) {
      const newStack = historyStack.slice(0, historyPointer + 1);
      newStack.push(currentPath);
      setHistoryStack(newStack);
      setHistoryPointer(newStack.length - 1);
    }
  }, [location.pathname]);

  const onNavigateBack = useCallback(() => {
    if (historyPointer > 0) {
      setIsInternalNav(true);
      const newPointer = historyPointer - 1;
      setHistoryPointer(newPointer);
      navigate(historyStack[newPointer]);
    }
  }, [historyPointer, historyStack, navigate]);

  const onNavigateForward = useCallback(() => {
    if (historyPointer < historyStack.length - 1) {
      setIsInternalNav(true);
      const newPointer = historyPointer + 1;
      setHistoryPointer(newPointer);
      navigate(historyStack[newPointer]);
    }
  }, [historyPointer, historyStack, navigate]);

  const onSoftRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return <>{children({ historyStack, historyPointer, onNavigateBack, onNavigateForward, onSoftRefresh, refreshKey })}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [originalAdmin, setOriginalAdmin] = useState<User | null>(null);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [coaches, setCoaches] = useState<Coach[]>(INITIAL_COACHES);
  const [events, setEvents] = useState<ClubEvent[]>(INITIAL_EVENTS);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('padel_cluster_users');
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS.map(u => ({
      ...u,
      permissions: u.permissions || DEFAULT_PERMISSIONS[u.role]
    }));
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>({
    coachingEnabled: true,
    tournamentsEnabled: true,
    paymentsEnabled: true,
    maintenanceMode: false,
    emergencyBookingDisable: false
  });
  const [platformRules, setPlatformRules] = useState<PlatformRules>({
    clubCommission: 15,
    coachCommission: 20,
    tournamentCommission: 10,
    cancellationWindowHours: 24,
    rankingWinPoints: 100,
    rankingLossPoints: 10,
    refundPolicy: 'Flexible'
  });

  const [permissions, setPermissions] = useState<Record<UserRole, RolePermissions>>({
    [UserRole.PLAYER]: { canBookCourts: true, canManageClubs: false, canManageCoaches: false, canManageTournaments: false, canViewFinancials: false, canManageSystem: false },
    [UserRole.COACH]: { canBookCourts: true, canManageClubs: false, canManageCoaches: true, canManageTournaments: false, canViewFinancials: true, canManageSystem: false },
    [UserRole.CLUB]: { canBookCourts: true, canManageClubs: true, canManageCoaches: true, canManageTournaments: true, canViewFinancials: true, canManageSystem: false },
    [UserRole.ADMIN]: { canBookCourts: true, canManageClubs: true, canManageCoaches: true, canManageTournaments: true, canViewFinancials: true, canManageSystem: false },
    [UserRole.SUPER_ADMIN]: { canBookCourts: true, canManageClubs: true, canManageCoaches: true, canManageTournaments: true, canViewFinancials: true, canManageSystem: true },
  });

  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([
    { id: 'p1', entityId: 'u4', entityName: 'CASABLANCA ARENA', amount: 4500, status: 'Pending', date: '2024-06-15', type: 'Club' },
    { id: 'p2', entityId: 'u2', entityName: 'MEHDI BENANI', amount: 1200, status: 'Approved', date: '2024-06-12', type: 'Coach' },
  ]);

  useEffect(() => {
    localStorage.setItem('padel_cluster_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const savedUser = localStorage.getItem('padel_user');
    const testRole = localStorage.getItem('padel_active_role') as UserRole | null;
    
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      let synced = users.find(u => u.id === parsed.id) || parsed;
      
      if (testRole) {
        synced = { 
          ...synced, 
          role: testRole, 
          permissions: synced.permissions || DEFAULT_PERMISSIONS[testRole] 
        };
      }
      
      setUser(synced);
    }
  }, [users]);

  const handleLogin = (u: User) => {
    const testRole = localStorage.getItem('padel_active_role') as UserRole | null;
    const finalRole = testRole || u.role;
    
    const userWithRole = {
      ...u,
      role: finalRole,
      permissions: u.permissions || DEFAULT_PERMISSIONS[finalRole]
    };
    
    setUser(userWithRole);
    localStorage.setItem('padel_user', JSON.stringify(userWithRole));
  };

  const handleLogout = () => {
    setUser(null);
    setOriginalAdmin(null);
    localStorage.removeItem('padel_user');
    localStorage.removeItem('padel_active_role');
  };

  const handleImpersonate = (u: User) => {
    if (!originalAdmin) setOriginalAdmin(user);
    setUser(u);
  };

  const handleExitImpersonation = () => {
    if (originalAdmin) {
      setUser(originalAdmin);
      setOriginalAdmin(null);
    }
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const addSession = (session: CoachingSession) => {
    setSessions(prev => [...prev, session]);
  };

  const addEvent = (event: ClubEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (event: ClubEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const addRegistration = (registration: TournamentRegistration) => {
    setRegistrations(prev => [...prev, registration]);
    setEvents(prev => prev.map(e => e.id === registration.tournamentId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as const } : b));
  };

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'date' | 'read'>) => {
    setNotifications(prev => [{
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev]);
  };

  const updateConfig = (config: FeatureConfig) => {
    setFeatureConfig(config);
  };

  const updateRules = (rules: PlatformRules) => {
    setPlatformRules(rules);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('padel_user', JSON.stringify(updatedUser));
    }
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, { ...newUser, permissions: newUser.permissions || DEFAULT_PERMISSIONS[newUser.role] }]);
  };

  const updatePermission = (role: UserRole, p: RolePermissions) => {
    setPermissions(prev => ({ ...prev, [role]: p }));
  };

  const refundBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Refunded' as const } : b));
  };

  const approvePayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
  };

  const addCourt = (c: Court) => {
    setCourts(prev => [...prev, c]);
  };

  const updateCourt = (c: Court) => {
    setCourts(prev => prev.map(curr => curr.id === c.id ? c : curr));
  };

  return (
    <Router>
      <TestModeContext.Provider value={{ isTestMode: true, activeRole: (localStorage.getItem('padel_active_role') as UserRole) || null }}>
        <div className="flex flex-col min-h-screen bg-[#060b1a] text-white selection:bg-[#95f122] selection:text-[#060b1a]">
          <HistoryManager>
            {(navProps) => (
              <AppRoutes 
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                courts={courts}
                coaches={coaches}
                events={events}
                users={users}
                bookings={bookings}
                sessions={sessions}
                registrations={registrations}
                notifications={notifications}
                featureConfig={featureConfig}
                platformRules={platformRules}
                permissions={permissions}
                auditTrail={auditTrail}
                payouts={payouts}
                addBooking={addBooking}
                addSession={addSession}
                addEvent={addEvent}
                updateEvent={updateEvent}
                addRegistration={addRegistration}
                cancelBooking={cancelBooking}
                markNotificationRead={markNotificationRead}
                clearAllNotifications={clearAllNotifications}
                addNotification={addNotification}
                updateConfig={updateConfig}
                updateRules={updateRules}
                updateUser={updateUser}
                addUser={addUser}
                updatePermission={updatePermission}
                refundBooking={refundBooking}
                addAudit={() => {}}
                approvePayout={approvePayout}
                addCourt={addCourt}
                updateCourt={updateCourt}
                adminUser={originalAdmin || user}
                onImpersonate={handleImpersonate}
                isImpersonating={!!originalAdmin}
                onExitImpersonation={handleExitImpersonation}
                {...navProps}
              />
            )}
          </HistoryManager>
        </div>
      </TestModeContext.Provider>
    </Router>
  );
};

export default App;
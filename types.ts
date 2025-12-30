export enum UserRole {
  PLAYER = 'player',
  COACH = 'coach',
  CLUB = 'club',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  PRO = 'Pro'
}

export enum SkillTier {
  ROOKIE = 'Rookie',
  CONTENDER = 'Contender',
  ELITE = 'Elite',
  COMPETITIVE = 'Competitive'
}

export enum PlayerRank {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  ELITE = 'Elite'
}

export enum GenderPreference {
  ANY = 'Any',
  MALE = 'Male only',
  FEMALE = 'Female only',
  MIXED = 'Mixed'
}

export enum MatchType {
  SINGLES = 'Singles',
  DOUBLES = 'Doubles'
}

export enum CompetitionMode {
  CASUAL = 'Casual',
  RANKED = 'Ranked'
}

export enum TournamentType {
  CASUAL = 'Casual',
  RANKED = 'Ranked'
}

export interface MatchMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface PlayerRating {
  fromId: string;
  toId: string;
  stars: number;
  comment?: string;
  matchId: string;
}

export enum ReportReason {
  NO_SHOW = 'No-show',
  UNSPORTSMANLIKE = 'Unsportsmanlike behavior',
  FAKE_SKILL = 'Fake skill level',
  ABUSE = 'Abuse',
  OTHER = 'Other'
}

export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetName: string;
  reason: ReportReason;
  comment: string;
  status: 'Open' | 'Reviewed' | 'Actioned';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  skillLevel?: SkillLevel;
  skillTier?: SkillTier;
  skillScore?: number;
  reliabilityScore?: number;
  totalMatches?: number;
  averageRating?: number;
  membership?: MembershipType;
  points?: number;
  seasonalPoints?: Record<string, number>;
  rank?: PlayerRank;
  winCount?: number;
  lossCount?: number;
  badges?: string[];
  matchHistory?: MatchHistoryEntry[];
  notifications?: Notification[];
  isSuspended?: boolean;
  assignedClubId?: string;
  permissions?: UserPermissions;
  clubTier?: ClubTier;
}

// SOCIAL SYSTEM TYPES
export enum FriendStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SEARCHING = 'searching',
  IN_MATCH = 'in_match',
  INVITE_SENT = 'invite_sent',
  PENDING = 'pending',
  ARENA_ENGAGED = 'arena_engaged'
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: FriendStatus;
  isFriend: boolean;
  isPending: boolean;
  incoming: boolean;
  statsHidden?: boolean;
  rank?: PlayerRank;
  skillTier?: SkillTier;
  unreadCount?: number;
}

export interface FriendMatchHistory {
  id: string;
  date: string;
  arena: string;
  type: '1v1' | '2v2';
  result: 'Win' | 'Loss';
  srChange: string;
}

export interface FriendStats {
  totalMatches: number;
  matchesTogether: number;
  winsTogether: number;
  lossesTogether: number;
  winRate: number;
  avgDuration: string;
  lastMatch: string;
  favArena: string;
  history: FriendMatchHistory[];
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
}

export interface OpenMatch {
  id: string;
  creatorId: string;
  creatorName: string;
  courtId: string;
  courtName: string;
  date: string;
  timeSlot: string;
  matchType: MatchType;
  competitionMode: CompetitionMode;
  skillLevel: SkillLevel;
  genderPreference: GenderPreference;
  maxPlayers: number;
  playersJoined: string[]; 
  acceptedPlayers: string[];
  visibility: 'Public' | 'Club-only';
  status: 'Open' | 'Pending' | 'Ready' | 'Confirmed' | 'Completed';
  pricePerPlayer: number;
  confirmationDeadline?: number;
  messages?: MatchMessage[];
  ratings?: PlayerRating[];
}

export enum SeedingMode { RANDOM = 'Random', RANKING = 'By Ranking', CATEGORY = 'By Category' }
export enum TournamentLevel { OPEN_1000 = 'Open 1000', CHALLENGER_500 = 'Challenger 500', ACADEMY_250 = 'Academy 250' }
export enum ClubTier { BASIC = 'Basic', PRO = 'Pro', ELITE = 'Elite' }
export enum TournamentFormat { KNOCKOUT = 'Knockout', LEAGUE = 'League', CHAMPIONS_LEAGUE = 'Champions League' }

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  capacity: number;
  registeredCount: number;
  price: number;
  image: string;
  status?: 'Pending' | 'Approved' | 'Cancelled' | 'Closed';
  clubId?: string;
  category?: string;
  format?: TournamentFormat;
  type: TournamentType;
  entryFee?: number;
  gender?: 'Male' | 'Female' | 'Mixed';
  prizePoolPercent?: number;
  rules?: string;
  bracket?: TournamentMatch[];
  seedingMode?: SeedingMode;
  level?: TournamentLevel;
  isFederationApproved?: boolean;
}

export interface Sponsor { id: string; name: string; imageUrl: string; placement: 'tournament' | 'bracket' | 'profile'; link: string; status: 'active' | 'expired'; }
export interface MatchHistoryEntry { id: string; opponent: string; tournamentName: string; score: string; result: 'W' | 'L'; date: string; }

export type NotificationCategory = 'All' | 'Match' | 'Friends' | 'System';

export interface Notification { 
  id: string; 
  title: string; 
  message: string; 
  type: 'info' | 'success' | 'warning' | 'error'; 
  category: NotificationCategory;
  date: string; 
  read: boolean; 
}

export interface UserPermissions { canAccessAdmin: boolean; canAccessClub: boolean; canAccessCoach: boolean; canBookCourts: boolean; canManageUsers: boolean; canManageTournaments: boolean; canViewFinancials: boolean; canCreateOpenMatch?: boolean; }
export interface RolePermissions { canBookCourts: boolean; canManageClubs: boolean; canManageCoaches: boolean; canManageTournaments: boolean; canViewFinancials: boolean; canManageSystem: boolean; }
export interface RankingEntry { userId: string; userName: string; points: number; rank: number; prevRank: number; club?: string; category: string; }
export enum MembershipType { NONE = 'None', BASIC = 'Basic', PREMIUM = 'Premium', ELITE = 'Elite' }
export interface Court { id: string; name: string; type: 'Indoor' | 'Outdoor' | 'Panoramic'; price: number; image: string; rating?: number; reviewCount?: number; clubId?: string; isLocked?: boolean; }
export interface Booking { id: string; userId: string; userName: string; courtId: string; courtName: string; date: string; timeSlot: string; price: number; status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded'; transactionId?: string; disputed?: boolean; disputeNotes?: string; isOpenMatch?: boolean; }
export interface Coach { id: string; name: string; level: SkillLevel; bio: string; price: number; avatar: string; rating: number; reviewCount?: number; commissionCap?: number; }
export interface AvailabilitySlot { day: string; slots: string[]; }
export interface CoachingSession { id: string; coachId: string; coachName: string; userId: string; userName: string; date: string; time: string; duration: number; price: number; type: 'Private' | 'Group'; status: 'Booked' | 'Completed' | 'Cancelled'; transactionId?: string; }
export enum MatchStatus { PENDING = 'Pending', SCHEDULED = 'Scheduled', IN_PROGRESS = 'In Progress', COMPLETED = 'Completed' }
export interface TournamentMatch { id: string; round: string; position: number; teamA?: string; teamB?: string; scoreA?: number; scoreB?: number; winnerId?: string; status: MatchStatus; nextMatchId?: string; nextMatchSlot?: 'A' | 'B'; }
export interface TournamentRegistration { id: string; tournamentId: string; userId: string; userName: string; status: 'Paid' | 'Refunded'; paidAmount: number; transactionId: string; registrationDate: string; }
export interface FeatureConfig { coachingEnabled: boolean; tournamentsEnabled: boolean; paymentsEnabled: boolean; maintenanceMode: boolean; emergencyBookingDisable: boolean; }
export interface PlatformRules { clubCommission: number; coachCommission: number; tournamentCommission: number; cancellationWindowHours: number; rankingWinPoints: number; rankingLossPoints: number; refundPolicy: 'Flexible' | 'Strict' | 'No Refund'; }
export interface PayoutRequest { id: string; entityId: string; entityName: string; amount: number; status: 'Pending' | 'Approved' | 'Rejected'; date: string; type: 'Club' | 'Coach'; }
export interface AuditEntry { id: string; adminId: string; action: string; target: string; date: string; }
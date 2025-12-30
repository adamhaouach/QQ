
import { UserRole, SkillLevel, Court, Coach, ClubEvent, User, MembershipType, TournamentLevel, RankingEntry, ClubTier, Sponsor, TournamentFormat, PlayerRank, SkillTier, TournamentType } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'ADMIN MASTER', email: 'admin@padelclub.ma', role: UserRole.ADMIN, gender: 'Male', points: 0 },
  { 
    id: 'u2', name: 'MEHDI BENANI', email: 'mehdi.coach@padelclub.ma', role: UserRole.COACH, gender: 'Male',
    skillLevel: SkillLevel.PRO, skillTier: SkillTier.COMPETITIVE, rank: PlayerRank.ELITE, skillScore: 98, points: 5400, 
    seasonalPoints: { 'S1': 4200, 'S2': 5400 },
    winCount: 42, lossCount: 8, reliabilityScore: 100, averageRating: 4.9, totalMatches: 150,
    badges: ['Top Ranked', 'Pro Coach', 'National Champion'],
    matchHistory: [
      { id: 'm1', opponent: 'OMAR EL FASSI', tournamentName: 'Rabat Open', score: '6-4, 6-2', result: 'W', date: '2024-05-12' },
      { id: 'm2', opponent: 'JUAN LEBRON', tournamentName: 'World Padel Tour', score: '3-6, 4-6', result: 'L', date: '2024-04-10' },
    ]
  },
  { id: 'u3', name: 'SOFIA ALAMI', email: 'sofia.coach@padelclub.ma', role: UserRole.COACH, gender: 'Female', skillLevel: SkillLevel.ADVANCED, skillTier: SkillTier.ELITE, rank: PlayerRank.GOLD, skillScore: 85, points: 4200, seasonalPoints: { 'S1': 3000, 'S2': 4200 }, winCount: 35, lossCount: 12, reliabilityScore: 95, averageRating: 4.8, totalMatches: 90, badges: ['Pro Coach'] },
  { id: 'u4', name: 'CASABLANCA ARENA', email: 'contact@casa-arena.ma', role: UserRole.CLUB, gender: 'Other', points: 0, clubTier: ClubTier.ELITE },
  { id: 'u5', name: 'AMINE RADI', email: 'amine@gmail.com', role: UserRole.PLAYER, gender: 'Male', skillLevel: SkillLevel.INTERMEDIATE, skillTier: SkillTier.CONTENDER, rank: PlayerRank.SILVER, skillScore: 62, membership: MembershipType.PREMIUM, points: 1250, seasonalPoints: { 'S2': 1250 }, winCount: 15, lossCount: 10, reliabilityScore: 88, averageRating: 4.5, totalMatches: 30, badges: ['Fast Learner'] },
  { id: 'u6', name: 'SARA JABRI', email: 'sara@yahoo.fr', role: UserRole.PLAYER, gender: 'Female', skillLevel: SkillLevel.BEGINNER, skillTier: SkillTier.ROOKIE, rank: PlayerRank.BRONZE, skillScore: 35, membership: MembershipType.BASIC, points: 450, seasonalPoints: { 'S2': 450 }, winCount: 4, lossCount: 8, reliabilityScore: 92, averageRating: 4.7, totalMatches: 12 },
  { id: 'u7', name: 'RABAT PADEL HUB', email: 'info@rabat-padel.ma', role: UserRole.CLUB, gender: 'Other', points: 0, clubTier: ClubTier.PRO },
  { id: 'u8', name: 'OMAR EL FASSI', email: 'omar@gmail.com', role: UserRole.PLAYER, gender: 'Male', skillLevel: SkillLevel.PRO, skillTier: SkillTier.COMPETITIVE, rank: PlayerRank.ELITE, skillScore: 95, points: 2800, seasonalPoints: { 'S1': 2000, 'S2': 2800 }, winCount: 22, lossCount: 14, reliabilityScore: 98, averageRating: 4.8, totalMatches: 65, badges: ['Top 10'] },
  { id: 'u9', name: 'LILA MANSOURI', email: 'lila@gmail.com', role: UserRole.PLAYER, gender: 'Female', skillLevel: SkillLevel.ADVANCED, skillTier: SkillTier.ELITE, rank: PlayerRank.GOLD, skillScore: 82, points: 1950, seasonalPoints: { 'S2': 1950 }, winCount: 18, lossCount: 9, reliabilityScore: 94, averageRating: 4.6, totalMatches: 45 },
];

export const INITIAL_SPONSORS: Sponsor[] = [
  { id: 's1', name: 'Red Bull', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_Antonin_Logo.svg/1200px-Red_Bull_Antonin_Logo.svg.png', placement: 'tournament', link: 'https://redbull.com', status: 'active' },
  { id: 's2', name: 'Head Padel', imageUrl: 'https://logovtor.com/wp-content/uploads/2020/09/head-logo-vector.png', placement: 'bracket', link: 'https://head.com', status: 'active' },
  { id: 's3', name: 'Bullpadel', imageUrl: 'https://www.bullpadel.com/img/bullpadel-logo-1563445831.jpg', placement: 'profile', link: 'https://bullpadel.com', status: 'active' },
];

export const INITIAL_RANKINGS: RankingEntry[] = [
  { userId: 'u2', userName: 'MEHDI BENANI', points: 5400, rank: 1, prevRank: 1, category: 'Male Pro', club: 'Casablanca Arena' },
  { userId: 'u3', userName: 'SOFIA ALAMI', points: 4200, rank: 2, prevRank: 3, category: 'Female Pro', club: 'Rabat Padel Hub' },
  { userId: 'u8', userName: 'OMAR EL FASSI', points: 2800, rank: 3, prevRank: 2, category: 'Male Pro', club: 'Casablanca Arena' },
  { userId: 'u9', userName: 'LILA MANSOURI', points: 1950, rank: 4, prevRank: 5, category: 'Female Pro', club: 'Rabat Padel Hub' },
  { userId: 'u5', userName: 'AMINE RADI', points: 1250, rank: 5, prevRank: 4, category: 'Male Intermediate', club: 'Casablanca Arena' },
  { userId: 'u6', userName: 'SARA JABRI', points: 450, rank: 6, prevRank: 6, category: 'Female Beginner', club: 'Oasis Garden' },
];

export const INITIAL_COURTS: Court[] = [
  { id: 'c1', name: 'Court 1 - Casablanca Pro', type: 'Indoor', price: 350, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800' },
  { id: 'c2', name: 'Court 2 - Atlas Panoramic', type: 'Panoramic', price: 450, image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=800' },
  { id: 'c3', name: 'Court 3 - Oasis Garden', type: 'Outdoor', price: 250, image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800' },
  { id: 'c4', name: 'Court 4 - Championship Indoor', type: 'Indoor', price: 400, image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800' },
];

export const INITIAL_COACHES: Coach[] = [
  { id: 'ch1', name: 'Mehdi Benani', level: SkillLevel.PRO, bio: 'PPA Certified Master Professional. 15 years on the World Padel Tour. Specialized in high-performance match strategy and technical bio-mechanics.', price: 500, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500', rating: 4.9 },
  { id: 'ch2', name: 'Sofia Alami', level: SkillLevel.ADVANCED, bio: 'FMP Level 2 Certified Coach. Former national champion with a focus on tactical defensive positioning and junior academy excellence.', price: 400, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=500', rating: 4.8 },
  { id: 'ch3', name: 'Youssef Mansour', level: SkillLevel.INTERMEDIATE, bio: 'Professional Fitness Instructor and Certified Padel Coach. Expert in physical conditioning, footwork, and fundamental skill development.', price: 300, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500', rating: 4.7 },
];

export const INITIAL_EVENTS: ClubEvent[] = [
  { 
    id: 'e1', title: 'Rabat Open Cup', description: 'The biggest padel tournament in the region. Big prizes and international scouts!', 
    date: '2024-07-15', time: '09:00', capacity: 32, registeredCount: 24, price: 250, 
    image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800', 
    status: 'Approved', clubId: 'u7', category: 'Open', format: TournamentFormat.KNOCKOUT, type: TournamentType.RANKED, entryFee: 250,
    gender: 'Mixed', prizePoolPercent: 30, level: TournamentLevel.OPEN_1000, isFederationApproved: true 
  },
  { 
    id: 'e2', title: 'Beginners Masterclass', description: 'Get started with the right technique. Equipment included.', 
    date: '2024-07-20', time: '18:00', capacity: 12, registeredCount: 8, price: 150, 
    image: 'https://images.unsplash.com/photo-1594470117722-14589a9e3f39?auto=format&fit=crop&q=80&w=800', 
    status: 'Approved', clubId: 'u4', category: 'Academy', format: TournamentFormat.LEAGUE, type: TournamentType.CASUAL, entryFee: 0,
    gender: 'Mixed', prizePoolPercent: 0, level: TournamentLevel.ACADEMY_250, isFederationApproved: false 
  }
];

export const INITIAL_TIME_SLOTS = [ '08:00 - 09:30', '09:30 - 11:00', '11:00 - 12:30', '14:00 - 15:30', '15:30 - 17:00', '17:00 - 18:30', '18:30 - 20:00', '20:00 - 21:30' ];

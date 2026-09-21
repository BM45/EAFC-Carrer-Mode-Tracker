export type CareerMode = 'manager' | 'player';

export type Position = 
  | 'GK' 
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'CF' | 'ST';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface SeasonSummary {
  season: string;
  club?: string;
  leagueFinish?: string;
  points?: number;
  trophiesWon: string[];
  matchesPlayed?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  topScorer?: string;
  topAssister?: string;
  bestPlayer?: string;
  // Player career mode specific
  playerGoals?: number;
  playerAssists?: number;
  playerAvgRating?: number;
  playerOvrStart?: number;
  playerOvrEnd?: number;
}

export type SeasonRecord = SeasonSummary;

export interface Career {
  id: string;
  name: string;
  mode: CareerMode;
  club: string;
  clubBadge?: string;
  league: string;
  startingSeason: string;
  currentSeason: string;
  difficulty: 'Amateur' | 'Semi-Pro' | 'Professional' | 'World Class' | 'Legendary' | 'Ultimate';
  currency: '€' | '£' | '$';
  halfLength?: number;
  notes?: string;
  
  // Manager Mode specific
  managerName?: string;
  transferBudget?: number;
  wageBudget?: number;
  formation?: string;
  tacticalStyle?: string;
  boardObjectiveLeague?: string;
  boardObjectiveCup?: string;
  boardObjectiveYouth?: string;
  
  // Player Mode specific
  playerName?: string;
  playerNationality?: string;
  playerAge?: number;
  playerOverall?: number;
  playerPotential?: number;
  playerPosition?: Position;
  playerSecondaryPositions?: Position[];
  playerArchetype?: string;
  preferredFoot?: 'Right' | 'Left';
  skillMoves?: number;
  weakFoot?: number;
  squadRole?: 'Crucial Starter' | 'Key Player' | 'Rotation' | 'Sporadic' | 'Prospect' | 'Transfer Listed' | 'On Loan';
  managerConfidence?: number; // 0 - 100
  weeklyWage?: number;
  marketValue?: number;
  contractLengthYears?: number;
  nationalTeam?: string;
  nationalTeamCaps?: number;
  nationalTeamGoals?: number;
  jerseyNumber?: number;
  attributes?: PlayerAttributes;
  perks?: string[];
  developmentPoints?: number;

  seasons: SeasonSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  careerId: string;
  name: string;
  number: number;
  position: Position;
  secondaryPositions?: Position[];
  age: number;
  nationality: string;
  overall: number;
  potential: number;
  growth: number;
  value: number;
  wage: number;
  contractExpiry: string;
  role: 'Crucial' | 'Important' | 'Rotation' | 'Sporadic' | 'Prospect';
  status: 'Fit' | 'Injured' | 'Suspended' | 'Fatigued';
  lineupStatus: 'starter' | 'bench' | 'reserve';
  pitchSlot?: number; // 0 to 10 for starting XI positions
  photo?: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
  notes?: string;
}

export interface Match {
  id: string;
  careerId: string;
  season: string;
  date: string;
  competition: string;
  opponent: string;
  venue: 'Home' | 'Away' | 'Neutral';
  ourGoals: number;
  opponentGoals: number;
  result: 'W' | 'D' | 'L';
  matchType: 'Played' | 'Simulated' | 'Highlights';
  scorers: string;
  assists: string;
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  cleanSheet?: boolean;
  notes?: string;
  
  // Player Career Mode specific
  playerStarted?: boolean;
  playerMinutes?: number;
  playerGoals?: number;
  playerAssists?: number;
  playerRating?: number; // e.g. 8.6
  playerMOTM?: boolean;
  objectiveCompleted?: boolean;
  objectiveText?: string;
}

export interface Transfer {
  id: string;
  careerId: string;
  season: string;
  date: string;
  player: string;
  type: 'IN' | 'OUT' | 'LOAN_IN' | 'LOAN_OUT' | 'FREE';
  fromClub: string;
  toClub: string;
  fee: number;
  wage?: number;
  status: 'Completed' | 'Rumour' | 'Offer Received' | 'Rejected';
  notes?: string;
}

export interface Trophy {
  id: string;
  careerId: string;
  season: string;
  name: string;
  category: 'league' | 'continental' | 'domestic_cup' | 'super_cup' | 'international' | 'preseason';
  competition: string;
  finalOpponent?: string;
  finalScore?: string;
  date: string;
  mvp?: string;
  notes?: string;
}

export interface Award {
  id: string;
  careerId: string;
  season: string;
  name: string;
  recipient: string;
  competition?: string;
  date: string;
  stats?: string;
  type: 'ballon_dor' | 'golden_boot' | 'golden_glove' | 'potm' | 'manager_of_season' | 'young_player' | 'toty' | 'custom';
}

export interface RecordItem {
  id: string;
  careerId: string;
  title: string;
  holder: string;
  value: string;
  season: string;
  category: 'goals' | 'assists' | 'appearances' | 'streaks' | 'transfers' | 'club';
}

export interface JournalEntry {
  id: string;
  careerId: string;
  season: string;
  date: string;
  title: string;
  category: 'milestone' | 'press' | 'transfer' | 'derby' | 'drama' | 'tactics';
  content: string;
  headline?: string;
}

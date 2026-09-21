import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Career,
  Player,
  Match,
  Transfer,
  Trophy,
  Award,
  RecordItem,
  JournalEntry,
  PlayerAttributes,
  SeasonSummary,
} from '../types';
import {
  INITIAL_CAREERS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_TRANSFERS,
  INITIAL_TROPHIES,
  INITIAL_AWARDS,
  INITIAL_RECORDS,
  INITIAL_JOURNAL,
} from '../data/initialData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CareerContextType {
  careers: Career[];
  activeCareerId: string;
  activeCareer: Career | undefined;
  setActiveCareerId: (id: string) => void;
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;

  // Career CRUD
  createCareer: (data: Partial<Career>) => Career;
  updateCareer: (id: string, updates: Partial<Career>) => void;
  deleteCareer: (id: string) => void;
  addSeason: (careerId: string, seasonName: string) => void;
  addSeasonRecord: (record: SeasonSummary) => void;

  // Filtered collections for active career and active season
  players: Player[];
  allCareerPlayers: Player[];
  matches: Match[];
  allCareerMatches: Match[];
  transfers: Transfer[];
  allCareerTransfers: Transfer[];
  trophies: Trophy[];
  allCareerTrophies: Trophy[];
  awards: Award[];
  allCareerAwards: Award[];
  records: RecordItem[];
  journal: JournalEntry[];

  // CRUD for collections
  addPlayer: (player: Omit<Player, 'id' | 'careerId'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  addMatch: (match: Omit<Match, 'id' | 'careerId'>) => Match;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;

  addTransfer: (transfer: Omit<Transfer, 'id' | 'careerId'>) => Transfer;
  updateTransfer: (id: string, updates: Partial<Transfer>) => void;
  deleteTransfer: (id: string) => void;

  addTrophy: (trophy: Omit<Trophy, 'id' | 'careerId'>) => Trophy;
  updateTrophy: (id: string, updates: Partial<Trophy>) => void;
  deleteTrophy: (id: string) => void;

  addAward: (award: Omit<Award, 'id' | 'careerId'>) => Award;
  updateAward: (id: string, updates: Partial<Award>) => void;
  deleteAward: (id: string) => void;

  addRecord: (record: Omit<RecordItem, 'id' | 'careerId'>) => RecordItem;
  updateRecord: (id: string, updates: Partial<RecordItem>) => void;
  deleteRecord: (id: string) => void;

  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'careerId'>) => JournalEntry;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Player Career Mode features
  upgradeAttribute: (attribute: keyof PlayerAttributes, amount?: number) => void;
  addPerk: (perk: string) => void;
  removePerk: (perk: string) => void;

  // Utility
  formatCurrency: (value: number) => string;
  exportCareerJson: (careerId?: string) => void;
  importCareerJson: (jsonData: string) => boolean;
  resetToDemoData: () => void;

  // Toast
  toasts: ToastState[];
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CAREERS: 'fifa_cmt_careers_v1',
  ACTIVE_ID: 'fifa_cmt_active_id_v1',
  PLAYERS: 'fifa_cmt_players_v1',
  MATCHES: 'fifa_cmt_matches_v1',
  TRANSFERS: 'fifa_cmt_transfers_v1',
  TROPHIES: 'fifa_cmt_trophies_v1',
  AWARDS: 'fifa_cmt_awards_v1',
  RECORDS: 'fifa_cmt_records_v1',
  JOURNAL: 'fifa_cmt_journal_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [careers, setCareers] = useState<Career[]>(() =>
    loadStorage(STORAGE_KEYS.CAREERS, INITIAL_CAREERS)
  );

  const [activeCareerId, setActiveCareerId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    if (savedId && careers.some((c) => c.id === savedId)) {
      return savedId;
    }
    return careers[0]?.id || 'career-manager-rm';
  });

  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const [players, setPlayers] = useState<Player[]>(() =>
    loadStorage(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS)
  );
  const [matches, setMatches] = useState<Match[]>(() =>
    loadStorage(STORAGE_KEYS.MATCHES, INITIAL_MATCHES)
  );
  const [transfers, setTransfers] = useState<Transfer[]>(() =>
    loadStorage(STORAGE_KEYS.TRANSFERS, INITIAL_TRANSFERS)
  );
  const [trophies, setTrophies] = useState<Trophy[]>(() =>
    loadStorage(STORAGE_KEYS.TROPHIES, INITIAL_TROPHIES)
  );
  const [awards, setAwards] = useState<Award[]>(() =>
    loadStorage(STORAGE_KEYS.AWARDS, INITIAL_AWARDS)
  );
  const [records, setRecords] = useState<RecordItem[]>(() =>
    loadStorage(STORAGE_KEYS.RECORDS, INITIAL_RECORDS)
  );
  const [journal, setJournal] = useState<JournalEntry[]>(() =>
    loadStorage(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL)
  );

  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(careers));
  }, [careers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeCareerId);
  }, [activeCareerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TROPHIES, JSON.stringify(trophies));
  }, [trophies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(awards));
  }, [awards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  }, [journal]);

  const activeCareer = useMemo(() => {
    return careers.find((c) => c.id === activeCareerId) || careers[0];
  }, [careers, activeCareerId]);

  // When active career changes, reset season selector to 'all'
  useEffect(() => {
    setSelectedSeason('all');
  }, [activeCareerId]);

  // Filtered lists for active career
  const allCareerPlayers = useMemo(() => {
    return players.filter((p) => p.careerId === activeCareer?.id);
  }, [players, activeCareer?.id]);

  const allCareerMatches = useMemo(() => {
    return matches.filter((m) => m.careerId === activeCareer?.id);
  }, [matches, activeCareer?.id]);

  const allCareerTransfers = useMemo(() => {
    return transfers.filter((t) => t.careerId === activeCareer?.id);
  }, [transfers, activeCareer?.id]);

  const allCareerTrophies = useMemo(() => {
    return trophies.filter((t) => t.careerId === activeCareer?.id);
  }, [trophies, activeCareer?.id]);

  const allCareerAwards = useMemo(() => {
    return awards.filter((a) => a.careerId === activeCareer?.id);
  }, [awards, activeCareer?.id]);

  const careerRecords = useMemo(() => {
    return records.filter((r) => r.careerId === activeCareer?.id);
  }, [records, activeCareer?.id]);

  const careerJournal = useMemo(() => {
    return journal.filter((j) => j.careerId === activeCareer?.id);
  }, [journal, activeCareer?.id]);

  // Season-filtered sets
  const filteredMatches = useMemo(() => {
    if (selectedSeason === 'all') return allCareerMatches;
    return allCareerMatches.filter((m) => m.season === selectedSeason);
  }, [allCareerMatches, selectedSeason]);

  const filteredTransfers = useMemo(() => {
    if (selectedSeason === 'all') return allCareerTransfers;
    return allCareerTransfers.filter((t) => t.season === selectedSeason);
  }, [allCareerTransfers, selectedSeason]);

  const filteredTrophies = useMemo(() => {
    if (selectedSeason === 'all') return allCareerTrophies;
    return allCareerTrophies.filter((t) => t.season === selectedSeason);
  }, [allCareerTrophies, selectedSeason]);

  const filteredAwards = useMemo(() => {
    if (selectedSeason === 'all') return allCareerAwards;
    return allCareerAwards.filter((a) => a.season === selectedSeason);
  }, [allCareerAwards, selectedSeason]);

  // Career CRUD
  const createCareer = (data: Partial<Career>): Career => {
    const isPlayer = data.mode === 'player';
    const newCareer: Career = {
      id: `career-${Date.now()}`,
      name: data.name || (isPlayer ? `${data.playerName || 'Pro'} Career` : `${data.club || 'Club'} Career`),
      mode: data.mode || 'manager',
      club: data.club || 'FC Barcelona',
      league: data.league || 'LaLiga EA Sports',
      startingSeason: data.startingSeason || '2025/26',
      currentSeason: data.currentSeason || data.startingSeason || '2025/26',
      difficulty: data.difficulty || 'World Class',
      currency: data.currency || '€',
      managerName: data.managerName || (isPlayer ? undefined : 'Manager'),
      transferBudget: data.transferBudget ?? (isPlayer ? undefined : 100000000),
      wageBudget: data.wageBudget ?? (isPlayer ? undefined : 2000000),
      formation: data.formation || '4-3-3',
      tacticalStyle: data.tacticalStyle || 'Gegenpress',
      boardObjectiveLeague: data.boardObjectiveLeague || 'Compete for the title',
      boardObjectiveCup: data.boardObjectiveCup || 'Reach Quarter Finals',
      boardObjectiveYouth: data.boardObjectiveYouth || 'Sign 1 youth prospect',

      // Player Mode
      playerName: data.playerName || (isPlayer ? 'Player Pro' : undefined),
      playerNationality: data.playerNationality || (isPlayer ? 'England' : undefined),
      playerAge: data.playerAge ?? (isPlayer ? 19 : undefined),
      playerOverall: data.playerOverall ?? (isPlayer ? 78 : undefined),
      playerPotential: data.playerPotential ?? (isPlayer ? 88 : undefined),
      playerPosition: data.playerPosition || (isPlayer ? 'ST' : undefined),
      playerSecondaryPositions: data.playerSecondaryPositions || (isPlayer ? ['LW'] : undefined),
      playerArchetype: data.playerArchetype || (isPlayer ? 'Playmaker / Finisher' : undefined),
      preferredFoot: data.preferredFoot || 'Right',
      skillMoves: data.skillMoves ?? 3,
      weakFoot: data.weakFoot ?? 4,
      jerseyNumber: data.jerseyNumber ?? (isPlayer ? 10 : undefined),
      squadRole: data.squadRole || (isPlayer ? 'Crucial Starter' : undefined),
      managerConfidence: data.managerConfidence ?? (isPlayer ? 80 : undefined),
      weeklyWage: data.weeklyWage ?? (isPlayer ? 35000 : undefined),
      marketValue: data.marketValue ?? (isPlayer ? 32000000 : undefined),
      contractLengthYears: data.contractLengthYears ?? (isPlayer ? 4 : undefined),
      nationalTeam: data.nationalTeam || (isPlayer ? 'National Team' : undefined),
      nationalTeamCaps: data.nationalTeamCaps ?? 0,
      nationalTeamGoals: data.nationalTeamGoals ?? 0,
      developmentPoints: data.developmentPoints ?? (isPlayer ? 5 : undefined),
      perks: data.perks || (isPlayer ? ['Finesse Shot', 'Relentless'] : undefined),
      attributes: data.attributes || (isPlayer ? {
        pace: 82,
        shooting: 78,
        passing: 75,
        dribbling: 80,
        defending: 40,
        physical: 74,
      } : undefined),

      seasons: data.seasons || [
        {
          season: data.startingSeason || '2025/26',
          club: data.club || 'Club',
          trophiesWon: [],
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCareers((prev) => [newCareer, ...prev]);
    setActiveCareerId(newCareer.id);
    showToast(`Career "${newCareer.name}" created!`, 'success');
    return newCareer;
  };

  const updateCareer = (id: string, updates: Partial<Career>) => {
    setCareers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Career details updated', 'success');
  };

  const deleteCareer = (id: string) => {
    if (careers.length <= 1) {
      showToast('Cannot delete your only career!', 'warning');
      return;
    }
    const filtered = careers.filter((c) => c.id !== id);
    setCareers(filtered);
    // clean up associated data
    setPlayers((prev) => prev.filter((p) => p.careerId !== id));
    setMatches((prev) => prev.filter((m) => m.careerId !== id));
    setTransfers((prev) => prev.filter((t) => t.careerId !== id));
    setTrophies((prev) => prev.filter((t) => t.careerId !== id));
    setAwards((prev) => prev.filter((a) => a.careerId !== id));
    setRecords((prev) => prev.filter((r) => r.careerId !== id));
    setJournal((prev) => prev.filter((j) => j.careerId !== id));

    if (activeCareerId === id) {
      setActiveCareerId(filtered[0].id);
    }
    showToast('Career removed', 'info');
  };

  const addSeason = (careerId: string, seasonName: string) => {
    const c = careers.find((car) => car.id === careerId);
    if (!c) return;
    if (c.seasons.some((s) => s.season === seasonName)) {
      showToast(`Season ${seasonName} already exists!`, 'warning');
      return;
    }
    const newSeasonSummary: Career['seasons'][0] = {
      season: seasonName,
      club: c.club,
      trophiesWon: [],
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };
    updateCareer(careerId, {
      currentSeason: seasonName,
      seasons: [...c.seasons, newSeasonSummary],
    });
    setSelectedSeason(seasonName);
    showToast(`Season ${seasonName} initiated!`, 'success');
  };

  const addSeasonRecord = (record: SeasonSummary) => {
    if (!activeCareer) return;
    const existingIndex = activeCareer.seasons.findIndex((s) => s.season === record.season);
    let updatedSeasons = [...activeCareer.seasons];
    if (existingIndex >= 0) {
      updatedSeasons[existingIndex] = { ...updatedSeasons[existingIndex], ...record };
    } else {
      updatedSeasons.push(record);
    }
    updateCareer(activeCareer.id, {
      seasons: updatedSeasons,
      currentSeason: record.season,
    });
    setSelectedSeason(record.season);
    showToast(`Season record for ${record.season} saved!`, 'success');
  };

  // Player CRUD
  const addPlayer = (playerData: Omit<Player, 'id' | 'careerId'>): Player => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setPlayers((prev) => [...prev, newPlayer]);
    showToast(`Added ${newPlayer.name} to squad`, 'success');
    return newPlayer;
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Player updated', 'success');
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    showToast('Player removed from squad', 'info');
  };

  // Match CRUD
  const addMatch = (matchData: Omit<Match, 'id' | 'careerId'>): Match => {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setMatches((prev) => [newMatch, ...prev]);

    // If player mode, update player rating / stats if entered
    if (activeCareer?.mode === 'player') {
      const addedGoals = newMatch.playerGoals || 0;
      const addedAssists = newMatch.playerAssists || 0;
      const motm = newMatch.playerMOTM;

      // Update manager confidence
      let confChange = 0;
      if (newMatch.result === 'W') confChange += 3;
      if (newMatch.result === 'L') confChange -= 2;
      if (newMatch.objectiveCompleted) confChange += 4;
      if ((newMatch.playerRating || 0) >= 8.0) confChange += 3;
      if (motm) confChange += 4;

      const newConfidence = Math.min(100, Math.max(10, (activeCareer.managerConfidence || 80) + confChange));
      
      // Check for development points boost
      let devPoints = activeCareer.developmentPoints || 0;
      if (addedGoals + addedAssists >= 2 || (newMatch.playerRating || 0) >= 8.5) {
        devPoints += 1;
      }

      updateCareer(activeCareer.id, {
        managerConfidence: newConfidence,
        developmentPoints: devPoints,
      });
    }

    showToast(`Match vs ${newMatch.opponent} logged (${newMatch.ourGoals}-${newMatch.opponentGoals})`, 'success');
    return newMatch;
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Match updated', 'success');
  };

  const deleteMatch = (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    showToast('Match deleted', 'info');
  };

  // Transfer CRUD
  const addTransfer = (transferData: Omit<Transfer, 'id' | 'careerId'>): Transfer => {
    const newTransfer: Transfer = {
      ...transferData,
      id: `transfer-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setTransfers((prev) => [newTransfer, ...prev]);

    // Update budget if manager mode
    if (activeCareer?.mode === 'manager' && newTransfer.status === 'Completed') {
      const currentBudget = activeCareer.transferBudget || 0;
      let newBudget = currentBudget;
      if (newTransfer.type === 'IN') {
        newBudget = Math.max(0, currentBudget - newTransfer.fee);
      } else if (newTransfer.type === 'OUT') {
        newBudget = currentBudget + newTransfer.fee;
      }
      updateCareer(activeCareer.id, { transferBudget: newBudget });
    }

    showToast(`Transfer for ${newTransfer.player} recorded`, 'success');
    return newTransfer;
  };

  const updateTransfer = (id: string, updates: Partial<Transfer>) => {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Transfer updated', 'success');
  };

  const deleteTransfer = (id: string) => {
    setTransfers((prev) => prev.filter((t) => t.id !== id));
    showToast('Transfer removed', 'info');
  };

  // Trophy CRUD
  const addTrophy = (trophyData: Omit<Trophy, 'id' | 'careerId'>): Trophy => {
    const newTrophy: Trophy = {
      ...trophyData,
      id: `trophy-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setTrophies((prev) => [newTrophy, ...prev]);

    // Also append to career season summary if matching
    if (activeCareer) {
      const updatedSeasons = activeCareer.seasons.map((s) => {
        if (s.season === newTrophy.season) {
          return {
            ...s,
            trophiesWon: Array.from(new Set([...s.trophiesWon, newTrophy.name])),
          };
        }
        return s;
      });
      updateCareer(activeCareer.id, { seasons: updatedSeasons });
    }

    showToast(`🏆 Trophy "${newTrophy.name}" added to cabinet!`, 'success');
    return newTrophy;
  };

  const updateTrophy = (id: string, updates: Partial<Trophy>) => {
    setTrophies((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Trophy updated', 'success');
  };

  const deleteTrophy = (id: string) => {
    setTrophies((prev) => prev.filter((t) => t.id !== id));
    showToast('Trophy removed from cabinet', 'info');
  };

  // Award CRUD
  const addAward = (awardData: Omit<Award, 'id' | 'careerId'>): Award => {
    const newAward: Award = {
      ...awardData,
      id: `award-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setAwards((prev) => [newAward, ...prev]);
    showToast(`Award "${newAward.name}" logged!`, 'success');
    return newAward;
  };

  const updateAward = (id: string, updates: Partial<Award>) => {
    setAwards((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Award updated', 'success');
  };

  const deleteAward = (id: string) => {
    setAwards((prev) => prev.filter((a) => a.id !== id));
    showToast('Award removed', 'info');
  };

  // Record CRUD
  const addRecord = (recordData: Omit<RecordItem, 'id' | 'careerId'>): RecordItem => {
    const newRecord: RecordItem = {
      ...recordData,
      id: `record-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setRecords((prev) => [newRecord, ...prev]);
    showToast(`Record "${newRecord.title}" saved!`, 'success');
    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<RecordItem>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Record updated', 'success');
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Record removed', 'info');
  };

  // Journal CRUD
  const addJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'careerId'>): JournalEntry => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `journal-${Date.now()}`,
      careerId: activeCareer?.id || '',
    };
    setJournal((prev) => [newEntry, ...prev]);
    showToast(`Journal story "${newEntry.title}" published!`, 'success');
    return newEntry;
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournal((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    showToast('Journal entry updated', 'success');
  };

  const deleteJournalEntry = (id: string) => {
    setJournal((prev) => prev.filter((j) => j.id !== id));
    showToast('Journal entry deleted', 'info');
  };

  // Player Career Specific Upgrade Attributes
  const upgradeAttribute = (attribute: keyof PlayerAttributes, amount: number = 1) => {
    if (!activeCareer || activeCareer.mode !== 'player') return;
    const currentAttrs = activeCareer.attributes || {
      pace: 80,
      shooting: 80,
      passing: 80,
      dribbling: 80,
      defending: 50,
      physical: 75,
    };
    const currentPoints = activeCareer.developmentPoints || 0;
    if (currentPoints < 1) {
      showToast('Not enough Development Points! Play matches to earn more.', 'warning');
      return;
    }

    const currentVal = currentAttrs[attribute];
    if (currentVal >= 99) {
      showToast(`${String(attribute).toUpperCase()} is already at max 99!`, 'info');
      return;
    }

    const newAttrs: PlayerAttributes = {
      ...currentAttrs,
      [attribute]: Math.min(99, currentVal + amount),
    };

    // Calculate updated overall based on rough position weighting
    const baseAvg = Math.round(
      (newAttrs.pace * 0.2 +
        newAttrs.shooting * 0.25 +
        newAttrs.dribbling * 0.25 +
        newAttrs.passing * 0.15 +
        newAttrs.physical * 0.1 +
        newAttrs.defending * 0.05)
    );
    const newOvr = Math.max(activeCareer.playerOverall || 80, Math.min(99, baseAvg));

    updateCareer(activeCareer.id, {
      attributes: newAttrs,
      playerOverall: newOvr,
      developmentPoints: currentPoints - 1,
    });
    showToast(`Upgraded ${String(attribute).toUpperCase()} to ${newAttrs[attribute]}!`, 'success');
  };

  const addPerk = (perk: string) => {
    if (!activeCareer || activeCareer.mode !== 'player') return;
    const currentPerks = activeCareer.perks || [];
    if (currentPerks.includes(perk)) return;
    if (currentPerks.length >= 5) {
      showToast('Maximum 5 PlayStyles/Perks active at once', 'warning');
      return;
    }
    updateCareer(activeCareer.id, {
      perks: [...currentPerks, perk],
    });
    showToast(`Equipped PlayStyle: ${perk}`, 'success');
  };

  const removePerk = (perk: string) => {
    if (!activeCareer || activeCareer.mode !== 'player') return;
    const currentPerks = activeCareer.perks || [];
    updateCareer(activeCareer.id, {
      perks: currentPerks.filter((p) => p !== perk),
    });
    showToast(`Unequipped PlayStyle: ${perk}`, 'info');
  };

  // Utilities
  const formatCurrency = (value: number): string => {
    const sym = activeCareer?.currency || '€';
    if (value >= 1_000_000) {
      return `${sym}${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${sym}${(value / 1_000).toFixed(0)}K`;
    }
    return `${sym}${value.toLocaleString()}`;
  };

  const exportCareerJson = (careerId?: string) => {
    const targetId = careerId || activeCareer?.id;
    const careerToExport = careers.find((c) => c.id === targetId);
    if (!careerToExport) return;

    const bundle = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      career: careerToExport,
      players: players.filter((p) => p.careerId === targetId),
      matches: matches.filter((m) => m.careerId === targetId),
      transfers: transfers.filter((t) => t.careerId === targetId),
      trophies: trophies.filter((t) => t.careerId === targetId),
      awards: awards.filter((a) => a.careerId === targetId),
      records: records.filter((r) => r.careerId === targetId),
      journal: journal.filter((j) => j.careerId === targetId),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${careerToExport.name.replace(/\s+/g, '_')}_CareerTracker.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Career backup downloaded as JSON', 'success');
  };

  const importCareerJson = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.career || !data.career.name) {
        showToast('Invalid career file format', 'warning');
        return false;
      }
      const importedCareer: Career = {
        ...data.career,
        id: `career-imported-${Date.now()}`,
        name: `${data.career.name} (Imported)`,
      };

      const importedPlayers: Player[] = (data.players || []).map((p: Player) => ({
        ...p,
        id: `p-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedMatches: Match[] = (data.matches || []).map((m: Match) => ({
        ...m,
        id: `m-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedTransfers: Transfer[] = (data.transfers || []).map((t: Transfer) => ({
        ...t,
        id: `t-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedTrophies: Trophy[] = (data.trophies || []).map((tr: Trophy) => ({
        ...tr,
        id: `tr-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedAwards: Award[] = (data.awards || []).map((a: Award) => ({
        ...a,
        id: `a-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedRecords: RecordItem[] = (data.records || []).map((r: RecordItem) => ({
        ...r,
        id: `r-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      const importedJournal: JournalEntry[] = (data.journal || []).map((j: JournalEntry) => ({
        ...j,
        id: `j-imp-${Math.random()}`,
        careerId: importedCareer.id,
      }));

      setCareers((prev) => [importedCareer, ...prev]);
      setPlayers((prev) => [...prev, ...importedPlayers]);
      setMatches((prev) => [...prev, ...importedMatches]);
      setTransfers((prev) => [...prev, ...importedTransfers]);
      setTrophies((prev) => [...prev, ...importedTrophies]);
      setAwards((prev) => [...prev, ...importedAwards]);
      setRecords((prev) => [...prev, ...importedRecords]);
      setJournal((prev) => [...prev, ...importedJournal]);
      setActiveCareerId(importedCareer.id);

      showToast(`Successfully restored "${importedCareer.name}"!`, 'success');
      return true;
    } catch (err) {
      console.error('Failed to parse career JSON:', err);
      showToast('Error reading imported file', 'warning');
      return false;
    }
  };

  const resetToDemoData = () => {
    setCareers(INITIAL_CAREERS);
    setActiveCareerId(INITIAL_CAREERS[0].id);
    setPlayers(INITIAL_PLAYERS);
    setMatches(INITIAL_MATCHES);
    setTransfers(INITIAL_TRANSFERS);
    setTrophies(INITIAL_TROPHIES);
    setAwards(INITIAL_AWARDS);
    setRecords(INITIAL_RECORDS);
    setJournal(INITIAL_JOURNAL);
    showToast('Reset back to official demo careers', 'info');
  };

  return (
    <CareerContext.Provider
      value={{
        careers,
        activeCareerId,
        activeCareer,
        setActiveCareerId,
        selectedSeason,
        setSelectedSeason,
        createCareer,
        updateCareer,
        deleteCareer,
        addSeason,
        addSeasonRecord,

        players: allCareerPlayers,
        allCareerPlayers,
        matches: filteredMatches,
        allCareerMatches,
        transfers: filteredTransfers,
        allCareerTransfers,
        trophies: filteredTrophies,
        allCareerTrophies,
        awards: filteredAwards,
        allCareerAwards,
        records: careerRecords,
        journal: careerJournal,

        addPlayer,
        updatePlayer,
        deletePlayer,

        addMatch,
        updateMatch,
        deleteMatch,

        addTransfer,
        updateTransfer,
        deleteTransfer,

        addTrophy,
        updateTrophy,
        deleteTrophy,

        addAward,
        updateAward,
        deleteAward,

        addRecord,
        updateRecord,
        deleteRecord,

        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,

        upgradeAttribute,
        addPerk,
        removePerk,

        formatCurrency,
        exportCareerJson,
        importCareerJson,
        resetToDemoData,

        toasts,
        toast: toasts[0] || null,
        showToast,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};

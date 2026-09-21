import React, { useState, useMemo } from 'react';
import { useCareer } from '../../context/CareerContext';
import { FC27_DATABASE, FC27DatabasePlayer, LEAGUES_LIST, PLAYSTYLE_PLUS_LIST } from '../../data/fc27Database';
import { getClubDetails, getPlayerPhoto } from '../../utils/assets';
import { sound } from '../../utils/soundEffects';
import { Position } from '../../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Shield,
  Target,
  Users,
  Compass,
  DollarSign,
  ChevronRight,
  ArrowRightLeft,
  X,
  Flame,
  LayoutGrid,
  List,
  Scale,
  Award,
  Clock,
} from 'lucide-react';

interface FC27DatabasePageProps {
  onOpenCardModal?: (player: any) => void;
  onNavigate?: (page: any) => void;
}

type TabMode = 'database' | 'shortlist' | 'wonderkids' | 'bargains' | 'compare';

export const FC27DatabasePage: React.FC<FC27DatabasePageProps> = ({
  onOpenCardModal,
  onNavigate,
}) => {
  const {
    activeCareer,
    players: currentSquad,
    addPlayer,
    addTransfer,
    addJournalEntry,
    updateCareer,
    formatCurrency,
    showToast,
    selectedSeason,
  } = useCareer();

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabMode>('database');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [posCategory, setPosCategory] = useState<'ALL' | 'ATT' | 'MID' | 'DEF' | 'GK'>('ALL');
  const [specificPos, setSpecificPos] = useState<string>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('All Leagues');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<string>('All PlayStyles+');
  const [minOvr, setMinOvr] = useState<number>(60);
  const [minPot, setMinPot] = useState<number>(75);
  const [ageCategory, setAgeCategory] = useState<'ALL' | 'U21' | 'U25' | 'PRIME' | 'VET'>('ALL');
  const [affordableOnly, setAffordableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    'ovr_desc' | 'pot_desc' | 'val_desc' | 'val_asc' | 'growth_desc' | 'pace_desc' | 'wage_desc'
  >('ovr_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Shortlist (Bookmarked players IDs stored in state)
  const [shortlistIds, setShortlistIds] = useState<string[]>(['db-yamal', 'db-mastantuono', 'db-yoro']);

  // Comparison State (array of up to 2 players)
  const [comparePlayers, setComparePlayers] = useState<FC27DatabasePlayer[]>([]);

  // Transfer Negotiation Modal
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<FC27DatabasePlayer | null>(null);
  const [offerFee, setOfferFee] = useState<number>(0);
  const [offerWage, setOfferWage] = useState<number>(0);
  const [offerRole, setOfferRole] = useState<'Crucial' | 'Important' | 'Rotation' | 'Prospect'>('Important');
  const [offerDuration, setOfferDuration] = useState<number>(4);
  const [offerType, setOfferType] = useState<'PERMANENT' | 'LOAN'>('PERMANENT');

  // Check if player is already signed to user's club
  const isAlreadySigned = (playerName: string) => {
    return currentSquad.some(
      (p) => p.name.toLowerCase() === playerName.toLowerCase()
    );
  };

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    setShortlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (player: FC27DatabasePlayer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    setComparePlayers((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) {
        return prev.filter((p) => p.id !== player.id);
      }
      if (prev.length >= 2) {
        showToast('Comparing max 2 players. Replaced first pick.', 'info');
        return [prev[1], player];
      }
      return [...prev, player];
    });
  };

  // Open Negotiation Drawer/Modal
  const handleOpenNegotiate = (player: FC27DatabasePlayer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    setNegotiatingPlayer(player);
    setOfferFee(player.value);
    setOfferWage(player.wage);
    setOfferRole(player.overall >= 84 ? 'Crucial' : player.overall >= 79 ? 'Important' : 'Rotation');
    setOfferDuration(4);
    setOfferType('PERMANENT');
  };

  // Execute Signing
  const handleConfirmTransfer = () => {
    if (!negotiatingPlayer || !activeCareer) return;

    const currentBudget = activeCareer.transferBudget || 0;
    const isFree = offerType === 'LOAN';
    const totalCost = isFree ? 0 : offerFee;

    if (!isFree && currentBudget < totalCost) {
      sound.playBuzzer();
      showToast('Transfer budget insufficient for this offer!', 'warning');
      return;
    }

    // Play Sound & Register Transfer
    sound.playCashRegister();
    sound.playFanfare();

    // 1. Add player to Squad
    addPlayer({
      name: negotiatingPlayer.name,
      number: Math.floor(Math.random() * 30) + 12,
      position: negotiatingPlayer.position,
      secondaryPositions: negotiatingPlayer.secondaryPositions,
      age: negotiatingPlayer.age,
      nationality: negotiatingPlayer.nationality,
      overall: negotiatingPlayer.overall,
      potential: negotiatingPlayer.potential,
      growth: 0,
      value: negotiatingPlayer.value,
      wage: offerWage,
      contractExpiry: `${2026 + offerDuration}`,
      role: offerRole,
      status: 'Fit',
      lineupStatus: offerRole === 'Crucial' ? 'starter' : 'bench',
      appearances: 0,
      goals: 0,
      assists: 0,
      avgRating: 7.0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      notes: `Signed from ${negotiatingPlayer.club}. PlayStyle+: ${negotiatingPlayer.playstylePlus}`,
    });

    // 2. Add Transfer Record (Context will update transferBudget automatically)
    addTransfer({
      player: negotiatingPlayer.name,
      type: isFree ? 'LOAN_IN' : 'IN',
      fromClub: negotiatingPlayer.club,
      toClub: activeCareer.club,
      fee: totalCost,
      wage: offerWage,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      notes: isFree
        ? `1-year loan signed for ${activeCareer.club}`
        : `Blockbuster FC 27 acquisition for ${formatCurrency(totalCost)} (${offerRole} role)`,
    });

    // 3. Add Breaking News Story to Journal
    addJournalEntry({
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      date: new Date().toISOString().split('T')[0],
      title: `BREAKING: ${activeCareer.club} complete ${negotiatingPlayer.name} blockbuster signing!`,
      category: 'transfer',
      headline: `OFFICIAL: ${negotiatingPlayer.name} puts pen to paper on ${offerDuration}-year contract at ${activeCareer.club}`,
      content: `In a landmark deal in the FC 27 market, ${activeCareer.club} have announced the signing of ${negotiatingPlayer.name} (${negotiatingPlayer.overall} OVR, ${negotiatingPlayer.potential} POT) from ${negotiatingPlayer.club}. The deal is valued at ${formatCurrency(totalCost)} with weekly wages of ${formatCurrency(offerWage)}. The ${negotiatingPlayer.nationality} sensation brings their trademark ${negotiatingPlayer.playstylePlus} to bolster the squad.`,
    });

    showToast(`🤝 Signed ${negotiatingPlayer.name} to ${activeCareer.club}!`, 'success');
    setNegotiatingPlayer(null);
  };

  // Filter and Sort Engine
  const filteredPlayers = useMemo(() => {
    return FC27_DATABASE.filter((player) => {
      // Tab Filters
      if (activeTab === 'shortlist' && !shortlistIds.includes(player.id)) return false;
      if (activeTab === 'wonderkids' && (!player.isWonderkid || player.potential < 88)) return false;
      if (activeTab === 'bargains' && (player.value > 30000000 || player.potential < 86)) return false;

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = player.name.toLowerCase().includes(q);
        const matchClub = player.club.toLowerCase().includes(q);
        const matchNation = player.nationality.toLowerCase().includes(q);
        const matchPos = player.position.toLowerCase().includes(q);
        if (!matchName && !matchClub && !matchNation && !matchPos) return false;
      }

      // Position Category
      if (posCategory === 'ATT') {
        if (!['ST', 'CF', 'LW', 'RW'].includes(player.position)) return false;
      } else if (posCategory === 'MID') {
        if (!['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(player.position)) return false;
      } else if (posCategory === 'DEF') {
        if (!['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(player.position)) return false;
      } else if (posCategory === 'GK') {
        if (player.position !== 'GK') return false;
      }

      // Specific Position
      if (specificPos !== 'ALL') {
        if (player.position !== specificPos && !player.secondaryPositions.includes(specificPos as Position)) {
          return false;
        }
      }

      // League
      if (selectedLeague !== 'All Leagues' && player.league !== selectedLeague) {
        return false;
      }

      // Playstyle+
      if (selectedPlaystyle !== 'All PlayStyles+' && player.playstylePlus !== selectedPlaystyle) {
        return false;
      }

      // Ratings
      if (player.overall < minOvr) return false;
      if (player.potential < minPot) return false;

      // Age Category
      if (ageCategory === 'U21' && player.age > 21) return false;
      if (ageCategory === 'U25' && (player.age < 22 || player.age > 25)) return false;
      if (ageCategory === 'PRIME' && (player.age < 26 || player.age > 29)) return false;
      if (ageCategory === 'VET' && player.age < 30) return false;

      // Affordable Only
      if (affordableOnly && activeCareer?.transferBudget) {
        if (player.value > activeCareer.transferBudget) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'ovr_desc':
          return b.overall - a.overall;
        case 'pot_desc':
          return b.potential - a.potential;
        case 'val_desc':
          return b.value - a.value;
        case 'val_asc':
          return a.value - b.value;
        case 'growth_desc':
          return b.potential - b.overall - (a.potential - a.overall);
        case 'pace_desc':
          return b.pace - a.pace;
        case 'wage_desc':
          return b.wage - a.wage;
        default:
          return b.overall - a.overall;
      }
    });
  }, [
    activeTab,
    shortlistIds,
    searchQuery,
    posCategory,
    specificPos,
    selectedLeague,
    selectedPlaystyle,
    minOvr,
    minPot,
    ageCategory,
    affordableOnly,
    sortBy,
    activeCareer?.transferBudget,
  ]);

  const warChest = activeCareer?.transferBudget ?? 0;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER: FC 27 BROADCAST BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a101f] via-[#070c17] to-[#04070f] border border-[#1e293b] p-6 sm:p-7 shadow-2xl">
        {/* Glow accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#05f1cd]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] text-[11px] font-black uppercase tracking-wider border border-[#ccff00]/30 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                <Sparkles className="w-3 h-3" />
                FC 27 Master Database & Transfer Market
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {FC27_DATABASE.length} World Players Indexed
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight">
              Scout, Filter & Sign For Your Squad
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Search real FC 27 star players, filter by rating, PlayStyles+, wonderkid ceilings, or budget. Negotiate contracts, place transfer bids, or compare players side-by-side.
            </p>
          </div>

          {/* Transfer War Chest Quick Stats */}
          <div className="flex items-center gap-3 bg-[#0d1527]/90 border border-[#1e293b] rounded-2xl p-4 shrink-0 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Transfer War Chest ({activeCareer?.club})
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#ccff00]">
                {formatCurrency(warChest)}
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY SUB-NAV TABS */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#1e293b]">
          {[
            { id: 'database', label: 'All Players', icon: Users, count: FC27_DATABASE.length },
            { id: 'shortlist', label: 'My Shortlist', icon: Star, count: shortlistIds.length },
            { id: 'wonderkids', label: 'Wonderkids (POT 88+)', icon: Flame, count: FC27_DATABASE.filter(p => p.isWonderkid).length },
            { id: 'bargains', label: 'Bargains (< €30M)', icon: DollarSign },
            { id: 'compare', label: `Compare (${comparePlayers.length}/2)`, icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as TabMode);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ccff00] to-[#b8e600] text-[#050811] shadow-[0_0_15px_rgba(204,255,0,0.3)] font-black'
                    : 'bg-[#0b1220] hover:bg-[#121c32] text-slate-300 border border-[#1e293b]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isActive ? 'bg-black/20 text-[#050811]' : 'bg-[#152037] text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* HEAD-TO-HEAD COMPARE DRAWER (IF ACTIVE) */}
      {activeTab === 'compare' && (
        <div className="p-6 bg-gradient-to-br from-[#0c1426] to-[#070b16] border border-[#1e293b] rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#ccff00]" />
              <h3 className="text-lg font-black font-display text-white">Head-to-Head Comparison</h3>
            </div>
            {comparePlayers.length > 0 && (
              <button
                onClick={() => setComparePlayers([])}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
              >
                <X className="w-3.5 h-3.5" />
                Clear comparison
              </button>
            )}
          </div>

          {comparePlayers.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#060a14]/80 border border-dashed border-[#1e293b] space-y-3">
              <Scale className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Select any 2 players to compare</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click the "Compare" icon on any player card below to see side-by-side stats, pace, physical, and value differential.
              </p>
            </div>
          ) : comparePlayers.length === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 */}
              <div className="p-5 bg-[#0a101f] border border-[#1e293b] rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#ccff00]/40">
                    <img
                      src={getPlayerPhoto(comparePlayers[0].name, comparePlayers[0].photo)}
                      alt={comparePlayers[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">{comparePlayers[0].name}</span>
                    <p className="text-xs text-slate-400">{comparePlayers[0].club} • {comparePlayers[0].position}</p>
                    <span className="text-xs text-[#ccff00] font-black">{comparePlayers[0].overall} OVR | {comparePlayers[0].potential} POT</span>
                  </div>
                </div>
              </div>

              {/* Player 2 Slot Placeholder */}
              <div className="p-8 text-center rounded-2xl bg-[#060a14]/60 border border-dashed border-[#1e293b] flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-slate-400">Select 1 more player from the list below to complete comparison</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparePlayers.map((p, idx) => {
                const other = comparePlayers[idx === 0 ? 1 : 0];
                return (
                  <div
                    key={p.id}
                    className="p-6 bg-[#0a101f] border border-[#1e293b] rounded-2xl space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#ccff00]/50 shadow-md">
                          <img
                            src={getPlayerPhoto(p.name, p.photo)}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xl font-black font-display text-white">{p.name}</h4>
                          <p className="text-xs text-slate-400">{p.club} • {p.league}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-[#ccff00]/20 text-[#ccff00] font-black text-xs">
                              {p.overall} OVR
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black text-xs">
                              {p.potential} POT
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenNegotiate(p)}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#ccff00] to-[#b8e600] text-[#050811] text-xs font-black rounded-xl hover:brightness-110 transition shadow"
                      >
                        Sign
                      </button>
                    </div>

                    {/* Stats Comparison Grid */}
                    <div className="space-y-2.5 text-xs">
                      {[
                        { label: 'Pace', val: p.pace, otherVal: other.pace },
                        { label: 'Shooting', val: p.shooting, otherVal: other.shooting },
                        { label: 'Passing', val: p.passing, otherVal: other.passing },
                        { label: 'Dribbling', val: p.dribbling, otherVal: other.dribbling },
                        { label: 'Defending', val: p.defending, otherVal: other.defending },
                        { label: 'Physical', val: p.physical, otherVal: other.physical },
                      ].map((st) => {
                        const diff = st.val - st.otherVal;
                        return (
                          <div key={st.label} className="flex items-center justify-between">
                            <span className="text-slate-400 font-bold">{st.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-white">{st.val}</span>
                              {diff !== 0 && (
                                <span
                                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                    diff > 0
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-rose-500/20 text-rose-400'
                                  }`}
                                >
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Market Value:</span>
                      <span className="font-mono font-black text-[#ccff00]">{formatCurrency(p.value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FILTER & SEARCH MATRIX */}
      <div className="p-5 bg-gradient-to-br from-[#0c1426]/90 via-[#090f1d]/95 to-[#060a14]/95 border border-[#1e293b] rounded-3xl space-y-4 shadow-xl">
        {/* Row 1: Search & Position Category Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by player name, club (e.g. Real Madrid, Arsenal), nation, or position..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#070b14] border border-[#1e293b] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Position Category Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-[#070b14] border border-[#1e293b] rounded-2xl text-xs shrink-0 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Positions' },
              { id: 'ATT', label: 'Attackers' },
              { id: 'MID', label: 'Midfielders' },
              { id: 'DEF', label: 'Defenders' },
              { id: 'GK', label: 'Goalkeepers' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPosCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  posCategory === cat.id
                    ? 'bg-[#ccff00] text-[#050811] shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Deep Filters (League, Specific Pos, Playstyle, Age, Sort) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Specific Position */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Role Position
            </label>
            <select
              value={specificPos}
              onChange={(e) => setSpecificPos(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              <option value="ALL">Any Specific</option>
              <option value="ST">ST (Striker)</option>
              <option value="CF">CF (Center Forward)</option>
              <option value="LW">LW (Left Wing)</option>
              <option value="RW">RW (Right Wing)</option>
              <option value="CAM">CAM (Attacking Mid)</option>
              <option value="CM">CM (Central Mid)</option>
              <option value="CDM">CDM (Defensive Mid)</option>
              <option value="CB">CB (Center Back)</option>
              <option value="LB">LB (Left Back)</option>
              <option value="RB">RB (Right Back)</option>
              <option value="GK">GK (Goalkeeper)</option>
            </select>
          </div>

          {/* League */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              League
            </label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              {LEAGUES_LIST.map((lg) => (
                <option key={lg} value={lg}>
                  {lg}
                </option>
              ))}
            </select>
          </div>

          {/* Playstyle+ */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Signature PlayStyle+
            </label>
            <select
              value={selectedPlaystyle}
              onChange={(e) => setSelectedPlaystyle(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              {PLAYSTYLE_PLUS_LIST.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Age Profile
            </label>
            <select
              value={ageCategory}
              onChange={(e) => setAgeCategory(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              <option value="ALL">All Ages</option>
              <option value="U21">U21 Wonderkids (16-21)</option>
              <option value="U25">Young Talents (22-25)</option>
              <option value="PRIME">Peak Prime (26-29)</option>
              <option value="VET">Veterans (30+)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Sort Matrix
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              <option value="ovr_desc">Highest Overall (OVR)</option>
              <option value="pot_desc">Highest Potential (POT)</option>
              <option value="growth_desc">Highest Growth (+POT)</option>
              <option value="val_desc">Market Value (High to Low)</option>
              <option value="val_asc">Market Value (Bargains First)</option>
              <option value="pace_desc">Fastest Pace (PAC)</option>
              <option value="wage_desc">Highest Wage</option>
            </select>
          </div>

          {/* Min OVR Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>Min OVR</span>
              <span className="text-[#ccff00] font-mono font-black">{minOvr}+</span>
            </div>
            <input
              type="range"
              min="60"
              max="90"
              value={minOvr}
              onChange={(e) => setMinOvr(Number(e.target.value))}
              className="w-full accent-[#ccff00]"
            />
          </div>
        </div>

        {/* Row 3: Quick Toggles (Affordable Only, View Mode) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1e293b] text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAffordableOnly(!affordableOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition ${
                affordableOnly
                  ? 'bg-[#ccff00]/20 text-[#ccff00] border-[#ccff00]/40'
                  : 'bg-[#070b14] text-slate-400 border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Affordable with my budget (&le; {formatCurrency(warChest)})</span>
            </button>

            <span className="text-slate-400 font-mono text-[11px]">
              Showing <span className="text-white font-bold">{filteredPlayers.length}</span> players
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#070b14] border border-[#1e293b] rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-[#ccff00] text-[#050811]' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-[#ccff00] text-[#050811]' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS LIST / GRID */}
      {filteredPlayers.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#090e1c] border border-dashed border-[#1e293b] p-6 space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No players matching criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, minimum rating sliders, or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPosCategory('ALL');
              setSpecificPos('ALL');
              setSelectedLeague('All Leagues');
              setSelectedPlaystyle('All PlayStyles+');
              setMinOvr(60);
              setMinPot(75);
              setAgeCategory('ALL');
              setAffordableOnly(false);
            }}
            className="px-4 py-2 bg-[#121c32] hover:bg-[#1a2744] text-white text-xs font-bold rounded-xl border border-[#1e293b] transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => {
            const club = getClubDetails(player.club);
            const inSquad = isAlreadySigned(player.name);
            const isShortlisted = shortlistIds.includes(player.id);
            const isCompared = comparePlayers.some((p) => p.id === player.id);
            const growth = player.potential - player.overall;
            const photoUrl = getPlayerPhoto(player.name, player.photo);

            return (
              <div
                key={player.id}
                onClick={() => onOpenCardModal?.(player)}
                className="group relative rounded-3xl bg-gradient-to-b from-[#0e1627] via-[#090f1d] to-[#060a14] border border-[#1e293b] hover:border-[#ccff00]/50 transition-all duration-200 p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  {/* Rating Shield */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-[#ccff00]/20 to-[#060a14] border border-[#ccff00]/40 flex flex-col items-center justify-center p-1 text-center shadow">
                      <span className="text-xl font-black font-display text-white leading-none">
                        {player.overall}
                      </span>
                      <span className="text-[10px] font-black text-[#ccff00] uppercase mt-0.5">
                        {player.position}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-300">
                          POT {player.potential}
                        </span>
                        {growth > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                            +{growth}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Age {player.age} • {player.nationality}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Shortlist & Compare Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => toggleCompare(player, e)}
                      title="Compare with another player"
                      className={`p-1.5 rounded-xl border transition ${
                        isCompared
                          ? 'bg-[#05f1cd] text-black border-[#05f1cd]'
                          : 'bg-[#0a101f] text-slate-400 border-[#1e293b] hover:text-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleShortlist(player.id, e)}
                      title="Add to Shortlist"
                      className={`p-1.5 rounded-xl border transition ${
                        isShortlisted
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-[#0a101f] text-slate-400 border-[#1e293b] hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Player Photo & Identity */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#1e293b] group-hover:border-[#ccff00]/40 transition shrink-0 bg-[#060a14]">
                    <img
                      src={photoUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black font-display text-white truncate">
                        {player.name}
                      </h3>
                      {club.logo && (
                        <img
                          src={club.logo}
                          alt={player.club}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 object-contain shrink-0 drop-shadow"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{player.club}</p>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#05f1cd]/10 border border-[#05f1cd]/30 text-[10px] font-bold text-[#05f1cd] mt-1 truncate max-w-full">
                      <Zap className="w-3 h-3 shrink-0" />
                      <span className="truncate">{player.playstylePlus}</span>
                    </div>
                  </div>
                </div>

                {/* FC 27 Stats Row (PAC, SHO, PAS, DRI, DEF, PHY) */}
                <div className="grid grid-cols-6 gap-1 p-2 bg-[#070b14]/90 rounded-2xl border border-[#1e293b] text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block">PAC</span>
                    <span className="text-xs font-black text-white">{player.pace}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">SHO</span>
                    <span className="text-xs font-black text-white">{player.shooting}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">PAS</span>
                    <span className="text-xs font-black text-white">{player.passing}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">DRI</span>
                    <span className="text-xs font-black text-white">{player.dribbling}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">DEF</span>
                    <span className="text-xs font-black text-white">{player.defending}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">PHY</span>
                    <span className="text-xs font-black text-white">{player.physical}</span>
                  </div>
                </div>

                {/* Valuation & Action Footer */}
                <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valuation:</span>
                    <span className="text-xs font-mono font-bold text-[#ccff00]">
                      {formatCurrency(player.value)}
                    </span>
                  </div>

                  {inSquad ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Squad
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenNegotiate(player, e)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#ccff00] to-[#b8e600] hover:brightness-110 text-[#050811] rounded-xl text-xs font-black transition shadow-md shadow-[#ccff00]/20 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Player</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-3xl bg-[#090f1d] border border-[#1e293b] shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#070b16] text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Player</th>
                <th className="p-4">Pos</th>
                <th className="p-4 text-center">OVR</th>
                <th className="p-4 text-center">POT</th>
                <th className="p-4 text-center">Age</th>
                <th className="p-4">PlayStyle+</th>
                <th className="p-4 text-center">PAC</th>
                <th className="p-4 text-center">SHO</th>
                <th className="p-4 text-center">PAS</th>
                <th className="p-4 text-center">DRI</th>
                <th className="p-4 text-center">DEF</th>
                <th className="p-4 text-center">PHY</th>
                <th className="p-4 text-right">Value</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162033]">
              {filteredPlayers.map((player) => {
                const inSquad = isAlreadySigned(player.name);
                const club = getClubDetails(player.club);
                return (
                  <tr
                    key={player.id}
                    onClick={() => onOpenCardModal?.(player)}
                    className="hover:bg-[#0e1628] transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#1e293b] shrink-0">
                          <img
                            src={getPlayerPhoto(player.name, player.photo)}
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-black text-white">
                            <span>{player.name}</span>
                            {club.logo && (
                              <img
                                src={club.logo}
                                alt={player.club}
                                referrerPolicy="no-referrer"
                                className="w-3.5 h-3.5 object-contain"
                              />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{player.club} • {player.nationality}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-[#ccff00]">{player.position}</td>
                    <td className="p-4 text-center font-black font-mono text-white text-sm">{player.overall}</td>
                    <td className="p-4 text-center font-black font-mono text-emerald-400">{player.potential}</td>
                    <td className="p-4 text-center text-slate-300">{player.age}</td>
                    <td className="p-4 text-[#05f1cd] font-bold text-[11px]">{player.playstylePlus}</td>
                    <td className="p-4 text-center font-mono">{player.pace}</td>
                    <td className="p-4 text-center font-mono">{player.shooting}</td>
                    <td className="p-4 text-center font-mono">{player.passing}</td>
                    <td className="p-4 text-center font-mono">{player.dribbling}</td>
                    <td className="p-4 text-center font-mono">{player.defending}</td>
                    <td className="p-4 text-center font-mono">{player.physical}</td>
                    <td className="p-4 text-right font-mono font-bold text-[#ccff00]">
                      {formatCurrency(player.value)}
                    </td>
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {inSquad ? (
                        <span className="text-xs text-emerald-400 font-bold">In Squad</span>
                      ) : (
                        <button
                          onClick={(e) => handleOpenNegotiate(player, e)}
                          className="px-3 py-1.5 bg-[#ccff00] text-[#050811] text-xs font-black rounded-xl hover:brightness-110 transition shadow"
                        >
                          Sign
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TRANSFER NEGOTIATION DRAWER / MODAL */}
      {negotiatingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090f1d] border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0d1628] via-[#090f1d] to-[#0d1628] border-b border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#ccff00]/40">
                  <img
                    src={getPlayerPhoto(negotiatingPlayer.name, negotiatingPlayer.photo)}
                    alt={negotiatingPlayer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#ccff00] tracking-wider block">
                    Transfer & Contract Negotiations
                  </span>
                  <h3 className="text-xl font-black font-display text-white">
                    Sign {negotiatingPlayer.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setNegotiatingPlayer(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#162238]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#060a14] rounded-2xl border border-[#1e293b]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Club War Chest:</span>
                  <span className="text-base font-black font-mono text-[#ccff00]">
                    {formatCurrency(warChest)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Player Valuation:</span>
                  <span className="text-base font-black font-mono text-white">
                    {formatCurrency(negotiatingPlayer.value)}
                  </span>
                </div>
              </div>

              {/* Deal Type Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  Deal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOfferType('PERMANENT');
                      setOfferFee(negotiatingPlayer.value);
                    }}
                    className={`py-2.5 rounded-xl border font-bold transition ${
                      offerType === 'PERMANENT'
                        ? 'bg-[#ccff00] text-[#050811] border-[#ccff00] font-black'
                        : 'bg-[#070b14] text-slate-400 border-[#1e293b]'
                    }`}
                  >
                    Permanent Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferType('LOAN');
                      setOfferFee(0);
                    }}
                    className={`py-2.5 rounded-xl border font-bold transition ${
                      offerType === 'LOAN'
                        ? 'bg-[#ccff00] text-[#050811] border-[#ccff00] font-black'
                        : 'bg-[#070b14] text-slate-400 border-[#1e293b]'
                    }`}
                  >
                    1-Year Loan Agreement
                  </button>
                </div>
              </div>

              {/* Transfer Fee Offer Slider (Only for Permanent) */}
              {offerType === 'PERMANENT' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Agreed Transfer Fee:
                    </label>
                    <span className="font-mono font-black text-sm text-[#ccff00]">
                      {formatCurrency(offerFee)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(negotiatingPlayer.value * 0.7)}
                    max={Math.round(negotiatingPlayer.value * 1.5)}
                    step={500000}
                    value={offerFee}
                    onChange={(e) => setOfferFee(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Discount: {formatCurrency(Math.round(negotiatingPlayer.value * 0.7))}</span>
                    <span>Premium: {formatCurrency(Math.round(negotiatingPlayer.value * 1.5))}</span>
                  </div>
                </div>
              )}

              {/* Contract Terms: Role, Wage, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Squad Role */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Squad Role
                  </label>
                  <select
                    value={offerRole}
                    onChange={(e) => setOfferRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none"
                  >
                    <option value="Crucial">Crucial Starter</option>
                    <option value="Important">Important Player</option>
                    <option value="Rotation">Squad Rotation</option>
                    <option value="Prospect">Future Prospect</option>
                  </select>
                </div>

                {/* Weekly Wage */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Weekly Wage
                  </label>
                  <input
                    type="number"
                    value={offerWage}
                    onChange={(e) => setOfferWage(Number(e.target.value))}
                    step={5000}
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-mono font-bold focus:outline-none"
                  />
                </div>

                {/* Contract Duration */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Contract Length
                  </label>
                  <select
                    value={offerDuration}
                    onChange={(e) => setOfferDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none"
                  >
                    <option value={2}>2 Years (Until 2028)</option>
                    <option value={3}>3 Years (Until 2029)</option>
                    <option value={4}>4 Years (Until 2030)</option>
                    <option value={5}>5 Years (Until 2031)</option>
                  </select>
                </div>
              </div>

              {/* Budget Feasibility Alert */}
              {offerType === 'PERMANENT' && warChest < offerFee ? (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Transfer budget insufficient! You need {formatCurrency(offerFee - warChest)} more funds.</span>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                    <span>Club Finances Approved!</span>
                  </div>
                  <span className="font-mono font-bold text-xs">
                    Remaining: {formatCurrency(warChest - (offerType === 'PERMANENT' ? offerFee : 0))}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#060a14] border-t border-[#1e293b] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setNegotiatingPlayer(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={offerType === 'PERMANENT' && warChest < offerFee}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ccff00] to-[#b8e600] disabled:opacity-50 hover:brightness-110 text-[#050811] text-xs font-black rounded-xl transition shadow-lg shadow-[#ccff00]/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Sign to Squad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

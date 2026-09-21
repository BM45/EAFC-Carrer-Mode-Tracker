import React from 'react';
import { useCareer } from '../../context/CareerContext';
import { PageId } from '../Sidebar';
import { Match, Player, Transfer, Trophy } from '../../types';
import { ASSETS_3D, getClubDetails, getPlayerPhoto } from '../../utils/assets';
import {
  Trophy as TrophyIcon,
  Award,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Calendar,
  Shield,
  Activity,
  Zap,
  Target,
  Users,
  ChevronRight,
  Sparkles,
  Play,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onOpenMatchModal: () => void;
  onViewMatch: (match: Match) => void;
  onViewPlayer: (player: Player) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenMatchModal,
  onViewMatch,
  onViewPlayer,
}) => {
  const {
    activeCareer,
    matches,
    players,
    transfers,
    trophies,
    formatCurrency,
    selectedSeason,
  } = useCareer();

  const isPlayerMode = activeCareer?.mode === 'player';

  // Calculate high-level stats
  const totalMatches = matches.length;
  const wins = matches.filter((m) => m.result === 'W').length;
  const draws = matches.filter((m) => m.result === 'D').length;
  const losses = matches.filter((m) => m.result === 'L').length;
  const winPercentage = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  const totalGoalsScored = matches.reduce((acc, m) => acc + m.ourGoals, 0);
  const totalGoalsConceded = matches.reduce((acc, m) => acc + m.opponentGoals, 0);
  const goalDiff = totalGoalsScored - totalGoalsConceded;

  // Player mode stats
  const playerMatches = matches.filter((m) => m.playerMinutes !== undefined && m.playerMinutes > 0);
  const playerGoalsTotal = matches.reduce((acc, m) => acc + (m.playerGoals || 0), 0);
  const playerAssistsTotal = matches.reduce((acc, m) => acc + (m.playerAssists || 0), 0);
  const playerMotmTotal = matches.filter((m) => m.playerMOTM).length;
  const avgPlayerRating =
    playerMatches.length > 0
      ? (
          playerMatches.reduce((acc, m) => acc + (m.playerRating || 7.0), 0) /
          playerMatches.length
        ).toFixed(1)
      : (activeCareer?.playerOverall ? (activeCareer.playerOverall / 10).toFixed(1) : '8.2');

  const recentMatches = matches.slice(0, 4);
  const recentTransfers = transfers.slice(0, 4);
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* HERO BANNER - EA SPORTS FC 26/27 3D STADIUM ATMOSPHERE */}
      {isPlayerMode ? (
        /* Player Career Mode Hero with 3D Superstar & Stadium Visual */
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 p-6 sm:p-8 shadow-2xl bg-[#060a14] group">
          {/* 3D Stadium Background with volumetric glow */}
          <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-45 transition-opacity duration-700">
            <img
              src={ASSETS_3D.stadiumMatchday3D}
              alt="FC 27 Stadium"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/90 to-[#060a14]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-[#060a14]/40" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* 3D Next-Gen FUT Player Card with Interactive Tilt */}
              <div className="relative w-28 sm:w-32 h-40 sm:h-48 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-600 to-[#060a14] p-0.5 shadow-2xl shadow-amber-500/20 shrink-0 transform hover:rotate-2 hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-[14px] bg-[#090d16]/95 overflow-hidden flex flex-col justify-between relative p-2">
                  <img
                    src={ASSETS_3D.superstarRender3D}
                    alt="Player 3D Render"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-75 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-amber-950/30" />

                  {/* Top Stats */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 font-display leading-none block drop-shadow">
                        {activeCareer?.playerOverall || 84}
                      </span>
                      <span className="text-[11px] font-black text-white uppercase tracking-wider block">
                        {activeCareer?.playerPosition || 'ST'}
                      </span>
                    </div>
                    {(() => {
                      const club = getClubDetails(activeCareer?.club);
                      return club.logo ? (
                        <img
                          src={club.logo}
                          alt={activeCareer?.club}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 object-contain drop-shadow"
                        />
                      ) : null;
                    })()}
                  </div>

                  {/* Player Name & Archetype */}
                  <div className="relative z-10 text-center pb-1">
                    <div className="font-black text-xs uppercase tracking-tight text-white truncate drop-shadow">
                      {activeCareer?.playerName || 'Pro Player'}
                    </div>
                    <div className="text-[9px] text-amber-300 font-bold uppercase tracking-widest">
                      {activeCareer?.playerArchetype || 'Virtuoso'}
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-1 text-[8px] font-bold text-slate-200 border-t border-amber-500/30 pt-1">
                      <span>PAC {activeCareer?.attributes?.pace || 90}</span>
                      <span>SHO {activeCareer?.attributes?.shooting || 86}</span>
                      <span>DRI {activeCareer?.attributes?.dribbling || 86}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-neutral-950 uppercase tracking-wider shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                    ⚡ FC 27 PRO PLAYER
                  </span>
                  <span className="text-xs text-amber-300/80 font-mono">Season {activeCareer?.currentSeason}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101826] text-[#ccff00] border border-[#ccff00]/30 font-bold">
                    HyperMotion V6.0 Active
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-white tracking-wide flex items-center gap-2">
                  {activeCareer?.playerName}
                  <span className="text-amber-400 text-lg">#{activeCareer?.jerseyNumber || 9}</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                  {(() => {
                    const club = getClubDetails(activeCareer?.club);
                    return club.logo ? (
                      <img
                        src={club.logo}
                        alt={activeCareer?.club}
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 object-contain"
                      />
                    ) : null;
                  })()}
                  <span>{activeCareer?.club}</span>
                  <span>•</span>
                  <span>{activeCareer?.league}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-[#0d1424]/90 text-slate-200 border border-[#1e293b]">
                    Role: <strong className="text-amber-400">{activeCareer?.squadRole || 'Crucial Starter'}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#0d1424]/90 text-slate-200 border border-[#1e293b]">
                    Manager Trust: <strong className="text-[#ccff00]">{activeCareer?.managerConfidence || 85}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#0d1424]/90 text-slate-200 border border-[#1e293b]">
                    Market Value: <strong className="text-amber-300 font-mono">{formatCurrency(activeCareer?.marketValue || 45000000)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2.5 shrink-0 relative z-10">
              <button
                onClick={() => onNavigate('player-pro')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 text-neutral-950 text-xs font-black rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                <span>Upgrade Pro Attributes</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenMatchModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d1424]/90 hover:bg-[#131b2f] text-white text-xs font-semibold rounded-xl border border-[#1e293b] transition"
              >
                <span>＋ Log Match</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Manager Career Mode Hero with 3D Stadium Visual & Real Club Crest */
        <div className="relative overflow-hidden rounded-3xl border border-[#ccff00]/30 p-6 sm:p-8 shadow-2xl bg-[#060a14] group">
          {/* 3D Stadium Matchday Background */}
          <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-45 transition-opacity duration-700">
            <img
              src={ASSETS_3D.stadiumMatchday3D}
              alt="FC 27 Stadium Arena"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/90 to-[#060a14]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-[#060a14]/40" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Club Crest 3D Display Shield */}
              {(() => {
                const club = getClubDetails(activeCareer?.club);
                return (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0c1220]/90 border-2 border-[#ccff00]/40 flex items-center justify-center p-3 shadow-xl shrink-0 group-hover:border-[#ccff00] transition-colors">
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={activeCareer?.club}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-xl font-black text-[#ccff00] font-display">
                        {club.short}
                      </span>
                    )}
                    <div className="absolute -bottom-2 px-2 py-0.5 rounded bg-[#050811] border border-[#ccff00]/60 text-[9px] font-black text-[#ccff00] tracking-wider shadow-[0_0_8px_rgba(204,255,0,0.3)]">
                      FC 27
                    </div>
                  </div>
                );
              })()}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#ccff00] text-[#050811] uppercase tracking-wider shadow-[0_0_12px_rgba(204,255,0,0.35)]">
                    👔 FC 27 MANAGER CAREER
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Season {activeCareer?.currentSeason}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#05f1cd]/10 text-[#05f1cd] border border-[#05f1cd]/30 font-bold">
                    HyperMotion Match Engine
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-white tracking-wide">
                  {activeCareer?.club}
                </h2>
                <p className="text-sm text-slate-300 mt-0.5">
                  Managed by <strong className="text-white">{activeCareer?.managerName || 'Manager'}</strong> •{' '}
                  {activeCareer?.league} • {activeCareer?.difficulty} Difficulty
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  {activeCareer?.boardObjectiveLeague && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0c1220]/90 px-3 py-1 rounded-xl border border-[#1e293b]">
                      <Target className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                      <span>
                        Board Objective: <strong className="text-white">{activeCareer.boardObjectiveLeague}</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0c1220]/90 px-3 py-1 rounded-xl border border-[#1e293b]">
                    <Zap className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                    <span>
                      Budget: <strong className="text-[#ccff00] font-mono">{formatCurrency(activeCareer?.transferBudget || 0)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2.5 shrink-0 relative z-10">
              <button
                onClick={onOpenMatchModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ccff00] to-[#b8e600] hover:brightness-110 text-[#050811] text-xs font-black rounded-xl transition shadow-lg shadow-[#ccff00]/25"
              >
                <span>＋ Quick Add Match</span>
              </button>
              <button
                onClick={() => onNavigate('squad')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0c1220]/90 hover:bg-[#131b2f] text-white text-xs font-semibold rounded-xl border border-[#1e293b] transition"
              >
                <span>Manage Squad Lineup</span>
                <ArrowUpRight className="w-4 h-4 text-[#ccff00]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {isPlayerMode ? (
          <>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-[#ccff00]/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Personal Goals</span>
                <Activity className="w-4 h-4 text-[#ccff00]" />
              </div>
              <div className="text-2xl font-black font-display text-white">{playerGoalsTotal}</div>
              <span className="text-[11px] text-[#ccff00] font-semibold">In {playerMatches.length} Appearances</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-[#05f1cd]/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Assists</span>
                <Zap className="w-4 h-4 text-[#05f1cd]" />
              </div>
              <div className="text-2xl font-black font-display text-white">{playerAssistsTotal}</div>
              <span className="text-[11px] text-slate-400">Total Goal Involvements: {playerGoalsTotal + playerAssistsTotal}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-amber-400/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Average Rating</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-display text-amber-400">{avgPlayerRating}</div>
              <span className="text-[11px] text-slate-400">{playerMotmTotal} Man of Match Awards</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-rose-400/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Dev Skill Points</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black font-display text-rose-400">
                {activeCareer?.developmentPoints || 0} PTS
              </div>
              <button
                onClick={() => onNavigate('player-pro')}
                className="text-[11px] text-[#ccff00] font-bold hover:underline mt-0.5 block"
              >
                Upgrade Attributes →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-[#ccff00]/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Record (W-D-L)</span>
                <Activity className="w-4 h-4 text-[#ccff00]" />
              </div>
              <div className="text-2xl font-black font-display text-white">
                {wins}-{draws}-{losses}
              </div>
              <span className="text-[11px] text-[#ccff00] font-bold">{winPercentage}% Win Rate ({totalMatches} games)</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-[#05f1cd]/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Goals Scored / Diff</span>
                <TrendingUp className="w-4 h-4 text-[#05f1cd]" />
              </div>
              <div className="text-2xl font-black font-display text-white">
                {totalGoalsScored} <span className="text-xs font-normal text-slate-400">({goalDiff >= 0 ? `+${goalDiff}` : goalDiff})</span>
              </div>
              <span className="text-[11px] text-slate-400">{totalGoalsConceded} Goals Conceded</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-[#ccff00]/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Transfer Budget</span>
                <Zap className="w-4 h-4 text-[#ccff00]" />
              </div>
              <div className="text-2xl font-black font-display text-[#ccff00]">
                {formatCurrency(activeCareer?.transferBudget || 0)}
              </div>
              <span className="text-[11px] text-slate-400">Tactics: {activeCareer?.formation || '4-3-3'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] hover:border-amber-400/40 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Squad Size</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-display text-white">{players.length} Players</div>
              <button
                onClick={() => onNavigate('squad')}
                className="text-[11px] text-[#ccff00] font-bold hover:underline mt-0.5 block"
              >
                View Pitch Lineup →
              </button>
            </div>
          </>
        )}
      </div>

      {/* DASHBOARD 3-COLUMN / GRID SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT MATCHES */}
        <div className="lg:col-span-2 p-5 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00]">Fixtures</span>
              <h3 className="text-lg font-bold font-display text-white">Recent Match Results</h3>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ccff00]" />
            </button>
          </div>

          {recentMatches.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-[#1e293b] rounded-2xl">
              No matches logged for {selectedSeason === 'all' ? 'this career' : selectedSeason} yet.
              <div className="mt-2">
                <button
                  onClick={onOpenMatchModal}
                  className="px-3 py-1.5 rounded-lg bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 text-xs font-bold hover:bg-[#ccff00]/25 transition"
                >
                  ＋ Log First Match
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMatches.map((m) => {
                const isWin = m.result === 'W';
                const isDraw = m.result === 'D';
                const oppClub = getClubDetails(m.opponent);
                return (
                  <div
                    key={m.id}
                    onClick={() => onViewMatch(m)}
                    className="flex items-center justify-between p-3.5 bg-[#070b14]/90 hover:bg-[#0e1628] border border-[#1a2333] hover:border-[#ccff00]/40 rounded-2xl cursor-pointer transition group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black shrink-0 ${
                          isWin
                            ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40'
                            : isDraw
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {m.result}
                      </span>
                      <div className="flex items-center gap-2.5">
                        {oppClub.logo ? (
                          <img
                            src={oppClub.logo}
                            alt={m.opponent}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 object-contain drop-shadow shrink-0 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <span className="w-7 h-7 rounded-lg bg-[#0d1424] text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {oppClub.short}
                          </span>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                              vs {m.opponent}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#101827] text-slate-400 font-mono">
                              {m.venue}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block max-w-[220px]">
                            {m.scorers || m.competition}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black font-display text-white">
                        {m.ourGoals} - {m.opponentGoals}
                      </span>
                      {isPlayerMode && m.playerRating && (
                        <div className="text-[10px] font-bold text-amber-400">
                          Rating: {m.playerRating} {m.playerMOTM && '⭐'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDE COLUMN: SQUAD SPOTLIGHT OR RECENT TRANSFERS */}
        <div className="p-5 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#05f1cd]">Market</span>
              <h3 className="text-lg font-bold font-display text-white">Latest Transfers</h3>
            </div>
            <button
              onClick={() => onNavigate('transfers')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#05f1cd]" />
            </button>
          </div>

          {recentTransfers.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-[#1e293b] rounded-2xl">
              No transfers logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTransfers.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-[#070b14]/90 border border-[#1a2333] rounded-2xl flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          t.type === 'IN'
                            ? 'bg-[#ccff00]/20 text-[#ccff00]'
                            : t.type === 'OUT'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {t.type}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[120px]">{t.player}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.fromClub} → {t.toClub}
                    </span>
                  </div>
                  <span className="text-xs font-black font-display text-[#ccff00]">
                    {formatCurrency(t.fee)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TROPHY CABINET 3D SHOWCASE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/50 shadow-md shadow-amber-500/20 shrink-0">
              <img
                src={ASSETS_3D.goldenTrophy3D}
                alt="3D Trophy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                SILVERWARE HALL OF FAME
              </span>
              <h3 className="text-lg font-black font-display text-white flex items-center gap-2">
                Honours & Trophies
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                  {trophies.length} Won
                </span>
              </h3>
            </div>
          </div>
          <button
            onClick={() => onNavigate('trophies')}
            className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0c1322] hover:bg-[#131d33] border border-[#1e293b] transition self-start sm:self-auto"
          >
            <span>Open 3D Trophy Cabinet</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {trophies.length === 0 ? (
          <div className="relative py-8 px-4 rounded-2xl bg-[#060a14]/80 border border-dashed border-[#1e293b] text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/30 mb-3 opacity-60">
              <img
                src={ASSETS_3D.goldenTrophy3D}
                alt="3D Trophy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Trophy cabinet is waiting for your club to lift its first silverware! Compete in league & cup finals to fill the pedestal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trophies.slice(0, 4).map((tr) => (
              <div
                key={tr.id}
                onClick={() => onNavigate('trophies')}
                className="p-3.5 bg-[#060a14]/80 hover:bg-[#0e1628] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl cursor-pointer transition text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-2 relative rounded-xl overflow-hidden border border-amber-500/40 group-hover:scale-110 transition-transform">
                  <img
                    src={ASSETS_3D.goldenTrophy3D}
                    alt={tr.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                </div>
                <div className="text-xs font-bold text-white truncate">{tr.name}</div>
                <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">{tr.season}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

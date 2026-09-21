import React from 'react';
import { useCareer } from '../../context/CareerContext';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldCheck,
  Target,
  Zap,
  Star,
  Users,
  Calendar,
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { matches, players, activeCareer, selectedSeason } = useCareer();

  const isPlayerMode = activeCareer?.mode === 'player';

  // Overall Match stats
  const totalMatches = matches.length;
  const wins = matches.filter((m) => m.result === 'W').length;
  const draws = matches.filter((m) => m.result === 'D').length;
  const losses = matches.filter((m) => m.result === 'L').length;

  const winPct = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  const drawPct = totalMatches > 0 ? Math.round((draws / totalMatches) * 100) : 0;
  const lossPct = totalMatches > 0 ? Math.round((losses / totalMatches) * 100) : 0;

  // Goals
  const goalsScored = matches.reduce((acc, m) => acc + m.ourGoals, 0);
  const goalsConceded = matches.reduce((acc, m) => acc + m.opponentGoals, 0);
  const cleanSheets = matches.filter((m) => m.opponentGoals === 0).length;
  const avgGoalsPerGame = totalMatches > 0 ? (goalsScored / totalMatches).toFixed(2) : '0.00';
  const avgConcededPerGame = totalMatches > 0 ? (goalsConceded / totalMatches).toFixed(2) : '0.00';

  // Home vs Away
  const homeMatches = matches.filter((m) => m.venue === 'Home');
  const homeWins = homeMatches.filter((m) => m.result === 'W').length;
  const homeWinPct = homeMatches.length > 0 ? Math.round((homeWins / homeMatches.length) * 100) : 0;

  const awayMatches = matches.filter((m) => m.venue === 'Away');
  const awayWins = awayMatches.filter((m) => m.result === 'W').length;
  const awayWinPct = awayMatches.length > 0 ? Math.round((awayWins / awayMatches.length) * 100) : 0;

  // Top players
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topAssisters = [...players].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const topRated = [...players].sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);

  // Player Career Mode stats
  const playerMatches = matches.filter((m) => m.playerMinutes !== undefined && m.playerMinutes > 0);
  const playerGoals = matches.reduce((acc, m) => acc + (m.playerGoals || 0), 0);
  const playerAssists = matches.reduce((acc, m) => acc + (m.playerAssists || 0), 0);
  const playerMotm = matches.filter((m) => m.playerMOTM).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Analytics Engine
          </span>
          <span className="text-xs text-neutral-400">
            Season: {selectedSeason === 'all' ? 'All Seasons' : selectedSeason}
          </span>
        </div>
        <h2 className="text-2xl font-black font-display text-white">Performance Analytics & Stats</h2>
      </div>

      {/* PLAYER CAREER MODE SPECIFIC BREAKDOWN */}
      {isPlayerMode && (
        <div className="p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold font-display text-white">
              {activeCareer.playerName} Career Tracking
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Appearances</span>
              <span className="text-2xl font-black font-display text-white">{playerMatches.length}</span>
            </div>
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Goals Scored</span>
              <span className="text-2xl font-black font-display text-emerald-400">{playerGoals}</span>
            </div>
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Assists Provided</span>
              <span className="text-2xl font-black font-display text-blue-400">{playerAssists}</span>
            </div>
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Man of the Match</span>
              <span className="text-2xl font-black font-display text-amber-400">{playerMotm} 🏆</span>
            </div>
          </div>
        </div>
      )}

      {/* FORM & RESULTS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Results Bar Chart */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Match Record</span>
              <h3 className="text-lg font-bold font-display text-white">Results Distribution</h3>
            </div>
            <span className="text-xs font-bold text-neutral-400">{totalMatches} Games</span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-4 rounded-full bg-neutral-950 flex overflow-hidden border border-neutral-800">
            <div style={{ width: `${winPct}%` }} className="bg-emerald-500 h-full transition-all" title={`Wins: ${winPct}%`} />
            <div style={{ width: `${drawPct}%` }} className="bg-amber-500 h-full transition-all" title={`Draws: ${drawPct}%`} />
            <div style={{ width: `${lossPct}%` }} className="bg-rose-500 h-full transition-all" title={`Losses: ${lossPct}%`} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Wins</span>
              <span className="text-xl font-black font-display text-white">{wins}</span>
              <span className="text-[10px] text-neutral-400 block">{winPct}%</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Draws</span>
              <span className="text-xl font-black font-display text-white">{draws}</span>
              <span className="text-[10px] text-neutral-400 block">{drawPct}%</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Losses</span>
              <span className="text-xl font-black font-display text-white">{losses}</span>
              <span className="text-[10px] text-neutral-400 block">{lossPct}%</span>
            </div>
          </div>
        </div>

        {/* Goals & Clean Sheets */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Offense & Defense</span>
            <h3 className="text-lg font-bold font-display text-white">Goal Statistics</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Goals Scored</span>
              <span className="text-2xl font-black font-display text-emerald-400">{goalsScored}</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">{avgGoalsPerGame} per match</span>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Goals Conceded</span>
              <span className="text-2xl font-black font-display text-rose-400">{goalsConceded}</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">{avgConcededPerGame} per match</span>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Clean Sheets</span>
              <span className="text-2xl font-black font-display text-amber-400">{cleanSheets}</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Shutouts</span>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Goal Difference</span>
              <span
                className={`text-2xl font-black font-display ${
                  goalsScored - goalsConceded >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {goalsScored - goalsConceded >= 0 ? `+${goalsScored - goalsConceded}` : goalsScored - goalsConceded}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Net Margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Scorers */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-base font-display">Top Scorers</h4>
          </div>
          <div className="space-y-2">
            {topScorers.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-500 w-4">{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[10px] text-neutral-400 block">{p.position}</span>
                  </div>
                </div>
                <span className="text-base font-black font-display text-emerald-400">{p.goals} G</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Assists */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-white text-base font-display">Top Playmakers</h4>
          </div>
          <div className="space-y-2">
            {topAssisters.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-500 w-4">{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[10px] text-neutral-400 block">{p.position}</span>
                  </div>
                </div>
                <span className="text-base font-black font-display text-blue-400">{p.assists} A</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Ratings */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-base font-display">Highest Rated</h4>
          </div>
          <div className="space-y-2">
            {topRated.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-500 w-4">{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[10px] text-neutral-400 block">{p.position}</span>
                  </div>
                </div>
                <span className="text-base font-black font-display text-amber-400">{p.avgRating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

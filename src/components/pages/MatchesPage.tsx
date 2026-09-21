import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Match } from '../../types';
import { getClubDetails } from '../../utils/assets';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Star,
  Award,
} from 'lucide-react';

interface MatchesPageProps {
  onOpenMatchModal: () => void;
  onEditMatch: (match: Match) => void;
  onViewMatch: (match: Match) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  onOpenMatchModal,
  onEditMatch,
  onViewMatch,
}) => {
  const { matches, deleteMatch, activeCareer, selectedSeason } = useCareer();

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'W' | 'D' | 'L'>('ALL');
  const [compFilter, setCompFilter] = useState('ALL');

  const isPlayerMode = activeCareer?.mode === 'player';

  // Get distinct competitions
  const competitions = Array.from(new Set(matches.map((m) => m.competition))).filter(Boolean);

  const filteredMatches = matches.filter((m) => {
    const matchesSearch =
      m.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.scorers && m.scorers.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesResult = resultFilter === 'ALL' || m.result === resultFilter;
    const matchesComp = compFilter === 'ALL' || m.competition === compFilter;

    return matchesSearch && matchesResult && matchesComp;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Fixtures Log</span>
            <span className="text-xs text-neutral-400">({matches.length} Matches in {selectedSeason === 'all' ? 'All Seasons' : selectedSeason})</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Matches & Results</h2>
        </div>

        <button
          onClick={onOpenMatchModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Match Result</span>
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opponent, scorer..."
              className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Result Filter */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            {(['ALL', 'W', 'D', 'L'] as const).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResultFilter(res)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  resultFilter === res
                    ? res === 'W'
                      ? 'bg-emerald-500 text-neutral-950'
                      : res === 'D'
                      ? 'bg-amber-500 text-neutral-950'
                      : res === 'L'
                      ? 'bg-rose-500 text-white'
                      : 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {res === 'ALL' ? 'All' : res}
              </button>
            ))}
          </div>

          {/* Competition Filter */}
          {competitions.length > 0 && (
            <select
              value={compFilter}
              onChange={(e) => setCompFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="ALL">All Competitions</option>
              {competitions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* MATCHES LIST */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <h3 className="text-base font-bold text-white mb-1">No Matches Found</h3>
          <p className="text-xs text-neutral-400 mb-4">
            No matches match the current filter or have been registered yet.
          </p>
          <button
            onClick={onOpenMatchModal}
            className="px-4 py-2 rounded-xl bg-emerald-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Log Match
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => {
            const isWin = m.result === 'W';
            const isDraw = m.result === 'D';

            return (
              <div
                key={m.id}
                onClick={() => onViewMatch(m)}
                className="group relative p-5 bg-neutral-900 hover:bg-neutral-850/90 border border-neutral-800 hover:border-neutral-700 rounded-3xl transition cursor-pointer shadow-lg space-y-3"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {m.competition}
                    </span>
                    <span className="text-[11px] text-neutral-400">Season {m.season}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMatch(m);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                      title="Edit Match"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete match vs ${m.opponent}?`)) {
                          deleteMatch(m.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                      title="Delete Match"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scoreline Center */}
                {(() => {
                  const oppClub = getClubDetails(m.opponent);
                  return (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 flex items-center justify-center rounded-2xl text-sm font-black shrink-0 ${
                            isWin
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
                              className="w-8 h-8 object-contain drop-shadow shrink-0 group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {oppClub.short}
                            </span>
                          )}
                          <div>
                            <h4 className="text-base font-bold text-white leading-tight">vs {m.opponent}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {m.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {m.venue}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2 rounded-2xl bg-neutral-950 border border-neutral-800 text-center shrink-0">
                        <span className="text-xl font-black font-display text-white">
                          {m.ourGoals} - {m.opponentGoals}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Scorers info */}
                {m.scorers && (
                  <div className="pt-2 border-t border-neutral-850 text-xs text-neutral-300 truncate">
                    ⚽ <span className="text-neutral-400">{m.scorers}</span>
                  </div>
                )}

                {/* Player Mode Specific Badge */}
                {isPlayerMode && (
                  <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>
                        Rating: <strong className="text-amber-400">{m.playerRating || '-'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        G/A: <strong>{m.playerGoals ?? 0}G / {m.playerAssists ?? 0}A</strong>
                      </span>
                    </div>

                    {m.playerMOTM && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        MOTM 🏆
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

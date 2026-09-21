import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Player } from '../../types';
import { getPlayerPhoto } from '../../utils/assets';
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Sliders,
  DollarSign,
  ChevronDown,
} from 'lucide-react';

interface SquadPageProps {
  onOpenPlayerModal: () => void;
  onEditPlayer: (player: Player) => void;
  onViewPlayer: (player: Player) => void;
}

// Formations coordinate maps (in percentage [top%, left%])
const FORMATION_COORDINATES: Record<string, { pos: string; top: number; left: number }[]> = {
  '4-3-3': [
    { pos: 'GK', top: 86, left: 50 },
    { pos: 'LB', top: 68, left: 16 },
    { pos: 'CB', top: 72, left: 38 },
    { pos: 'CB', top: 72, left: 62 },
    { pos: 'RB', top: 68, left: 84 },
    { pos: 'CM', top: 48, left: 26 },
    { pos: 'CDM', top: 52, left: 50 },
    { pos: 'CM', top: 48, left: 74 },
    { pos: 'LW', top: 22, left: 20 },
    { pos: 'ST', top: 16, left: 50 },
    { pos: 'RW', top: 22, left: 80 },
  ],
  '4-2-3-1': [
    { pos: 'GK', top: 86, left: 50 },
    { pos: 'LB', top: 68, left: 16 },
    { pos: 'CB', top: 72, left: 38 },
    { pos: 'CB', top: 72, left: 62 },
    { pos: 'RB', top: 68, left: 84 },
    { pos: 'CDM', top: 54, left: 35 },
    { pos: 'CDM', top: 54, left: 65 },
    { pos: 'LM', top: 34, left: 18 },
    { pos: 'CAM', top: 32, left: 50 },
    { pos: 'RM', top: 34, left: 82 },
    { pos: 'ST', top: 14, left: 50 },
  ],
  '4-4-2': [
    { pos: 'GK', top: 86, left: 50 },
    { pos: 'LB', top: 68, left: 16 },
    { pos: 'CB', top: 72, left: 38 },
    { pos: 'CB', top: 72, left: 62 },
    { pos: 'RB', top: 68, left: 84 },
    { pos: 'LM', top: 44, left: 16 },
    { pos: 'CM', top: 46, left: 38 },
    { pos: 'CM', top: 46, left: 62 },
    { pos: 'RM', top: 44, left: 84 },
    { pos: 'ST', top: 18, left: 38 },
    { pos: 'ST', top: 18, left: 62 },
  ],
  '3-5-2': [
    { pos: 'GK', top: 86, left: 50 },
    { pos: 'CB', top: 72, left: 24 },
    { pos: 'CB', top: 74, left: 50 },
    { pos: 'CB', top: 72, left: 76 },
    { pos: 'LWB', top: 48, left: 14 },
    { pos: 'CDM', top: 54, left: 38 },
    { pos: 'CDM', top: 54, left: 62 },
    { pos: 'RWB', top: 48, left: 86 },
    { pos: 'CAM', top: 32, left: 50 },
    { pos: 'ST', top: 16, left: 38 },
    { pos: 'ST', top: 16, left: 62 },
  ],
};

export const SquadPage: React.FC<SquadPageProps> = ({
  onOpenPlayerModal,
  onEditPlayer,
  onViewPlayer,
}) => {
  const { activeCareer, players, updateCareer, formatCurrency } = useCareer();

  const [formation, setFormation] = useState(activeCareer?.formation || '4-3-3');
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'overall' | 'goals' | 'value' | 'age'>('overall');

  const coords = FORMATION_COORDINATES[formation] || FORMATION_COORDINATES['4-3-3'];

  // Starting 11 players vs bench
  const starters = players.slice(0, 11);
  const bench = players.slice(11);

  // Filtered full list
  const filteredPlayers = players
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nationality.toLowerCase().includes(searchQuery.toLowerCase());
      if (posFilter === 'ALL') return matchesSearch;
      if (posFilter === 'DEF') return matchesSearch && ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position);
      if (posFilter === 'MID') return matchesSearch && ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position);
      if (posFilter === 'FWD') return matchesSearch && ['ST', 'CF', 'LW', 'RW'].includes(p.position);
      if (posFilter === 'GK') return matchesSearch && p.position === 'GK';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'overall') return b.overall - a.overall;
      if (sortBy === 'goals') return b.goals - a.goals;
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'age') return a.age - b.age;
      return 0;
    });

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
    if (activeCareer) {
      updateCareer(activeCareer.id, { formation: newFormation });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & FORMATION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Team Management</span>
            <span className="text-xs text-neutral-400">({players.length} Total Players)</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Tactical Pitch & Squad</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Formation:</span>
            <select
              value={formation}
              onChange={(e) => handleFormationChange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="4-3-3">4-3-3 Attack</option>
              <option value="4-2-3-1">4-2-3-1 Wide</option>
              <option value="4-4-2">4-4-2 Flat</option>
              <option value="3-5-2">3-5-2 Wingbacks</option>
            </select>
          </div>

          <button
            onClick={onOpenPlayerModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </button>
        </div>
      </div>

      {/* PITCH VISUALIZER & BENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE FOOTBALL PITCH */}
        <div className="lg:col-span-2 relative p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Starting XI ({formation})
            </span>
            <span className="text-xs text-neutral-400">Click any card to inspect stats</span>
          </div>

          {/* Actual Pitch Surface */}
          <div className="relative w-full max-w-xl aspect-[7/9] rounded-2xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-900 border-4 border-emerald-500/30 overflow-hidden shadow-2xl p-2 select-none">
            {/* Pitch Markings */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {/* Outer boundary */}
              <div className="absolute inset-2 border-2 border-white/40 rounded-sm" />
              {/* Halfway line */}
              <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/40 -translate-y-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full" />
              {/* Center Spot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white/60 rounded-full" />
              {/* Top Penalty Box */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-24 border-b-2 border-x-2 border-white/40" />
              {/* Bottom Penalty Box */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white/40" />
              {/* Top Goal Area */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-10 border-b-2 border-x-2 border-white/40" />
              {/* Bottom Goal Area */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-10 border-t-2 border-x-2 border-white/40" />
            </div>

            {/* Starting 11 Node Placement */}
            {coords.map((c, idx) => {
              const player = starters[idx];
              const photo = player ? getPlayerPhoto(player.name, player.photo) : null;

              return (
                <div
                  key={idx}
                  onClick={() => player && onViewPlayer(player)}
                  style={{ top: `${c.top}%`, left: `${c.left}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                >
                  {player ? (
                    <div className="flex flex-col items-center">
                      <div className="relative flex flex-col items-center justify-between w-12 sm:w-14 h-16 sm:h-20 rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-amber-400/60 group-hover:border-[#ccff00] group-hover:scale-115 transition-all duration-300 shadow-xl text-center p-1 overflow-hidden">
                        <div className="flex items-center justify-between w-full px-0.5 z-10 leading-none">
                          <span className="text-[11px] sm:text-xs font-black font-display text-amber-300">
                            {player.overall}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-neutral-300 uppercase">
                            {c.pos}
                          </span>
                        </div>

                        {photo ? (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden my-0.5 border border-white/10 bg-black/40">
                            <img
                              src={photo}
                              alt={player.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-white font-bold flex items-center justify-center text-[10px]">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <span className="text-[8px] text-neutral-400 block font-mono z-10">
                          #{player.number}
                        </span>
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded-full bg-neutral-950/95 border border-neutral-800 text-[10px] font-bold text-white max-w-[85px] truncate shadow-md">
                        {player.name.split(' ').pop()}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={onOpenPlayerModal}
                      className="flex flex-col items-center justify-center w-11 h-16 rounded-xl border-2 border-dashed border-white/30 hover:border-emerald-400 text-white/50 hover:text-emerald-300 transition text-[10px] font-bold"
                    >
                      <span>{c.pos}</span>
                      <span className="text-xs">＋</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BENCH & SUBSTITUTES */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Substitutes & Reserves ({bench.length})
            </span>
          </div>

          {bench.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl">
              No substitutes on the bench yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {bench.map((p) => {
                const photo = getPlayerPhoto(p.name, p.photo);
                return (
                  <div
                    key={p.id}
                    onClick={() => onViewPlayer(p)}
                    className="flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-850/80 border border-neutral-800 rounded-2xl cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      {photo ? (
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
                          <img
                            src={photo}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 font-black text-xs font-display shrink-0">
                          {p.overall}
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate max-w-[120px]">{p.name}</span>
                          <span className="text-[10px] px-1 rounded bg-neutral-850 text-neutral-400">{p.position}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">
                          OVR {p.overall} • Age {p.age} • POT {p.potential}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">{p.goals} G</span>
                      <span className="text-[10px] text-neutral-500 block">{p.appearances} Apps</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* COMPLETE SQUAD LIST TABLE */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold font-display text-white">Full Squad Roster</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search players..."
                className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
              />
            </div>

            {/* Position filter */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
              {['ALL', 'FWD', 'MID', 'DEF', 'GK'].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPosFilter(pos)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    posFilter === pos
                      ? 'bg-emerald-400 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="overall">Sort by OVR</option>
              <option value="goals">Sort by Goals</option>
              <option value="value">Sort by Value</option>
              <option value="age">Sort by Age</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3">POS</th>
                <th className="py-3 px-3">OVR</th>
                <th className="py-3 px-3">POT</th>
                <th className="py-3 px-3">Age</th>
                <th className="py-3 px-3">Nation</th>
                <th className="py-3 px-3">Apps</th>
                <th className="py-3 px-3">G / A</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredPlayers.map((p) => {
                const photo = getPlayerPhoto(p.name, p.photo);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-850/60 transition cursor-pointer"
                    onClick={() => onViewPlayer(p)}
                  >
                    <td className="py-3 px-3 font-mono text-neutral-500 font-bold">{p.number}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        {photo ? (
                          <div className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
                            <img
                              src={photo}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>{p.name}</span>
                        {p.growth > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400">+{p.growth}</span>
                        )}
                      </div>
                    </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                      {p.position}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-amber-400 font-display text-sm">{p.overall}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-400 font-display">{p.potential}</td>
                  <td className="py-3 px-3">{p.age}</td>
                  <td className="py-3 px-3 text-neutral-400">{p.nationality}</td>
                  <td className="py-3 px-3">{p.appearances}</td>
                  <td className="py-3 px-3 font-semibold">
                    <span className="text-emerald-400">{p.goals}</span> /{' '}
                    <span className="text-blue-400">{p.assists}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-300">{p.avgRating}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-300">{formatCurrency(p.value)}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlayer(p);
                      }}
                      className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-neutral-200 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

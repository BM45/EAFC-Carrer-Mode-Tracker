import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Player } from '../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  DollarSign,
  Shield,
  Activity,
} from 'lucide-react';

interface PlayersPageProps {
  onOpenPlayerModal: () => void;
  onEditPlayer: (player: Player) => void;
  onViewPlayer: (player: Player) => void;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({
  onOpenPlayerModal,
  onEditPlayer,
  onViewPlayer,
}) => {
  const { players, deletePlayer, formatCurrency, activeCareer, selectedSeason } = useCareer();

  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'overall' | 'potential' | 'goals' | 'value' | 'age'>('overall');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
      if (sortBy === 'potential') return b.potential - a.potential;
      if (sortBy === 'goals') return b.goals - a.goals;
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'age') return a.age - b.age;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Roster & Teammates
            </span>
            <span className="text-xs text-neutral-400">
              ({players.length} Players in {selectedSeason === 'all' ? 'All Seasons' : selectedSeason})
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">
            {activeCareer?.mode === 'player' ? 'Club Teammates' : 'Squad Database'}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid vs Table Toggle */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
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

      {/* Filters Bar */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player, nation..."
              className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            {['ALL', 'FWD', 'MID', 'DEF', 'GK'].map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPosFilter(pos)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  posFilter === pos ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none"
          >
            <option value="overall">Highest OVR</option>
            <option value="potential">Highest Potential</option>
            <option value="goals">Most Goals</option>
            <option value="value">Market Value</option>
            <option value="age">Youngest</option>
          </select>
        </div>
      </div>

      {/* Content Rendering: Grid Cards or Table */}
      {filteredPlayers.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <Users className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <h3 className="text-base font-bold text-white mb-1">No Players Found</h3>
          <p className="text-xs text-neutral-400 mb-4">No players match the current search filter.</p>
          <button
            onClick={onOpenPlayerModal}
            className="px-4 py-2 rounded-xl bg-emerald-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Add Player
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => onViewPlayer(p)}
              className="group relative p-5 bg-neutral-900 hover:bg-neutral-850/80 border border-neutral-800 hover:border-emerald-500/40 rounded-3xl transition cursor-pointer shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* FIFA Card mini emblem */}
                  <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-lg font-black font-display text-white leading-none">{p.overall}</span>
                    <span className="text-[9px] font-bold text-amber-300 uppercase mt-0.5">{p.position}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition truncate max-w-[130px]">
                        {p.name}
                      </h4>
                      {p.growth > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400">+{p.growth}</span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">
                      #{p.number} • Age {p.age} • {p.nationality}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPlayer(p);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${p.name} from squad?`)) {
                        deletePlayer(p.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Performance & Value Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Goals/Ast</span>
                  <span className="font-bold text-emerald-400">{p.goals} / {p.assists}</span>
                </div>
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Potential</span>
                  <span className="font-bold text-amber-400">{p.potential}</span>
                </div>
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Value</span>
                  <span className="font-bold text-white truncate block">{formatCurrency(p.value)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-850">
                <span>Role: <strong className="text-neutral-200">{p.role}</strong></span>
                <span className="text-amber-400 font-bold">★ {p.avgRating}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3">POS</th>
                <th className="py-3 px-3">OVR</th>
                <th className="py-3 px-3">POT</th>
                <th className="py-3 px-3">Age</th>
                <th className="py-3 px-3">Apps</th>
                <th className="py-3 px-3">Goals</th>
                <th className="py-3 px-3">Assists</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredPlayers.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-neutral-850/60 transition cursor-pointer"
                  onClick={() => onViewPlayer(p)}
                >
                  <td className="py-3 px-3 font-mono text-neutral-500 font-bold">{p.number}</td>
                  <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                      {p.position}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-amber-400 font-display text-sm">{p.overall}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-400 font-display">{p.potential}</td>
                  <td className="py-3 px-3">{p.age}</td>
                  <td className="py-3 px-3">{p.appearances}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{p.goals}</td>
                  <td className="py-3 px-3 font-semibold text-blue-400">{p.assists}</td>
                  <td className="py-3 px-3 font-bold text-amber-300">{p.avgRating}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-300">{formatCurrency(p.value)}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

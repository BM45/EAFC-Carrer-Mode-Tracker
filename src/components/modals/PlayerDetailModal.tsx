import React from 'react';
import { Player } from '../../types';
import { useCareer } from '../../context/CareerContext';
import { X, Trophy, TrendingUp, DollarSign, Shield, Activity, Calendar } from 'lucide-react';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
  onEdit: (player: Player) => void;
  onOpenCardModal?: (player: Player) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  onClose,
  onEdit,
  onOpenCardModal,
}) => {
  const { formatCurrency } = useCareer();
  if (!player) return null;

  const getPositionColor = (pos: string) => {
    if (pos === 'GK') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Top Header Card */}
        <div className="relative p-6 bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-neutral-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-5">
            {/* FIFA-style player shield */}
            <div className="flex flex-col items-center justify-center w-20 h-28 bg-gradient-to-b from-amber-200/20 to-amber-600/10 border-2 border-amber-400/40 rounded-2xl shadow-xl p-2 text-center">
              <span className="text-2xl font-black font-display text-white">{player.overall}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${getPositionColor(player.position)}`}>
                {player.position}
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">#{player.number}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-neutral-400">{player.nationality}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  Age {player.age}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {player.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mt-1">{player.name}</h3>
              <p className="text-sm text-neutral-400">
                Squad Role: <strong className="text-neutral-200">{player.role}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Potential</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl font-black text-amber-400 font-display">{player.potential}</span>
                {player.growth > 0 && (
                  <span className="flex items-center text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-3 h-3" />+{player.growth}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Market Value</span>
              <span className="text-base font-bold text-emerald-400 font-display">{formatCurrency(player.value)}</span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Weekly Wage</span>
              <span className="text-base font-bold text-white font-display">{formatCurrency(player.wage)}/w</span>
            </div>
          </div>

          {/* Season Performance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Current Season Performance
            </h4>
            <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <div>
                <span className="text-[11px] text-neutral-400 block">Apps</span>
                <span className="text-lg font-bold text-white font-display">{player.appearances}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Goals</span>
                <span className="text-lg font-bold text-emerald-400 font-display">{player.goals}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Assists</span>
                <span className="text-lg font-bold text-blue-400 font-display">{player.assists}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Avg Rating</span>
                <span className="text-lg font-bold text-amber-400 font-display">{player.avgRating}</span>
              </div>
            </div>
          </div>

          {/* Discipline & Contract */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <div>
                <span className="text-neutral-400 block text-[10px]">Contract Expiry</span>
                <span className="font-semibold text-white">{player.contractExpiry}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-neutral-400" />
              <div>
                <span className="text-neutral-400 block text-[10px]">Discipline (Cards)</span>
                <span className="font-semibold text-white">
                  🟨 {player.yellowCards} • 🟥 {player.redCards}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 bg-neutral-950 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(player);
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-xl transition"
            >
              Edit Player Details
            </button>
            {onOpenCardModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCardModal(player);
                }}
                className="px-3.5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-md shadow-amber-500/20"
              >
                ★ FUT Card Studio
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

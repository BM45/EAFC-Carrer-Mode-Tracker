import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Trophy } from '../../types';
import { ASSETS_3D, getClubDetails } from '../../utils/assets';
import {
  Trophy as TrophyIcon,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Award,
  Sparkles,
  Shield,
  Star,
  Crown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrophiesPageProps {
  onOpenTrophyModal: () => void;
  onEditTrophy: (trophy: Trophy) => void;
}

export const TrophiesPage: React.FC<TrophiesPageProps> = ({
  onOpenTrophyModal,
  onEditTrophy,
}) => {
  const { trophies, deleteTrophy, selectedSeason, activeCareer } = useCareer();
  const [catFilter, setCatFilter] = useState('ALL');

  const filteredTrophies = trophies.filter((t) => {
    if (catFilter === 'ALL') return true;
    return t.category === catFilter;
  });

  const fireCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#ccff00', '#fbbf24', '#05f1cd', '#ffffff', '#f59e0b'],
    });
  };

  const clubInfo = getClubDetails(activeCareer?.club);

  const getCategoryBadge = (cat: Trophy['category']) => {
    switch (cat) {
      case 'league':
        return { label: 'Domestic League', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'continental':
        return { label: 'Continental / UCL', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'domestic_cup':
        return { label: 'Domestic Cup', color: 'bg-neutral-700/50 text-neutral-200 border-neutral-600' };
      case 'super_cup':
        return { label: 'Super Cup', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'international':
        return { label: 'International / World Cup', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Pre-season', color: 'bg-neutral-800 text-neutral-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SILVERWARE CELEBRATION */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* 3D Trophy Showcase Pedestal */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl shadow-amber-500/20 shrink-0 bg-neutral-950 group">
              <img
                src={ASSETS_3D.goldenTrophy3D}
                alt="3D Trophy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-amber-400/20 pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  EA SPORTS FC 27 SILVERWARE
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedSeason === 'all' ? 'All Seasons' : selectedSeason}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white flex items-center gap-2.5">
                Trophy Cabinet
                {clubInfo.logo && (
                  <img
                    src={clubInfo.logo}
                    alt={clubInfo.short}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-contain inline-block drop-shadow"
                  />
                )}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {trophies.length === 0
                  ? 'Compete in league and cup campaigns to fill this cabinet with glory.'
                  : `${trophies.length} Major ${trophies.length === 1 ? 'Honour' : 'Honours'} won by ${activeCareer?.club || 'your club'}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {trophies.length > 0 && (
              <button
                type="button"
                onClick={fireCelebration}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrate! 🎊</span>
              </button>
            )}

            <button
              onClick={onOpenTrophyModal}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Won Trophy</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 text-xs">
        {[
          { id: 'ALL', label: 'All Honours' },
          { id: 'league', label: 'League Titles' },
          { id: 'continental', label: 'UCL / Continental' },
          { id: 'domestic_cup', label: 'Domestic Cups' },
          { id: 'super_cup', label: 'Super Cups' },
          { id: 'international', label: 'International' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCatFilter(item.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              catFilter === item.id
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TROPHIES CABINET GRID */}
      {filteredTrophies.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border border-amber-500/30 mb-4 opacity-70">
            <img
              src={ASSETS_3D.goldenTrophy3D}
              alt="3D Trophy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Cabinet Awaits Silverware</h3>
          <p className="text-xs text-neutral-400 max-w-sm mb-4">
            No trophies recorded in this category yet. Lift a title and celebrate your triumph!
          </p>
          <button
            onClick={onOpenTrophyModal}
            className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Add Trophy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrophies.map((tr) => {
            const badge = getCategoryBadge(tr.category);
            const opponentInfo = tr.finalOpponent ? getClubDetails(tr.finalOpponent) : null;

            return (
              <div
                key={tr.id}
                className="group relative p-6 bg-gradient-to-b from-neutral-900 via-neutral-900 to-amber-950/25 hover:to-amber-950/40 border border-neutral-800 hover:border-amber-400/50 rounded-3xl transition-all duration-300 shadow-xl space-y-4 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onEditTrophy(tr)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${tr.name} from cabinet?`)) {
                          deleteTrophy(tr.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3D Realistic Trophy Visual on Pedestal */}
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl shadow-amber-500/20 group-hover:scale-110 group-hover:border-amber-300 transition-all duration-300 mb-3 bg-neutral-950">
                    <img
                      src={ASSETS_3D.goldenTrophy3D}
                      alt={tr.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-amber-400/20 pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-black font-display text-white">{tr.name}</h3>
                  <span className="text-xs font-semibold text-amber-400 font-mono mt-0.5">
                    Season {tr.season}
                  </span>
                </div>

                {/* Final match recap with Opponent Club Logo */}
                {(tr.finalOpponent || tr.finalScore) && (
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800/80 text-xs">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1 text-center">
                      The Final
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {opponentInfo?.logo && (
                        <img
                          src={opponentInfo.logo}
                          alt={tr.finalOpponent}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 object-contain drop-shadow"
                        />
                      )}
                      <span className="font-bold text-white">
                        vs {tr.finalOpponent} ({tr.finalScore})
                      </span>
                    </div>
                    {tr.mvp && (
                      <span className="block text-center text-[11px] text-amber-300 mt-1 font-semibold">
                        Final MVP: {tr.mvp} ⭐
                      </span>
                    )}
                  </div>
                )}

                {tr.notes && (
                  <p className="text-xs text-neutral-400 italic text-center px-2">"{tr.notes}"</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

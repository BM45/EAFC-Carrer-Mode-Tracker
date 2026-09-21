import React from 'react';
import { Match } from '../../types';
import { useCareer } from '../../context/CareerContext';
import { X, Calendar, MapPin, Award, Star, Target, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  onEdit: (match: Match) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose, onEdit }) => {
  const { activeCareer } = useCareer();
  if (!match) return null;

  const isPlayerMode = activeCareer?.mode === 'player';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="relative p-6 bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {match.competition}
            </span>
            <span className="text-xs text-neutral-400">Season {match.season}</span>
          </div>

          <div className="flex items-center justify-center gap-6 my-4">
            <div className="flex-1 text-right">
              <h4 className="text-lg font-bold text-white font-display truncate">
                {match.venue === 'Away' ? match.opponent : activeCareer?.club || 'Our Club'}
              </h4>
              <span className="text-xs text-neutral-400">
                {match.venue === 'Away' ? 'Home' : match.venue}
              </span>
            </div>

            <div className="px-5 py-2 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner">
              <span className="text-3xl font-black font-display text-white">
                {match.venue === 'Away' ? `${match.opponentGoals} - ${match.ourGoals}` : `${match.ourGoals} - ${match.opponentGoals}`}
              </span>
            </div>

            <div className="flex-1 text-left">
              <h4 className="text-lg font-bold text-white font-display truncate">
                {match.venue === 'Away' ? activeCareer?.club || 'Our Club' : match.opponent}
              </h4>
              <span className="text-xs text-neutral-400">
                {match.venue === 'Away' ? 'Away' : 'Away'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {match.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {match.venue}
            </span>
            <span>•</span>
            <span className="capitalize">{match.matchType}</span>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Scorers & Assists */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
            <div>
              <span className="text-[11px] font-semibold uppercase text-emerald-400 block mb-0.5">Goalscorers</span>
              <p className="text-sm text-neutral-200">{match.scorers || 'No goals registered'}</p>
            </div>
            {match.assists && (
              <div className="pt-2 border-t border-neutral-850">
                <span className="text-[11px] font-semibold uppercase text-blue-400 block mb-0.5">Assists</span>
                <p className="text-sm text-neutral-300">{match.assists}</p>
              </div>
            )}
          </div>

          {/* Player Mode Performance Card */}
          {isPlayerMode && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300">
                    {activeCareer?.playerName || 'Pro'} Performance
                  </span>
                </div>
                {match.playerMOTM && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <Award className="w-3.5 h-3.5" /> Man of the Match
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Rating</span>
                  <span className="text-base font-extrabold text-emerald-400">{match.playerRating || '-'}</span>
                </div>
                <div className="p-2 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Goals</span>
                  <span className="text-base font-extrabold text-white">{match.playerGoals ?? 0}</span>
                </div>
                <div className="p-2 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Assists</span>
                  <span className="text-base font-extrabold text-white">{match.playerAssists ?? 0}</span>
                </div>
                <div className="p-2 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Mins</span>
                  <span className="text-base font-extrabold text-white">{match.playerMinutes ?? 90}'</span>
                </div>
              </div>

              {match.objectiveText && (
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-emerald-500/20 text-neutral-300">
                  {match.objectiveCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                  <span>
                    Objective: <em>{match.objectiveText}</em>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-neutral-400 block text-[10px]">Possession</span>
              <span className="font-bold text-white text-sm">{match.possession || 50}%</span>
            </div>
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-neutral-400 block text-[10px]">Shots</span>
              <span className="font-bold text-white text-sm">{match.shots || 0}</span>
            </div>
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-neutral-400 block text-[10px]">On Target</span>
              <span className="font-bold text-white text-sm">{match.shotsOnTarget || 0}</span>
            </div>
          </div>

          {/* Notes / Storyline */}
          {match.notes && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">Highlights & Notes</span>
              <p className="text-xs text-neutral-300 leading-relaxed">{match.notes}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-950 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(match);
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-xl transition"
          >
            Edit Match
          </button>
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

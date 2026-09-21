import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { SeasonRecord } from '../../types';
import {
  Compass,
  Briefcase,
  User,
  Calendar,
  Target,
  Trophy,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface CareerPageProps {
  onOpenEditCareer: () => void;
  onOpenNewSeasonModal: () => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({
  onOpenEditCareer,
  onOpenNewSeasonModal,
}) => {
  const { activeCareer, formatCurrency, updateCareer } = useCareer();

  if (!activeCareer) return null;

  const isPlayerMode = activeCareer.mode === 'player';

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-display text-white">{activeCareer.name}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {isPlayerMode ? 'Player Mode' : 'Manager Mode'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {activeCareer.club} • {activeCareer.league} • Current Season: {activeCareer.currentSeason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewSeasonModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Start Next Season</span>
          </button>
          <button
            onClick={onOpenEditCareer}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-xs font-semibold rounded-xl transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* PROFILE DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Identity & Configuration
            </span>
            {isPlayerMode ? <User className="w-4 h-4 text-amber-400" /> : <Briefcase className="w-4 h-4 text-emerald-400" />}
          </div>

          <h3 className="text-xl font-bold font-display text-white">
            {isPlayerMode ? activeCareer.playerName : activeCareer.club}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Match Difficulty</span>
              <span className="font-bold text-white">{activeCareer.difficulty}</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Half Length</span>
              <span className="font-bold text-white">{activeCareer.halfLength} Mins</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Currency</span>
              <span className="font-bold text-white">{activeCareer.currency}</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Active Season</span>
              <span className="font-bold text-emerald-400">{activeCareer.currentSeason}</span>
            </div>
          </div>

          {activeCareer.notes && (
            <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Career Story / Philosophy</span>
              <p className="leading-relaxed">{activeCareer.notes}</p>
            </div>
          )}
        </div>

        {/* Board & Season Objectives */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Board & Career Goals
            </span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>

          <h3 className="text-xl font-bold font-display text-white">Season Targets</h3>

          <div className="space-y-2.5">
            {isPlayerMode ? (
              <>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Starting XI Regular</span>
                    <p className="text-neutral-400 text-[11px]">Maintain manager confidence above 80%</p>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Score 25+ Season Goals</span>
                    <p className="text-neutral-400 text-[11px]">Compete for Golden Boot in domestic league</p>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Ballon d'Or Nomination</span>
                    <p className="text-neutral-400 text-[11px]">Average match rating of 8.0+ across UCL and League</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {activeCareer.boardObjectiveLeague && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">League Objective</span>
                      <p className="text-neutral-300 text-[11px]">{activeCareer.boardObjectiveLeague}</p>
                    </div>
                  </div>
                )}

                {activeCareer.boardObjectiveCup && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Continental / Cup Objective</span>
                      <p className="text-neutral-300 text-[11px]">{activeCareer.boardObjectiveCup}</p>
                    </div>
                  </div>
                )}

                {activeCareer.boardObjectiveYouth && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Youth & Financial</span>
                      <p className="text-neutral-300 text-[11px]">{activeCareer.boardObjectiveYouth}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* SEASON-BY-SEASON ARCHIVE TIMELINE */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Historical Archive
            </span>
            <h3 className="text-xl font-bold font-display text-white">Season-by-Season Record</h3>
          </div>

          <button
            onClick={onOpenNewSeasonModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-neutral-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Season Record</span>
          </button>
        </div>

        {activeCareer.seasons.length === 0 ? (
          <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-500">
            No historical season records saved yet. Start or archive a season above!
          </div>
        ) : (
          <div className="space-y-3">
            {activeCareer.seasons.map((s, idx) => (
              <div
                key={idx}
                className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-display text-white">{s.season}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Finished {s.leagueFinish || '1st'}
                    </span>
                  </div>
                  <span className="text-neutral-400 text-[11px] block mt-0.5">
                    {s.points ? `${s.points} Points` : ''} • Record: {s.wins ?? 0}W - {s.draws ?? 0}D - {s.losses ?? 0}L
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {s.trophiesWon && s.trophiesWon.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-[11px]">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{s.trophiesWon.join(', ')}</span>
                    </div>
                  )}

                  {s.topScorer && (
                    <span className="text-neutral-300 font-semibold">
                      ⚽ {s.topScorer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

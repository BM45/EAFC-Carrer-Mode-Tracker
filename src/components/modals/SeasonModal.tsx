import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { SeasonRecord } from '../../types';
import { X, Calendar, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeasonModal: React.FC<SeasonModalProps> = ({ isOpen, onClose }) => {
  const { activeCareer, addSeasonRecord, updateCareer } = useCareer();

  const [seasonName, setSeasonName] = useState('2026/27');
  const [leagueFinish, setLeagueFinish] = useState('1st - Champions');
  const [points, setPoints] = useState(89);
  const [wins, setWins] = useState(28);
  const [draws, setDraws] = useState(5);
  const [losses, setLosses] = useState(5);
  const [trophiesWon, setTrophiesWon] = useState('La Liga, UEFA Champions League');
  const [topScorer, setTopScorer] = useState('Vinícius Jr (32 Goals)');
  const [bestPlayer, setBestPlayer] = useState('Jude Bellingham');
  const [setAsCurrent, setSetAsCurrent] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCareer) return;

    const record: SeasonRecord = {
      season: seasonName.trim(),
      leagueFinish: leagueFinish.trim(),
      points: Number(points),
      wins: Number(wins),
      draws: Number(draws),
      losses: Number(losses),
      trophiesWon: trophiesWon
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      topScorer: topScorer.trim(),
      bestPlayer: bestPlayer.trim(),
    };

    addSeasonRecord(record);

    if (setAsCurrent) {
      updateCareer(activeCareer.id, {
        currentSeason: seasonName.trim(),
      });
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#fbbf24'],
      });
    } catch (err) {
      console.error(err);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Season Archive</span>
              <h3 className="text-xl font-bold font-display text-white">Start / Archive Season</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Season Tag *</label>
              <input
                type="text"
                required
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                placeholder="2026/27"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">League Finish</label>
              <input
                type="text"
                value={leagueFinish}
                onChange={(e) => setLeagueFinish(e.target.value)}
                placeholder="1st - Champions"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Wins</label>
              <input
                type="number"
                value={wins}
                onChange={(e) => setWins(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-emerald-400 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Draws</label>
              <input
                type="number"
                value={draws}
                onChange={(e) => setDraws(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-amber-400 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Losses</label>
              <input
                type="number"
                value={losses}
                onChange={(e) => setLosses(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-rose-400 text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Trophies Won (comma separated)
            </label>
            <input
              type="text"
              value={trophiesWon}
              onChange={(e) => setTrophiesWon(e.target.value)}
              placeholder="e.g. La Liga, UEFA Champions League"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Season Top Scorer</label>
              <input
                type="text"
                value={topScorer}
                onChange={(e) => setTopScorer(e.target.value)}
                placeholder="e.g. Vinícius Jr (34)"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Player of Season</label>
              <input
                type="text"
                value={bestPlayer}
                onChange={(e) => setBestPlayer(e.target.value)}
                placeholder="e.g. Jude Bellingham"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="setAsCurrentSeason"
              checked={setAsCurrent}
              onChange={(e) => setSetAsCurrent(e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-emerald-500 focus:ring-0"
            />
            <label htmlFor="setAsCurrentSeason" className="text-xs text-neutral-300 font-medium cursor-pointer">
              Set as the active season for tracking new matches
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Save Season Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

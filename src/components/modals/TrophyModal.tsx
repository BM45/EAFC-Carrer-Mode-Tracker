import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Trophy } from '../../types';
import { X, Trophy as TrophyIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trophyToEdit?: Trophy | null;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({ isOpen, onClose, trophyToEdit }) => {
  const { activeCareer, addTrophy, updateTrophy, selectedSeason } = useCareer();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Trophy['category']>('continental');
  const [competition, setCompetition] = useState('UEFA Champions League');
  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [finalOpponent, setFinalOpponent] = useState('');
  const [finalScore, setFinalScore] = useState('2 - 1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mvp, setMvp] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (trophyToEdit) {
      setName(trophyToEdit.name);
      setCategory(trophyToEdit.category);
      setCompetition(trophyToEdit.competition);
      setSeason(trophyToEdit.season);
      setFinalOpponent(trophyToEdit.finalOpponent || '');
      setFinalScore(trophyToEdit.finalScore || '');
      setDate(trophyToEdit.date);
      setMvp(trophyToEdit.mvp || '');
      setNotes(trophyToEdit.notes || '');
    } else {
      setName('UEFA Champions League');
      setCategory('continental');
      setCompetition('UEFA Champions League');
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setFinalOpponent('Bayern Munich');
      setFinalScore('3 - 1');
      setDate(new Date().toISOString().split('T')[0]);
      setMvp('');
      setNotes('');
    }
  }, [trophyToEdit, isOpen, activeCareer, selectedSeason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: name.trim(),
      category,
      competition: competition.trim(),
      season,
      finalOpponent: finalOpponent.trim(),
      finalScore: finalScore.trim(),
      date,
      mvp: mvp.trim(),
      notes: notes.trim(),
    };

    if (trophyToEdit) {
      updateTrophy(trophyToEdit.id, data);
    } else {
      addTrophy(data);
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#fbbf24', '#ffffff', '#3b82f6'],
        });
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <TrophyIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Honours</span>
              <h3 className="text-xl font-bold font-display text-white">
                {trophyToEdit ? 'Edit Trophy' : 'Add Trophy to Cabinet'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Trophy Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. UEFA Champions League, Premier League Trophy"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-semibold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Trophy['category'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="league">Domestic League (Gold)</option>
                <option value="continental">Continental / UCL (Star)</option>
                <option value="domestic_cup">Domestic Cup (Silver)</option>
                <option value="super_cup">Super Cup</option>
                <option value="international">World Cup / International</option>
                <option value="preseason">Pre-Season Shield</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Season</label>
              <input
                type="text"
                required
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="2025/26"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Final Opponent</label>
              <input
                type="text"
                value={finalOpponent}
                onChange={(e) => setFinalOpponent(e.target.value)}
                placeholder="e.g. Manchester City"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Final Score</label>
              <input
                type="text"
                value={finalScore}
                onChange={(e) => setFinalScore(e.target.value)}
                placeholder="e.g. 3 - 1"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-center font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Final MVP / Star</label>
              <input
                type="text"
                value={mvp}
                onChange={(e) => setMvp(e.target.value)}
                placeholder="e.g. Vinícius Jr"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Date Won</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Tournament Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Unbeaten run in the tournament, epic comeback in semi-finals..."
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
            />
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
              className="px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              {trophyToEdit ? 'Update Trophy' : 'Lift Trophy 🏆'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

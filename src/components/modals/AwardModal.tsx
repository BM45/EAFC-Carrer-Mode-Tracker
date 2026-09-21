import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Award } from '../../types';
import { X, Award as AwardIcon } from 'lucide-react';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  awardToEdit?: Award | null;
}

export const AwardModal: React.FC<AwardModalProps> = ({ isOpen, onClose, awardToEdit }) => {
  const { activeCareer, addAward, updateAward, selectedSeason } = useCareer();

  const [name, setName] = useState("Ballon d'Or");
  const [recipient, setRecipient] = useState(
    activeCareer?.mode === 'player' ? activeCareer.playerName || 'My Player' : 'Player Name'
  );
  const [competition, setCompetition] = useState('World / FIFA');
  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [stats, setStats] = useState('');
  const [type, setType] = useState<Award['type']>('ballon_dor');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (awardToEdit) {
      setName(awardToEdit.name);
      setRecipient(awardToEdit.recipient);
      setCompetition(awardToEdit.competition || '');
      setSeason(awardToEdit.season);
      setStats(awardToEdit.stats || '');
      setType(awardToEdit.type);
      setDate(awardToEdit.date);
    } else {
      setName("Ballon d'Or");
      setRecipient(activeCareer?.mode === 'player' ? activeCareer.playerName || 'My Player' : 'Player Name');
      setCompetition('World / FIFA');
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setStats('38 Goals, 14 Assists in 42 Matches');
      setType('ballon_dor');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [awardToEdit, isOpen, activeCareer, selectedSeason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: name.trim(),
      recipient: recipient.trim(),
      competition: competition.trim(),
      season,
      stats: stats.trim(),
      type,
      date,
    };

    if (awardToEdit) {
      updateAward(awardToEdit.id, data);
    } else {
      addAward(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <AwardIcon className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Individual Accolade</span>
              <h3 className="text-xl font-bold font-display text-white">
                {awardToEdit ? 'Edit Award' : 'Log Individual Award'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Award Preset / Type</label>
            <select
              value={type}
              onChange={(e) => {
                const val = e.target.value as Award['type'];
                setType(val);
                if (val === 'ballon_dor') setName("Ballon d'Or");
                if (val === 'golden_boot') setName('Golden Boot (Top Scorer)');
                if (val === 'golden_glove') setName('Golden Glove (Best GK)');
                if (val === 'potm') setName('Player of the Month');
                if (val === 'manager_of_season') setName('Manager of the Season');
                if (val === 'young_player') setName('Young Player of the Year (Golden Boy)');
                if (val === 'toty') setName('Team of the Season (TOTS)');
              }}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ballon_dor">🌟 Ballon d'Or</option>
              <option value="golden_boot">⚽ Golden Boot / Pichichi</option>
              <option value="golden_glove">🧤 Golden Glove</option>
              <option value="potm">🏅 Player of the Month</option>
              <option value="manager_of_season">👔 Manager of the Season</option>
              <option value="young_player">🧒 Golden Boy / Young Player</option>
              <option value="toty">🛡️ Team of the Year (TOTY)</option>
              <option value="custom">✨ Custom Award</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Award Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Recipient (Player / Manager) *</label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Vinícius Jr or Marcus Vance"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Competition / Body</label>
              <input
                type="text"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                placeholder="e.g. UEFA, Premier League"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Winning Stats / Highlight</label>
            <input
              type="text"
              value={stats}
              onChange={(e) => setStats(e.target.value)}
              placeholder="e.g. 34 Goals in 36 League Games, 5 MOTMs"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
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
              {awardToEdit ? 'Update Award' : 'Save Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

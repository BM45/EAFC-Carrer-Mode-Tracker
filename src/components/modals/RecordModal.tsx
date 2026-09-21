import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { RecordItem } from '../../types';
import { X, Flame } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: RecordItem | null;
}

export const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, recordToEdit }) => {
  const { activeCareer, addRecord, updateRecord, selectedSeason } = useCareer();

  const [title, setTitle] = useState('');
  const [holder, setHolder] = useState('');
  const [value, setValue] = useState('');
  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [category, setCategory] = useState<RecordItem['category']>('goals');

  useEffect(() => {
    if (recordToEdit) {
      setTitle(recordToEdit.title);
      setHolder(recordToEdit.holder);
      setValue(recordToEdit.value);
      setSeason(recordToEdit.season);
      setCategory(recordToEdit.category);
    } else {
      setTitle('');
      setHolder(activeCareer?.mode === 'player' ? activeCareer.playerName || '' : activeCareer?.club || '');
      setValue('');
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setCategory('goals');
    }
  }, [recordToEdit, isOpen, activeCareer, selectedSeason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: title.trim(),
      holder: holder.trim(),
      value: value.trim(),
      season,
      category,
    };

    if (recordToEdit) {
      updateRecord(recordToEdit.id, data);
    } else {
      addRecord(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase">Milestones</span>
              <h3 className="text-xl font-bold font-display text-white">
                {recordToEdit ? 'Edit Career Record' : 'Add Career Record'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Record Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RecordItem['category'])}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="goals">⚽ Goals Record</option>
              <option value="assists">🎯 Assists Record</option>
              <option value="appearances">🏃 Appearances / Longevity</option>
              <option value="streaks">🔥 Winning / Unbeaten Streak</option>
              <option value="transfers">💰 Transfer Signing / Sale Record</option>
              <option value="club">🏛️ Club Trophy / History Record</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Record Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Most Goals in a Single Season, Fastest Hat-trick"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Record Holder *</label>
              <input
                type="text"
                required
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                placeholder="e.g. Kylian Mbappé"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Value / Figure *</label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 48 Goals or 18 Games"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-bold text-orange-400 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Season Achieved</label>
            <input
              type="text"
              required
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="2025/26"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
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
              className="px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-orange-400 hover:bg-orange-300 rounded-xl transition shadow-lg shadow-orange-500/20"
            >
              {recordToEdit ? 'Update Record' : 'Lock In Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

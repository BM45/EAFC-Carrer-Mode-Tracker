import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { JournalEntry } from '../../types';
import { X, BookOpen } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: JournalEntry | null;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, entryToEdit }) => {
  const { activeCareer, addJournalEntry, updateJournalEntry, selectedSeason } = useCareer();

  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('press');
  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      setHeadline(entryToEdit.headline || '');
      setCategory(entryToEdit.category);
      setSeason(entryToEdit.season);
      setDate(entryToEdit.date);
      setContent(entryToEdit.content);
    } else {
      setTitle('');
      setHeadline('');
      setCategory('press');
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setDate(new Date().toISOString().split('T')[0]);
      setContent('');
    }
  }, [entryToEdit, isOpen, activeCareer, selectedSeason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: title.trim(),
      headline: headline.trim(),
      category,
      season,
      date,
      content: content.trim(),
    };

    if (entryToEdit) {
      updateJournalEntry(entryToEdit.id, data);
    } else {
      addJournalEntry(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Storylines & Press</span>
              <h3 className="text-xl font-bold font-display text-white">
                {entryToEdit ? 'Edit Journal Entry' : 'New Journal Entry'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Story Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JournalEntry['category'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="press">🎙️ Press Conference / Media</option>
                <option value="derby">⚔️ Derby / Rivalry Clash</option>
                <option value="transfer">💼 Transfer Window Story</option>
                <option value="milestone">⭐ Career Milestone</option>
                <option value="drama">⚡ Locker Room Drama / Injury</option>
                <option value="tactics">♟️ Tactical Masterclass</option>
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
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Entry Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unbelievable Comeback in Madrid Derby"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Media Headline (Optional)</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Marca: 'Masterclass tactics deliver silverware in stoppage time'"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Story Content *</label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the memories, thoughts, press quotes, or player perspective here..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-indigo-500 focus:outline-none"
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
              className="px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-indigo-400 hover:bg-indigo-300 rounded-xl transition shadow-lg shadow-indigo-500/20"
            >
              {entryToEdit ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

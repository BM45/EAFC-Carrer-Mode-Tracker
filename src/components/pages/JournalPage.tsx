import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { JournalEntry } from '../../types';
import { BookOpen, Plus, Trash2, Edit2, Newspaper, Swords, Zap, Star } from 'lucide-react';

interface JournalPageProps {
  onOpenJournalModal: () => void;
  onEditJournal: (entry: JournalEntry) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  onOpenJournalModal,
  onEditJournal,
}) => {
  const { journal, deleteJournalEntry, selectedSeason } = useCareer();
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = journal.filter((j) => {
    if (catFilter === 'ALL') return true;
    return j.category === catFilter;
  });

  const getCategoryBadge = (cat: JournalEntry['category']) => {
    switch (cat) {
      case 'press':
        return { label: 'Press Conference', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'derby':
        return { label: 'Derby Clash', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'transfer':
        return { label: 'Transfer Story', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'milestone':
        return { label: 'Milestone', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Tactics & Story', color: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Media & Lore
            </span>
            <span className="text-xs text-neutral-400">
              ({journal.length} Stories in {selectedSeason === 'all' ? 'All Seasons' : selectedSeason})
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Career Journal & Stories</h2>
        </div>

        <button
          onClick={onOpenJournalModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-400 hover:bg-indigo-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Story Entry</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 text-xs">
        {[
          { id: 'ALL', label: 'All Stories' },
          { id: 'press', label: '🎙️ Press Conferences' },
          { id: 'derby', label: '⚔️ Derbies & Rivals' },
          { id: 'transfer', label: '💼 Transfers & Rumours' },
          { id: 'milestone', label: '⭐ Career Milestones' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatFilter(c.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              catFilter === c.id
                ? 'bg-indigo-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-indigo-400/40" />
          <h3 className="text-base font-bold text-white mb-1">No Journal Entries Yet</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Document legendary match narratives, manager press quotes, and locker room stories.
          </p>
          <button
            onClick={onOpenJournalModal}
            className="px-4 py-2 rounded-xl bg-indigo-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Write Story
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((j) => {
            const badge = getCategoryBadge(j.category);

            return (
              <div
                key={j.id}
                className="group p-6 bg-neutral-900 hover:bg-neutral-850/80 border border-neutral-800 hover:border-indigo-500/40 rounded-3xl transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Season {j.season} • {j.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onEditJournal(j)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete journal entry: "${j.title}"?`)) {
                          deleteJournalEntry(j.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white">{j.title}</h3>
                  {j.headline && (
                    <div className="mt-1 text-sm font-semibold text-neutral-300 italic border-l-2 border-indigo-400 pl-3 py-0.5 bg-neutral-950/40 rounded-r-lg">
                      "{j.headline}"
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line pt-1">
                  {j.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { RecordItem } from '../../types';
import { Flame, Plus, Trash2, Edit2, Trophy, Star } from 'lucide-react';

interface RecordsPageProps {
  onOpenRecordModal: () => void;
  onEditRecord: (record: RecordItem) => void;
}

export const RecordsPage: React.FC<RecordsPageProps> = ({
  onOpenRecordModal,
  onEditRecord,
}) => {
  const { records, deleteRecord } = useCareer();
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = records.filter((r) => {
    if (catFilter === 'ALL') return true;
    return r.category === catFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              Hall of Fame
            </span>
            <span className="text-xs text-neutral-400">({records.length} Historic Milestones)</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Career Records & Milestones</h2>
        </div>

        <button
          onClick={onOpenRecordModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-400 hover:bg-orange-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 text-xs">
        {[
          { id: 'ALL', label: 'All Records' },
          { id: 'goals', label: '⚽ Goals' },
          { id: 'assists', label: '🎯 Assists' },
          { id: 'appearances', label: '🏃 Appearances' },
          { id: 'streaks', label: '🔥 Streaks' },
          { id: 'transfers', label: '💰 Transfers' },
          { id: 'club', label: '🏛️ Club History' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCatFilter(item.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              catFilter === item.id
                ? 'bg-orange-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <Flame className="w-12 h-12 mx-auto mb-3 text-orange-400/40" />
          <h3 className="text-base font-bold text-white mb-1">No Records Yet</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Set records for most goals in a season, longest winning streak, or all-time top scorer.
          </p>
          <button
            onClick={onOpenRecordModal}
            className="px-4 py-2 rounded-xl bg-orange-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Add Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="group p-5 bg-neutral-900 hover:bg-neutral-850/80 border border-neutral-800 hover:border-orange-500/30 rounded-3xl transition shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEditRecord(rec)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete record: ${rec.title}?`)) {
                        deleteRecord(rec.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 block mb-0.5">
                  {rec.category.toUpperCase()} • Season {rec.season}
                </span>
                <h3 className="text-base font-bold font-display text-white">{rec.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-semibold">{rec.holder}</span>
                  <span className="text-xl font-black font-display text-orange-400">{rec.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

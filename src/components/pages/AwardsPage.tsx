import React from 'react';
import { useCareer } from '../../context/CareerContext';
import { Award as AwardType } from '../../types';
import { Award, Plus, Trash2, Edit2, Calendar, Star, Trophy } from 'lucide-react';

interface AwardsPageProps {
  onOpenAwardModal: () => void;
  onEditAward: (award: AwardType) => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = ({ onOpenAwardModal, onEditAward }) => {
  const { awards, deleteAward, selectedSeason } = useCareer();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Individual Accolades
            </span>
            <span className="text-xs text-neutral-400">
              ({awards.length} Awards in {selectedSeason === 'all' ? 'All Seasons' : selectedSeason})
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Individual Honours</h2>
        </div>

        <button
          onClick={onOpenAwardModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Award</span>
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <Award className="w-12 h-12 mx-auto mb-3 text-amber-400/40" />
          <h3 className="text-base font-bold text-white mb-1">No Individual Awards Yet</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Record Ballon d'Or, Golden Boot, Player of the Month or Manager of the Season accolades!
          </p>
          <button
            onClick={onOpenAwardModal}
            className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Add Award
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((aw) => (
            <div
              key={aw.id}
              className="group p-5 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-3xl transition shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEditAward(aw)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete award ${aw.name}?`)) {
                        deleteAward(aw.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  {aw.competition || 'League & Continental'} • Season {aw.season}
                </span>
                <h3 className="text-xl font-bold font-display text-white">{aw.name}</h3>
                <p className="text-sm font-semibold text-emerald-400 mt-1">
                  Recipient: <strong className="text-white">{aw.recipient}</strong>
                </p>
              </div>

              {aw.stats && (
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300">
                  {aw.stats}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

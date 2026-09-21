import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Transfer } from '../../types';
import { getClubDetails, getPlayerPhoto } from '../../utils/assets';
import {
  ArrowRightLeft,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Trash2,
  Edit2,
  Briefcase,
} from 'lucide-react';

interface TransfersPageProps {
  onOpenTransferModal: () => void;
  onEditTransfer: (transfer: Transfer) => void;
}

export const TransfersPage: React.FC<TransfersPageProps> = ({
  onOpenTransferModal,
  onEditTransfer,
}) => {
  const { transfers, deleteTransfer, activeCareer, formatCurrency, selectedSeason } = useCareer();

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IN' | 'OUT' | 'LOAN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Net Spend Calculations
  const totalSpent = transfers
    .filter((t) => t.type === 'IN' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.fee, 0);

  const totalReceived = transfers
    .filter((t) => t.type === 'OUT' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.fee, 0);

  const netSpend = totalSpent - totalReceived;

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromClub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toClub.toLowerCase().includes(searchQuery.toLowerCase());

    if (typeFilter === 'ALL') return matchesSearch;
    if (typeFilter === 'IN') return matchesSearch && (t.type === 'IN' || t.type === 'FREE');
    if (typeFilter === 'OUT') return matchesSearch && t.type === 'OUT';
    if (typeFilter === 'LOAN') return matchesSearch && (t.type === 'LOAN_IN' || t.type === 'LOAN_OUT');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & FINANCIAL SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Transfer Market
            </span>
            <span className="text-xs text-neutral-400">
              ({transfers.length} Deals in {selectedSeason === 'all' ? 'All Seasons' : selectedSeason})
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Transfers & Contracts</h2>
        </div>

        <button
          onClick={onOpenTransferModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record Transfer</span>
        </button>
      </div>

      {/* FINANCIAL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Expenditure (Signings)</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-display text-rose-400">
            {formatCurrency(totalSpent)}
          </div>
          <span className="text-[11px] text-neutral-400">Total fees paid</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Income (Sales)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-400">
            {formatCurrency(totalReceived)}
          </div>
          <span className="text-[11px] text-neutral-400">Total player sales</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Net Transfer Spend</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div
            className={`text-2xl font-black font-display ${
              netSpend > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {netSpend > 0 ? `-${formatCurrency(netSpend)}` : `+${formatCurrency(Math.abs(netSpend))}`}
          </div>
          <span className="text-[11px] text-neutral-400">
            Remaining Budget: {formatCurrency(activeCareer?.transferBudget || 0)}
          </span>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player or club..."
              className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            {(['ALL', 'IN', 'OUT', 'LOAN'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  typeFilter === t
                    ? 'bg-emerald-400 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All Deals' : t === 'IN' ? 'Incoming' : t === 'OUT' ? 'Outgoing' : 'Loans'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DEALS LIST */}
      {filteredTransfers.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl text-neutral-400">
          <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <h3 className="text-base font-bold text-white mb-1">No Transfers Found</h3>
          <p className="text-xs text-neutral-400 mb-4">
            No transfer deals logged matching the current filter.
          </p>
          <button
            onClick={onOpenTransferModal}
            className="px-4 py-2 rounded-xl bg-emerald-400 text-neutral-950 text-xs font-bold"
          >
            ＋ Record Deal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransfers.map((t) => {
            const isIncoming = t.type === 'IN' || t.type === 'FREE';

            return (
              <div
                key={t.id}
                className="group p-5 bg-neutral-900 hover:bg-neutral-850/80 border border-neutral-800 hover:border-neutral-700 rounded-3xl transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isIncoming
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : t.type === 'OUT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {t.type}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Season {t.season} • {t.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onEditTransfer(t)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete transfer of ${t.player}?`)) {
                          deleteTransfer(t.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {(() => {
                  const playerPhoto = getPlayerPhoto(t.player);
                  const fromClubDetails = getClubDetails(t.fromClub);
                  const toClubDetails = getClubDetails(t.toClub);

                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {playerPhoto ? (
                          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
                            <img
                              src={playerPhoto}
                              alt={t.player}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {t.player.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-bold font-display text-white">{t.player}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                            {fromClubDetails.logo && (
                              <img
                                src={fromClubDetails.logo}
                                alt={t.fromClub}
                                referrerPolicy="no-referrer"
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <span className="font-semibold text-neutral-300">{t.fromClub}</span>
                            <span className="text-neutral-500">→</span>
                            {toClubDetails.logo && (
                              <img
                                src={toClubDetails.logo}
                                alt={t.toClub}
                                referrerPolicy="no-referrer"
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <span className="font-semibold text-white">{t.toClub}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl font-black font-display text-emerald-400">
                          {formatCurrency(t.fee)}
                        </span>
                        {t.wage && (
                          <span className="text-[10px] text-neutral-400 block">
                            {formatCurrency(t.wage)}/w
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs text-neutral-400">
                  <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-semibold text-neutral-300">
                    Status: {t.status}
                  </span>
                  {t.notes && <span className="truncate max-w-[200px] text-[11px] italic">{t.notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

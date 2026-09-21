import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Transfer } from '../../types';
import { X, ArrowRightLeft } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferToEdit?: Transfer | null;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, transferToEdit }) => {
  const { activeCareer, addTransfer, updateTransfer, selectedSeason } = useCareer();

  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [player, setPlayer] = useState('');
  const [type, setType] = useState<Transfer['type']>('IN');
  const [fromClub, setFromClub] = useState('');
  const [toClub, setToClub] = useState(activeCareer?.club || '');
  const [fee, setFee] = useState(45000000);
  const [wage, setWage] = useState(120000);
  const [status, setStatus] = useState<Transfer['status']>('Completed');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (transferToEdit) {
      setSeason(transferToEdit.season);
      setDate(transferToEdit.date);
      setPlayer(transferToEdit.player);
      setType(transferToEdit.type);
      setFromClub(transferToEdit.fromClub);
      setToClub(transferToEdit.toClub);
      setFee(transferToEdit.fee);
      setWage(transferToEdit.wage || 0);
      setStatus(transferToEdit.status);
      setNotes(transferToEdit.notes || '');
    } else {
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setDate(new Date().toISOString().split('T')[0]);
      setPlayer('');
      setType('IN');
      setFromClub('Bayern Munich');
      setToClub(activeCareer?.club || 'Your Club');
      setFee(50000000);
      setWage(140000);
      setStatus('Completed');
      setNotes('');
    }
  }, [transferToEdit, isOpen, activeCareer, selectedSeason]);

  // Handle type change automatic club setup
  const handleTypeChange = (newType: Transfer['type']) => {
    setType(newType);
    if (newType === 'IN' || newType === 'LOAN_IN') {
      setToClub(activeCareer?.club || '');
      if (fromClub === activeCareer?.club) setFromClub('');
    } else if (newType === 'OUT' || newType === 'LOAN_OUT') {
      setFromClub(activeCareer?.club || '');
      if (toClub === activeCareer?.club) setToClub('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      season,
      date,
      player: player.trim(),
      type,
      fromClub: fromClub.trim(),
      toClub: toClub.trim(),
      fee,
      wage,
      status,
      notes: notes.trim(),
    };

    if (transferToEdit) {
      updateTransfer(transferToEdit.id, data);
    } else {
      addTransfer(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Transfer Market</span>
              <h3 className="text-xl font-bold font-display text-white">
                {transferToEdit ? 'Edit Transfer Deal' : 'Log Transfer Deal'}
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
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Season</label>
              <input
                type="text"
                required
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="2025/26"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Player Name *</label>
            <input
              type="text"
              required
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="e.g. Florian Wirtz"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Transfer Type</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as Transfer['type'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="IN">Incoming (Signing)</option>
                <option value="OUT">Outgoing (Sold)</option>
                <option value="LOAN_IN">Loan In</option>
                <option value="LOAN_OUT">Loan Out</option>
                <option value="FREE">Free Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Deal Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Transfer['status'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option>Completed</option>
                <option>Offer Received</option>
                <option>Rumour</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Selling Club (From)</label>
              <input
                type="text"
                required
                value={fromClub}
                onChange={(e) => setFromClub(e.target.value)}
                placeholder="e.g. Bayer Leverkusen"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Buying Club (To)</label>
              <input
                type="text"
                required
                value={toClub}
                onChange={(e) => setToClub(e.target.value)}
                placeholder="e.g. Real Madrid CF"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Transfer Fee ({activeCareer?.currency})
              </label>
              <input
                type="number"
                min={0}
                step={500000}
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Agreed Wage / Week
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={wage}
                onChange={(e) => setWage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Contract / Scout Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Release clause negotiated, sell-on fee clause, player promised starting spot..."
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
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
              className="px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              {transferToEdit ? 'Update Deal' : 'Submit Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

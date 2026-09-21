import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Player, Position } from '../../types';
import { X } from 'lucide-react';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose, playerToEdit }) => {
  const { addPlayer, updatePlayer, activeCareer } = useCareer();

  const [name, setName] = useState('');
  const [number, setNumber] = useState(10);
  const [position, setPosition] = useState<Position>('ST');
  const [age, setAge] = useState(21);
  const [nationality, setNationality] = useState('Spain');
  const [overall, setOverall] = useState(78);
  const [potential, setPotential] = useState(88);
  const [growth, setGrowth] = useState(1);
  const [value, setValue] = useState(25000000);
  const [wage, setWage] = useState(65000);
  const [contractExpiry, setContractExpiry] = useState('2028');
  const [role, setRole] = useState<Player['role']>('Important');
  const [status, setStatus] = useState<Player['status']>('Fit');
  const [lineupStatus, setLineupStatus] = useState<Player['lineupStatus']>('starter');

  const [appearances, setAppearances] = useState(15);
  const [goals, setGoals] = useState(5);
  const [assists, setAssists] = useState(4);
  const [cleanSheets, setCleanSheets] = useState(0);
  const [yellowCards, setYellowCards] = useState(1);
  const [redCards, setRedCards] = useState(0);
  const [avgRating, setAvgRating] = useState(7.4);

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setNumber(playerToEdit.number);
      setPosition(playerToEdit.position);
      setAge(playerToEdit.age);
      setNationality(playerToEdit.nationality);
      setOverall(playerToEdit.overall);
      setPotential(playerToEdit.potential);
      setGrowth(playerToEdit.growth);
      setValue(playerToEdit.value);
      setWage(playerToEdit.wage);
      setContractExpiry(playerToEdit.contractExpiry);
      setRole(playerToEdit.role);
      setStatus(playerToEdit.status);
      setLineupStatus(playerToEdit.lineupStatus);
      setAppearances(playerToEdit.appearances);
      setGoals(playerToEdit.goals);
      setAssists(playerToEdit.assists);
      setCleanSheets(playerToEdit.cleanSheets);
      setYellowCards(playerToEdit.yellowCards);
      setRedCards(playerToEdit.redCards);
      setAvgRating(playerToEdit.avgRating);
    } else {
      setName('');
      setNumber(10);
      setPosition('ST');
      setAge(21);
      setNationality('Spain');
      setOverall(78);
      setPotential(88);
      setGrowth(1);
      setValue(25000000);
      setWage(65000);
      setContractExpiry('2028');
      setRole('Important');
      setStatus('Fit');
      setLineupStatus('starter');
      setAppearances(0);
      setGoals(0);
      setAssists(0);
      setCleanSheets(0);
      setYellowCards(0);
      setRedCards(0);
      setAvgRating(7.0);
    }
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerData = {
      name: name.trim(),
      number,
      position,
      age,
      nationality: nationality.trim(),
      overall,
      potential,
      growth,
      value,
      wage,
      contractExpiry,
      role,
      status,
      lineupStatus,
      appearances,
      goals,
      assists,
      cleanSheets,
      yellowCards,
      redCards,
      avgRating,
    };

    if (playerToEdit) {
      updatePlayer(playerToEdit.id, playerData);
    } else {
      addPlayer(playerData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Squad Management</span>
            <h3 className="text-xl font-bold font-display text-white">
              {playerToEdit ? 'Edit Player' : 'Add Player to Squad'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Player Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bukayo Saka"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Squad #</label>
              <input
                type="number"
                min={1}
                max={99}
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="GK">GK</option>
                <option value="CB">CB</option>
                <option value="LB">LB</option>
                <option value="RB">RB</option>
                <option value="CDM">CDM</option>
                <option value="CM">CM</option>
                <option value="CAM">CAM</option>
                <option value="LW">LW</option>
                <option value="RW">RW</option>
                <option value="ST">ST</option>
                <option value="CF">CF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Age</label>
              <input
                type="number"
                min={15}
                max={45}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">OVR</label>
              <input
                type="number"
                min={40}
                max={99}
                value={overall}
                onChange={(e) => setOverall(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">POT</label>
              <input
                type="number"
                min={40}
                max={99}
                value={potential}
                onChange={(e) => setPotential(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-amber-400 font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. France"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Squad Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Player['role'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option>Crucial</option>
                <option>Important</option>
                <option>Rotation</option>
                <option>Sporadic</option>
                <option>Prospect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Lineup Status</label>
              <select
                value={lineupStatus}
                onChange={(e) => setLineupStatus(e.target.value as Player['lineupStatus'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="starter">Starting XI</option>
                <option value="bench">Bench</option>
                <option value="reserve">Reserves</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Value ({activeCareer?.currency})</label>
              <input
                type="number"
                min={0}
                step={500000}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Weekly Wage</label>
              <input
                type="number"
                min={0}
                step={5000}
                value={wage}
                onChange={(e) => setWage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Contract Expiry</label>
              <input
                type="text"
                value={contractExpiry}
                onChange={(e) => setContractExpiry(e.target.value)}
                placeholder="2028"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Fitness Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Player['status'])}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              >
                <option>Fit</option>
                <option>Injured</option>
                <option>Suspended</option>
                <option>Fatigued</option>
              </select>
            </div>
          </div>

          {/* Season Stats */}
          <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Season Stats</div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-neutral-400 block">Appearances</span>
                <input
                  type="number"
                  min={0}
                  value={appearances}
                  onChange={(e) => setAppearances(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-center text-sm font-semibold"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Goals</span>
                <input
                  type="number"
                  min={0}
                  value={goals}
                  onChange={(e) => setGoals(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-center text-sm font-semibold text-emerald-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Assists</span>
                <input
                  type="number"
                  min={0}
                  value={assists}
                  onChange={(e) => setAssists(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-center text-sm font-semibold text-blue-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Avg Rating</span>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={avgRating}
                  onChange={(e) => setAvgRating(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-center text-sm font-semibold text-amber-400"
                />
              </div>
            </div>
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
              {playerToEdit ? 'Update Player' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

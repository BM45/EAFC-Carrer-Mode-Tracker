import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Career, CareerMode, Position } from '../../types';
import { X, Briefcase, User } from 'lucide-react';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerToEdit?: Career | null;
}

export const CareerModal: React.FC<CareerModalProps> = ({ isOpen, onClose, careerToEdit }) => {
  const { createCareer, updateCareer } = useCareer();

  const [mode, setMode] = useState<CareerMode>('manager');
  const [name, setName] = useState('');
  const [club, setClub] = useState('');
  const [league, setLeague] = useState('LaLiga EA Sports');
  const [startingSeason, setStartingSeason] = useState('2025/26');
  const [difficulty, setDifficulty] = useState<Career['difficulty']>('World Class');
  const [currency, setCurrency] = useState<'€' | '£' | '$'>('€');

  // Manager Mode fields
  const [managerName, setManagerName] = useState('');
  const [transferBudget, setTransferBudget] = useState(120000000);
  const [wageBudget, setWageBudget] = useState(2500000);
  const [formation, setFormation] = useState('4-3-3');
  const [tacticalStyle, setTacticalStyle] = useState('Gegenpressing');
  const [boardObjectiveLeague, setBoardObjectiveLeague] = useState('Fight for the league championship');

  // Player Mode fields
  const [playerName, setPlayerName] = useState('');
  const [playerNationality, setPlayerNationality] = useState('England');
  const [playerAge, setPlayerAge] = useState(19);
  const [playerOverall, setPlayerOverall] = useState(79);
  const [playerPotential, setPlayerPotential] = useState(91);
  const [playerPosition, setPlayerPosition] = useState<Position>('ST');
  const [playerArchetype, setPlayerArchetype] = useState('Clinical Finisher');
  const [preferredFoot, setPreferredFoot] = useState<'Right' | 'Left'>('Right');
  const [jerseyNumber, setJerseyNumber] = useState(9);
  const [weeklyWage, setWeeklyWage] = useState(45000);
  const [marketValue, setMarketValue] = useState(38000000);

  useEffect(() => {
    if (careerToEdit) {
      setMode(careerToEdit.mode);
      setName(careerToEdit.name);
      setClub(careerToEdit.club);
      setLeague(careerToEdit.league);
      setStartingSeason(careerToEdit.startingSeason);
      setDifficulty(careerToEdit.difficulty);
      setCurrency(careerToEdit.currency);

      if (careerToEdit.mode === 'manager') {
        setManagerName(careerToEdit.managerName || '');
        setTransferBudget(careerToEdit.transferBudget || 100000000);
        setWageBudget(careerToEdit.wageBudget || 2000000);
        setFormation(careerToEdit.formation || '4-3-3');
        setTacticalStyle(careerToEdit.tacticalStyle || 'Gegenpressing');
        setBoardObjectiveLeague(careerToEdit.boardObjectiveLeague || '');
      } else {
        setPlayerName(careerToEdit.playerName || '');
        setPlayerNationality(careerToEdit.playerNationality || 'England');
        setPlayerAge(careerToEdit.playerAge || 19);
        setPlayerOverall(careerToEdit.playerOverall || 80);
        setPlayerPotential(careerToEdit.playerPotential || 90);
        setPlayerPosition(careerToEdit.playerPosition || 'ST');
        setPlayerArchetype(careerToEdit.playerArchetype || 'Clinical Finisher');
        setPreferredFoot(careerToEdit.preferredFoot || 'Right');
        setJerseyNumber(careerToEdit.jerseyNumber || 9);
        setWeeklyWage(careerToEdit.weeklyWage || 40000);
        setMarketValue(careerToEdit.marketValue || 35000000);
      }
    } else {
      setMode('manager');
      setName('');
      setClub('Arsenal FC');
      setLeague('Premier League');
      setStartingSeason('2025/26');
      setDifficulty('World Class');
      setCurrency('€');
      setManagerName('');
      setTransferBudget(120000000);
      setWageBudget(2500000);
      setFormation('4-3-3');
      setTacticalStyle('Gegenpressing');
      setBoardObjectiveLeague('Qualify for UEFA Champions League');
      setPlayerName('');
      setPlayerNationality('England');
      setPlayerAge(19);
      setPlayerOverall(79);
      setPlayerPotential(91);
      setPlayerPosition('ST');
      setPlayerArchetype('Clinical Finisher');
      setPreferredFoot('Right');
      setJerseyNumber(9);
      setWeeklyWage(45000);
      setMarketValue(38000000);
    }
  }, [careerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      name: name.trim() || (mode === 'manager' ? `${club} Career` : `${playerName || 'Pro'} Career`),
      mode,
      club: club.trim(),
      league: league.trim(),
      startingSeason,
      difficulty,
      currency,
    };

    if (mode === 'manager') {
      const managerData = {
        ...baseData,
        managerName: managerName.trim() || 'Manager',
        transferBudget,
        wageBudget,
        formation,
        tacticalStyle,
        boardObjectiveLeague,
      };

      if (careerToEdit) {
        updateCareer(careerToEdit.id, managerData);
      } else {
        createCareer(managerData);
      }
    } else {
      const playerData = {
        ...baseData,
        playerName: playerName.trim() || 'Star Player',
        playerNationality,
        playerAge,
        playerOverall,
        playerPotential,
        playerPosition,
        playerArchetype,
        preferredFoot,
        jerseyNumber,
        weeklyWage,
        marketValue,
        managerConfidence: careerToEdit?.managerConfidence || 85,
        squadRole: careerToEdit?.squadRole || 'Crucial Starter',
      };

      if (careerToEdit) {
        updateCareer(careerToEdit.id, playerData);
      } else {
        createCareer(playerData);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              {careerToEdit ? 'Configuration' : 'New Journey'}
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              {careerToEdit ? 'Edit Career' : 'Create New Career'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        {!careerToEdit && (
          <div className="p-6 pb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Career Mode Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('manager')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                  mode === 'manager'
                    ? 'border-emerald-500 bg-emerald-950/30 text-white'
                    : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg ${
                    mode === 'manager' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Manager Career</div>
                  <div className="text-xs text-neutral-400">Manage squad, tactics, transfers & club honours</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('player')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                  mode === 'player'
                    ? 'border-emerald-500 bg-emerald-950/30 text-white'
                    : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg ${
                    mode === 'player' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Player Career</div>
                  <div className="text-xs text-neutral-400">Develop your pro, earn ratings, win Ballon d'Or</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Career Save Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mode === 'manager' ? 'e.g. Real Madrid Road to Glory' : 'e.g. My Striker Legacy'}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Club *
              </label>
              <input
                type="text"
                required
                value={club}
                onChange={(e) => setClub(e.target.value)}
                placeholder="e.g. Arsenal FC"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                League *
              </label>
              <input
                type="text"
                required
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                placeholder="e.g. Premier League"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Starting Season
              </label>
              <input
                type="text"
                value={startingSeason}
                onChange={(e) => setStartingSeason(e.target.value)}
                placeholder="2025/26"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Match Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Career['difficulty'])}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option>Amateur</option>
                <option>Semi-Pro</option>
                <option>Professional</option>
                <option>World Class</option>
                <option>Legendary</option>
                <option>Ultimate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as '€' | '£' | '$')}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="€">€ Euro (EUR)</option>
                <option value="£">£ British Pound (GBP)</option>
                <option value="$">$ US Dollar (USD)</option>
              </select>
            </div>
          </div>

          {/* MANAGER SPECIFIC FIELDS */}
          {mode === 'manager' && (
            <div className="pt-2 border-t border-neutral-800/80 space-y-4">
              <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Manager Details & Tactics
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Mikel Arteta"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Preferred Formation
                  </label>
                  <select
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>4-3-3</option>
                    <option>4-2-3-1</option>
                    <option>4-4-2</option>
                    <option>3-5-2</option>
                    <option>5-3-2</option>
                    <option>4-1-2-1-2</option>
                    <option>3-4-3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Transfer Budget ({currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500000}
                    value={transferBudget}
                    onChange={(e) => setTransferBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Tactical Philosophy
                  </label>
                  <input
                    type="text"
                    value={tacticalStyle}
                    onChange={(e) => setTacticalStyle(e.target.value)}
                    placeholder="e.g. Gegenpress, Tiki-Taka, Counter"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Board Objective (League)
                  </label>
                  <input
                    type="text"
                    value={boardObjectiveLeague}
                    onChange={(e) => setBoardObjectiveLeague(e.target.value)}
                    placeholder="e.g. Win the title / Qualify for Champions League"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PLAYER SPECIFIC FIELDS */}
          {mode === 'player' && (
            <div className="pt-2 border-t border-neutral-800/80 space-y-4">
              <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Pro Player Identity & Rating
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Primary Position
                  </label>
                  <select
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value as Position)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ST">ST - Striker</option>
                    <option value="CF">CF - Center Forward</option>
                    <option value="LW">LW - Left Winger</option>
                    <option value="RW">RW - Right Winger</option>
                    <option value="CAM">CAM - Attacking Mid</option>
                    <option value="CM">CM - Central Mid</option>
                    <option value="CDM">CDM - Defensive Mid</option>
                    <option value="LB">LB - Left Back</option>
                    <option value="RB">RB - Right Back</option>
                    <option value="CB">CB - Center Back</option>
                    <option value="GK">GK - Goalkeeper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={playerNationality}
                    onChange={(e) => setPlayerNationality(e.target.value)}
                    placeholder="e.g. England"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={42}
                    value={playerAge}
                    onChange={(e) => setPlayerAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Jersey #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Current Overall (OVR)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={99}
                    value={playerOverall}
                    onChange={(e) => setPlayerOverall(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Potential (POT)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={99}
                    value={playerPotential}
                    onChange={(e) => setPlayerPotential(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Preferred Foot
                  </label>
                  <select
                    value={preferredFoot}
                    onChange={(e) => setPreferredFoot(e.target.value as 'Right' | 'Left')}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Right</option>
                    <option>Left</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Player Archetype / PlayStyle
                  </label>
                  <input
                    type="text"
                    value={playerArchetype}
                    onChange={(e) => setPlayerArchetype(e.target.value)}
                    placeholder="e.g. Clinical Poacher, Dynamic Playmaker, Aerial Target Man"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
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
              {careerToEdit ? 'Save Changes' : 'Start Career'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Match } from '../../types';
import { X, Star, Target, Award } from 'lucide-react';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchToEdit?: Match | null;
}

export const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, matchToEdit }) => {
  const { activeCareer, addMatch, updateMatch, selectedSeason } = useCareer();
  const isPlayerMode = activeCareer?.mode === 'player';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [season, setSeason] = useState(activeCareer?.currentSeason || '2025/26');
  const [competition, setCompetition] = useState(activeCareer?.league || 'League');
  const [opponent, setOpponent] = useState('');
  const [venue, setVenue] = useState<'Home' | 'Away' | 'Neutral'>('Home');
  const [ourGoals, setOurGoals] = useState(2);
  const [opponentGoals, setOpponentGoals] = useState(1);
  const [matchType, setMatchType] = useState<'Played' | 'Simulated' | 'Highlights'>('Played');
  const [scorers, setScorers] = useState('');
  const [assists, setAssists] = useState('');
  const [possession, setPossession] = useState(54);
  const [shots, setShots] = useState(12);
  const [shotsOnTarget, setShotsOnTarget] = useState(6);
  const [notes, setNotes] = useState('');

  // Player Career Mode
  const [playerStarted, setPlayerStarted] = useState(true);
  const [playerMinutes, setPlayerMinutes] = useState(90);
  const [playerGoals, setPlayerGoals] = useState(1);
  const [playerAssists, setPlayerAssists] = useState(1);
  const [playerRating, setPlayerRating] = useState(8.5);
  const [playerMOTM, setPlayerMOTM] = useState(false);
  const [objectiveCompleted, setObjectiveCompleted] = useState(true);
  const [objectiveText, setObjectiveText] = useState('Maintain rating >= 8.0 and contribute 1 goal');

  useEffect(() => {
    if (matchToEdit) {
      setDate(matchToEdit.date);
      setSeason(matchToEdit.season);
      setCompetition(matchToEdit.competition);
      setOpponent(matchToEdit.opponent);
      setVenue(matchToEdit.venue);
      setOurGoals(matchToEdit.ourGoals);
      setOpponentGoals(matchToEdit.opponentGoals);
      setMatchType(matchToEdit.matchType);
      setScorers(matchToEdit.scorers);
      setAssists(matchToEdit.assists);
      setPossession(matchToEdit.possession || 50);
      setShots(matchToEdit.shots || 10);
      setShotsOnTarget(matchToEdit.shotsOnTarget || 5);
      setNotes(matchToEdit.notes || '');

      setPlayerStarted(matchToEdit.playerStarted ?? true);
      setPlayerMinutes(matchToEdit.playerMinutes ?? 90);
      setPlayerGoals(matchToEdit.playerGoals ?? 0);
      setPlayerAssists(matchToEdit.playerAssists ?? 0);
      setPlayerRating(matchToEdit.playerRating ?? 7.5);
      setPlayerMOTM(matchToEdit.playerMOTM ?? false);
      setObjectiveCompleted(matchToEdit.objectiveCompleted ?? true);
      setObjectiveText(matchToEdit.objectiveText ?? '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setSeason(selectedSeason !== 'all' ? selectedSeason : activeCareer?.currentSeason || '2025/26');
      setCompetition(activeCareer?.league || 'League');
      setOpponent('');
      setVenue('Home');
      setOurGoals(2);
      setOpponentGoals(1);
      setMatchType('Played');
      setScorers('');
      setAssists('');
      setPossession(54);
      setShots(12);
      setShotsOnTarget(6);
      setNotes('');

      setPlayerStarted(true);
      setPlayerMinutes(90);
      setPlayerGoals(1);
      setPlayerAssists(0);
      setPlayerRating(8.2);
      setPlayerMOTM(false);
      setObjectiveCompleted(true);
      setObjectiveText('Score 1+ goals and complete match with 8.0+ rating');
    }
  }, [matchToEdit, isOpen, activeCareer, selectedSeason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let result: 'W' | 'D' | 'L' = 'D';
    if (ourGoals > opponentGoals) result = 'W';
    else if (ourGoals < opponentGoals) result = 'L';

    const matchPayload = {
      season,
      date,
      competition: competition.trim() || 'League',
      opponent: opponent.trim(),
      venue,
      ourGoals,
      opponentGoals,
      result,
      matchType,
      scorers: scorers.trim(),
      assists: assists.trim(),
      possession,
      shots,
      shotsOnTarget,
      cleanSheet: opponentGoals === 0,
      notes: notes.trim(),

      ...(isPlayerMode
        ? {
            playerStarted,
            playerMinutes,
            playerGoals,
            playerAssists,
            playerRating,
            playerMOTM,
            objectiveCompleted,
            objectiveText,
          }
        : {}),
    };

    if (matchToEdit) {
      updateMatch(matchToEdit.id, matchPayload);
    } else {
      addMatch(matchPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              {activeCareer?.name} • Match Tracking
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              {matchToEdit ? 'Edit Match Result' : 'Log New Match'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Match Essentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Season
              </label>
              <input
                type="text"
                required
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="2025/26"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Competition
              </label>
              <input
                type="text"
                required
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                placeholder="e.g. Champions League, Premier League"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Opponent Club *
              </label>
              <input
                type="text"
                required
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="e.g. Manchester City, Bayern Munich"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Venue
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value as 'Home' | 'Away' | 'Neutral')}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Home">Home (Bernabéu / Ground)</option>
                <option value="Away">Away</option>
                <option value="Neutral">Neutral (Final / Cup)</option>
              </select>
            </div>
          </div>

          {/* Scoreline */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 text-center">
              Scoreline
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-xs font-medium text-emerald-400 truncate max-w-[140px] block">
                  {activeCareer?.club || 'Your Club'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  required
                  value={ourGoals}
                  onChange={(e) => setOurGoals(Number(e.target.value))}
                  className="w-20 text-center py-2 text-3xl font-extrabold font-display bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <span className="text-2xl font-bold text-neutral-500">:</span>

              <div className="text-center">
                <span className="text-xs font-medium text-neutral-400 truncate max-w-[140px] block">
                  {opponent || 'Opponent'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  required
                  value={opponentGoals}
                  onChange={(e) => setOpponentGoals(Number(e.target.value))}
                  className="w-20 text-center py-2 text-3xl font-extrabold font-display bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3">
              {(['Played', 'Simulated', 'Highlights'] as const).map((type) => (
                <label key={type} className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="radio"
                    name="matchType"
                    checked={matchType === type}
                    onChange={() => setMatchType(type)}
                    className="accent-emerald-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Goal contributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Goalscorers
              </label>
              <input
                type="text"
                value={scorers}
                onChange={(e) => setScorers(e.target.value)}
                placeholder="e.g. Mbappé 24', 68', Bellingham 89'"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Assists
              </label>
              <input
                type="text"
                value={assists}
                onChange={(e) => setAssists(e.target.value)}
                placeholder="e.g. Vinícius Jr (2), Valverde"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* PLAYER CAREER MODE INDIVIDUAL PERFORMANCE */}
          {isPlayerMode && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-display">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>Pro Performance: {activeCareer.playerName || 'My Player'}</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={playerMOTM}
                    onChange={(e) => setPlayerMOTM(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <Award className="w-3.5 h-3.5" />
                  Man of the Match
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                    Match Rating (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={3.0}
                    max={10.0}
                    value={playerRating}
                    onChange={(e) => setPlayerRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-emerald-400 font-bold text-lg text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                    Your Goals
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={playerGoals}
                    onChange={(e) => setPlayerGoals(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                    Your Assists
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={playerAssists}
                    onChange={(e) => setPlayerAssists(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                    Minutes Played
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={playerMinutes}
                    onChange={(e) => setPlayerMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-center"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Manager Match Objective</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-emerald-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectiveCompleted}
                      onChange={(e) => setObjectiveCompleted(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Objective Completed (+Confidence)</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={objectiveText}
                  onChange={(e) => setObjectiveText(e.target.value)}
                  placeholder="e.g. Maintain 75% pass accuracy, 1+ goal"
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500"
                />
              </div>
            </div>
          )}

          {/* Notes & Match Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Possession %</label>
              <input
                type="number"
                min={10}
                max={90}
                value={possession}
                onChange={(e) => setPossession(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Total Shots</label>
              <input
                type="number"
                min={0}
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">On Target</label>
              <input
                type="number"
                min={0}
                value={shotsOnTarget}
                onChange={(e) => setShotsOnTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Match Highlights / Story
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened in this game? Stunning curler, red card drama, clutch 90th min winner..."
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500"
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
              {matchToEdit ? 'Update Match' : 'Save Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

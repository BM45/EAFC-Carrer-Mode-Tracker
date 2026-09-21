import React, { useState, useEffect, useRef } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Match } from '../../types';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Shield,
  Activity,
  Flame,
  CheckCircle2,
  Star,
  Users,
} from 'lucide-react';

interface LiveMatchSimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MatchEvent {
  minute: number;
  type: 'goal_us' | 'goal_them' | 'yellow' | 'red' | 'chance' | 'whistle' | 'sub';
  text: string;
  player?: string;
}

const COMMON_OPPONENTS = [
  'Real Madrid',
  'Manchester City',
  'Bayern Munich',
  'Paris Saint-Germain',
  'Liverpool',
  'Arsenal',
  'FC Barcelona',
  'Inter Milan',
  'Juventus',
  'Borussia Dortmund',
  'Atletico Madrid',
  'Chelsea',
];

export const LiveMatchSimModal: React.FC<LiveMatchSimModalProps> = ({ isOpen, onClose }) => {
  const { activeCareer, players, addMatch, selectedSeason } = useCareer();

  const isPlayerMode = activeCareer?.mode === 'player';

  // Config
  const [opponent, setOpponent] = useState('Manchester City');
  const [venue, setVenue] = useState<'Home' | 'Away'>('Home');
  const [competition, setCompetition] = useState<'league' | 'ucl' | 'cup' | 'friendly'>('ucl');
  const [simSpeed, setSimSpeed] = useState<number>(250); // ms per simulated minute

  // Match State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [minute, setMinute] = useState(0);
  const [ourScore, setOurScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [ourScorers, setOurScorers] = useState<string[]>([]);
  const [theirScorers, setTheirScorers] = useState<string[]>([]);

  // Player mode stats during this match
  const [proGoals, setProGoals] = useState(0);
  const [proAssists, setProAssists] = useState(0);
  const [proRating, setProRating] = useState(7.0);

  const tickerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ticker
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight;
    }
  }, [events]);

  // Reset match state
  const resetMatch = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setMinute(0);
    setOurScore(0);
    setTheirScore(0);
    setEvents([]);
    setOurScorers([]);
    setTheirScorers([]);
    setProGoals(0);
    setProAssists(0);
    setProRating(7.0);
  };

  const startSimulation = () => {
    if (isFinished) resetMatch();
    sound.playWhistle();
    setIsPlaying(true);
  };

  // Sim Loop
  useEffect(() => {
    let timer: any;
    if (isPlaying && minute < 90) {
      timer = setTimeout(() => {
        const nextMin = minute + 1;
        setMinute(nextMin);

        // Kick-off event
        if (nextMin === 1) {
          setEvents((prev) => [
            ...prev,
            {
              minute: 1,
              type: 'whistle',
              text: `Referee signals kick-off! ${activeCareer?.club} vs ${opponent} is underway under the floodlights.`,
            },
          ]);
        }

        // Half time
        if (nextMin === 45) {
          sound.playWhistle();
          setEvents((prev) => [
            ...prev,
            {
              minute: 45,
              type: 'whistle',
              text: `Half-time whistle blows! Tactical instructions being delivered in the tunnel.`,
            },
          ]);
        }

        // Random match events probability check (e.g. 10% chance of event per minute)
        const roll = Math.random();
        const availableAttackers = players.filter((p) => ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position));
        const randomAttacker = availableAttackers.length > 0
          ? availableAttackers[Math.floor(Math.random() * availableAttackers.length)].name
          : activeCareer?.mode === 'player' ? activeCareer.playerName! : 'Striker';

        // 1. We score! (~4% chance)
        if (roll < 0.038) {
          sound.playGoalRoar();
          setOurScore((s) => s + 1);

          let scorerName = randomAttacker;
          if (isPlayerMode && Math.random() < 0.6) {
            scorerName = activeCareer.playerName || 'Player Pro';
            setProGoals((g) => g + 1);
            setProRating((r) => Math.min(10.0, +(r + 0.8).toFixed(1)));
          }

          setOurScorers((prev) => [...prev, `${scorerName} (${nextMin}')`]);
          setEvents((prev) => [
            ...prev,
            {
              minute: nextMin,
              type: 'goal_us',
              text: `GOAL! Spectacular finish! ${scorerName} ripples the net for ${activeCareer?.club}!`,
              player: scorerName,
            },
          ]);
        }
        // 2. Opponent scores! (~3.2% chance)
        else if (roll > 0.038 && roll < 0.070) {
          setTheirScore((s) => s + 1);
          const oppScorer = `${opponent} Striker`;
          setTheirScorers((prev) => [...prev, `${oppScorer} (${nextMin}')`]);
          setEvents((prev) => [
            ...prev,
            {
              minute: nextMin,
              type: 'goal_them',
              text: `GOAL for ${opponent}! Defensive lapse as the ball slides past the keeper into the bottom corner.`,
              player: oppScorer,
            },
          ]);
        }
        // 3. Yellow card (~2% chance)
        else if (roll > 0.070 && roll < 0.090) {
          const carded = Math.random() > 0.5 ? activeCareer?.club : opponent;
          setEvents((prev) => [
            ...prev,
            {
              minute: nextMin,
              type: 'yellow',
              text: `Yellow Card shown for a tactical foul breaking up a counter attack (${carded}).`,
            },
          ]);
        }
        // 4. Player assist chance in player mode (~2% chance)
        else if (isPlayerMode && roll > 0.090 && roll < 0.11) {
          setProAssists((a) => a + 1);
          setProRating((r) => Math.min(10.0, +(r + 0.5).toFixed(1)));
          setEvents((prev) => [
            ...prev,
            {
              minute: nextMin,
              type: 'chance',
              text: `Incisive vision from ${activeCareer.playerName}! Splitting the backline with a laser pass!`,
            },
          ]);
        }

        // Full time at 90'
        if (nextMin >= 90) {
          setIsPlaying(false);
          setIsFinished(true);
          sound.playWhistle();

          if (ourScore > theirScore) {
            sound.playFanfare();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }

          setEvents((prev) => [
            ...prev,
            {
              minute: 90,
              type: 'whistle',
              text: `FULL-TIME WHISTLE! The clash ends ${ourScore} - ${theirScore}.`,
            },
          ]);
        }
      }, simSpeed);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, minute, ourScore, theirScore, simSpeed]);

  // Save match to permanent record
  const handleSaveToMatchLog = () => {
    if (!activeCareer) return;

    let result: 'W' | 'D' | 'L' = 'D';
    if (ourScore > theirScore) result = 'W';
    else if (ourScore < theirScore) result = 'L';

    const newMatch: Omit<Match, 'id' | 'careerId'> = {
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      date: new Date().toISOString().split('T')[0],
      competition,
      opponent,
      venue,
      ourGoals: ourScore,
      opponentGoals: theirScore,
      result,
      matchType: 'Simulated',
      scorers: ourScorers.join(', '),
      assists: isPlayerMode && proAssists > 0 ? `${activeCareer.playerName} (${proAssists})` : '',
      notes: `Live Simulation Match against ${opponent} (${competition.toUpperCase()})`,

      // Player Pro mode specific
      playerStarted: true,
      playerMinutes: 90,
      playerGoals: proGoals,
      playerAssists: proAssists,
      playerRating: proRating,
      playerMOTM: proRating >= 8.5 && result === 'W',
    };

    addMatch(newMatch);
    sound.playWhistle();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                Interactive Broadcast
              </span>
              <h3 className="text-xl font-black font-display text-white">
                Live Match Day Simulator
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MATCH SCOREBOARD HERO */}
        <div className="p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {/* Our Club */}
            <div className="flex-1 text-center">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                {venue === 'Home' ? 'HOME' : 'AWAY'}
              </span>
              <h4 className="text-lg font-black font-display text-white truncate px-2">
                {activeCareer?.club}
              </h4>
              <div className="text-[11px] text-emerald-400 font-bold mt-1 space-y-0.5">
                {ourScorers.map((s, i) => (
                  <div key={i}>⚽ {s}</div>
                ))}
              </div>
            </div>

            {/* Score Center & Minute Clock */}
            <div className="px-6 flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-neutral-850 border border-neutral-750 text-xs font-mono font-bold text-emerald-400 mb-2">
                {minute}' {minute === 90 ? 'FT' : ''}
              </span>
              <div className="flex items-center gap-3 text-5xl font-black font-display text-white tracking-tight">
                <span>{ourScore}</span>
                <span className="text-neutral-600">-</span>
                <span>{theirScore}</span>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase mt-2">
                {competition.toUpperCase()} FIXTURE
              </span>
            </div>

            {/* Opponent */}
            <div className="flex-1 text-center">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                {venue === 'Home' ? 'AWAY' : 'HOME'}
              </span>
              <h4 className="text-lg font-black font-display text-white truncate px-2">
                {opponent}
              </h4>
              <div className="text-[11px] text-rose-400 font-bold mt-1 space-y-0.5">
                {theirScorers.map((s, i) => (
                  <div key={i}>⚽ {s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Bar (Available before starting) */}
        {!isPlaying && minute === 0 && (
          <div className="p-4 bg-neutral-950 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                Opponent Club
              </label>
              <select
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
              >
                {COMMON_OPPONENTS.map((opp) => (
                  <option key={opp} value={opp}>
                    {opp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                Venue
              </label>
              <div className="flex bg-neutral-900 p-0.5 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setVenue('Home')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                    venue === 'Home' ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setVenue('Away')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                    venue === 'Away' ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  Away
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                Tournament
              </label>
              <select
                value={competition}
                onChange={(e) => setCompetition(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
              >
                <option value="league">Domestic League Match</option>
                <option value="ucl">UEFA Champions League</option>
                <option value="cup">Domestic Cup Knockout</option>
                <option value="friendly">Pre-Season Friendly</option>
              </select>
            </div>
          </div>
        )}

        {/* Player Pro In-Game Card Tracker */}
        {isPlayerMode && (
          <div className="px-6 py-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">{activeCareer.playerName} Live Rating:</span>
              <span className="font-black font-display text-amber-400 text-base">{proRating}</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-300 font-semibold">
              <span>⚽ Goals: <strong className="text-emerald-400">{proGoals}</strong></span>
              <span>🎯 Assists: <strong className="text-blue-400">{proAssists}</strong></span>
            </div>
          </div>
        )}

        {/* LIVE COMMENTARY TICKER */}
        <div
          ref={tickerRef}
          className="p-5 h-64 overflow-y-auto space-y-2.5 bg-neutral-950 text-xs font-mono select-none"
        >
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
              <Activity className="w-8 h-8 text-neutral-600 animate-pulse" />
              <p>Press "Kick Off" to start the live tactical match simulation.</p>
            </div>
          ) : (
            events.map((ev, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-xl transition ${
                  ev.type === 'goal_us'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                    : ev.type === 'goal_them'
                    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
                    : ev.type === 'whistle'
                    ? 'bg-neutral-900 border border-neutral-800 text-amber-300 font-bold'
                    : 'text-neutral-300'
                }`}
              >
                <span className="font-bold shrink-0 text-neutral-400">{ev.minute}'</span>
                <span className="leading-relaxed">{ev.text}</span>
              </div>
            ))
          )}
        </div>

        {/* SIMULATION CONTROLS FOOTER */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Sim Speed:</span>
            {[
              { label: '1x', speed: 300 },
              { label: '2x', speed: 150 },
              { label: 'Instant', speed: 40 },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSimSpeed(s.speed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  simSpeed === s.speed ? 'bg-emerald-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {!isFinished && (
              <button
                type="button"
                onClick={isPlaying ? () => setIsPlaying(false) : startSimulation}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                  isPlaying
                    ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{minute === 0 ? 'Kick Off Match' : isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            )}

            {isFinished && (
              <button
                type="button"
                onClick={handleSaveToMatchLog}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Result to Career Match Log</span>
              </button>
            )}

            {minute > 0 && (
              <button
                type="button"
                onClick={resetMatch}
                className="p-2.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-white rounded-xl transition"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

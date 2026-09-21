import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { sound } from '../../utils/soundEffects';
import {
  Sliders,
  Shield,
  Zap,
  Target,
  Users,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  HelpCircle,
  Play,
} from 'lucide-react';

interface TacticsPageProps {
  onOpenLiveSim?: () => void;
}

export const TacticsPage: React.FC<TacticsPageProps> = ({ onOpenLiveSim }) => {
  const { activeCareer, players, updateCareer } = useCareer();

  // Tactics Sliders
  const [defensiveStyle, setDefensiveStyle] = useState('Press After Possession Loss');
  const [teamWidth, setTeamWidth] = useState(52);
  const [defensiveDepth, setDefensiveDepth] = useState(68);
  const [buildUpPlay, setBuildUpPlay] = useState('Fast Build Up');
  const [chanceCreation, setChanceCreation] = useState('Direct Passing');
  const [playersInBox, setPlayersInBox] = useState(6);
  const [corners, setCorners] = useState(3);
  const [freeKicks, setFreeKicks] = useState(2);

  // Set Piece Takers
  const [captain, setCaptain] = useState(players[0]?.name || 'Captain');
  const [penaltyTaker, setPenaltyTaker] = useState(players[1]?.name || 'Striker');
  const [freeKickTaker, setFreeKickTaker] = useState(players[2]?.name || 'Playmaker');
  const [cornerTaker, setCornerTaker] = useState(players[3]?.name || 'Winger');

  // AI Gameplan Assistant
  const [aiOpponent, setAiOpponent] = useState('Real Madrid');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTactics, setAiTactics] = useState<any>(null);

  // Calculate Chemistry (based on nations/clubs representation)
  const calculateChemistry = () => {
    const starterPlayers = players.filter((p) => p.lineupStatus === 'starter').slice(0, 11);
    if (starterPlayers.length === 0) return 33;

    // Count common nationalities
    const nations: Record<string, number> = {};
    starterPlayers.forEach((p) => {
      nations[p.nationality] = (nations[p.nationality] || 0) + 1;
    });

    let chemPoints = 20;
    Object.values(nations).forEach((count) => {
      if (count >= 2) chemPoints += 3;
      if (count >= 4) chemPoints += 4;
    });

    return Math.min(33, Math.max(14, chemPoints));
  };

  const chemistry = calculateChemistry();

  const handleFetchAiTactics = async () => {
    setAiLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/match-tactics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club: activeCareer?.club,
          opponent: aiOpponent,
          formation: activeCareer?.formation || '4-3-3',
          isHome: true,
        }),
      });
      const data = await res.json();
      setAiTactics(data);
      sound.playFanfare();
    } catch (err) {
      console.error('Failed to get AI tactics:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveTactics = () => {
    if (!activeCareer) return;
    sound.playLevelUp();
    updateCareer(activeCareer.id, {
      tacticalStyle: defensiveStyle,
    });
    alert('Tactical preset and team instructions saved!');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00]">
                FC 27 Tactical Board
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] font-black border border-[#ccff00]/30">
                Squad Chemistry: {chemistry}/33 ★
              </span>
            </div>
            <h2 className="text-2xl font-black font-display text-white tracking-wide">Tactics & Chemistry Hub</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenLiveSim}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#ccff00] to-[#b8e600] hover:brightness-110 text-[#050811] text-xs font-black rounded-xl transition shadow-lg shadow-[#ccff00]/25"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Test in Live Sim</span>
          </button>
          <button
            type="button"
            onClick={handleSaveTactics}
            className="px-4 py-2 bg-[#0c1322] hover:bg-[#131d33] text-white text-xs font-bold rounded-xl transition border border-[#1e293b]"
          >
            Save Preset
          </button>
        </div>
      </div>

      {/* TACTICAL SLIDERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defense & Pressing */}
        <div className="p-6 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
            <Shield className="w-5 h-5 text-[#ccff00]" />
            <h3 className="text-lg font-bold font-display text-white">Defensive Approach</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Defensive Style
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Press After Possession Loss',
                'Constant Pressure',
                'Balanced',
                'Drop Back',
              ].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDefensiveStyle(style);
                  }}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    defensiveStyle === style
                      ? 'bg-gradient-to-r from-[#ccff00] to-[#b8e600] text-[#050811] border-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : 'bg-[#070b14]/90 border-[#1a2333] text-slate-300 hover:border-[#ccff00]/40'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Team Width ({teamWidth})</span>
                <span className="text-[#ccff00]">{teamWidth < 40 ? 'Narrow' : teamWidth > 65 ? 'Wide' : 'Balanced'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={teamWidth}
                onChange={(e) => setTeamWidth(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Defensive Depth ({defensiveDepth})</span>
                <span className="text-[#ccff00]">{defensiveDepth > 70 ? 'High Line Press' : defensiveDepth < 35 ? 'Deep Block' : 'Mid Block'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={defensiveDepth}
                onChange={(e) => setDefensiveDepth(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>
          </div>
        </div>

        {/* Offense & Build Up */}
        <div className="p-6 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
            <Zap className="w-5 h-5 text-[#05f1cd]" />
            <h3 className="text-lg font-bold font-display text-white">Attacking & Build-Up Play</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Build-Up Play
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Fast Build Up',
                'Slow Build Up',
                'Long Ball',
                'Balanced',
              ].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setBuildUpPlay(b);
                  }}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    buildUpPlay === b
                      ? 'bg-gradient-to-r from-[#05f1cd] to-cyan-400 text-neutral-950 border-[#05f1cd] shadow-[0_0_12px_rgba(5,241,205,0.3)]'
                      : 'bg-[#070b14]/90 border-[#1a2333] text-slate-300 hover:border-[#05f1cd]/40'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Chance Creation
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Direct Passing',
                'Forward Runs',
                'Possession',
                'Balanced',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setChanceCreation(c);
                  }}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    chanceCreation === c
                      ? 'bg-gradient-to-r from-[#05f1cd] to-cyan-400 text-neutral-950 border-[#05f1cd] shadow-[0_0_12px_rgba(5,241,205,0.3)]'
                      : 'bg-[#070b14]/90 border-[#1a2333] text-slate-300 hover:border-[#05f1cd]/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Players In Box ({playersInBox}/10)</span>
                <span className="text-[#05f1cd]">{playersInBox >= 7 ? 'Heavy Overload' : 'Controlled'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={playersInBox * 10}
                onChange={(e) => setPlayersInBox(Math.round(Number(e.target.value) / 10))}
                className="w-full accent-[#05f1cd]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SET PIECE TAKERS & LEADERSHIP */}
      <div className="p-6 bg-gradient-to-br from-[#0e1626]/90 via-[#0a0f1b]/90 to-[#060a12]/95 border border-[#1e293b] rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold font-display text-white">Set Piece Specialists & Captaincy</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#070b14]/90 rounded-2xl border border-[#1a2333] space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Team Captain</span>
            <select
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1424] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none focus:border-[#ccff00]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position} - {p.overall} OVR)
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#070b14]/90 rounded-2xl border border-[#1a2333] space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Penalty Taker</span>
            <select
              value={penaltyTaker}
              onChange={(e) => setPenaltyTaker(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1424] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none focus:border-[#ccff00]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position} - {p.overall} OVR)
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#070b14]/90 rounded-2xl border border-[#1a2333] space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Free Kick Specialist</span>
            <select
              value={freeKickTaker}
              onChange={(e) => setFreeKickTaker(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1424] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none focus:border-[#ccff00]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position} - {p.overall} OVR)
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#070b14]/90 rounded-2xl border border-[#1a2333] space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Corner Kick Taker</span>
            <select
              value={cornerTaker}
              onChange={(e) => setCornerTaker(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1424] border border-[#1e293b] rounded-xl text-white font-bold focus:outline-none focus:border-[#ccff00]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position} - {p.overall} OVR)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI OPPONENT SCOUT & TACTICAL MASTERCLASS */}
      <div className="p-6 bg-gradient-to-r from-[#0e1626]/90 via-[#0a0f1b]/90 to-indigo-950/40 border border-indigo-500/30 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Tactical Analyst Engine
              </span>
            </div>
            <h3 className="text-lg font-black font-display text-white">
              AI Opponent Breakdown & Gameplan
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiOpponent}
              onChange={(e) => setAiOpponent(e.target.value)}
              placeholder="e.g. Real Madrid, Man City"
              className="px-3 py-2 bg-[#070b14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-[#ccff00] w-44"
            />
            <button
              type="button"
              onClick={handleFetchAiTactics}
              disabled={aiLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              {aiLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Analyze Matchup</span>
            </button>
          </div>
        </div>

        {aiTactics && (
          <div className="p-5 bg-[#070b14]/90 rounded-2xl border border-[#1e293b] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Key Tactical Battle:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] font-bold border border-[#ccff00]/30 text-[11px]">
                Win Probability: {aiTactics.winProbability}%
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{aiTactics.keyBattle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {aiTactics.recommendedInstructions?.map((rec: any, idx: number) => (
                <div key={idx} className="p-3 bg-[#0d1424] rounded-xl border border-[#1e293b]">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                    {rec.role}
                  </span>
                  <span className="text-white font-medium">{rec.instruction}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
